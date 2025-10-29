import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function that triggers when a new user signs up
 * Sends a "thank you for applying" email immediately
 */
export const onUserSignup = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {
    const userData = snap.data();
    if (!userData) return null;

    const userEmail = userData.email;
    const userName = userData.name || 'there';
    const userRole = userData.role || 'member';

    // Role-specific content
    const roleContent = userRole === 'builder' 
      ? {
          greeting: "Thanks for applying to join Cofndrly as a builder!",
          nextSteps: "We're reviewing your profile and projects. If approved, you'll be able to browse marketers who can help grow your product, post your projects to find co-founders, and connect with growth experts.",
        }
      : {
          greeting: "Thanks for applying to join Cofndrly as a marketer!",
          nextSteps: "We're reviewing your profile and experience. If approved, you'll be able to browse builders looking for marketing co-founders, explore exciting projects to grow, and connect with technical founders.",
        };

    try {
      // Add email to mail collection (Firebase extension will send it)
      await db.collection('mail').add({
        to: [userEmail],
        message: {
          subject: 'Thanks for applying to Cofndrly! 📝',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #2d2d2d;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background: linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%);
                    padding: 40px 30px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 32px;
                    color: #2d2d2d;
                    font-weight: 300;
                    letter-spacing: 1px;
                  }
                  .content {
                    background: #ffffff;
                    padding: 40px 30px;
                    border: 1px solid #e8dcc8;
                    border-top: none;
                  }
                  .footer {
                    background: #f5f1e8;
                    padding: 30px;
                    text-align: center;
                    border-radius: 0 0 8px 8px;
                    color: #666;
                    font-size: 14px;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>cofndrly</h1>
                </div>
                <div class="content">
                  <p>Hey ${userName},</p>
                  
                  <p><strong>${roleContent.greeting}</strong></p>
                  
                  <p>${roleContent.nextSteps}</p>
                  
                  <p><strong>What happens next?</strong></p>
                  <p>We manually review every application to keep our community high-quality. You'll receive an email from us within the next 24-48 hours letting you know if you've been approved.</p>
                  
                  <p>In the meantime, feel free to reply to this email if you have any questions about Cofndrly or the application process.</p>
                  
                  <p>Talk soon,<br>
                  <strong>The Cofndrly Team</strong></p>
                </div>
                <div class="footer">
                  <p>Cofndrly - Where builders meet marketers</p>
                  <p style="margin-top: 10px; font-size: 12px;">
                    <a href="https://cofndrly.com" style="color: #666; text-decoration: none;">cofndrly.com</a>
                  </p>
                </div>
              </body>
            </html>
          `,
          text: `Hey ${userName},

${roleContent.greeting}

${roleContent.nextSteps}

What happens next?
We manually review every application to keep our community high-quality. You'll receive an email from us within the next 24-48 hours letting you know if you've been approved.

In the meantime, feel free to reply to this email if you have any questions about Cofndrly or the application process.

Talk soon,
The Cofndrly Team

---
Cofndrly - Where builders meet marketers
cofndrly.com
`,
        },
      });

      console.log(`Signup confirmation email queued for ${userEmail}`);
      return null;
    } catch (error) {
      console.error('Failed to queue signup email:', error);
      return null;
    }
  });

/**
 * Cloud Function that triggers when a user document is updated
 * Sends an approval email when a user is approved
 */
export const onUserApproved = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Check if the user was just approved (changed from false to true)
    if (!before?.approved && after?.approved) {
      const userEmail = after.email;
      const userName = after.name || 'there';
      const userRole = after.role || 'member';
      
      // Role-specific content for approval email
      const roleContent = userRole === 'builder'
        ? {
            whatYouCanDo: `
              <ul>
                <li><strong>Browse marketers</strong> - Find growth experts who can help scale your product</li>
                <li><strong>Post your projects</strong> - Share what you're building and attract co-founders</li>
                <li><strong>Connect with marketers</strong> - Start conversations with potential partners</li>
                <li><strong>Complete your profile</strong> - Add more projects and details to attract the right people</li>
              </ul>
            `,
            callToAction: "Start exploring marketers and posting your projects!",
            textList: `- Browse marketers - Find growth experts who can help scale your product
- Post your projects - Share what you're building and attract co-founders
- Connect with marketers - Start conversations with potential partners
- Complete your profile - Add more projects and details to attract the right people

Start exploring marketers and posting your projects!`
          }
        : {
            whatYouCanDo: `
              <ul>
                <li><strong>Browse builders</strong> - Discover exciting projects looking for marketing co-founders</li>
                <li><strong>Explore projects</strong> - See what's being built and where you can make an impact</li>
                <li><strong>Connect with builders</strong> - Reach out to founders whose vision aligns with yours</li>
                <li><strong>Complete your profile</strong> - Showcase your experience to attract the right opportunities</li>
              </ul>
            `,
            callToAction: "Start exploring projects and connecting with builders!",
            textList: `- Browse builders - Discover exciting projects looking for marketing co-founders
- Explore projects - See what's being built and where you can make an impact
- Connect with builders - Reach out to founders whose vision aligns with yours
- Complete your profile - Showcase your experience to attract the right opportunities

Start exploring projects and connecting with builders!`
          };
      
      try {
        // Add approval email to mail collection
        await db.collection('mail').add({
          to: [userEmail],
          message: {
            subject: 'Welcome to Cofndrly! 🎉',
            html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #2d2d2d;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background: linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%);
                    padding: 40px 30px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 32px;
                    color: #2d2d2d;
                    font-weight: 300;
                    letter-spacing: 1px;
                  }
                  .content {
                    background: #ffffff;
                    padding: 40px 30px;
                    border: 1px solid #e8dcc8;
                    border-top: none;
                  }
                  .cta-button {
                    display: inline-block;
                    padding: 16px 32px;
                    background-color: #2d2d2d;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-weight: 500;
                  }
                  .footer {
                    background: #f5f1e8;
                    padding: 30px;
                    text-align: center;
                    border-radius: 0 0 8px 8px;
                    color: #666;
                    font-size: 14px;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>cofndrly</h1>
                </div>
                <div class="content">
                  <p>Hey ${userName},</p>
                  
                  <p><strong>You're in! 🎉</strong></p>
                  
                  <p>Your application has been approved and you now have full access to Cofndrly. We're excited to have you in our community.</p>
                  
                  <p><strong>Here's what you can do now:</strong></p>
                  ${roleContent.whatYouCanDo}
                  
                  <p>${roleContent.callToAction}</p>
                  
                  <center>
                    <a href="https://cofndrly.com/projects" class="cta-button">Go to Dashboard</a>
                  </center>
                  
                  <p>If you have any questions or need help getting started, just reply to this email. I'm here to help!</p>
                  
                  <p>Looking forward to seeing what you build,<br>
                  <strong>The Cofndrly Team</strong></p>
                </div>
                <div class="footer">
                  <p>Cofndrly - Where builders meet marketers</p>
                  <p style="margin-top: 10px; font-size: 12px;">
                    <a href="https://cofndrly.com" style="color: #666; text-decoration: none;">cofndrly.com</a>
                  </p>
                </div>
              </body>
            </html>
          `,
          text: `Hey ${userName},

You're in! 🎉

Your application has been approved and you now have full access to Cofndrly. We're excited to have you in our community.

Here's what you can do now:
${roleContent.textList}

Visit your dashboard: https://cofndrly.com/projects

If you have any questions or need help getting started, just reply to this email. I'm here to help!

Looking forward to seeing what you build,
The Cofndrly Team

---
Cofndrly - Where builders meet marketers
cofndrly.com
`,
          },
        });

        console.log(`Approval email queued for ${userEmail}`);
        return null;
      } catch (error) {
        console.error('Failed to queue approval email:', error);
        return null;
      }
    }
    
    return null;
  });
