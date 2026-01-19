import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian text-cloud">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-copper flex items-center justify-center">
              <span className="text-obsidian font-bold text-lg">φ</span>
            </div>
            <span className="font-serif text-xl text-pure">PhilosophizeMe</span>
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
            <h1 className="text-5xl font-serif text-pure mb-4">Terms of Service</h1>
            <p className="text-mist">Last Updated: January 18, 2026</p>
          </div>

          <div className="prose max-w-none">
            <h2>Agreement to Terms</h2>
            <p>
              Welcome to PhilosophizeMe. These Terms of Service ("Terms") govern your access to and use of our 
              website, application, and services (collectively, the "Service"). By accessing or using the Service, 
              you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
              please do not use the Service.
            </p>
            <p>
              <strong>IMPORTANT:</strong> These Terms contain an arbitration clause and class action waiver that 
              affect your legal rights. Please read Section 17 carefully.
            </p>

            <h2>1. Definitions</h2>
            <ul>
              <li><strong>"Service"</strong> refers to the PhilosophizeMe platform, including website, application, API, and all related services.</li>
              <li><strong>"User," "You," "Your"</strong> refers to any individual or entity using the Service.</li>
              <li><strong>"Content"</strong> refers to any text, images, videos, audio, scripts, or other materials generated through or uploaded to the Service.</li>
              <li><strong>"We," "Us," "Our"</strong> refers to PhilosophizeMe and its affiliates, employees, and contractors.</li>
              <li><strong>"Generated Content"</strong> refers to videos, images, scripts, and other materials created by our AI systems based on your inputs.</li>
            </ul>

            <h2>2. Eligibility</h2>
            <h3>2.1 Age Requirements</h3>
            <p>
              You must be at least 13 years old (or 16 in the European Economic Area) to use the Service. 
              If you are under 18, you represent that you have your parent or guardian's permission to use the Service.
            </p>

            <h3>2.2 Account Accuracy</h3>
            <p>
              You agree to provide accurate, current, and complete information during registration and to update 
              such information to keep it accurate, current, and complete.
            </p>

            <h3>2.3 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>3. Account Registration and Types</h2>
            <h3>3.1 Free Tier</h3>
            <ul>
              <li>Limited video generation (10 videos per month)</li>
              <li>Basic features and themes</li>
              <li>Community support</li>
              <li>No automatic posting</li>
            </ul>

            <h3>3.2 Paid Plans</h3>
            <p>Paid plans include additional features:</p>
            <ul>
              <li>Increased generation limits</li>
              <li>Premium themes and fonts</li>
              <li>Automatic social media posting</li>
              <li>Priority support</li>
              <li>Version history</li>
              <li>API access (certain plans)</li>
            </ul>

            <h2>4. User Obligations</h2>
            <h3>4.1 Acceptable Use</h3>
            <p>You agree to use the Service only for lawful purposes. You agree NOT to:</p>
            <p><strong>Prohibited Content:</strong></p>
            <ul>
              <li>Generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of privacy</li>
              <li>Create content that promotes violence, discrimination, or hatred</li>
              <li>Generate content that infringes intellectual property rights</li>
              <li>Use the Service for spam or malicious purposes</li>
              <li>Create content that violates platform policies of TikTok, Instagram, or other connected services</li>
            </ul>

            <p><strong>Prohibited Activities:</strong></p>
            <ul>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated means (bots, scripts) to access the Service except through our official API</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Impersonate any person or entity</li>
              <li>Create multiple accounts to abuse free tier limits</li>
            </ul>

            <h3>4.2 Content Responsibility</h3>
            <p>You are solely responsible for:</p>
            <ul>
              <li>The topics and prompts you submit to our AI agent</li>
              <li>The content you generate and publish through the Service</li>
              <li>Ensuring your use complies with applicable laws and platform policies</li>
              <li>Any consequences of posting Generated Content to social media</li>
            </ul>

            <h2>5. Intellectual Property Rights</h2>
            <h3>5.1 Your Content</h3>
            <p>You retain ownership of:</p>
            <ul>
              <li>Original prompts, topics, and ideas you provide</li>
              <li>Custom scripts or text you input</li>
              <li>Final content you create using the Service</li>
            </ul>

            <h3>5.2 Generated Content</h3>
            <p><strong>Your License to Generated Content:</strong></p>
            <p>
              You receive a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, 
              and publicly display Generated Content for any lawful purpose, including commercial use.
            </p>

            <p><strong>Our License to Your Content:</strong></p>
            <p>You grant us a limited license to:</p>
            <ul>
              <li>Process your inputs to generate content</li>
              <li>Store and display your content within the Service</li>
              <li>Use anonymized, aggregated data to improve our AI models</li>
            </ul>

            <h3>5.3 Third-Party AI Services</h3>
            <p>
              Generated Content is created using third-party AI services (OpenAI, Google, Anthropic, fal.ai, ElevenLabs). 
              We do not guarantee exclusive ownership or copyright protection for Generated Content.
            </p>

            <h2>6. Payment and Billing</h2>
            <h3>6.1 Subscription Plans</h3>
            <p>Paid plans are billed on a recurring basis (monthly or annually) until canceled. Prices are stated in USD.</p>

            <h3>6.2 Automatic Renewal</h3>
            <p>
              Subscriptions automatically renew at the end of each billing period unless canceled before the renewal date.
            </p>

            <h3>6.3 Refunds</h3>
            <p>
              All payments are non-refundable except as required by law or at our sole discretion. 
              We may provide refunds in cases of service unavailability, billing errors, or fraudulent charges.
            </p>

            <h3>6.4 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through account settings. Cancellation takes effect 
              at the end of the current billing period.
            </p>

            <h2>7. Service Availability and Modifications</h2>
            <p>We strive to provide reliable service but do not guarantee:</p>
            <ul>
              <li>Uninterrupted or error-free access</li>
              <li>Defect-free operation</li>
              <li>Specific uptime percentages</li>
            </ul>
            <p>The Service is provided "as is" and "as available."</p>

            <h2>8. Content Moderation and Removal</h2>
            <p>We reserve the right, but have no obligation, to:</p>
            <ul>
              <li>Monitor content generated through the Service</li>
              <li>Remove content that violates these Terms</li>
              <li>Refuse service to anyone for any reason</li>
              <li>Report illegal content to authorities</li>
            </ul>

            <h3>DMCA and Copyright</h3>
            <p>If you believe content on our Service infringes your copyright, contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></p>

            <h2>9. Termination</h2>
            <h3>9.1 Termination by You</h3>
            <p>You may terminate your account at any time through account settings or by emailing sharoz75@gmail.com.</p>

            <h3>9.2 Termination by Us</h3>
            <p>We may suspend or terminate your account immediately without notice if:</p>
            <ul>
              <li>You violate these Terms</li>
              <li>You engage in fraudulent activity</li>
              <li>Your account is used for illegal purposes</li>
              <li>Required by law or court order</li>
            </ul>

            <h2>10. Disclaimers</h2>
            <h3>10.1 AI-Generated Content</h3>
            <p>AI-generated content may:</p>
            <ul>
              <li>Contain inaccuracies or errors</li>
              <li>Include biases present in training data</li>
              <li>Produce unexpected or inappropriate results</li>
              <li>Misrepresent philosophical concepts</li>
            </ul>

            <h3>10.2 "AS IS" Disclaimer</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
              OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PHILOSOPHIZEME SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Loss of profits, revenue, or data</li>
              <li>Loss of use or business opportunities</li>
              <li>Account suspension or termination on third-party platforms</li>
              <li>Cost of substitute services</li>
            </ul>
            <p>
              OUR TOTAL LIABILITY FOR ALL CLAIMS SHALL NOT EXCEED THE GREATER OF: the amount you paid us in the 
              12 months before the claim arose, OR $100 USD.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless PhilosophizeMe from any claims, liabilities, 
              damages, losses, costs, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you generate or publish through the Service</li>
            </ul>

            <h2>13. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our <Link to="/privacy" className="text-accent-gold">Privacy Policy</Link> explains 
              how we collect, use, and protect your information. By using the Service, you also agree to our Privacy Policy.
            </p>

            <h2>14. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of the United States, without regard to conflict of law principles.
            </p>

            <h2>15. Miscellaneous Provisions</h2>
            <h3>15.1 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              PhilosophizeMe regarding the Service.
            </p>

            <h3>15.2 Amendments</h3>
            <p>
              We may modify these Terms at any time by posting updated Terms on our website. Your continued use 
              after changes constitutes acceptance.
            </p>

            <h3>15.3 Severability</h3>
            <p>
              If any provision of these Terms is found invalid, the remaining provisions will remain in full effect.
            </p>

            <h2>16. Dispute Resolution and Arbitration</h2>
            <p><strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong></p>

            <h3>16.1 Informal Resolution</h3>
            <p>
              Before filing a claim, you agree to contact us at <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a> to 
              attempt to resolve the dispute informally.
            </p>

            <h3>16.2 Binding Arbitration</h3>
            <p>
              If informal resolution fails, disputes will be resolved through binding arbitration rather than in court, 
              EXCEPT for small claims court actions or claims seeking injunctive relief for intellectual property infringement.
            </p>

            <h3>16.3 Class Action Waiver</h3>
            <p>
              <strong>YOU AGREE TO RESOLVE DISPUTES INDIVIDUALLY, NOT AS PART OF A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.</strong>
            </p>

            <h3>16.4 Opt-Out</h3>
            <p>
              You may opt out of arbitration by emailing <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a> within 
              30 days of first accepting these Terms.
            </p>

            <h2>17. Special Provisions</h2>
            <h3>17.1 AI Agent System</h3>
            <p>The AI agent is powered by Anthropic Claude. By using the agent:</p>
            <ul>
              <li>You acknowledge responses may be imperfect or incorrect</li>
              <li>You agree not to rely solely on agent outputs for critical decisions</li>
              <li>The agent does not provide professional philosophical advice</li>
            </ul>

            <h3>17.2 Social Media Posting</h3>
            <p>When using automatic posting features:</p>
            <ul>
              <li>You authorize us to post on your behalf to connected accounts</li>
              <li>You are responsible for compliance with platform policies</li>
              <li>We are not liable for post rejections, account suspensions, or policy violations</li>
            </ul>

            <h2>18. Contact Information</h2>
            <p>For questions about these Terms:</p>
            <ul>
<li><strong>General Inquiries:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
                <li><strong>Support:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
                <li><strong>Privacy:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
                <li><strong>DMCA:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
                <li><strong>Disputes:</strong> <a href="mailto:sharoz75@gmail.com">sharoz75@gmail.com</a></li>
            </ul>
            <p><strong>Response Time:</strong> We aim to respond within 5 business days.</p>

            <h2>19. Acknowledgment</h2>
            <p>BY CLICKING "I ACCEPT," CREATING AN ACCOUNT, OR USING THE SERVICE, YOU ACKNOWLEDGE THAT:</p>
            <ul>
              <li>✓ You have read and understood these Terms of Service</li>
              <li>✓ You agree to be bound by these Terms</li>
              <li>✓ You are legally able to enter into this agreement</li>
              <li>✓ You understand the arbitration and class action waiver provisions</li>
              <li>✓ You have read and agree to our Privacy Policy</li>
            </ul>
            <p>If you do not agree to these Terms, you must not access or use the Service.</p>

            <div className="mt-16 pt-8 border-t border-slate/30">
              <h3>Summary of Key Terms (Not Legally Binding)</h3>
              <p className="text-mist text-sm mb-4">This summary is for convenience only. The full Terms above are legally binding.</p>
              <table>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Eligibility</td>
                    <td>Must be 13+ (16+ in EU)</td>
                  </tr>
                  <tr>
                    <td>Acceptable Use</td>
                    <td>No illegal, harmful, or abusive content</td>
                  </tr>
                  <tr>
                    <td>Payment</td>
                    <td>Subscriptions auto-renew; generally no refunds</td>
                  </tr>
                  <tr>
                    <td>Content Rights</td>
                    <td>You own your content; we get license to process it</td>
                  </tr>
                  <tr>
                    <td>AI Disclaimers</td>
                    <td>AI content may be inaccurate; use at your own risk</td>
                  </tr>
                  <tr>
                    <td>Liability</td>
                    <td>Limited to amount paid or $100; no consequential damages</td>
                  </tr>
                  <tr>
                    <td>Disputes</td>
                    <td>Binding arbitration; no class actions (opt-out available)</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-mist text-sm mt-6"><strong>This summary is NOT a substitute for reading the full Terms of Service.</strong></p>
              <p className="text-mist text-sm mt-4">© 2026 PhilosophizeMe. All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mist text-sm">© 2026 PhilosophizeMe. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-silver hover:text-pure transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-accent-gold">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
