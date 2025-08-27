import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const r = row.getValue("role") as string
      const color =
        r === "admin"
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : r === "manager"
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      return (
        <span className={`rounded-full px-2 py-0.5 text-xs ${color}`}>
          {r}
        </span>
      )
    },
  },
]
