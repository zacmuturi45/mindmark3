"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
import Link from "next/link";

const words = ["Talk", "to", "us"];
interface childProp {
  closeDropdown: () => void;
}

export const NavCta = ({ closeDropdown }: childProp) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blackBgRef = useRef<HTMLDivElement>(null);
  const arrow1Ref = useRef<HTMLDivElement>(null);
  const arrow2Ref = useRef<HTMLDivElement>(null);
  const enterTlRef = useRef<gsap.core.Timeline | null>(null);
  const leaveTlRef = useRef<gsap.core.Timeline | null>(null);
  const text = "Contact us";

  // ============================================================
  // INITIAL STATES
  // ============================================================

  useGSAP(() => {
    // Black bg starts scaled to 0 from bottom-left
    if (blackBgRef.current) {
      gsap.set(blackBgRef.current, {
        scale: 0,
        transformOrigin: "bottom left",
      });
    }

    // Arrow 2 starts outside bottom-left of container
    if (arrow2Ref.current) {
      gsap.set(arrow2Ref.current, {
        x: "-100%",
        y: "100%",
      });
    }
  }, []);

  // ============================================================
  // ENTER — timeline: arrow1 out → blackBg in → arrow2 in
  // ============================================================

  const handleEnter = () => {
    closeDropdown();

    leaveTlRef.current?.kill();
    enterTlRef.current?.kill();

    const tl = gsap.timeline();
    enterTlRef.current = tl;

    // ── Step 2: Arrow 1 exits top-right ──────────────────────
    tl.to(
      arrow1Ref.current,
      {
        x: "102%",
        y: "-102%",
        duration: 0.4,
        ease: "circ.inOut",
      },
      0, // fires with text
    );

    // ── Step 3: Black bg scales in from bottom-left ───────────
    // Starts slightly before arrow1 finishes
    tl.to(
      blackBgRef.current,
      {
        scale: 1,
        duration: 0.2,
        ease: "circ.inOut",
      },
      "-=0.25", // overlaps with arrow1 exit
    );

    // ── Step 4: Arrow 2 enters from bottom-left ───────────────
    // Enters as black bg is filling
    tl.to(
      arrow2Ref.current,
      {
        x: "0%",
        y: "0%",
        duration: 0.2,
        ease: "circ.inOut",
      },
      "-=0.18", // overlaps with black bg scaling
    );
  };

  // ============================================================
  // LEAVE — graceful reverse
  // ============================================================

  const handleLeave = () => {
    // if (!split1Ref.current || !split2Ref.current) return;

    // Kill both timelines
    enterTlRef.current?.kill();
    leaveTlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(arrow1Ref.current, { x: "0%", y: "0%" });
        gsap.set(arrow2Ref.current, { x: "-100%", y: "100%" });
        gsap.set(blackBgRef.current, { scale: 0 });
      },
    });
    leaveTlRef.current = tl;

    // ── Arrow 2 exits back to bottom-left ────────────────────
    tl.to(
      arrow2Ref.current,
      {
        x: "-100%",
        y: "100%",
        duration: 0.3,
        ease: "circ.inOut",
      },
      0,
    );

    // ── Black bg scales back out ──────────────────────────────
    tl.to(
      blackBgRef.current,
      {
        scale: 0,
        duration: 0.35,
        ease: "circ.inOut",
      },
      "-=0.15",
    );

    // ── Arrow 1 returns to position ───────────────────────────
    tl.to(
      arrow1Ref.current,
      {
        x: "0%",
        y: "0%",
        duration: 0.25,
        ease: "power2.out",
      },
      "-=0.1",
    );

    // ── Words row 2 exits down, row 1 returns ─────────────────
    // tl.to(
    //   split2Ref.current?.chars,
    //   {
    //     y: "0%",
    //     duration: 0.3,
    //     ease: "circ.inOut",
    //     stagger: 0.007,
    //   },
    //   "-=0.3",
    // ).to(
    //   split1Ref.current.chars,
    //   {
    //     y: "0%",
    //     duration: 0.3,
    //     ease: "circ.inOut",
    //     stagger: 0.007,
    //   },
    //   "<", // starts at same time as row 2 exit
    // );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div ref={wrapperRef}>
      <Link
        href={"/contact"}
        className="flex items-center gap-3 shrink-0 cursor-pointer group"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* ── Text section ─────────────────────────────────────────
          h-[1.5em] = explicit height of one line (matches line-height)
          overflow-hidden masks row 2 sitting below
      ── */}
        <div className="h-[1.5em] flex flex-col">
          {/* Text Animation */}
          <span className="relative overflow-hidden inline-flex font-bold text-nav-label text-nav-text leading-none font-p-n-montreal">
            {[...text].map((char, index) => (
              <span
                key={index}
                style={{
                  transitionDelay: `${index * 0.01}s`,
                }}
                className="
              inline-block
              transition-transform
              duration-500
              ease-[cubic-bezier(0.625,0.05,0,1)]
              [text-shadow:0_1.2em_currentColor]
              transform-[translateY(0em)]
              group-hover:-translate-y-[1.2em]
              "
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </div>

        {/* ── Arrow container ───────────────────────────────────────
          relative + overflow-hidden = clips arrows outside bounds
          Same size as the svg (width + padding from original NavCta)
          rounded-sm matches original shape
      ── */}
        <div className="relative overflow-hidden rounded-sm flex items-center justify-center p-2 bg-nav-cta">
          {/* Black bg — scales from bottom-left on hover */}
          <div
            ref={blackBgRef}
            className="absolute inset-0 bg-black rounded-sm"
          />

          {/* Arrow 1 — black, starts at position 0, exits top-right */}
          <div
            ref={arrow1Ref}
            className="relative z-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
              <g clipPath="url(#clip0_arrow1)">
                <path
                  d="M7 7H17M17 7V17M17 7L7 17"
                  stroke="#292929"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </g>
              <defs>
                <clipPath id="clip0_arrow1">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Arrow 2 — lime colored, starts outside bottom-left */}
          <div
            ref={arrow2Ref}
            className="absolute z-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
              <g clipPath="url(#clip0_arrow2)">
                <path
                  d="M7 7H17M17 7V17M17 7L7 17"
                  stroke="#a9fd44"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </g>
              <defs>
                <clipPath id="clip0_arrow2">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};
