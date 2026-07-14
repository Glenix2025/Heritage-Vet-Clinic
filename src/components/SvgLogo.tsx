import React from "react";

interface SvgLogoProps {
  className?: string;
  hideText?: boolean;
}

export const SvgLogo: React.FC<SvgLogoProps> = ({ className = "h-12 w-auto", hideText = false }) => {
  return (
    <svg
      viewBox={hideText ? "0 0 100 100" : "0 0 420 100"}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. BRAND MONOGRAM (100x100) */}
      <g transform="translate(0, 0)">
        {/* Teal Roof / Upper Caret (Top-pointing arrowhead) */}
        <path
          d="M 50,5 L 85,35 L 75,35 L 50,15 L 25,35 L 15,35 Z"
          fill="#00827F"
        />

        {/* Teal Bottom Caret (Bottom-pointing arrowhead) */}
        <path
          d="M 50,95 L 85,65 L 75,65 L 50,85 L 25,65 L 15,65 Z"
          fill="#00827F"
        />

        {/* Teal Left Chevron */}
        <path
          d="M 5,50 L 25,30 L 25,40 L 15,50 L 25,60 L 25,70 Z"
          fill="#00827F"
        />

        {/* Teal Right Chevron */}
        <path
          d="M 95,50 L 75,30 L 75,40 L 85,50 L 75,60 L 75,70 Z"
          fill="#00827F"
        />

        {/* Blue Serif 'H' Monogram */}
        {/* Left vertical column */}
        <rect x="28" y="25" width="11" height="50" fill="#00669C" />
        {/* Left column top serif */}
        <rect x="23" y="25" width="21" height="4" fill="#00669C" />
        {/* Left column bottom serif */}
        <rect x="23" y="71" width="21" height="4" fill="#00669C" />

        {/* Right vertical column */}
        <rect x="61" y="25" width="11" height="50" fill="#00669C" />
        {/* Right column top serif */}
        <rect x="56" y="25" width="21" height="4" fill="#00669C" />
        {/* Right column bottom serif */}
        <rect x="56" y="71" width="21" height="4" fill="#00669C" />

        {/* H Crossbar */}
        <rect x="39" y="47" width="22" height="6" fill="#00669C" />
      </g>

      {/* 2. BRAND TEXT - Rendered beside monogram if hideText is false */}
      {!hideText && (
        <g transform="translate(115, 0)">
          {/* "Heritage" - Bold primary blue */}
          <text
            x="0"
            y="45"
            fontFamily="'Inter', 'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="38px"
            fill="#00669C"
            letterSpacing="-1px"
          >
            Heritage
          </text>
          
          {/* "Veterinary Clinic" - Medium secondary teal */}
          <text
            x="0"
            y="80"
            fontFamily="'Inter', 'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="600"
            fontSize="28px"
            fill="#00827F"
            letterSpacing="-0.5px"
          >
            Veterinary Clinic
          </text>
        </g>
      )}
    </svg>
  );
};
