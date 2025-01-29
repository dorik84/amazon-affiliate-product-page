import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function AffiliateMessage() {
  return (
    <Alert className="border-0">
      <Info className="h-4 w-4" />
      <AlertDescription>
        As an Amazon Associate, we earn from qualifying purchases. Thank you for supporting our store!
      </AlertDescription>
    </Alert>
  )
}

