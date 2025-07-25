import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1,2,3,4].map(i => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Some content...</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
