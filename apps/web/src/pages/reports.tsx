import { useQuery } from "@tanstack/react-query";
import { getAccessSummary } from "@/services/reports.service";


export default function ReportsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["access-summary"],
        queryFn: () => getAccessSummary(),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">Failed to load</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Access Summary</h2>

            {/* By Resource */}
            <div className="border rounded overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">Resource</th>
                            <th className="p-2 text-right">Requests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data?.byResource ?? []).map((r: any) => (
                            <tr key={r.resourceId} className="border-t">
                                <td className="p-2">{r.resourceName ?? r.resourceId}</td>
                                <td className="p-2 text-right">{r.count}</td>
                            </tr>
                        ))}
                        {(!data?.byResource || data.byResource.length === 0) && (
                            <tr><td colSpan={2} className="p-4 text-center opacity-60">No data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* By Status */}
            <div className="border rounded overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-right">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data?.byStatus ?? []).map((s: any) => (
                            <tr key={s.status} className="border-t">
                                <td className="p-2 capitalize">{s.status}</td>
                                <td className="p-2 text-right">{s.count}</td>
                            </tr>
                        ))}
                        {(!data?.byStatus || data.byStatus.length === 0) && (
                            <tr><td colSpan={2} className="p-4 text-center opacity-60">No data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
