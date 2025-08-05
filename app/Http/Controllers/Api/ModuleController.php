<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ModuleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Module::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('is_free')) {
            $query->where('is_free', $request->boolean('is_free'));
        }

        $modules = $query->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json($modules);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:modules',
            'description' => 'required|string',
            'category' => 'required|in:communication,ecommerce,analytics,social,booking',
            'icon' => 'nullable|string',
            'config_schema' => 'nullable|array',
            'price' => 'nullable|numeric|min:0',
            'is_free' => 'boolean',
        ]);

        $module = Module::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'category' => $request->category,
            'icon' => $request->icon,
            'config_schema' => $request->config_schema,
            'price' => $request->price ?? 0,
            'is_free' => $request->boolean('is_free', true),
            'is_active' => true,
        ]);

        return response()->json($module, 201);
    }

    public function show(Module $module): JsonResponse
    {
        return response()->json($module);
    }

    public function update(Request $request, Module $module): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:modules,slug,' . $module->id,
            'description' => 'sometimes|string',
            'category' => 'sometimes|in:communication,ecommerce,analytics,social,booking',
            'icon' => 'sometimes|nullable|string',
            'config_schema' => 'sometimes|nullable|array',
            'price' => 'sometimes|nullable|numeric|min:0',
            'is_free' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $module->update($request->only([
            'name', 'slug', 'description', 'category', 'icon',
            'config_schema', 'price', 'is_free', 'is_active', 'sort_order'
        ]));

        return response()->json($module);
    }

    public function destroy(Request $request, Module $module): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $module->update(['is_active' => false]);

        return response()->json(['message' => 'Module deactivated successfully']);
    }
}
