import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian text-cloud">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-copper flex items-center justify-center">
              <span className="text-obsidian font-bold text-lg">⚡</span>
            </div>
            <span className="font-serif text-xl text-pure">AutoContent</span>
          </Link>
          <Link to="/" className="text-silver hover:text-pure transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12">
            <h1 className="text-5xl font-serif text-pure mb-4">Privacy Policy</h1>
            <p className="text-mist">Last Updated: January 18, 2026</p>
          </div>

          <div className="prose max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to AutoContent ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring you have a positive experience using our content automation platform. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our website, application, and services (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge 
              that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. 
              If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
            </p>

            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Information You Provide Directly</h3>
            <p><strong>Account Information</strong></p>
            <ul>
              <li>Email address</li>
              <li>Name</li>
              <li>Password (encrypted and never stored in plain text)</li>
              <li>Profile information (optional)</li>
            </ul>
            
            <p><strong>Payment Information</strong></p>
            <ul>
              <li>Credit card information (processed securely through third-party payment processors; we do not store full card details)</li>
              <li>Billing address</li>
              <li>Payment history</li>
            </ul>

            <p><strong>Content You Create</strong></p>
            <ul>
              <li>Topics and prompts you submit</li>
              <li>Custom scripts or text you input</li>
              <li>Generated videos, images, and slideshows</li>
              <li>Editing preferences (fonts, themes, voiceovers)</li>
              <li>Conversation history with our AI agent</li>
            </ul>

            <p><strong>Social Media Credentials</strong></p>
            <ul>
              <li>TikTok OAuth tokens (for posting automation)</li>
              <li>Instagram account credentials via API</li>
              <li>Social media account IDs and usernames</li>
            </ul>

            <h3>1.2 Information Collected Automatically</h3>
            <p><strong>Usage Data</strong></p>
            <ul>
              <li>Pages visited and features used</li>
              <li>Time spent on the Service</li>
              <li>Generation requests and completion rates</li>
              <li>Error logs and diagnostic data</li>
              <li>Device information (browser type, operating system, IP address)</li>
            </ul>

            <p><strong>Cookies and Tracking Technologies</strong></p>
            <ul>
              <li>Session cookies for authentication</li>
              <li>Analytics cookies to understand user behavior</li>
              <li>Preference cookies to remember your settings</li>
            </ul>

            <h3>1.3 Information from Third Parties</h3>
            <p><strong>AI Service Providers</strong></p>
            <ul>
              <li>We process your content through various AI APIs including OpenAI, ElevenLabs, and image generation services</li>
              <li>These providers may collect technical data as per their own privacy policies</li>
              <li>We do not receive personal information about you from these providers beyond what's necessary for service functionality</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>

            <h3>2.1 Service Provision</h3>
            <ul>
              <li>Generate content based on your requests</li>
              <li>Create videos, images, and slideshows</li>
              <li>Post content to your connected social media accounts</li>
              <li>Store your content in our gallery for future access</li>
              <li>Provide version history and editing capabilities</li>
            </ul>

            <h3>2.2 Service Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve features</li>
              <li>Train and optimize our AI systems</li>
              <li>Fix bugs and technical issues</li>
              <li>Develop new features based on user needs</li>
            </ul>

            <h3>2.3 Communication</h3>
            <ul>
              <li>Send service-related emails (account verification, password resets)</li>
              <li>Notify you about new features or updates</li>
              <li>Respond to your support requests</li>
              <li>Send marketing communications (with your consent; opt-out available)</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>We do not sell your personal information to third parties. We may share your information in the following circumstances:</p>

            <h3>3.1 Service Providers</h3>
            <p>We share data with trusted third-party service providers who help us operate the Service:</p>
            <p><strong>AI & Content Generation:</strong> OpenAI, ElevenLabs, image generation services</p>
            <p><strong>Infrastructure & Hosting:</strong> Google Cloud Platform, Vercel, Firebase</p>
            <p><strong>Social Media Posting:</strong> TikTok, Instagram APIs</p>

            <h3>3.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid legal processes.</p>

            <h2>4. Data Storage and Security</h2>
            <h3>4.1 Where We Store Data</h3>
            <p>
              Primary data storage and processing occurs on servers located in the United States. 
              Generated videos, images, and slideshows are stored in cloud storage services.
            </p>

            <h3>4.2 Security Measures</h3>
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul>
              <li>Encryption in transit (TLS/SSL)</li>
              <li>Encryption at rest for sensitive data</li>
              <li>Secure API authentication (API keys, OAuth tokens)</li>
              <li>Regular security audits and vulnerability scanning</li>
              <li>Rate limiting to prevent abuse</li>
            </ul>

            <h2>5. Data Retention</h2>
            <ul>
              <li>Account information is retained for as long as your account is active</li>
              <li>Generated content is retained indefinitely unless you delete it</li>
              <li>Deleted content is permanently removed within 30 days</li>
              <li>Analytics and log data are retained for 12 months</li>
            </ul>

            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p>To exercise any of these rights, please contact us at: <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></p>

            <h2>7. Children's Privacy</h2>
            <p>
              The Service is not intended for children under the age of 13 (or 16 in the European Economic Area). 
              We do not knowingly collect personal information from children. If you believe we have collected 
              information from a child, please contact us at sharoz75@gmail.com.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              If you are accessing the Service from outside the United States, please be aware that your 
              information may be transferred to, stored, and processed in the United States. By using the 
              Service, you consent to this transfer.
            </p>

            <h2>9. California Privacy Rights</h2>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete your personal information</li>
              <li>Right to opt-out of sale (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <h2>10. Cookies and Tracking</h2>
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by 
              posting the updated policy on our website and updating the "Last Updated" date.
            </p>

            <h2>12. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
            </ul>
            <p><strong>Response Time:</strong> We aim to respond to all inquiries within 5 business days.</p>

            <div className="mt-16 pt-8 border-t border-slate/30">
              <p className="text-mist text-sm">
                <strong>By using AutoContent, you acknowledge that you have read and understood this Privacy Policy.</strong>
              </p>
              <p className="text-mist text-sm mt-4">© 2026 AutoContent. All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mist text-sm">© 2026 AutoContent. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-accent-gold">Privacy Policy</Link>
            <Link to="/terms" className="text-silver hover:text-pure transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
