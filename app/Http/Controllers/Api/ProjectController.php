<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Template;
use App\Jobs\GenerateWordPressSite;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = $request->user()
            ->projects()
            ->with(['template', 'logs'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($projects);
    }

    public function init(Request $request): JsonResponse
    {
        \Log::info('Project init request data:', $request->all());
        \Log::info('Request headers:', $request->headers->all());
        
        $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|in:company,store,landing',
            'description' => 'nullable|string',
        ]);

        $project = Project::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'business_name' => $request->business_name,
            'business_type' => $request->business_type,
            'description' => $request->description,
            'status' => 'draft',
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'project_created',
            'description' => 'Project initialized',
            'level' => 'info',
        ]);

        return response()->json($project, 201);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project->load(['template', 'logs', 'teamMembers.user', 'addons.module']);

        return response()->json($project);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'business_name' => 'sometimes|string|max:255',
            'business_type' => 'sometimes|in:company,store,landing',
            'description' => 'sometimes|nullable|string',
            'domain' => 'sometimes|nullable|string|max:255',
        ]);

        $project->update($request->only([
            'name', 'business_name', 'business_type', 'description', 'domain'
        ]));

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'project_updated',
            'description' => 'Project details updated',
            'level' => 'info',
        ]);

        return response()->json($project);
    }

    public function selectTemplate(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'template_id' => 'required|exists:templates,id',
        ]);

        $template = Template::findOrFail($request->template_id);

        $project->update([
            'template_id' => $template->id,
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'template_selected',
            'description' => "Template '{$template->name}' selected",
            'metadata' => ['template_id' => $template->id],
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project->load('template'),
            'message' => 'Template selected successfully',
        ]);
    }

    public function setColors(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'colors' => 'required|array',
            'colors.primary' => 'required|string',
            'colors.secondary' => 'required|string',
            'colors.accent' => 'required|string',
            'colors.background' => 'required|string',
            'colors.text' => 'required|string',
        ]);

        $project->update([
            'colors' => $request->colors,
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'colors_set',
            'description' => 'Color scheme applied',
            'metadata' => ['colors' => $request->colors],
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project,
            'message' => 'Colors set successfully',
        ]);
    }

    public function uploadLogo(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $logoPath = $request->file('logo')->store('logos', 'public');

        $project->update([
            'logo_path' => $logoPath,
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'logo_uploaded',
            'description' => 'Logo uploaded',
            'metadata' => ['logo_path' => $logoPath],
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project,
            'logo_url' => Storage::url($logoPath),
            'message' => 'Logo uploaded successfully',
        ]);
    }

    public function generateSite(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        if (!$project->template_id) {
            return response()->json(['message' => 'Template must be selected first'], 400);
        }

        $subdomain = $project->generateSubdomain();
        
        $project->update([
            'subdomain' => $subdomain,
            'status' => 'generating',
            'trial_expires_at' => now()->addHours(72),
        ]);

        GenerateWordPressSite::dispatch($project);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'site_generation_started',
            'description' => 'WordPress site generation initiated',
            'metadata' => ['subdomain' => $subdomain],
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project,
            'message' => 'Site generation started',
            'subdomain' => $subdomain,
            'trial_expires_at' => $project->trial_expires_at,
        ]);
    }

    public function status(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'status' => $project->status,
            'trial_expires_at' => $project->trial_expires_at,
            'is_trial_expired' => $project->isTrialExpired(),
            'wp_admin_url' => $project->wp_admin_url,
            'subdomain' => $project->subdomain,
        ]);
    }

    public function archive(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update([
            'status' => 'archived',
            'archived_at' => now(),
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'project_archived',
            'description' => 'Project archived',
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project,
            'message' => 'Project archived successfully',
        ]);
    }

    public function restore(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update([
            'status' => 'active',
            'archived_at' => null,
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'project_restored',
            'description' => 'Project restored from archive',
            'level' => 'info',
        ]);

        return response()->json([
            'project' => $project,
            'message' => 'Project restored successfully',
        ]);
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->update(['status' => 'deleted']);

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $projects = Project::with(['user', 'template'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($projects);
    }

    public function analytics(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_projects' => Project::count(),
            'active_projects' => Project::where('status', 'active')->count(),
            'trial_projects' => Project::whereNotNull('trial_expires_at')
                ->where('trial_expires_at', '>', now())->count(),
            'expired_trials' => Project::whereNotNull('trial_expires_at')
                ->where('trial_expires_at', '<=', now())->count(),
            'projects_by_type' => Project::selectRaw('business_type, count(*) as count')
                ->groupBy('business_type')->get(),
            'projects_by_status' => Project::selectRaw('status, count(*) as count')
                ->groupBy('status')->get(),
        ];

        return response()->json($stats);
    }
}
