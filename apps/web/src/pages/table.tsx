import { DataTable } from "@/components/data-table/data-table"
import { columns, type User } from "@/components/data-table/columns"

const data: User[] = [
  { id: "1", name: "Alice", email: "alice@acme.com", role: "admin" },
  { id: "2", name: "Bob", email: "bob@acme.com", role: "manager" },
  { id: "3", name: "Charlie", email: "charlie@acme.com", role: "user" },
]

export default function TablePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Users</h2>
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
