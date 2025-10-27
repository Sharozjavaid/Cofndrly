// Custom SVG icon components for the hero grid

export const BuildIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-80"
  >
    {/* Laptop body */}
    <rect
      x="20"
      y="30"
      width="80"
      height="50"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Screen with code lines */}
    <line x1="30" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="30" y1="48" x2="70" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="30" y1="56" x2="55" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="30" y1="64" x2="65" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    
    {/* Keyboard base */}
    <path
      d="M 10 80 L 20 80 L 20 82 L 100 82 L 100 80 L 110 80 L 105 90 L 15 90 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Keyboard keys suggestion */}
    <line x1="25" y1="85" x2="95" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
)

export const CaptureIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-80"
  >
    {/* Camera body */}
    <rect
      x="25"
      y="40"
      width="70"
      height="50"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Lens */}
    <circle
      cx="60"
      cy="65"
      r="18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="60"
      cy="65"
      r="12"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />
    
    {/* Flash/top detail */}
    <path
      d="M 45 30 L 50 40 L 70 40 L 75 30 L 45 30 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Shutter button */}
    <circle cx="82" cy="50" r="3" fill="currentColor" opacity="0.6" />
    
    {/* Sparkle effect */}
    <path
      d="M 85 25 L 87 30 L 92 32 L 87 34 L 85 39 L 83 34 L 78 32 L 83 30 Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
)

export const CreateIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-80"
  >
    {/* Clapperboard top */}
    <path
      d="M 20 35 L 100 35 L 95 50 L 25 50 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Stripes on clapper */}
    <line x1="35" y1="35" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="35" x2="45" y2="50" stroke="currentColor" strokeWidth="2" />
    <line x1="65" y1="35" x2="60" y2="50" stroke="currentColor" strokeWidth="2" />
    <line x1="80" y1="35" x2="75" y2="50" stroke="currentColor" strokeWidth="2" />
    
    {/* Board body */}
    <rect
      x="25"
      y="50"
      width="70"
      height="40"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Scene/take markers */}
    <text x="35" y="72" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">SCENE</text>
    <text x="35" y="82" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">TAKE 1</text>
  </svg>
)

export const GrowIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-80"
  >
    {/* Axes */}
    <line x1="25" y1="85" x2="95" y2="85" stroke="currentColor" strokeWidth="2" />
    <line x1="30" y1="90" x2="30" y2="30" stroke="currentColor" strokeWidth="2" />
    
    {/* Arrow on Y axis */}
    <path d="M 30 30 L 27 35 M 30 30 L 33 35" stroke="currentColor" strokeWidth="2" />
    
    {/* Bar chart - ascending */}
    <rect x="40" y="70" width="12" height="15" fill="currentColor" opacity="0.5" rx="1" />
    <rect x="56" y="60" width="12" height="25" fill="currentColor" opacity="0.6" rx="1" />
    <rect x="72" y="45" width="12" height="40" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Trend line */}
    <path
      d="M 46 77 L 62 67 L 78 52"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 4"
      opacity="0.7"
    />
    
    {/* Growth arrow */}
    <path
      d="M 75 45 L 88 32"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M 88 32 L 83 34 M 88 32 L 86 37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// Large icons for Builder/Storyteller cards
export const BuilderIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Terminal window */}
    <rect x="10" y="15" width="60" height="50" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Terminal header dots */}
    <circle cx="16" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="21" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="26" cy="21" r="1.5" fill="currentColor" opacity="0.5" />
    
    {/* Code brackets and symbols */}
    <path d="M 25 35 L 20 40 L 25 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 35 35 L 40 40 L 35 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="44" y1="35" x2="52" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="40" x2="56" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="45" x2="50" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Cursor */}
    <rect x="44" y="51" width="8" height="2" fill="currentColor" opacity="0.7" />
  </svg>
)

export const StorytellerIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Camera/phone frame */}
    <rect x="20" y="10" width="40" height="60" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Lens/screen */}
    <rect x="25" y="15" width="30" height="35" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    
    {/* Play button - content creation */}
    <path d="M 35 27 L 35 38 L 45 32.5 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    
    {/* Social metrics icons */}
    <circle cx="30" cy="57" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M 38 54 L 40 57 L 44 53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 48 55 L 50 57 L 52 55 M 50 57 L 50 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Sparkle effects */}
    <path d="M 65 20 L 66 23 L 69 24 L 66 25 L 65 28 L 64 25 L 61 24 L 64 23 Z" fill="currentColor" opacity="0.5" />
    <path d="M 15 55 L 16 57 L 18 58 L 16 59 L 15 61 L 14 59 L 12 58 L 14 57 Z" fill="currentColor" opacity="0.5" />
  </svg>
)

// Icons for "How it works" steps
export const ApplyIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Document/form */}
    <rect x="25" y="15" width="50" height="70" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Form lines */}
    <line x1="35" y1="28" x2="65" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="35" y1="38" x2="60" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="35" y1="48" x2="65" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="35" y1="58" x2="55" y2="58" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    
    {/* Pen/pencil */}
    <path 
      d="M 55 65 L 62 72 L 65 69 L 58 62 Z M 62 72 L 60 75"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <rect x="63" y="60" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 64.5 64)" />
  </svg>
)

export const ApproveIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Badge/seal circle */}
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
    
    {/* Checkmark */}
    <path 
      d="M 38 50 L 46 58 L 62 40" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Badge points/ribbons */}
    <path d="M 50 18 L 52 22 L 48 22 Z" fill="currentColor" opacity="0.6" />
    <path d="M 50 82 L 52 78 L 48 78 Z" fill="currentColor" opacity="0.6" />
    <path d="M 18 50 L 22 52 L 22 48 Z" fill="currentColor" opacity="0.6" />
    <path d="M 82 50 L 78 52 L 78 48 Z" fill="currentColor" opacity="0.6" />
  </svg>
)

export const ConnectIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Two profile circles */}
    <circle cx="35" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="65" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Simple face details */}
    <circle cx="30" cy="37" r="1.5" fill="currentColor" />
    <circle cx="40" cy="37" r="1.5" fill="currentColor" />
    <circle cx="60" cy="37" r="1.5" fill="currentColor" />
    <circle cx="70" cy="37" r="1.5" fill="currentColor" />
    
    <path d="M 30 45 Q 35 48 40 45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 60 45 Q 65 48 70 45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    
    {/* Connection line with heart */}
    <path d="M 35 55 L 35 65 L 50 65 L 65 65 L 65 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Heart in center */}
    <path 
      d="M 50 68 L 47 65 Q 45 63 45 61 Q 45 59 47 59 Q 49 59 50 61 Q 51 59 53 59 Q 55 59 55 61 Q 55 63 53 65 Z"
      fill="currentColor"
      opacity="0.7"
    />
    
    {/* Message bubbles */}
    <rect x="25" y="72" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="55" y="72" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)


