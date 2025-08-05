<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Draft;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DraftController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $drafts = $request->user()
            ->drafts()
            ->where('expires_at', '>', now())
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($drafts);
    }

    public function save(Request $request): JsonResponse
    {
        \Log::info('Draft save request data:', $request->all());
        \Log::info('Request headers:', $request->headers->all());
        
        $request->validate([
            'current_step' => 'required|integer|min:1|max:7',
            'step_data' => 'required|array',
            'session_id' => 'nullable|string',
        ]);

        $draft = Draft::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'session_id' => $request->session_id,
            ],
            [
                'current_step' => $request->current_step,
                'step_data' => $request->step_data,
                'expires_at' => now()->addDays(7),
            ]
        );

        return response()->json([
            'draft' => $draft,
            'message' => 'Draft saved successfully',
        ]);
    }

    public function resume(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'nullable|string',
        ]);

        $query = $request->user()->drafts();

        if ($request->session_id) {
            $query->where('session_id', $request->session_id);
        }

        $draft = $query->where('expires_at', '>', now())
            ->orderBy('updated_at', 'desc')
            ->first();

        if (!$draft) {
            return response()->json([
                'message' => 'No valid draft found',
                'draft' => null,
            ], 404);
        }

        return response()->json([
            'draft' => $draft,
            'message' => 'Draft resumed successfully',
        ]);
    }

    public function destroy(Request $request, Draft $draft): JsonResponse
    {
        if ($draft->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $draft->delete();

        return response()->json(['message' => 'Draft deleted successfully']);
    }
}
