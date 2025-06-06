"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react"
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from "@/lib/emailjs-config"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  userName?: string
}

export default function FeedbackModal({ isOpen, onClose, userEmail, userName }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [subject, setSubject] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedback.trim()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)

      // Template parameters - must match your EmailJS template exactly
      const templateParams = {
        from_name: userName || 'FlowerPress User',
        from_email: userEmail || 'anonymous@example.com',
        email: 'angd1399@gmail.com',
        subject: subject || 'FlowerPress Feedback',
        message: feedback,
        timestamp: new Date().toLocaleString()
      }

      console.log('Sending email with params:', templateParams)

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      )

      console.log('EmailJS result:', result)

      setSubmitStatus('success')
      setFeedback("")
      setSubject("")
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose()
        setSubmitStatus('idle')
      }, 2000)

            } catch (error) {
      console.error('EmailJS error details:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setFeedback("")
      setSubject("")
      setSubmitStatus('idle')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#2E4D2E] dark:text-green-300">
            <MessageSquare className="w-5 h-5" />
            Send Feedback
          </DialogTitle>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-700 dark:text-green-400 mb-2">
              Feedback Sent!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for your feedback. We'll get back to you soon!
            </p>
          </div>
        ) : submitStatus === 'error' ? (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
              Failed to Send
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Something went wrong. Please try again or contact us directly.
            </p>
            <Button 
              onClick={() => setSubmitStatus('idle')} 
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="What's this feedback about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think! Suggestions, bugs, or just say hi..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                From: {userEmail || 'Anonymous user'} → To: Angad
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="bg-gradient-to-r from-[#2E4D2E] to-[#1D3C1D] hover:from-[#1D3C1D] hover:to-[#0F2A0F] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 