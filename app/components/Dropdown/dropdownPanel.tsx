"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/app/components/icons/arrowRight";

import type { SimpleNavLink, SimplePanelLink } from "../../data/navDataSimple";

type DropdownPanelProps = {
  trigger: SimpleNavLink;
  panelIndex: number;
  navbar: any;
};

const DropdownPanel = ({ trigger, panelIndex, navbar }: DropdownPanelProps) => {
  const {
    dropdownRefs,
    linkRefs,
    arrowRefs,
    imgRefs,
    imageLinkRefs,
    captionRefs,
    roundButtonRefs,
    pillRefs,

    handleImageEnter,
    handleImageLeave,

    handleLinkHover,
    handleLinkLeave,

    handleDropdownLinkkeyDown,

    closeDropdown,
  } = navbar;

  const links = trigger.dropdown_links;

  const half = Math.ceil(links.length / 2);

  const colA: SimplePanelLink[] = links.slice(0, half);
  const colB: SimplePanelLink[] = links.slice(half);

  if (!linkRefs.current[panelIndex]) {
    linkRefs.current[panelIndex] = [];
  }

  if (!arrowRefs.current[panelIndex]) {
    arrowRefs.current[panelIndex] = [];
  }

  return (
    <div
      id={`dropdown-panel-${panelIndex}`}
      role="menu"
      aria-label={trigger.link_name}
      ref={(el) => {
        dropdownRefs.current[panelIndex] = el;
      }}
      className="absolute opacity-0 top-nav-height left-0 w-[95vw] navWide:w-[62vw] max-w-nav pt-dropdown-gap will-change-transform"
    >
      <div className="bg-nav-bg p-dropdown-pad rounded-dropdown h-112.5 flex overflow-hidden">
        {/* Image Column */}
        <Link
          ref={(el) => {
            imageLinkRefs.current[panelIndex] = el;
          }}
          href={trigger.imageCaptionHref ?? trigger.href}
          className="w-image-col relative rounded-pill shrink-0 overflow-hidden"
          onMouseEnter={() => handleImageEnter(panelIndex)}
          onMouseLeave={() => handleImageLeave(panelIndex)}
          onKeyDown={(e) => {
            // SHIFT + TAB from image -> back to trigger
            if (e.key === "Tab" && e.shiftKey) {
              e.preventDefault();

              const triggerEl = pillRefs.current[panelIndex]?.parentElement;

              triggerEl?.focus();

              closeDropdown(panelIndex);
            }

            // TAB from image -> first dropdown text link
            else if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();

              const firstDropdownLink = linkRefs.current[panelIndex]?.[0];

              firstDropdownLink?.focus();
            }
          }}
        >
          {/* Image */}
          <div
            ref={(el) => {
              imgRefs.current[panelIndex] = el;
            }}
            className="absolute inset-0 will-change-transform"
          >
            {trigger.image && (
              <Image
                src={trigger.image}
                alt={trigger.link_name}
                fill
                sizes="(min-width: 1440px) 320px, (min-width: 1024px) 28vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>

          {/* Caption */}
          <div
            ref={(el) => {
              captionRefs.current[panelIndex] = el;
            }}
            className="absolute bottom-0 left-0 right-0 p-4 flex items-center will-change-transform"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-nav-label text-white font-medium">
                {trigger.imageCaption ?? trigger.link_name}
              </span>

              <div
                ref={(el) => {
                  roundButtonRefs.current[panelIndex] = el;
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  width={12}
                  height={12}
                  fill="#000000"
                  stroke="#000000"
                  strokeWidth="64.512"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>

                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>

                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Links Column */}
        <div className="flex-1 flex px-8 py-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
            {/* Column A */}
            <div className="flex flex-col">
              {colA.map((item, colIndex) => {
                const globalIndex = colIndex;

                return (
                  <Link
                    key={`simple-a-${item.link_name}`}
                    href={item.href}
                    tabIndex={-1}
                    ref={(el) => {
                      linkRefs.current[panelIndex][globalIndex] = el;
                    }}
                    className="flex items-center py-2 text-nav-dropdown-link text-nav-text font-medium will-change-transform w-fit font-inter"
                    onMouseEnter={() =>
                      handleLinkHover(panelIndex, globalIndex)
                    }
                    onMouseLeave={() =>
                      handleLinkLeave(panelIndex, globalIndex)
                    }
                  >
                    <span
                      ref={(el) => {
                        arrowRefs.current[panelIndex][globalIndex] = el;
                      }}
                      className="flex items-center mr-2 will-change-transform"
                    >
                      <ArrowRight width={12} height={12} />
                    </span>

                    <span>{item.link_name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Column B */}
            <div className="flex flex-col">
              {colB.map((item, colIndex) => {
                const globalIndex = colA.length + colIndex;

                const totalItems = trigger.dropdown_links.length;

                return (
                  <Link
                    key={`simple-b-${item.link_name}`}
                    href={item.href}
                    tabIndex={-1}
                    ref={(el) => {
                      linkRefs.current[panelIndex][globalIndex] = el;
                    }}
                    onKeyDown={(e) =>
                      handleDropdownLinkkeyDown(
                        e,
                        panelIndex,
                        globalIndex,
                        totalItems,
                      )
                    }
                    className="flex items-center py-2 text-nav-dropdown-link text-nav-text font-medium will-change-transform w-fit font-inter"
                    onMouseEnter={() =>
                      handleLinkHover(panelIndex, globalIndex)
                    }
                    onMouseLeave={() =>
                      handleLinkLeave(panelIndex, globalIndex)
                    }
                  >
                    <span
                      ref={(el) => {
                        arrowRefs.current[panelIndex][globalIndex] = el;
                      }}
                      className="flex items-center mr-2 will-change-transform"
                    >
                      <ArrowRight width={12} height={12} />
                    </span>

                    <span>{item.link_name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownPanel;
