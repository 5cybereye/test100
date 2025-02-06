"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RecoveryPhraseInput } from "@/components/recovery-phrase-input"
import { PrivateKeyInput } from "@/components/private-key-input"
import { Wallet, LifeBuoy, Settings, Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"phrase" | "key">("phrase")
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
      router.push("/login")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="fixed top-4 left-4 z-50 md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <Sidebar setActiveTab={setActiveTab} handleLogout={handleLogout} />
          </SheetContent>
        </Sheet>
        <aside className="hidden lg:block border-r bg-background/50 backdrop-blur">
          <Sidebar setActiveTab={setActiveTab} handleLogout={handleLogout} />
        </aside>
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">spacerpc</h1>
              <div className="text-sm text-muted-foreground">Secure access to your recovery tools</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mt-6 p-6">
              <div className="mb-4 flex items-center justify-start space-x-2">
                <Button
                  size="sm"
                  variant={activeTab === "phrase" ? "default" : "ghost"}
                  onClick={() => setActiveTab("phrase")}
                >
                  Recovery Phrase
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "key" ? "default" : "ghost"}
                  onClick={() => setActiveTab("key")}
                >
                  Private Key
                </Button>
              </div>
              {activeTab === "phrase" ? <RecoveryPhraseInput /> : <PrivateKeyInput />}
            </Card>
          </motion.div>
        </main>
      </div>
    </motion.div>
  )
}

function Sidebar({
  setActiveTab,
  handleLogout,
}: {
  setActiveTab: (tab: "phrase" | "key") => void
  handleLogout: () => void
}) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Wallet className="h-6 w-6" />
        <span className="font-bold">spacerpc</span>
      </div>
      <div className="px-4 py-4">
        <Input placeholder="Search" className="bg-background/50" />
      </div>
      <nav className="space-y-2 px-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LifeBuoy className="h-4 w-4" />
          Support
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </nav>
    </>
  )
}

