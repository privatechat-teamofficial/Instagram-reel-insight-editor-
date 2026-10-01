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
 * 1. LIKE: Custom Instagram heart curve in uniform 0 0 24 24
 */
export const HeartIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/**
 * 2. COMMENT: Chat bubble in uniform 0 0 24 24
 */
export const CommentIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.5a8.5 8.5 0 0 0-7.36 12.75L3.5 20.5l4.35-1.12A8.5 8.5 0 1 0 12 3.5z" />
  </svg>
);

/**
 * 3. REPOST: Curved reshare arrows in uniform 0 0 24 24
 */
export const RepostIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

/**
 * 4. SHARE: Rotated paper airplane in uniform 0 0 24 24
 */
export const ShareIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21.5 2.5L10.5 13.5" />
    <path d="M21.5 2.5L14.5 21.5L10.5 13.5L2.5 9.5L21.5 2.5Z" />
  </svg>
);

/**
 * 5. SAVE: Bookmark with notched bottom in uniform 0 0 24 24
 */
export const BookmarkIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
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
