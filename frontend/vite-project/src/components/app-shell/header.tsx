import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator.tsx"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex-1" />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-2 h-6" />
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://i.pravatar.cc/80" />
        <AvatarFallback>NV</AvatarFallback>
      </Avatar>
    </header>
  )
}
