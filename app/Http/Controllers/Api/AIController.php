<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiRequest;
use App\Models\AiChatSession;
use App\Models\Project;
use App\Services\LocalAIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AIController extends Controller
{
    protected LocalAIService $aiService;

    public function __construct(LocalAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function generateDescription(Request $request): JsonResponse
    {
        $request->validate([
            'business_name' => 'required|string',
            'business_type' => 'required|in:company,store,landing',
            'industry' => 'nullable|string',
            'language' => 'nullable|string|in:ar,en',
        ]);

        $aiRequest = AiRequest::create([
            'user_id' => $request->user()->id,
            'type' => 'description',
            'prompt' => $this->buildDescriptionPrompt($request->all()),
            'parameters' => $request->only(['business_name', 'business_type', 'industry', 'language']),
            'status' => 'processing',
        ]);

        try {
            $response = $this->aiService->generateDescription(
                $request->business_name,
                $request->business_type,
                $request->industry,
                $request->language ?? 'ar'
            );

            $aiRequest->update([
                'response' => $response,
                'status' => 'completed',
                'processing_time' => now()->diffInMilliseconds($aiRequest->created_at),
            ]);

            return response()->json([
                'description' => $response,
                'request_id' => $aiRequest->id,
            ]);

        } catch (\Exception $e) {
            $aiRequest->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to generate description',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function generateContent(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'content_type' => 'required|in:homepage,about,services,contact',
            'language' => 'nullable|string|in:ar,en',
        ]);

        $project = Project::findOrFail($request->project_id);
        $this->authorize('view', $project);

        $aiRequest = AiRequest::create([
            'user_id' => $request->user()->id,
            'project_id' => $project->id,
            'type' => 'content',
            'prompt' => $this->buildContentPrompt($project, $request->content_type, $request->language),
            'parameters' => $request->only(['content_type', 'language']),
            'status' => 'processing',
        ]);

        try {
            $response = $this->aiService->generateContent(
                $project,
                $request->content_type,
                $request->language ?? 'ar'
            );

            $aiRequest->update([
                'response' => $response,
                'status' => 'completed',
                'processing_time' => now()->diffInMilliseconds($aiRequest->created_at),
            ]);

            return response()->json([
                'content' => $response,
                'request_id' => $aiRequest->id,
            ]);

        } catch (\Exception $e) {
            $aiRequest->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to generate content',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function generateColors(Request $request): JsonResponse
    {
        $request->validate([
            'business_type' => 'required|in:company,store,landing',
            'industry' => 'nullable|string',
            'mood' => 'nullable|string|in:professional,creative,modern,classic,vibrant',
        ]);

        $aiRequest = AiRequest::create([
            'user_id' => $request->user()->id,
            'type' => 'colors',
            'prompt' => $this->buildColorsPrompt($request->all()),
            'parameters' => $request->only(['business_type', 'industry', 'mood']),
            'status' => 'processing',
        ]);

        try {
            $response = $this->aiService->generateColors(
                $request->business_type,
                $request->industry,
                $request->mood ?? 'professional'
            );

            $aiRequest->update([
                'response' => json_encode($response),
                'status' => 'completed',
                'processing_time' => now()->diffInMilliseconds($aiRequest->created_at),
            ]);

            return response()->json([
                'colors' => $response,
                'request_id' => $aiRequest->id,
            ]);

        } catch (\Exception $e) {
            $aiRequest->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to generate colors',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function generateLogo(Request $request): JsonResponse
    {
        $request->validate([
            'business_name' => 'required|string',
            'business_type' => 'required|in:company,store,landing',
            'style' => 'nullable|string|in:modern,classic,minimalist,bold',
            'colors' => 'nullable|array',
        ]);

        $aiRequest = AiRequest::create([
            'user_id' => $request->user()->id,
            'type' => 'logo',
            'prompt' => $this->buildLogoPrompt($request->all()),
            'parameters' => $request->only(['business_name', 'business_type', 'style', 'colors']),
            'status' => 'processing',
        ]);

        try {
            $logoPath = $this->aiService->generateLogo(
                $request->business_name,
                $request->business_type,
                $request->style ?? 'modern',
                $request->colors
            );

            $aiRequest->update([
                'response' => $logoPath,
                'status' => 'completed',
                'processing_time' => now()->diffInMilliseconds($aiRequest->created_at),
            ]);

            return response()->json([
                'logo_path' => $logoPath,
                'logo_url' => asset('storage/' . $logoPath),
                'request_id' => $aiRequest->id,
            ]);

        } catch (\Exception $e) {
            $aiRequest->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to generate logo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function translate(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
            'from_language' => 'required|string|in:ar,en',
            'to_language' => 'required|string|in:ar,en',
        ]);

        $aiRequest = AiRequest::create([
            'user_id' => $request->user()->id,
            'type' => 'translate',
            'prompt' => "Translate from {$request->from_language} to {$request->to_language}: {$request->text}",
            'parameters' => $request->only(['from_language', 'to_language']),
            'status' => 'processing',
        ]);

        try {
            $response = $this->aiService->translate(
                $request->text,
                $request->from_language,
                $request->to_language
            );

            $aiRequest->update([
                'response' => $response,
                'status' => 'completed',
                'processing_time' => now()->diffInMilliseconds($aiRequest->created_at),
            ]);

            return response()->json([
                'translated_text' => $response,
                'request_id' => $aiRequest->id,
            ]);

        } catch (\Exception $e) {
            $aiRequest->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to translate text',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'current_step' => 'nullable|integer|min:1|max:7',
        ]);

        $sessionId = $request->session_id ?? Str::uuid();

        $chatSession = AiChatSession::firstOrCreate(
            ['session_id' => $sessionId],
            [
                'user_id' => $request->user()->id,
                'project_id' => $request->project_id,
                'current_step' => $request->current_step,
                'messages' => [],
                'context' => [],
                'last_activity_at' => now(),
            ]
        );

        $chatSession->addMessage('user', $request->message);

        try {
            $response = $this->aiService->chat(
                $request->message,
                $chatSession->messages,
                $chatSession->context,
                $request->current_step
            );

            $chatSession->addMessage('assistant', $response);

            return response()->json([
                'response' => $response,
                'session_id' => $sessionId,
                'messages' => $chatSession->fresh()->messages,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process chat message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getChatSession(Request $request, string $sessionId): JsonResponse
    {
        $chatSession = AiChatSession::where('session_id', $sessionId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($chatSession);
    }

    private function buildDescriptionPrompt(array $data): string
    {
        $language = $data['language'] ?? 'ar';
        $businessName = $data['business_name'];
        $businessType = $data['business_type'];
        $industry = $data['industry'] ?? '';

        if ($language === 'ar') {
            return "اكتب وصفاً احترافياً لشركة '{$businessName}' من نوع '{$businessType}' في مجال '{$industry}'. الوصف يجب أن يكون جذاباً ومقنعاً ومناسباً للموقع الإلكتروني.";
        }

        return "Write a professional description for '{$businessName}', a {$businessType} business in the {$industry} industry. The description should be engaging, persuasive, and suitable for a website.";
    }

    private function buildContentPrompt(Project $project, string $contentType, ?string $language): string
    {
        $lang = $language ?? 'ar';
        $businessName = $project->business_name;
        $businessType = $project->business_type;
        $description = $project->description;

        if ($lang === 'ar') {
            return "اكتب محتوى صفحة '{$contentType}' لشركة '{$businessName}' من نوع '{$businessType}'. وصف الشركة: {$description}";
        }

        return "Write {$contentType} page content for '{$businessName}', a {$businessType} business. Company description: {$description}";
    }

    private function buildColorsPrompt(array $data): string
    {
        $businessType = $data['business_type'];
        $industry = $data['industry'] ?? '';
        $mood = $data['mood'] ?? 'professional';

        return "Generate a color palette for a {$businessType} business in the {$industry} industry with a {$mood} mood. Return primary, secondary, accent, background, and text colors.";
    }

    private function buildLogoPrompt(array $data): string
    {
        $businessName = $data['business_name'];
        $businessType = $data['business_type'];
        $style = $data['style'] ?? 'modern';

        return "Create a {$style} logo for '{$businessName}', a {$businessType} business. The logo should be professional and memorable.";
    }
}
