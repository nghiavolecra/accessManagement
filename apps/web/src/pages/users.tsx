// apps/web/src/pages/users.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, createUser, deleteUser, assignRole, unassignRole } from "@/services/users.service";
import { listRoles } from "@/services/roles.service";
import { useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => listUsers({ page: 1, limit: 50 }),
    });

    const { data: roles } = useQuery({
        queryKey: ["roles"],
        queryFn: () => listRoles(),
    });

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const mCreate = useMutation({
        mutationFn: () => createUser(form),
        onSuccess: () => {
            toast.success("User created");
            qc.invalidateQueries({ queryKey: ["users"] });
            setShowModal(false);
            setForm({ email: "", password: "", firstName: "", lastName: "" });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
    });

    const mDelete = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => toast.error("Delete failed"),
    });

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white rounded px-4 py-2"
                >
                    + Create User
                </button>
            </div>

            {/* User List */}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto border rounded">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2">Email</th>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Active</th>
                                <th className="text-left p-2">Roles</th>
                                <th className="text-right p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items?.map((u: any) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.firstName} {u.lastName}</td>
                                    <td className="p-2">{u.isActive ? "Yes" : "No"}</td>
                                    <td className="p-2">{u.roles?.join(", ")}</td>
                                    <td className="p-2 text-right space-x-2">
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="px-2 py-1 rounded bg-blue-600 text-white"
                                        >
                                            Manage Roles
                                        </button>
                                        <button
                                            onClick={() => mDelete.mutate(u.id)}
                                            className="px-2 py-1 rounded bg-red-600 text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data?.items?.length === 0 && (
                                <tr>
                                    <td className="p-2 text-center" colSpan={5}>No users</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Create User */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Create User</h3>
                        <input
                            placeholder="Email"
                            className="border rounded px-2 py-1 w-full"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            className="border rounded px-2 py-1 w-full"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <input
                            placeholder="First name"
                            className="border rounded px-2 py-1 w-full"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        />
                        <input
                            placeholder="Last name"
                            className="border rounded px-2 py-1 w-full"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">
                                Cancel
                            </button>
                            <button
                                onClick={() => mCreate.mutate()}
                                className="bg-black text-white rounded px-4 py-2"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Manage Roles */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4">
                        <h3 className="text-lg font-semibold">Manage Roles for {selectedUser.email}</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {roles?.map((r: any) => {
                                const checked = selectedUser.roles?.includes(r.name);
                                return (
                                    <label key={r.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    assignRole(selectedUser.id, r.id).then(() => {
                                                        toast.success(`Role ${r.name} assigned`);
                                                        qc.invalidateQueries({ queryKey: ["users"] });
                                                    });
                                                } else {
                                                    unassignRole(selectedUser.id, r.id).then(() => {
                                                        toast.success(`Role ${r.name} removed`);
                                                        qc.invalidateQueries({ queryKey: ["users"] });
                                                    });
                                                }
                                            }}
                                        />
                                        {r.name}
                                    </label>
                                );
                            })}
                            {(!roles || roles.length === 0) && (
                                <div className="text-sm text-gray-500">No roles available</div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setSelectedUser(null)} className="px-4 py-2 border rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
