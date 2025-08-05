<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function plans(): JsonResponse
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($plans);
    }

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $amount = $request->billing_cycle === 'yearly' 
            ? $plan->yearly_price 
            : $plan->monthly_price;

        $paymentIntent = [
            'id' => 'pi_' . Str::random(24),
            'client_secret' => 'pi_' . Str::random(24) . '_secret_' . Str::random(16),
            'amount' => $amount * 100,
            'currency' => 'egp',
            'status' => 'requires_payment_method',
        ];

        return response()->json([
            'payment_intent' => $paymentIntent,
            'plan' => $plan,
            'amount' => $amount,
        ]);
    }

    public function confirmPayment(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $amount = $request->billing_cycle === 'yearly' 
            ? $plan->yearly_price 
            : $plan->monthly_price;

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'amount' => $amount,
            'currency' => 'EGP',
            'payment_method' => 'stripe',
            'payment_intent_id' => $request->payment_intent_id,
            'status' => 'completed',
            'billing_cycle' => $request->billing_cycle,
        ]);

        $invoice = Invoice::create([
            'user_id' => $request->user()->id,
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-' . date('Y') . '-' . str_pad(Invoice::count() + 1, 6, '0', STR_PAD_LEFT),
            'amount' => $amount,
            'currency' => 'EGP',
            'status' => 'paid',
            'issued_at' => now(),
            'due_at' => now()->addDays(30),
            'paid_at' => now(),
        ]);

        return response()->json([
            'payment' => $payment,
            'invoice' => $invoice,
            'message' => 'Payment completed successfully',
        ]);
    }

    public function invoices(Request $request): JsonResponse
    {
        $invoices = $request->user()
            ->invoices()
            ->with('payment.plan')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($invoices);
    }
}
