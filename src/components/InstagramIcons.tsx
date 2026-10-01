import React from 'react';

// ==================================================
// 1. TOP METRIC & WHAT IMPACTS YOUR VIEWS ICONS
// Original Instagram geometry & shapes:
// - HeartIcon (exact Bézier geometry)
// - CommentIcon (chat bubble)
// - RepostIcon (curved reshare arrows)
// - ShareIcon (rotated exact vector send icon)
// - BookmarkIcon (bookmark with notched bottom)
// - SkipRateIcon (speedometer dial)
// ==================================================

/**
 * 1. LIKE: Custom Instagram heart curve
 */
export const HeartIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="7.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M 50 24.5 C 41.5 8, 17 6.5, 7 24 C -1.5 39, 6 54.5, 17 66 L 47 91 Q 50 93.5 53 91 L 83 66 C 94 54.5, 101.5 39, 93 24 C 83 6.5, 58.5 8, 50 24.5 Z" />
  </svg>
);

/**
 * 2. COMMENT: Chat bubble
 */
export const CommentIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="1.5 1.5 21 21"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.5a8.5 8.5 0 1 0 5.4 15.1l3.1.9-1-2.9A8.47 8.47 0 0 0 20.5 12a8.5 8.5 0 0 0-8.5-8.5z" />
  </svg>
);

/**
 * 3. REPOST: Two separate curved arrows forming the reshare symbol
 * (Top arrow curving right, Bottom arrow curving left)
 */
export const RepostIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="1.5 1.5 21 21"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Top arrow: goes up from left, curves right, ends with right-pointing arrow */}
    <path d="M5.5 11V8a3 3 0 0 1 3-3h9" />
    <polyline points="15 2.5 18 5 15 7.5" />

    {/* Bottom arrow: goes down from right, curves left, ends with left-pointing arrow */}
    <path d="M18.5 13v3a3 3 0 0 1-3 3h-9" />
    <polyline points="9 21.5 6 19 9 16.5" />
  </svg>
);

/**
 * 4. SHARE: Rotated paper airplane, centered in viewBox
 */
export const ShareIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="21 21 65 65"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <g transform="rotate(17.35 50 50)">
      <path d="M 28.5 36 L 68 23.5 Q 80 19.5 76.5 32.5 L 63.5 70.5 Q 60.5 79.5 53.5 73.5 L 45.5 61.5 Q 43.5 57 39 52.5 L 27.5 44.5 Q 19 39 28.5 36 Z M 43.5 57 L 58.5 42" />
    </g>
  </svg>
);

/**
 * 5. SAVE: Bookmark with notched bottom
 */
export const BookmarkIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="1.5 1 21 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5.5 3h13a1.5 1.5 0 0 1 1.5 1.5v16.5a1 1 0 0 1-1.6.8L12 16.5l-6.4 5.3a1 1 0 0 1-1.6-.8V4.5A1.5 1.5 0 0 1 5.5 3z" />
  </svg>
);

/**
 * 6. SKIP RATE: Clock dial with perpendicular hands (facing 12 and 3)
 * Solid quarter arc (12 to 3 o'clock) and dotted three-fourth part (3 o'clock clockwise to 12)
 */
export const SkipRateIcon: React.FC<{ className?: string }> = ({ className = 'w-[19px] h-[19px]' }) => (
  <svg
    viewBox="2 2 20 20"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Solid 1/4 circle arc: from 12 o'clock clockwise to 3 o'clock */}
    <path
      d="M 12 3.5 A 8.5 8.5 0 0 1 20.5 12"
      strokeWidth="1.85"
      strokeLinecap="round"
    />

    {/* Three-fourth part (3 o'clock clockwise to 12 o'clock) dotted curve */}
    <circle cx="19.85" cy="15.25" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="18.01" cy="18.01" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="15.25" cy="19.85" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="12.00" cy="20.50" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="8.75" cy="19.85" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="5.99" cy="18.01" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="4.15" cy="15.25" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="3.50" cy="12.00" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="4.15" cy="8.75" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="5.99" cy="5.99" r="0.92" fill="currentColor" stroke="none" />
    <circle cx="8.75" cy="4.15" r="0.92" fill="currentColor" stroke="none" />

    {/* Perpendicular clock hands: hand at 12 a bit longer (y=7.2), hand at 3 at x=16 */}
    <path
      d="M 12 7.2 V 12 H 16"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.0" fill="currentColor" stroke="none" />
  </svg>
);

// ==================================================
// 2. HEADER ICONS
// ==================================================

/**
 * BACK ARROW
 * Horizontal arrow with extended tail and head sized to match Reel insights text height
 */
export const HeaderBackIcon: React.FC<{ className?: string }> = ({ className = 'w-[18px] h-[16px]' }) => (
  <svg
    viewBox="0 0 20 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
    aria-hidden="true"
  >
    <path d="M19 9H1.5" />
    <polyline points="8.5 1.5 1.5 9 8.5 16.5" />
  </svg>
);

/**
 * INSIGHTS TREND ARROW
 */
export const HeaderInsightsIcon: React.FC<{ className?: string }> = ({ className = 'w-[21px] h-[21px]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="3.5 16.5 8.5 11.5 13 16 20.5 8.5" />
    <polyline points="15 8.5 20.5 8.5 20.5 14" />
  </svg>
);

/**
 * THREE-DOT MENU
 */
export const ThreeDotsIcon: React.FC<{ className?: string }> = ({ className = 'w-[20px] h-[20px]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);

// ==================================================
// 3. INFO ICON
// ==================================================

/**
 * INFO CIRCLE (ⓘ)
 * Matches Instagram heading info icon: inherits text color (pure white) and aligns horizontally on text midline
 */
export const InfoCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-[13.5px] h-[13.5px]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 -translate-y-[2.5px] ${className}`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="11" x2="12" y2="16.5" />
    <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
