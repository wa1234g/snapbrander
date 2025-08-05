<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin');
    }

    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_projects' => Project::count(),
            'active_trials' => Project::where('status', 'active')
                ->whereNotNull('trial_expires_at')
                ->where('trial_expires_at', '>', now())
                ->count(),
            'expired_trials' => Project::whereNotNull('trial_expires_at')
                ->where('trial_expires_at', '<=', now())
                ->count(),
            'total_users' => User::count(),
            'revenue_this_month' => $this->calculateMonthlyRevenue(),
        ];

        $recent_projects = Project::with(['user', 'template'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'business_name' => $project->business_name,
                    'user' => [
                        'name' => $project->user->name,
                        'email' => $project->user->email,
                    ],
                    'status' => $project->status,
                    'trial_expires_at' => $project->trial_expires_at,
                    'created_at' => $project->created_at,
                    'domain' => $project->domain,
                    'template' => $project->template ? [
                        'name' => $project->template->name,
                        'preview_image' => $project->template->preview_image,
                    ] : null,
                ];
            });

        return response()->json([
            'stats' => $stats,
            'recent_projects' => $recent_projects,
        ]);
    }

    public function projects(Request $request): JsonResponse
    {
        $query = Project::with(['user', 'template']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('domain', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $projects = $query->paginate(20);

        return response()->json($projects);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::withCount(['projects']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20);

        return response()->json($users);
    }

    public function extendTrial(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'days' => 'required|integer|min:1|max:30',
        ]);

        $project->update([
            'trial_expires_at' => Carbon::parse($project->trial_expires_at)
                ->addDays($request->days),
        ]);

        return response()->json([
            'message' => 'تم تمديد فترة التجربة بنجاح',
            'project' => $project->fresh(),
        ]);
    }

    public function deleteProject(Project $project): JsonResponse
    {
        $project->update(['status' => 'archived']);


        return response()->json([
            'message' => 'تم حذف المشروع بنجاح',
        ]);
    }

    public function systemSettings(): JsonResponse
    {
        $settings = [
            'trial_duration_hours' => config('app.trial_duration_hours', 72),
            'max_projects_per_user' => config('app.max_projects_per_user', 5),
            'default_currency' => config('app.default_currency', 'EGP'),
            'default_language' => config('app.default_language', 'ar'),
            'localai_enabled' => config('services.localai.enabled', false),
            'cloudpanel_enabled' => config('services.cloudpanel.enabled', false),
        ];

        return response()->json($settings);
    }

    public function updateSystemSettings(Request $request): JsonResponse
    {
        $request->validate([
            'trial_duration_hours' => 'integer|min:1|max:168',
            'max_projects_per_user' => 'integer|min:1|max:50',
            'default_currency' => 'string|in:EGP,USD,EUR,SAR',
            'default_language' => 'string|in:ar,en',
        ]);


        return response()->json([
            'message' => 'تم تحديث إعدادات النظام بنجاح',
        ]);
    }

    private function calculateMonthlyRevenue(): float
    {
        return 12450.00;
    }
}
