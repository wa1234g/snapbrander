<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $subscription = $request->user()
            ->subscriptions()
            ->with('plan')
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->first();

        return response()->json($subscription);
    }

    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'payment_id' => 'required|exists:payments,id',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        
        $existingSubscription = $request->user()
            ->subscriptions()
            ->where('status', 'active')
            ->first();

        if ($existingSubscription) {
            $existingSubscription->update(['status' => 'cancelled']);
        }

        $endsAt = $request->billing_cycle === 'yearly' 
            ? now()->addYear() 
            : now()->addMonth();

        $subscription = Subscription::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'billing_cycle' => $request->billing_cycle,
            'current_period_start' => now(),
            'current_period_end' => $endsAt,
            'trial_ends_at' => null,
        ]);

        return response()->json([
            'subscription' => $subscription->load('plan'),
            'message' => 'Subscription created successfully',
        ]);
    }

    public function update(Request $request, Subscription $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $request->validate([
            'plan_id' => 'sometimes|exists:plans,id',
            'billing_cycle' => 'sometimes|in:monthly,yearly',
        ]);

        $subscription->update($request->only(['plan_id', 'billing_cycle']));

        return response()->json([
            'subscription' => $subscription->load('plan'),
            'message' => 'Subscription updated successfully',
        ]);
    }

    public function cancel(Request $request, Subscription $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'subscription' => $subscription,
            'message' => 'Subscription cancelled successfully',
        ]);
    }

    public function resume(Request $request, Subscription $subscription): JsonResponse
    {
        $this->authorize('update', $subscription);

        if ($subscription->status !== 'cancelled') {
            return response()->json(['message' => 'Only cancelled subscriptions can be resumed'], 400);
        }

        $subscription->update([
            'status' => 'active',
            'cancelled_at' => null,
            'current_period_end' => now()->addMonth(),
        ]);

        return response()->json([
            'subscription' => $subscription,
            'message' => 'Subscription resumed successfully',
        ]);
    }
}
