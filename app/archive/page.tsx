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
      const gap = 4;
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
          className="bg-black text-white font-bold font-p-n-montreal tracking-wide inline-flex items-center text-sm h-10 uppercase overflow-hidden px-4 py-3 z-1"
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
            transform: isHovered
              ? "translateX(-1px) scale(0.85) rotate(90deg)"
              : "translateX(0px) scale(1) rotate(0deg)",
            transition: isHovered
              ? "background-color 150ms ease 100ms, transform 450ms cubic-bezier(0.625,0.05,0,1)"
              : "background-color 150ms ease 0ms, transform 450ms cubic-bezier(0.625,0.05,0,1)",
          }}
          className="z-2 absolute right-0 top-0 bottom-0 flex justify-center items-center w-10 p-0 h-10"
        >
          <svg
            style={{
              transform: isHovered ? "rotate(-135deg)" : "rotate(-45deg)",
              transition: isHovered
                ? "transform 400ms cubic-bezier(0.625,0.05,0,1), color 150ms ease 100ms"
                : "transform 400ms cubic-bezier(0.625,0.05,0,1), color 150ms ease 0ms",
              color: isHovered ? "#000000" : "#ffffff",
            }}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M10,0 L8.565,1.393 L16.172,9 L0,9 L0,11 L16.172,11 L8.586,18.586 L10,20 C13.661,16.339 16.496,13.504 20,10 L10,0"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
