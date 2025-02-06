import type { Metadata } from "next"
import LoginPage from "@/components/login-page"

export const metadata: Metadata = {
  title: "Login - spacerpc",
  description: "Log in to access your secure wallet recovery tools",
}

export default function Page() {
  return <LoginPage />
}

