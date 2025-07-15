"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog" // Added DialogFooter
import { Upload, Loader2 } from "lucide-react" // Added Loader2

interface ExternalKnowledgeUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExternalKnowledgeUpload({ open, onOpenChange }: ExternalKnowledgeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [knowledgeContext, setKnowledgeContext] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // New state for selected file

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleSubmitUpload = () => {
    // Allow submission if either file is selected OR knowledge context is provided
    if ((!selectedFile && !knowledgeContext.trim()) || isUploading) return

    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      onOpenChange(false)
      setKnowledgeContext("")
      setSelectedFile(null)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4">
          <Upload className="h-4 w-4 mr-2" />
          Upload External Knowledge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Upload External Knowledge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="knowledge-context" className="text-sm font-medium text-gray-300">
              Knowledge Source Context
            </Label>
            <Input
              id="knowledge-context"
              placeholder="e.g., Customer Database Schema, Sales Reports, etc."
              value={knowledgeContext}
              onChange={(e) => setKnowledgeContext(e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              disabled={isUploading}
            />
          </div>
          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium text-gray-300">
              Upload File (Optional)
            </Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange} // Changed to handleFileChange
              accept=".csv,.json,.sql,.txt,.pdf"
              disabled={isUploading}
              className="mt-1 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            You can provide knowledge context with or without a file. Both options help improve query accuracy.
          </div>
          {isUploading && (
            <Alert className="bg-gray-700 border-gray-600 text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <AlertDescription>Uploading and processing your knowledge source...</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            type="submit"
            onClick={handleSubmitUpload}
            disabled={(!selectedFile && !knowledgeContext.trim()) || isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
