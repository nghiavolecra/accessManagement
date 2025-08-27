import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "@/services/audit.service";


export default function AuditLogsPage() {
    const { data, isLoading } = useQuery({ queryKey: ["audit"], queryFn: () => listAuditLogs({ page: 1, limit: 50 }) });
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="overflow-auto border rounded">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2">Time</th>
                                <th className="text-left p-2">User</th>
                                <th className="text-left p-2">Action</th>
                                <th className="text-left p-2">Resource</th>
                                <th className="text-left p-2">Success</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items?.map((l: any) => (
                                <tr key={l.id} className="border-t">
                                    <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                                    <td className="p-2">{l.user?.email ?? "—"}</td>
                                    <td className="p-2">{l.action}</td>
                                    <td className="p-2">{l.resource?.name ?? "—"}</td>
                                    <td className="p-2">{l.success ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}