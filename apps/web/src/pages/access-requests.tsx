import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

import {
    listAccessReq,
    createAccessReq,
    approveAccessReq,
    rejectAccessReq,
} from "@/services/accessRequests.service";
import { listResources } from "@/services/resources.service";

// Kiểu status
type RequestStatus = "pending" | "approved" | "rejected" | "expired";

type FormState = {
    resourceId: string;
    purpose: string;
    startDate: string;
    endDate: string;
};

export default function AccessRequestsPage() {
    const qc = useQueryClient();
    const { user } = useAuth();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["access-requests"],
        queryFn: () => listAccessReq(),
    });

    const { data: resData } = useQuery({
        queryKey: ["resources-mini"],
        queryFn: () => listResources({ limit: 100 }),
    });

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<FormState>({
        resourceId: "",
        purpose: "",
        startDate: "",
        endDate: "",
    });

    const mCreate = useMutation({
        mutationFn: () =>
            createAccessReq({
                ...form,
                requesterId: user?.id,
                status: "pending" as RequestStatus,
            }),
        onSuccess: () => {
            toast.success("Request created");
            setForm({ resourceId: "", purpose: "", startDate: "", endDate: "" });
            setShowModal(false);
            qc.invalidateQueries({ queryKey: ["access-requests"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
    });

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Access Requests</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black text-white rounded px-4 py-2"
                >
                    + Create Request
                </button>
            </div>

            {/* Bảng requests */}
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p className="text-red-600">Failed to load: {(error as any)?.message ?? ""}</p>
            ) : (
                <div className="overflow-auto border rounded">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2">Resource</th>
                                <th className="text-left p-2">Requester</th>
                                <th className="text-left p-2">Time</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-right p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((a: any) => (
                                    <tr key={a.id} className="border-t">
                                        <td className="p-2">{a?.resource?.name ?? "-"}</td>
                                        <td className="p-2">
                                            {a?.requester?.email ??
                                                [a?.requester?.firstName, a?.requester?.lastName].filter(Boolean).join(" ") ??
                                                "-"}
                                        </td>
                                        <td className="p-2">
                                            {a?.startDate ? new Date(a.startDate).toLocaleString() : "-"} {" → "}
                                            {a?.endDate ? new Date(a.endDate).toLocaleString() : "-"}
                                        </td>
                                        <td className="p-2 capitalize">{a?.status ?? "-"}</td>
                                        <td className="p-2 text-right">
                                            <ApproveReject id={a.id} status={a.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-4 text-center opacity-60" colSpan={5}>
                                        No access requests
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal tạo request */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Create Access Request</h3>

                        <select
                            className="border rounded px-2 py-1 w-full"
                            value={form.resourceId}
                            onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
                        >
                            <option value="">— Select resource —</option>
                            {resData?.items?.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Purpose"
                            className="border rounded px-2 py-1 w-full"
                            value={form.purpose}
                            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                        />

                        <input
                            type="datetime-local"
                            className="border rounded px-2 py-1 w-full"
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        />

                        <input
                            type="datetime-local"
                            className="border rounded px-2 py-1 w-full"
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
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
                                disabled={
                                    mCreate.isPending ||
                                    !form.resourceId ||
                                    !form.purpose ||
                                    !form.startDate ||
                                    !form.endDate
                                }
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
function ApproveReject({ id, status }: { id: string; status: RequestStatus }) {
    const qc = useQueryClient();
    const mApprove = useMutation({
        mutationFn: () => approveAccessReq(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["access-requests"] }),
    });
    const mReject = useMutation({
        mutationFn: () => rejectAccessReq(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["access-requests"] }),
    });

    if (status !== "pending") return <span className="opacity-60">—</span>;

    return (
        <div className="inline-flex items-center justify-end gap-4">
            <button
                onClick={() => mApprove.mutate()}
                disabled={mApprove.isPending}
                className="px-2 py-1 rounded bg-green-600 text-white disabled:opacity-50"
            >
                {mApprove.isPending ? "Approving..." : "Approve"}
            </button>
            <button
                onClick={() => mReject.mutate()}
                disabled={mReject.isPending}
                className="px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
            >
                {mReject.isPending ? "Rejecting..." : "Reject"}
            </button>
        </div>
    );
}

