// EmailJS Configuration for FlowerPress Feedback System
// 
// To fully enable this, you'll need to:
// 1. Sign up at https://www.emailjs.com/
// 2. Create a service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your public key
// 5. Replace the placeholder values below

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_333333',
  TEMPLATE_ID: 'template_xc2ueee', 
  PUBLIC_KEY: 'qvQ1S5O2dsv6vzPE0'
}

// Simple fallback email function using mailto (works immediately)
export const sendFeedbackEmail = (params: {
  from_name: string
  from_email: string
  subject: string
  message: string
  timestamp: string
}) => {
  const { from_name, from_email, subject, message, timestamp } = params
  
  const emailBody = `
Hello Liya,

You have received new feedback from FlowerPress!

From: ${from_name} (${from_email})
Subject: ${subject}
Time: ${timestamp}

Message:
${message}

---
Sent from FlowerPress App
  `.trim()

  const mailtoLink = `mailto:angd1399@gmail.com?subject=FlowerPress Feedback: ${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
  
  // Open user's default email client
  window.open(mailtoLink, '_blank')
  
  return Promise.resolve()
} 