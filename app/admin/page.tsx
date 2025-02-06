import type { Metadata } from "next"
import AdminPage from "@/components/admin-page"

export const metadata: Metadata = {
  title: "Admin - spacerpc",
  description: "Admin panel for spacerpc",
}

export default function Page() {
  return <AdminPage />
}

