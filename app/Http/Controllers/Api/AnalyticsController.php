<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin');
    }

    public function dashboard(Request $request): JsonResponse
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays($period);

        $analytics = [
            'overview' => $this->getOverviewStats(),
            'projects' => $this->getProjectStats($startDate),
            'users' => $this->getUserStats($startDate),
            'revenue' => $this->getRevenueStats($startDate),
            'trials' => $this->getTrialStats(),
            'templates' => $this->getTemplateStats(),
            'charts' => [
                'projects_over_time' => $this->getProjectsOverTime($startDate),
                'revenue_over_time' => $this->getRevenueOverTime($startDate),
                'user_registrations' => $this->getUserRegistrations($startDate),
            ],
        ];

        return response()->json($analytics);
    }

    protected function getOverviewStats(): array
    {
        return [
            'total_projects' => Project::count(),
            'total_users' => User::count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'active_trials' => Project::where('status', 'active')
                ->whereNotNull('trial_expires_at')
                ->where('trial_expires_at', '>', now())
                ->count(),
        ];
    }

    protected function getProjectStats(Carbon $startDate): array
    {
        return [
            'total_created' => Project::where('created_at', '>=', $startDate)->count(),
            'by_type' => Project::where('created_at', '>=', $startDate)
                ->selectRaw('business_type, count(*) as count')
                ->groupBy('business_type')
                ->get(),
            'by_status' => Project::where('created_at', '>=', $startDate)
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get(),
            'completion_rate' => $this->getCompletionRate($startDate),
        ];
    }

    protected function getUserStats(Carbon $startDate): array
    {
        return [
            'new_registrations' => User::where('created_at', '>=', $startDate)->count(),
            'active_users' => User::whereHas('projects', function ($query) use ($startDate) {
                $query->where('updated_at', '>=', $startDate);
            })->count(),
            'conversion_rate' => $this->getConversionRate($startDate),
        ];
    }

    protected function getRevenueStats(Carbon $startDate): array
    {
        $payments = Payment::where('status', 'completed')
            ->where('created_at', '>=', $startDate);

        return [
            'total' => $payments->sum('amount'),
            'average_order_value' => $payments->avg('amount'),
            'by_plan' => $payments->with('plan')
                ->get()
                ->groupBy('plan.name')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total' => $group->sum('amount'),
                    ];
                }),
        ];
    }

    protected function getTrialStats(): array
    {
        $totalTrials = Project::whereNotNull('trial_expires_at')->count();
        $activeTrials = Project::where('trial_expires_at', '>', now())->count();
        $expiredTrials = Project::where('trial_expires_at', '<=', now())->count();
        $convertedTrials = Project::whereNotNull('trial_expires_at')
            ->whereHas('user.subscriptions', function ($query) {
                $query->where('status', 'active');
            })->count();

        return [
            'total' => $totalTrials,
            'active' => $activeTrials,
            'expired' => $expiredTrials,
            'converted' => $convertedTrials,
            'conversion_rate' => $totalTrials > 0 ? ($convertedTrials / $totalTrials) * 100 : 0,
        ];
    }

    protected function getTemplateStats(): array
    {
        return Project::whereNotNull('template_id')
            ->with('template')
            ->get()
            ->groupBy('template.name')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->take(10);
    }

    protected function getProjectsOverTime(Carbon $startDate): array
    {
        return Project::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    protected function getRevenueOverTime(Carbon $startDate): array
    {
        return Payment::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, sum(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    protected function getUserRegistrations(Carbon $startDate): array
    {
        return User::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    protected function getCompletionRate(Carbon $startDate): float
    {
        $totalProjects = Project::where('created_at', '>=', $startDate)->count();
        $completedProjects = Project::where('created_at', '>=', $startDate)
            ->whereIn('status', ['active', 'completed'])
            ->count();

        return $totalProjects > 0 ? ($completedProjects / $totalProjects) * 100 : 0;
    }

    protected function getConversionRate(Carbon $startDate): float
    {
        $totalUsers = User::where('created_at', '>=', $startDate)->count();
        $paidUsers = User::where('created_at', '>=', $startDate)
            ->whereHas('subscriptions', function ($query) {
                $query->where('status', 'active');
            })->count();

        return $totalUsers > 0 ? ($paidUsers / $totalUsers) * 100 : 0;
    }
}
