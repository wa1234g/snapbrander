<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Template::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('requires_woocommerce')) {
            $query->where('requires_woocommerce', $request->boolean('requires_woocommerce'));
        }

        $templates = $query->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json($templates);
    }

    public function show(Template $template): JsonResponse
    {
        return response()->json($template);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:business,ecommerce,landing,portfolio',
            'preview_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'template_kit' => 'required|file|mimes:zip',
            'requires_woocommerce' => 'boolean',
            'color_schemes' => 'nullable|array',
            'demo_data' => 'nullable|array',
        ]);

        $previewImagePath = $request->file('preview_image')->store('templates/previews', 'public');
        $templateKitPath = $request->file('template_kit')->store('templates/kits', 'public');

        $template = Template::create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'preview_image' => $previewImagePath,
            'template_kit_path' => $templateKitPath,
            'requires_woocommerce' => $request->boolean('requires_woocommerce'),
            'color_schemes' => $request->color_schemes,
            'demo_data' => $request->demo_data,
            'is_active' => true,
        ]);

        return response()->json($template, 201);
    }

    public function update(Request $request, Template $template): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|in:business,ecommerce,landing,portfolio',
            'preview_image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'template_kit' => 'sometimes|file|mimes:zip',
            'requires_woocommerce' => 'sometimes|boolean',
            'color_schemes' => 'sometimes|nullable|array',
            'demo_data' => 'sometimes|nullable|array',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $updateData = $request->only([
            'name', 'description', 'category', 'requires_woocommerce',
            'color_schemes', 'demo_data', 'is_active', 'sort_order'
        ]);

        if ($request->hasFile('preview_image')) {
            $updateData['preview_image'] = $request->file('preview_image')->store('templates/previews', 'public');
        }

        if ($request->hasFile('template_kit')) {
            $updateData['template_kit_path'] = $request->file('template_kit')->store('templates/kits', 'public');
        }

        $template->update($updateData);

        return response()->json($template);
    }

    public function destroy(Request $request, Template $template): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $template->update(['is_active' => false]);

        return response()->json(['message' => 'Template deactivated successfully']);
    }
}
