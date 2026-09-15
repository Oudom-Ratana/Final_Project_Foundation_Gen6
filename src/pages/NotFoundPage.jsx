import React from "react";
import { Link, useNavigate } from "react-router";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center py-6 px-3 sm:px-6 font-sans select-none">
      {/* Ambient Cinema Lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[850px] h-[520px] bg-red-600/5 dark:bg-red-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Cinema Stage with Projected Screen & Audience */}
        <div className="w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] max-h-[520px] flex items-center justify-center">
          <svg
            viewBox="0 0 960 540"
            className="w-full h-full overflow-visible drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Embedded CSS Animations */}
            <style>{`
              @keyframes spinClockwise {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes spinCounterClockwise {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
              }
              @keyframes scratchHeadMotion {
                0%, 100% {
                  transform: rotate(0deg);
                }
                20% {
                  transform: rotate(-6deg) translateY(-2px);
                }
                40% {
                  transform: rotate(4deg) translateY(2px);
                }
                60% {
                  transform: rotate(-5deg) translateY(-1px);
                }
                80% {
                  transform: rotate(3deg) translateY(1px);
                }
              }
              @keyframes idleBreathe {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-3px);
                }
              }
              @keyframes subtleWobble {
                0%, 100% {
                  transform: rotate(0deg);
                }
                50% {
                  transform: rotate(1.5deg);
                }
              }
              @keyframes projectorFlicker {
                0%, 100% { opacity: 0.12; }
                48% { opacity: 0.16; }
                50% { opacity: 0.09; }
                52% { opacity: 0.15; }
              }

              .gear-spin-cw {
                animation: spinClockwise 16s linear infinite;
              }
              .gear-spin-ccw {
                animation: spinCounterClockwise 12s linear infinite;
              }
              .gear-spin-cw-fast {
                animation: spinClockwise 10s linear infinite;
              }
              .scratch-arm {
                animation: scratchHeadMotion 3s ease-in-out infinite;
                transform-origin: 200px 335px;
              }
              .left-person-body {
                animation: idleBreathe 4s ease-in-out infinite;
                transform-origin: 155px 490px;
              }
              .right-person-body {
                animation: idleBreathe 3.5s ease-in-out infinite;
                animation-delay: 0.6s;
                transform-origin: 820px 490px;
              }
              .error-badge-pulse {
                animation: subtleWobble 4s ease-in-out infinite;
                transform-origin: 480px 75px;
              }
              .projector-beam {
                animation: projectorFlicker 4s infinite ease-in-out;
              }
            `}</style>

            <defs>
              {/* Projector Light Beam Gradient */}
              <linearGradient
                id="beamGradient"
                x1="480"
                y1="0"
                x2="480"
                y2="380"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#ffe8b3" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Screen Drop Shadow */}
              <filter
                id="screenShadow"
                x="-10%"
                y="-10%"
                width="120%"
                height="125%"
              >
                <feDropShadow
                  dx="0"
                  dy="16"
                  stdDeviation="18"
                  floodColor="#000000"
                  floodOpacity="0.28"
                />
              </filter>

              {/* Gear Template Helper */}
              <g id="gearGrey">
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="7"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="3.5"
                />
                {/* 8 Teeth */}
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(45)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(90)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(135)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(180)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(225)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(270)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#CBD5E1"
                  transform="rotate(315)"
                />
              </g>

              <g id="gearGold">
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="7"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="3.5"
                />
                {/* 8 Teeth */}
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(45)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(90)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(135)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(180)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(225)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(270)"
                />
                <rect
                  x="-5"
                  y="-36"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#EAB308"
                  transform="rotate(315)"
                />
              </g>
            </defs>

            {/* 1. PROJECTOR BEAM FROM CEILING */}
            <polygon
              points="450,0 510,0 840,360 120,360"
              fill="url(#beamGradient)"
              className="projector-beam pointer-events-none"
            />

            {/* 2. CINEMA SCREEN FRAME & SURFACE */}
            <g filter="url(#screenShadow)">
              {/* Screen Outer Bezel Frame */}
              <rect
                x="140"
                y="35"
                width="680"
                height="345"
                rx="18"
                fill="#18181B"
                stroke="#27272A"
                strokeWidth="4"
              />

              {/* Screen Top Header Notch / Cinema Sensor */}
              <rect
                x="460"
                y="39"
                width="40"
                height="4"
                rx="2"
                fill="#3F3F46"
              />

              {/* Projection Screen White Canvas */}
              <rect
                x="152"
                y="47"
                width="656"
                height="321"
                rx="12"
                fill="#FFFFFF"
              />

              {/* Screen Legs / Stand Mount */}
              <rect
                x="260"
                y="380"
                width="16"
                height="70"
                rx="4"
                fill="#18181B"
              />
              <rect
                x="684"
                y="380"
                width="16"
                height="70"
                rx="4"
                fill="#18181B"
              />
              <path d="M245,450 L291,450 L287,458 L249,458 Z" fill="#27272A" />
              <path d="M669,450 L715,450 L711,458 L673,458 Z" fill="#27272A" />

              {/* ======================================================== */}
              {/* INSIDE THE SCREEN: GEARS, ERROR BADGE, 404, PAGE NOT FOUND */}
              {/* ======================================================== */}

              {/* A. LEFT GEARS CLUSTER (LIGHT GREY) */}
              <g opacity="0.85">
                <g transform="translate(260, 155)" className="gear-spin-cw">
                  <use href="#gearGrey" transform="scale(1.05)" />
                </g>
                <g transform="translate(325, 120)" className="gear-spin-ccw">
                  <use href="#gearGrey" transform="scale(0.85)" />
                </g>
                <g
                  transform="translate(315, 205)"
                  className="gear-spin-cw-fast"
                >
                  <use href="#gearGrey" transform="scale(0.95)" />
                </g>
              </g>

              {/* B. RIGHT GEARS CLUSTER (GOLDEN / TAN) */}
              <g opacity="0.85">
                <g transform="translate(645, 110)" className="gear-spin-cw">
                  <use href="#gearGold" transform="scale(0.88)" />
                </g>
                <g transform="translate(710, 140)" className="gear-spin-ccw">
                  <use href="#gearGold" transform="scale(0.8)" />
                </g>
                <g transform="translate(615, 170)" className="gear-spin-ccw">
                  <use href="#gearGold" transform="scale(0.85)" />
                </g>
                <g
                  transform="translate(685, 205)"
                  className="gear-spin-cw-fast"
                >
                  <use href="#gearGold" transform="scale(0.92)" />
                </g>
              </g>

              {/* C. RED ERROR PILL BADGE */}
              <g className="error-badge-pulse">
                <rect
                  x="400"
                  y="66"
                  width="160"
                  height="52"
                  rx="26"
                  fill="#E53935"
                  stroke="#18181B"
                  strokeWidth="5"
                />
                <text
                  x="480"
                  y="102"
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="900"
                  fill="#ffffff"
                  letterSpacing="2"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  ERROR
                </text>
              </g>

              {/* D. GIANT 404 NUMBERS (INSIDE SCREEN) */}
              <text
                x="480"
                y="235"
                textAnchor="middle"
                fontSize="175"
                fontWeight="950"
                letterSpacing="-3"
                fill="#18181B"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ fontStretch: "condensed" }}
              >
                404
              </text>

              {/* E. HORIZONTAL UNDERLINE & "PAGE NOT FOUND" (INSIDE SCREEN) */}
              <line
                x1="285"
                y1="262"
                x2="675"
                y2="262"
                stroke="#18181B"
                strokeWidth="8"
                strokeLinecap="round"
              />

              <text
                x="480"
                y="312"
                textAnchor="middle"
                fontSize="38"
                fontWeight="950"
                letterSpacing="2"
                fill="#18181B"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                PAGE NOT FOUND
              </text>
            </g>

            {/* ======================================================== */}
            {/* IN FRONT OF THE SCREEN: THE TWO AUDIENCE CHARACTERS       */}
            {/* ======================================================== */}

            {/* 3. LEFT CHARACTER (WHITE SHIRT, SCRATCHING HEAD IN CONFUSION) */}
            <g className="left-person-body">
              {/* Ground Shadow (Mustard / Golden) */}
              <ellipse
                cx="145"
                cy="500"
                rx="65"
                ry="15"
                fill="#A87309"
                opacity="0.9"
              />

              {/* Legs & Black Pants */}
              <path d="M100,410 L118,490 L130,490 L120,410 Z" fill="#18181B" />
              <path d="M165,410 L172,490 L184,490 L178,410 Z" fill="#18181B" />
              {/* Shoes */}
              <path
                d="M108,490 C108,485 128,485 132,492 L114,494 Z"
                fill="#18181B"
              />
              <path
                d="M168,490 C168,485 188,485 192,492 L174,494 Z"
                fill="#18181B"
              />

              {/* Black Trousers Waist */}
              <path
                d="M95,345 C95,345 145,350 185,345 L188,413 C188,413 145,420 95,413 Z"
                fill="#18181B"
                stroke="#18181B"
                strokeWidth="4"
              />

              {/* White Dress Shirt (Seen from Behind) */}
              <path
                d="M85,265 C75,290 70,340 95,350 C125,355 160,355 185,350 C205,340 200,290 190,265 C170,253 115,253 85,265 Z"
                fill="#ffffff"
                stroke="#18181B"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* Left Arm Resting Down */}
              <path
                d="M88,270 C75,305 62,355 60,395"
                stroke="#18181B"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M88,270 C75,305 62,355 60,395"
                stroke="#ffffff"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* Left Hand Skin */}
              <ellipse
                cx="58"
                cy="405"
                rx="7"
                ry="12"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="3"
              />

              {/* Neck */}
              <rect
                x="125"
                y="235"
                width="32"
                height="24"
                rx="4"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="4"
              />

              {/* Head Base */}
              <ellipse cx="140" cy="230" rx="42" ry="46" fill="#18181B" />
              {/* Hair Tufts */}
              <path
                d="M98,230 C92,190 115,165 145,165 C175,165 198,190 195,230 C198,260 175,280 145,280 C115,280 92,260 98,230 Z"
                fill="#18181B"
                stroke="#18181B"
                strokeWidth="4"
              />
              <path
                d="M100,210 C105,180 130,170 155,173 C180,175 195,190 200,215 C185,190 155,185 135,193 C115,200 105,215 100,210 Z"
                fill="#27272A"
              />

              {/* Right Arm: Scratching / Touching Head (Animated) */}
              <g className="scratch-arm">
                <path
                  d="M185,265 C205,290 220,320 228,330 C232,325 228,295 205,250"
                  fill="#ffffff"
                  stroke="#18181B"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <path
                  d="M222,320 C215,285 200,255 185,235"
                  stroke="#18181B"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <path
                  d="M222,320 C215,285 200,255 185,235"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="180"
                  cy="230"
                  rx="10"
                  ry="12"
                  fill="#E8B088"
                  stroke="#18181B"
                  strokeWidth="3"
                  transform="rotate(25 180 230)"
                />
              </g>
            </g>

            {/* 4. RIGHT CHARACTER (RED SHIRT, HANDS ON HIPS, LOOKING UP AT SCREEN) */}
            <g className="right-person-body">
              {/* Ground Shadow (Cool Grey) */}
              <ellipse
                cx="820"
                cy="500"
                rx="70"
                ry="15"
                fill="#94A3B8"
                opacity="0.8"
              />

              {/* Legs & Black Pants */}
              <path d="M790,410 L785,490 L797,490 L805,410 Z" fill="#18181B" />
              <path d="M840,410 L845,490 L857,490 L852,410 Z" fill="#18181B" />
              {/* Shoes */}
              <path
                d="M780,490 C780,485 798,485 802,492 L785,494 Z"
                fill="#18181B"
              />
              <path
                d="M842,490 C842,485 860,485 864,492 L846,494 Z"
                fill="#18181B"
              />

              {/* Black Trousers Waist */}
              <path
                d="M775,345 C775,345 820,350 860,345 L865,413 C865,413 820,420 775,413 Z"
                fill="#18181B"
                stroke="#18181B"
                strokeWidth="4"
              />

              {/* Red Shirt (FilmZone Red) */}
              <path
                d="M765,265 C755,290 750,340 775,350 C800,355 835,355 860,350 C880,340 875,290 865,265 C845,253 790,253 765,265 Z"
                fill="#E53935"
                stroke="#18181B"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* Left Arm (Hand on Hip) */}
              <path
                d="M765,270 C740,295 715,315 735,350 C745,360 765,357 775,350"
                fill="none"
                stroke="#18181B"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M765,270 C740,295 715,315 735,350 C745,360 765,357 775,350"
                fill="none"
                stroke="#E53935"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse
                cx="776"
                cy="351"
                rx="8"
                ry="11"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="3"
              />

              {/* Right Arm (Hand on Hip) */}
              <path
                d="M865,270 C890,295 915,315 895,350 C885,360 865,357 855,350"
                fill="none"
                stroke="#18181B"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M865,270 C890,295 915,315 895,350 C885,360 865,357 855,350"
                fill="none"
                stroke="#E53935"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse
                cx="854"
                cy="351"
                rx="8"
                ry="11"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="3"
              />

              {/* Neck & Ear Profile */}
              <rect
                x="802"
                y="240"
                width="28"
                height="22"
                rx="4"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="4"
              />
              <circle
                cx="792"
                cy="245"
                r="8"
                fill="#E8B088"
                stroke="#18181B"
                strokeWidth="3"
              />

              {/* Head & Hair */}
              <path
                d="M790,230 C785,190 810,165 840,165 C870,165 895,190 890,230 C895,260 870,280 840,280 C810,280 785,260 790,230 Z"
                fill="#18181B"
                stroke="#18181B"
                strokeWidth="4"
              />
              <path
                d="M792,210 C798,180 825,170 850,173 C875,175 890,190 895,215 C880,190 850,185 830,193 C810,200 798,215 792,210 Z"
                fill="#27272A"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
