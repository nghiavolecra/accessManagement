import { useQuery } from "@tanstack/react-query";
import { listRoles } from "@/services/roles.service";
import { listPermissions, addPermissionToRole, removePermissionFromRole } from "@/services/permissions.service";
import { toast } from "sonner";

export default function RolesPage() {
    const { data: roles } = useQuery({ queryKey: ["roles"], queryFn: listRoles });
    const { data: permissions } = useQuery({ queryKey: ["permissions"], queryFn: listPermissions });

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Roles</h2>
            {roles?.map((role: any) => (
                <div key={role.id} className="border rounded p-4">
                    <h3 className="font-semibold mb-2">{role.name}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {permissions?.map((p: any) => {
                            const checked = role.permissions.some((rp: any) => rp.id === p.id);
                            return (
                                <label key={p.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                addPermissionToRole(role.id, p.id).then(() => toast.success("Added"));
                                            } else {
                                                removePermissionFromRole(role.id, p.id).then(() => toast.success("Removed"));
                                            }
                                        }}
                                    />
                                    {p.name} ({p.action} on {p.resource})
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
