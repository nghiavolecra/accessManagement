// apps/web/src/pages/roles.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    listRoles,
    createRole,
    deleteRole,
    listPermissions,
    addPermissionToRole,
    removePermissionFromRole,
} from "@/services/roles.service";
import { useState } from "react";
import { toast } from "sonner";

export default function RolesPage() {
    const qc = useQueryClient();

    // Query roles
    const { data: roles, isLoading } = useQuery({
        queryKey: ["roles"],
        queryFn: () => listRoles(),
    });

    // Query all permissions
    const { data: permissions } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => listPermissions(),
    });

    // State cho modal Create + Manage Permissions
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [selectedRole, setSelectedRole] = useState<any | null>(null);

    // Mutations
    const mCreate = useMutation({
        mutationFn: () => createRole({ name: form.name, description: form.description }),
        onSuccess: () => {
            toast.success("Role created");
            qc.invalidateQueries({ queryKey: ["roles"] });
            setForm({ name: "", description: "" });
            setShowModal(false);
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
    });

    const mDelete = useMutation({
        mutationFn: (id: string) => deleteRole(id),
        onSuccess: () => {
            toast.success("Role deleted");
            qc.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: () => toast.error("Delete failed"),
    });

    // UI
    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white rounded px-4 py-2"
                >
                    + Create Role
                </button>
            </div>

            {/* List roles */}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="border rounded divide-y">
                    {roles?.map((r: any) => (
                        <li key={r.id} className="p-2 flex items-center justify-between">
                            <div>
                                <div className="font-medium">{r.name}</div>
                                <div className="text-xs opacity-70">{r.description ?? ""}</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedRole(r)}
                                    className="px-2 py-1 rounded bg-blue-600 text-white"
                                >
                                    Manage Permissions
                                </button>
                                <button
                                    onClick={() => mDelete.mutate(r.id)}
                                    disabled={mDelete.isPending}
                                    className="px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                                >
                                    {mDelete.isPending ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </li>
                    ))}
                    {(!roles || roles.length === 0) && (
                        <li className="p-4 text-center opacity-60">No roles</li>
                    )}
                </ul>
            )}

            {/* Modal Create Role */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Create Role</h3>

                        <input
                            placeholder="Role name"
                            className="border rounded px-2 py-1 w-full"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <textarea
                            placeholder="Description (optional)"
                            className="border rounded px-2 py-1 w-full"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => mCreate.mutate()}
                                disabled={mCreate.isPending || !form.name}
                                className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
                            >
                                {mCreate.isPending ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Manage Permissions */}
            {selectedRole && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4">
                        <h3 className="text-lg font-semibold">
                            Permissions for {selectedRole.name}
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {permissions?.map((p: any) => {
                                const checked = selectedRole.permissions?.some(
                                    (rp: any) => rp.id === p.id
                                );
                                return (
                                    <label key={p.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    addPermissionToRole(selectedRole.id, p.id).then(() => {
                                                        toast.success("Permission added");
                                                        qc.invalidateQueries({ queryKey: ["roles"] });
                                                    });
                                                } else {
                                                    removePermissionFromRole(selectedRole.id, p.id).then(() => {
                                                        toast.success("Permission removed");
                                                        qc.invalidateQueries({ queryKey: ["roles"] });
                                                    });
                                                }
                                            }}
                                        />
                                        {p.name} ({p.action} on {p.resource})
                                    </label>
                                );
                            })}
                            {(!permissions || permissions.length === 0) && (
                                <div className="text-sm text-gray-500">No permissions available</div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
