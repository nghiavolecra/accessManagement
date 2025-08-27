import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function Users() {
  const { data, isLoading, error } = useQuery({ queryKey: ["users"], queryFn: async () => (await api.get("/users")).data });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Người dùng</h2>
      <table className="w-full text-left">
        <thead><tr><th>Email</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th></tr></thead>
        <tbody>
          {data.map((u: any) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.roles.join(", ")}</td>
              <td>{u.isActive? "Active":"Disabled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}