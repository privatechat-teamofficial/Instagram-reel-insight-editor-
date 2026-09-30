// Accurate representation of the podcast reel preview seen in reference screenshot
export const DEFAULT_PODCAST_THUMBNAIL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 580" width="100%" height="100%">
  <!-- Top and Bottom Black Letterbox Bands with subtle space specks -->
  <rect width="360" height="580" fill="#030405"/>
  <circle cx="45" cy="40" r="0.8" fill="#ffffff" opacity="0.6"/>
  <circle cx="120" cy="70" r="0.6" fill="#ffffff" opacity="0.4"/>
  <circle cx="280" cy="35" r="0.9" fill="#ffffff" opacity="0.5"/>
  <circle cx="310" cy="85" r="0.6" fill="#ffffff" opacity="0.3"/>
  <circle cx="80" cy="510" r="0.7" fill="#ffffff" opacity="0.4"/>
  <circle cx="220" cy="540" r="0.8" fill="#ffffff" opacity="0.5"/>
  <circle cx="315" cy="515" r="0.6" fill="#ffffff" opacity="0.3"/>

  <!-- Center Video Frame (Y: 100 to 460) -->
  <g id="center-video">
    <!-- Studio Background -->
    <rect x="0" y="105" width="360" height="355" fill="#1b5a82"/>
    
    <!-- Top-Left Branding / Logo -->
    <rect x="18" y="118" width="48" height="18" rx="3" fill="#ffffff" opacity="0.9"/>
    <text x="23" y="131" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="900" fill="#1b5a82">frida</text>

    <!-- Wall Medals -->
    <rect x="35" y="145" width="10" height="42" fill="#c4302b"/>
    <rect x="48" y="145" width="10" height="42" fill="#2b59c4"/>
    <circle cx="40" cy="192" r="7" fill="#ffd700"/>
    <circle cx="53" cy="192" r="7" fill="#c0c0c0"/>

    <!-- Small framed wall art -->
    <rect x="180" y="150" width="35" height="28" fill="#143e59" stroke="#ffffff" stroke-width="1.5"/>

    <!-- Large Moon Surface Art Frame on Right -->
    <rect x="270" y="130" width="75" height="95" rx="4" fill="#a48871" stroke="#332a24" stroke-width="2"/>
    <circle cx="308" cy="178" r="28" fill="#e8ded1"/>
    <circle cx="300" cy="170" r="6" fill="#c4b5a0" opacity="0.6"/>
    <circle cx="320" cy="185" r="4" fill="#c4b5a0" opacity="0.7"/>

    <!-- Man with Glasses & White Shirt -->
    <!-- Head & Hair -->
    <path d="M152 205 Q175 190 198 205 Q205 235 195 255 Q175 268 155 255 Z" fill="#eac09a"/>
    <path d="M148 208 Q175 185 202 208 Q195 195 175 192 Q155 195 148 208 Z" fill="#697177"/>
    <!-- Glasses -->
    <rect x="156" y="218" width="14" height="9" rx="2" fill="none" stroke="#222" stroke-width="2"/>
    <rect x="178" y="218" width="14" height="9" rx="2" fill="none" stroke="#222" stroke-width="2"/>
    <line x1="170" y1="222" x2="178" y2="222" stroke="#222" stroke-width="2"/>
    <!-- Shoulders & White Collared Shirt -->
    <path d="M110 370 L135 275 Q175 260 215 275 L245 370 Z" fill="#f4f5f8"/>
    <polygon points="175,270 162,295 175,320 188,295" fill="#e4e6ea"/>

    <!-- Podcast Boom Arm and Microphone in front -->
    <path d="M110 390 L160 300 L185 305" fill="none" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
    <!-- Mic Shockmount & Capsule -->
    <ellipse cx="188" cy="305" rx="14" ry="20" fill="#222222"/>
    <rect x="180" y="295" width="16" height="24" rx="4" fill="#444444"/>
    <circle cx="188" cy="307" r="9" fill="#111111"/>

    <!-- Yellow Bold Subtitle on chest: "COOKIE OUTSIDE" -->
    <g transform="translate(180, 345)">
      <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#ffe600" stroke="#000000" stroke-width="3" paint-order="stroke fill" letter-spacing="0.5">COOKIE OUTSIDE</text>
    </g>
  </g>
</svg>
`)}`;
