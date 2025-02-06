import type { Metadata } from "next"
import HomePage from "@/components/home-page"

export const metadata: Metadata = {
  title: "spacerpc - Secure Wallet Recovery",
  description: "Recover your crypto wallet securely with spacerpc",
}

export default function Page() {
  return <HomePage />
}

