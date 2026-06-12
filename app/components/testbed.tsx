"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  const text = "Shop Women";
  const [isHovered, setIsHovered] = useState(false);
  const shaftRef = useRef<HTMLDivElement>(null);
  const arrowBoxRef = useRef<HTMLDivElement>(null);
  const [restWidth, setRestWidth] = useState<number | null>(null);
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
  const [totalWidth, setTotalWidth] = useState<number | null>(null);

  useEffect(() => {
    if (shaftRef.current && arrowBoxRef.current) {
      const shaftWidth = shaftRef.current.offsetWidth;
      const arrowWidth = arrowBoxRef.current.offsetWidth;
      const gap = 6;
      setRestWidth(shaftWidth);
      setExpandedWidth(shaftWidth + gap + arrowWidth);
      setTotalWidth(shaftWidth + gap + arrowWidth);
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-black/20 flex justify-start px-6 items-center">
      <div
        className="group relative flex cursor-pointer"
        style={{ width: totalWidth ?? "auto" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shaft */}
        <div
          ref={shaftRef}
          style={{
            width: restWidth
              ? isHovered && expandedWidth
                ? expandedWidth
                : restWidth
              : undefined,
            transition: "width 450ms cubic-bezier(0.625,0.05,0,1)",
          }}
          className="bg-black text-white font-bold font-p-n-montreal tracking-wide inline-flex items-center text-sm uppercase overflow-hidden px-4 py-3 z-10"
        >
          <span className="relative inline-flex overflow-hidden leading-none">
            {[...text].map((char, index) => (
              <span
                key={index}
                style={{ transitionDelay: `${index * 0.015}s` }}
                className="
                  inline-block
                  transition-transform
                  duration-450
                  ease-[cubic-bezier(0.625,0.05,0,1)]
                  [text-shadow:0_1.2em_currentColor]
                  group-hover:-translate-y-[1.2em]
                "
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </div>

        {/* Arrow box — fixed to right edge, doesn't move */}
        <div
          ref={arrowBoxRef}
          style={{
            backgroundColor: isHovered ? "#ffffff" : "#000000",
            transition: isHovered
              ? "background-color 150ms ease 400ms"
              : "background-color 150ms ease 0ms",
          }}
          className="absolute right-0 top-0 bottom-0 flex justify-center items-center w-10"
        >
          <svg
            className="-rotate-45"
            width="20"
            height="20"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              style={{
                fill: isHovered ? "#000000" : "#ffffff",
                transition: isHovered
                  ? "fill 150ms ease 400ms"
                  : "fill 150ms ease 0ms",
              }}
              d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312L754.752 480z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
