# cofndrly

> where builders meet storytellers

A curated platform connecting technical founders with marketing experts to build successful startups together.

## Design Philosophy

**Artsy × Modern × Techno-minimal × Human warmth**

Inspired by Vercel, Are.na, Notion, and early Morning Brew editorial minimalism.

### Visual Direction

**Color Palette:**
- Deep charcoal (#111111) — grounding and confident
- Muted sand (#f3efe9) — soft backdrop, adds warmth  
- Off-white (#faf9f6) — elegant and premium
- Rust orange (#c36a2d) — human, natural pop
- Sage green (#a4b494) — calm accent

**Typography:**
- Headlines: Playfair Display (high-end serif)
- Body: Inter (clean, modern sans)
- Big spacing, lowercase emphasis, lots of whitespace

**Aesthetic:**
- Split screens and gentle parallax on scroll
- Light micro-animations (hover reveals, subtle fades)
- Polaroid-style profile cards
- Paper grain texture overlay
- Cinematic transitions

### Brand Personality

**Values:** Creative, selective, modern, slightly mysterious

**Feels like:** The app you tell your creative friends about

**Cultural references:** Kinfolk Magazine, Vercel, Glossier, Notion, Are.na, YC Founders

## Features

- 🎨 **Beautiful Landing Page** - Vercel-inspired design with smooth animations
- 📝 **Multi-step Signup Flow** - Artsy, minimal forms collecting experience and passions
- ✅ **Manual Approval System** - Curated community with admin approval
- 💫 **Polaroid-Style Matching** - Swipe through potential co-founders
- 💬 **Messaging System** - Connect with matches directly

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS (custom design system)
- **Animations**: Framer Motion
- **Routing**: React Router
- **Backend**: Firebase (Auth + Firestore)
- **Build Tool**: Vite
- **Fonts**: Playfair Display + Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd "Growth Tech"
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config
   - Update `src/firebase/config.ts` with your Firebase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx      # Home page with split-screen hero
│   ├── SignupPage.tsx        # Multi-step signup form
│   ├── WaitingApproval.tsx   # Pending approval state
│   └── MatchingPage.tsx      # Polaroid-style swipe interface
├── firebase/
│   └── config.ts             # Firebase configuration
├── App.tsx                   # Main app component with routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles + grain texture
```

## Design System

### Colors
```css
--charcoal: #111111
--sand: #f3efe9
--cream: #faf9f6
--rust: #c36a2d
--sage: #a4b494
```

### Typography Scale
- Headings: `font-serif` (Playfair Display)
- Body: `font-sans` (Inter)
- Lowercase emphasis throughout
- Generous letter-spacing

### Components
- Rounded corners: `rounded-sm` (subtle)
- Borders: `border-warm-gray-200`
- Shadows: Subtle, minimal
- Buttons: Minimal, lowercase text
- Forms: Underline inputs, no boxes

## Copy & Tone

**Taglines:**
- "where builders meet storytellers"
- "find your other half"
- "not another networking app — a place to start something"
- "the future is built in pairs"

**Tone:** Conversational, introspective, and aspirational. Creative class meets hacker culture.

**Examples:**
- "you've built something great. now find someone who can tell the world."
- "for the ones who build in silence and the ones who make noise."

## Firestore Data Structure

### Users Collection
```typescript
{
  uid: string
  name: string
  email: string
  role: 'technical' | 'non-technical'
  experience: string
  skills: string[]
  passions: string
  currentProject: string
  lookingFor: string
  bio: string
  approved: boolean
  createdAt: timestamp
}
```

### Matches Collection
```typescript
{
  userId1: string
  userId2: string
  status: 'pending' | 'matched'
  createdAt: timestamp
}
```

### Messages Collection
```typescript
{
  matchId: string
  senderId: string
  recipientId: string
  message: string
  createdAt: timestamp
}
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Admin Approval Workflow

To manually approve users:
1. Access Firebase Console
2. Navigate to Firestore Database
3. Find the user in the `users` collection
4. Update the `approved` field to `true`

**Future:** Build an admin panel with:
- List of pending applications
- User details review interface
- Approve/Reject buttons
- Analytics dashboard

## Future Enhancements

- [ ] Real-time messaging system
- [ ] Photo uploads and profile images
- [ ] Advanced filtering (location, industry, experience)
- [ ] Match algorithm based on compatibility scores
- [ ] Email notifications for matches and messages
- [ ] Admin dashboard for approvals
- [ ] Success stories section
- [ ] Mobile app (React Native)
- [ ] Integration with LinkedIn/Twitter

## Inspiration

- **Vercel** - Clean, modern, technical aesthetic
- **Are.na** - Artsy, curated, intentional
- **Notion** - Minimal, functional, beautiful
- **Kinfolk Magazine** - Editorial minimalism
- **Glossier** - Human warmth, premium feel

## License

MIT

---

*"the future is built in pairs."*
