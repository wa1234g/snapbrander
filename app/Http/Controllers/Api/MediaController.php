<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaGallery;
use App\Services\LocalAIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    protected LocalAIService $aiService;

    public function __construct(LocalAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->mediaGallery();

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $media = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($media);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'name' => 'required|string|max:255',
            'category' => 'required|in:logo,image,banner,icon',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');

        $media = MediaGallery::create([
            'user_id' => $request->user()->id,
            'project_id' => $request->project_id,
            'name' => $request->name,
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'category' => $request->category,
            'metadata' => [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
            ],
        ]);

        return response()->json([
            'media' => $media,
            'url' => $media->url,
            'message' => 'File uploaded successfully',
        ], 201);
    }

    public function aiEdit(Request $request, MediaGallery $media): JsonResponse
    {
        if ($media->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'operation' => 'required|in:remove_background,enhance,resize,recolor',
            'parameters' => 'nullable|array',
        ]);

        try {
            $editedPath = $this->aiService->editImage(
                $media->file_path,
                $request->operation,
                $request->parameters ?? []
            );

            $editedMedia = MediaGallery::create([
                'user_id' => $request->user()->id,
                'project_id' => $media->project_id,
                'name' => $media->name . ' (edited)',
                'file_path' => $editedPath,
                'file_type' => $media->file_type,
                'file_size' => Storage::disk('public')->size($editedPath),
                'category' => $media->category,
                'is_ai_generated' => true,
                'ai_prompt' => "Edit operation: {$request->operation}",
                'metadata' => [
                    'original_media_id' => $media->id,
                    'edit_operation' => $request->operation,
                    'edit_parameters' => $request->parameters,
                ],
            ]);

            return response()->json([
                'media' => $editedMedia,
                'url' => $editedMedia->url,
                'message' => 'Image edited successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to edit image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, MediaGallery $media): JsonResponse
    {
        if ($media->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($media->file_path);
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
