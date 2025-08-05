<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $members = $project->teamMembers()
            ->with('user')
            ->orderBy('role')
            ->orderBy('created_at')
            ->get();

        return response()->json($members);
    }

    public function invite(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:editor,viewer',
            'permissions' => 'nullable|array',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($project->teamMembers()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User is already a team member'], 400);
        }

        $teamMember = TeamMember::create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'role' => $request->role,
            'permissions' => $request->permissions,
            'invited_at' => now(),
            'joined_at' => now(),
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'team_member_invited',
            'description' => "User {$user->email} invited as {$request->role}",
            'metadata' => ['invited_user_id' => $user->id, 'role' => $request->role],
            'level' => 'info',
        ]);

        return response()->json([
            'team_member' => $teamMember->load('user'),
            'message' => 'Team member invited successfully',
        ], 201);
    }

    public function updateRole(Request $request, Project $project, TeamMember $member): JsonResponse
    {
        $this->authorize('update', $project);

        if ($member->project_id !== $project->id) {
            return response()->json(['message' => 'Team member not found'], 404);
        }

        $request->validate([
            'role' => 'required|in:owner,editor,viewer',
            'permissions' => 'nullable|array',
        ]);

        $member->update([
            'role' => $request->role,
            'permissions' => $request->permissions,
        ]);

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'team_member_role_updated',
            'description' => "Team member role updated to {$request->role}",
            'metadata' => ['member_id' => $member->id, 'new_role' => $request->role],
            'level' => 'info',
        ]);

        return response()->json([
            'team_member' => $member->load('user'),
            'message' => 'Team member role updated successfully',
        ]);
    }

    public function remove(Request $request, Project $project, TeamMember $member): JsonResponse
    {
        $this->authorize('update', $project);

        if ($member->project_id !== $project->id) {
            return response()->json(['message' => 'Team member not found'], 404);
        }

        if ($member->role === 'owner') {
            return response()->json(['message' => 'Cannot remove project owner'], 400);
        }

        $project->logs()->create([
            'user_id' => $request->user()->id,
            'action' => 'team_member_removed',
            'description' => "Team member removed",
            'metadata' => ['removed_member_id' => $member->id],
            'level' => 'info',
        ]);

        $member->delete();

        return response()->json(['message' => 'Team member removed successfully']);
    }
}
