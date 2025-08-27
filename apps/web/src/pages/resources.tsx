import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    listResources,
    createResource,
    deleteResource,
} from "@/services/resources.service";

type ResourceType = "physical" | "digital" | "system";
type SecurityLevel = "low" | "medium" | "high" | "critical";

type ResourceForm = {
    name: string;
    type: ResourceType;
    securityLevel: SecurityLevel;
    location?: string;
};

export default function ResourcesPage() {
    const qc = useQueryClient();

    // state
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<ResourceForm>({
        name: "",
        type: "physical",
        securityLevel: "low",
        location: "",
    });

    // query list
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["resources", { page: 1, limit: 50 }],
        queryFn: () => listResources({ page: 1, limit: 50 }),
    });

    // create
    const mCreate = useMutation({
        mutationFn: () =>
            createResource({
                ...form,
                isActive: true,
            }),
        onSuccess: () => {
            toast.success("Resource created");
            setForm({ name: "", type: "physical", securityLevel: "low", location: "" });
            setShowModal(false);
            qc.invalidateQueries({ queryKey: ["resources"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
    });

    // delete
    const mDelete = useMutation({
        mutationFn: (id: string) => deleteResource(id),
        onSuccess: () => {
            toast.success("Deleted");
            qc.invalidateQueries({ queryKey: ["resources"] });
        },
        onError: () => toast.error("Delete failed"),
    });

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white rounded px-4 py-2"
                >
                    + Create Resource
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p className="text-red-600">Failed to load: {(error as any)?.message ?? ""}</p>
            ) : (
                <div className="overflow-auto border rounded">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-left p-2">Level</th>
                                <th className="text-left p-2">Location</th>
                                <th className="text-right p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.items ?? []).map((r: any) => (
                                <tr key={r.id} className="border-t">
                                    <td className="p-2">{r.name}</td>
                                    <td className="p-2">{r.type}</td>
                                    <td className="p-2">{r.securityLevel}</td>
                                    <td className="p-2">{r.location ?? "-"}</td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => mDelete.mutate(r.id)}
                                            disabled={mDelete.isPending}
                                            className="px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                                        >
                                            {mDelete.isPending ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!data?.items || data.items.length === 0) && (
                                <tr>
                                    <td className="p-4 text-center opacity-60" colSpan={5}>
                                        No resources
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Create */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Create Resource</h3>

                        <input
                            placeholder="Name"
                            className="border rounded px-2 py-1 w-full"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <select
                            className="border rounded px-2 py-1 w-full"
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value as ResourceType })
                            }
                        >
                            <option value="physical">physical</option>
                            <option value="digital">digital</option>
                            <option value="system">system</option>
                        </select>

                        <select
                            className="border rounded px-2 py-1 w-full"
                            value={form.securityLevel}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    securityLevel: e.target.value as SecurityLevel,
                                })
                            }
                        >
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                            <option value="critical">critical</option>
                        </select>

                        <input
                            placeholder="Location"
                            className="border rounded px-2 py-1 w-full"
                            value={form.location ?? ""}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
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
        </div>
    );
}
