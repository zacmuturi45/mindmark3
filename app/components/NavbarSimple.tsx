"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { NavCta } from "@/app/components/icons/navCta";
import { Down_arrow } from "@/app/components/icons/downArrow";
import { ArrowRight } from "@/app/components/icons/arrowRight";
import { LogoSvg } from "@/app/components/icons/logo";
import {
  getVisibleMobileLinks,
  hasSeeAll,
  nav_links_simple,
  SimplePanelLink,
  type SimpleNavLink,
} from "../data/navDataSimple";

const NavbarSimple = () => {
  const pathname = usePathname();

  // ── Mobile refs ──────────────────────────────────────────
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileChevronRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Mobile tracking refs ─────────────────────────────────
  const isMobileOpen = useRef<boolean>(false);
  const openAccordion = useRef<number>(-1);

  // ── Desktop refs ─────────────────────────────────────────
  const overlayRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plainPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[][]>([]);
  const arrowRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Tracking refs ────────────────────────────────────────
  const openPanelIndex = useRef<number>(-1);
  const activeLinkIndex = useRef<number[]>([]);

  // ── Derived data ─────────────────────────────────────────
  const dropdownTriggers = nav_links_simple.filter((l) => l.dropdown);
  const plainLinks = nav_links_simple.filter((l) => !l.dropdown);

  // ============================================================
  // GSAP INITIAL SETUP
  // ============================================================

  useGSAP(() => {
    // Pills hidden
    pillRefs.current.forEach((p) => {
      if (p) gsap.set(p, { opacity: 0 });
    });
    plainPillRefs.current.forEach((p) => {
      if (p) gsap.set(p, { opacity: 0 });
    });

    // Active route pill
    nav_links_simple.forEach((navlink) => {
      if (!navlink.dropdown) return;
      const idx = dropdownTriggers.findIndex(
        (d) => d.link_name === navlink.link_name,
      );
      if (navlink.href === pathname) {
        const pill = pillRefs.current[idx];
        if (pill) gsap.set(pill, { opacity: 1 });
      }
    });
    plainLinks.forEach((navlink, idx) => {
      if (navlink.href === pathname) {
        const pill = plainPillRefs.current[idx];
        if (pill) gsap.set(pill, { opacity: 1 });
      }
    });

    // Dropdowns hidden
    dropdownRefs.current.forEach((d) => {
      if (d) gsap.set(d, { opacity: 0, y: 16, pointerEvents: "none" });
    });

    // Single image per panel — starts clipped
    imgRefs.current.forEach((img) => {
      if (img) gsap.set(img, { scale: 1.1 });
    });

    // Arrows — all hidden
    dropdownTriggers.forEach((trigger, panelIndex) => {
      activeLinkIndex.current[panelIndex] = -1;
      const links = Array.isArray(trigger.dropdown_links)
        ? trigger.dropdown_links
        : [];
      links.forEach((_, itemIndex) => {
        const arrow = arrowRefs.current[panelIndex]?.[itemIndex];
        if (arrow) gsap.set(arrow, { x: -8, rotation: 90, opacity: 0 });
      });
    });

    // Chevrons
    chevronRefs.current.forEach((c) => {
      if (c) gsap.set(c, { rotation: 0 });
    });

    // Overlay
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });

    // Mobile panel
    if (mobilePanelRef.current) {
      gsap.set(mobilePanelRef.current, {
        opacity: 0,
        y: 16,
        pointerEvents: "none",
      });
    }

    // Mobile accordions
    accordionRefs.current.forEach((a) => {
      if (a)
        gsap.set(a, {
          opacity: 0,
          height: 0,
          transformOrigin: "bottom center",
        });
    });
  }, [pathname]);

  // ============================================================
  // OPEN DROPDOWN
  // ============================================================

  const openDropdown = (panelIndex: number) => {
    if (openPanelIndex.current === panelIndex) return;
    if (openPanelIndex.current !== -1) closeDropdown(openPanelIndex.current);

    openPanelIndex.current = panelIndex;

    const dropdown = dropdownRefs.current[panelIndex];
    const chevron = chevronRefs.current[panelIndex];
    const pill = pillRefs.current[panelIndex];
    const img = imgRefs.current[panelIndex];
    const caption = captionRefs.current[panelIndex];
    const isActive = dropdownTriggers[panelIndex]?.href === pathname;

    if (dropdown) {
      gsap.killTweensOf(dropdown);
      gsap.to(dropdown, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)",
        pointerEvents: "auto",
        overwrite: "auto",
      });
    }
    if (chevron) {
      gsap.killTweensOf(chevron);
      gsap.to(chevron, {
        rotation: 180,
        duration: 0.35,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    }
    if (pill && !isActive) {
      gsap.killTweensOf(pill);
      gsap.to(pill, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (overlayRef.current) {
      gsap.killTweensOf(overlayRef.current);
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Single image reveal
    if (img) {
      gsap.killTweensOf(img);
      gsap.to(img, {
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Stagger links in
    const links = linkRefs.current[panelIndex]?.filter(Boolean);
    if (links?.length) {
      gsap.killTweensOf(links);
      gsap.fromTo(
        links,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
          overwrite: "auto",
        },
      );
    }
  };

  // ============================================================
  // CLOSE DROPDOWN
  // ============================================================

  const closeDropdown = (panelIndex: number = openPanelIndex.current) => {
    if (panelIndex === -1) return;

    const dropdown = dropdownRefs.current[panelIndex];
    const chevron = chevronRefs.current[panelIndex];
    const pill = pillRefs.current[panelIndex];
    const img = imgRefs.current[panelIndex];
    const caption = captionRefs.current[panelIndex];
    const isActive = dropdownTriggers[panelIndex]?.href === pathname;

    if (dropdown) {
      gsap.killTweensOf(dropdown);
      gsap.to(dropdown, {
        opacity: 0,
        pointerEvents: "none",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(dropdown, { y: 16 });
          if (img) gsap.set(img, { scale: 1.1 });
          const links = Array.isArray(
            dropdownTriggers[panelIndex]?.dropdown_links,
          )
            ? (dropdownTriggers[panelIndex].dropdown_links as SimplePanelLink[])
            : [];
          links.forEach((_, i) => {
            const arrow = arrowRefs.current[panelIndex]?.[i];
            if (arrow) gsap.set(arrow, { x: -8, rotation: 90, opacity: 0 });
            const link = linkRefs.current[panelIndex]?.[i];
            if (link) gsap.set(link, { x: 0 });
          });
          activeLinkIndex.current[panelIndex] = -1;
        },
      });
    }
    if (chevron) {
      gsap.killTweensOf(chevron);
      gsap.to(chevron, {
        rotation: 0,
        duration: 0.3,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    }
    if (pill && !isActive) {
      gsap.killTweensOf(pill);
      gsap.to(pill, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
    if (overlayRef.current) {
      gsap.killTweensOf(overlayRef.current);
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        overwrite: "auto",
      });
    }

    openPanelIndex.current = -1;
  };

  // ============================================================
  // LINK HOVER
  // ============================================================

  const handleLinkHover = (panelIndex: number, itemIndex: number) => {
    const prevIndex = activeLinkIndex.current[panelIndex];

    if (prevIndex !== -1 && prevIndex !== itemIndex) {
      const prevArrow = arrowRefs.current[panelIndex]?.[prevIndex];
      const prevLink = linkRefs.current[panelIndex]?.[prevIndex];
      if (prevArrow) {
        gsap.killTweensOf(prevArrow);
        gsap.to(prevArrow, {
          x: -8,
          rotation: -90,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
      if (prevLink) {
        gsap.killTweensOf(prevLink);
        gsap.to(prevLink, {
          x: 0,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    const newArrow = arrowRefs.current[panelIndex]?.[itemIndex];
    const newLink = linkRefs.current[panelIndex]?.[itemIndex];
    if (newArrow) {
      gsap.killTweensOf(newArrow);
      gsap.fromTo(
        newArrow,
        { x: -8, rotation: 90, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }
    if (newLink) {
      gsap.killTweensOf(newLink);
      gsap.to(newLink, {
        x: 16,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    activeLinkIndex.current[panelIndex] = itemIndex;
  };

  const handleLinkLeave = (panelIndex: number, itemIndex: number) => {
    const arrow = arrowRefs.current[panelIndex]?.[itemIndex];
    const link = linkRefs.current[panelIndex]?.[itemIndex];
    if (arrow) {
      gsap.killTweensOf(arrow);
      gsap.to(arrow, {
        x: -8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
    if (link) {
      gsap.killTweensOf(link);
      gsap.to(link, {
        x: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    activeLinkIndex.current[panelIndex] = -1;
  };

  // ============================================================
  // PLAIN LINK PILL
  // ============================================================

  const handlePlainLinkEnter = (el: HTMLElement | null) => {
    if (!el) return;
    closeDropdown(openPanelIndex.current);
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handlePlainLinkLeave = (el: HTMLElement | null, href: string) => {
    if (!el || href === pathname) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      overwrite: "auto",
    });
  };

  // ============================================================
  // DROPDOWN IMAGE ENTER
  // ============================================================
  const handleImageEnter = (panelIndex: number) => {
    const img = imgRefs.current[panelIndex];
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: 1.08,
      rotation: 2,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleImageLeave = (panelIndex: number) => {
    const img = imgRefs.current[panelIndex];
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // ============================================================
  // MOBILE — HAMBURGER TOGGLE
  // ============================================================

  const toggleMobileMenu = () => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (!isMobileOpen.current) {
      isMobileOpen.current = true;
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)",
        pointerEvents: "auto",
        overwrite: "auto",
      });
      const rows = mobileRowRefs.current.filter(Boolean);
      if (rows.length) {
        gsap.fromTo(
          rows,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: 0.06,
            overwrite: "auto",
          },
        );
      }
    } else {
      if (openAccordion.current !== -1) closeAccordion(openAccordion.current);
      isMobileOpen.current = false;
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        opacity: 0,
        y: 16,
        duration: 0.35,
        ease: "power3.in",
        pointerEvents: "none",
        overwrite: "auto",
      });
    }
  };

  // ============================================================
  // MOBILE — ACCORDION
  // ============================================================

  const openAccordionPanel = (index: number) => {
    if (openAccordion.current !== -1 && openAccordion.current !== index) {
      closeAccordion(openAccordion.current);

      openAccordion.current = index;
      const newAcc = accordionRefs.current[index];
      const newChevron = mobileChevronRefs.current[index];

      if (newAcc) {
        gsap.killTweensOf(newAcc);
        gsap.to(newAcc, {
          opacity: 1,
          height: "auto",
          duration: 0.4,
          ease: "power3.out",
          delay: 0.25, // starts halfway through the close
          overwrite: "auto",
        });
      }
      if (newChevron) {
        gsap.killTweensOf(newChevron);
        gsap.to(newChevron, {
          rotation: 180,
          duration: 0.3,
          ease: "back.out(2)",
          delay: 0.25,
          overwrite: "auto",
        });
      }
      return;
    }

    // No panel open — open directly
    openAccordion.current = index;
    const acc = accordionRefs.current[index];
    const chevron = mobileChevronRefs.current[index];
    if (acc) {
      gsap.killTweensOf(acc);
      gsap.to(acc, {
        opacity: 1,
        height: "auto",
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    if (chevron) {
      gsap.killTweensOf(chevron);
      gsap.to(chevron, {
        rotation: 180,
        duration: 0.3,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    }
  };

  const closeAccordion = (index: number) => {
    const acc = accordionRefs.current[index];
    const chevron = mobileChevronRefs.current[index];
    if (acc) {
      gsap.killTweensOf(acc);
      gsap.to(acc, {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: "power3.in",
        overwrite: "auto",
      });
    }
    if (chevron) {
      gsap.killTweensOf(chevron);
      gsap.to(chevron, {
        rotation: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
    openAccordion.current = -1;
  };

  const toggleAccordion = (index: number) => {
    openAccordion.current === index
      ? closeAccordion(index)
      : openAccordionPanel(index);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-nav-bg/40 pointer-events-none z-40 opacity-0 hidden nav:block"
      />

      <div className="fixed top-nav-offset left-0 right-0 flex-col items-center z-50 hidden nav:flex">
        <div
          onMouseLeave={() => closeDropdown(openPanelIndex.current)}
          className="relative"
        >
          {/* Floating bar */}
          <div className="w-[95vw] navWide:w-[62vw] max-w-nav h-nav-height bg-nav-bg rounded-nav flex items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <LogoSvg width={32} height={32} />
              <span className="text-nav-text font-bold font-p-n-montreal text-nav-logo">
                Sphere
              </span>
            </Link>

            <nav className="flex items-center gap-nav-gap">
              {nav_links_simple.map((navlink, i) => {
                const dropdownIndex = dropdownTriggers.findIndex(
                  (d) => d.link_name === navlink.link_name,
                );
                const plainIndex = plainLinks.findIndex(
                  (l) => l.link_name === navlink.link_name,
                );
                return (
                  <div
                    key={`desktop-${navlink.link_name}-${i}`}
                    className="relative"
                  >
                    {navlink.dropdown ? (
                      <Link
                        href={navlink.href}
                        className="relative z-0 flex items-center gap-1 px-nav-pill-x py-nav-pill-y font-p-n-montreal font-bold text-nav-label text-nav-text"
                        onMouseEnter={() => openDropdown(dropdownIndex)}
                      >
                        <div
                          ref={(el) => {
                            pillRefs.current[dropdownIndex] = el;
                          }}
                          className="absolute inset-0 bg-nav-text/8 rounded-pill -z-10 opacity-0"
                        />
                        <span>{navlink.link_name}</span>
                        <div
                          ref={(el) => {
                            chevronRefs.current[dropdownIndex] = el;
                          }}
                          className="flex items-center will-change-transform"
                        >
                          <Down_arrow width={12} height={12} />
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={navlink.href}
                        className="relative z-0 flex items-center px-nav-pill-x py-nav-pill-y font-p-n-montreal font-bold text-nav-label text-nav-text"
                        onMouseEnter={() =>
                          handlePlainLinkEnter(
                            plainPillRefs.current[plainIndex],
                          )
                        }
                        onMouseLeave={() =>
                          handlePlainLinkLeave(
                            plainPillRefs.current[plainIndex],
                            navlink.href,
                          )
                        }
                      >
                        <div
                          ref={(el) => {
                            plainPillRefs.current[plainIndex] = el;
                          }}
                          className="absolute inset-0 bg-nav-text/8 rounded-pill -z-10 opacity-0"
                        />
                        {navlink.link_name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <NavCta closeDropdown={closeDropdown} />
          </div>

          {/* Dropdown panels */}
          {dropdownTriggers.map((trigger, panelIndex) => {
            const links = Array.isArray(trigger.dropdown_links)
              ? (trigger.dropdown_links as SimplePanelLink[])
              : [];
            const half = Math.ceil(links.length / 2);
            const colA: SimplePanelLink[] = links.slice(0, half);
            const colB: SimplePanelLink[] = links.slice(half);

            if (!linkRefs.current[panelIndex])
              linkRefs.current[panelIndex] = [];
            if (!arrowRefs.current[panelIndex])
              arrowRefs.current[panelIndex] = [];

            return (
              <div
                key={`simple-panel-${trigger.link_name}`}
                ref={(el) => {
                  dropdownRefs.current[panelIndex] = el;
                }}
                className="absolute opacity-0 top-nav-height left-0 w-[95vw] navWide:w-[62vw] max-w-nav pt-dropdown-gap will-change-transform"
              >
                <div className="bg-nav-bg p-dropdown-pad rounded-dropdown h-112.5 flex overflow-hidden">
                  {/* Single static image */}
                  <div
                    className="w-image-col relative rounded-pill shrink-0 overflow-hidden"
                    onMouseEnter={() => handleImageEnter(panelIndex)}
                    onMouseLeave={() => handleImageLeave(panelIndex)}
                  >
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
                      <Link
                        href={trigger.imageCaptionHref ?? trigger.href}
                        className="flex items-center justify-between w-full"
                      >
                        <span className="text-nav-label text-white font-medium">
                          {trigger.imageCaption ?? trigger.link_name}
                        </span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
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
                      </Link>
                    </div>
                  </div>

                  {/* Links column */}
                  <div className="flex-1 flex px-8 py-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                      <div className="flex flex-col">
                        {colA.map((item, colIndex) => {
                          const globalIndex = colIndex;
                          return (
                            <Link
                              key={`simple-a-${item.link_name}`}
                              href={item.href}
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
                                  arrowRefs.current[panelIndex][globalIndex] =
                                    el;
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
                      <div className="flex flex-col">
                        {colB.map((item, colIndex) => {
                          const globalIndex = colA.length + colIndex;
                          return (
                            <Link
                              key={`simple-b-${item.link_name}`}
                              href={item.href}
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
                                  arrowRefs.current[panelIndex][globalIndex] =
                                    el;
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
          })}
        </div>
      </div>

      <div className="fixed top-nav-offset left-0 right-0 flex flex-col items-center z-50 nav:hidden px-4">
        {/* Mobile bar */}
        <div className="w-full h-nav-height-mobile bg-nav-bg rounded-nav flex items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <LogoSvg width={28} height={28} />
            <span className="text-nav-text font-bold font-p-n-montreal text-xl">
              Sphere
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-nav-cta"
            aria-label="Toggle navigation menu"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path
                d="M0 1H18M0 7H18M0 13H18"
                stroke="#1C2B2B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        <div
          ref={mobilePanelRef}
          className="relative w-full mt-2 bg-nav-bg rounded-nav opacity-0 will-change-transform"
        >
          <div className="px-5 py-3">
            {nav_links_simple.map((navlink, i) => {
              const isDropdown = navlink.dropdown === true;
              const dropdownData = isDropdown
                ? dropdownTriggers.find(
                    (d) => d.link_name === navlink.link_name,
                  )
                : null;
              const accordionIdx = isDropdown
                ? dropdownTriggers.findIndex(
                    (d) => d.link_name === navlink.link_name,
                  )
                : -1;

              return (
                <div
                  key={`mob-${navlink.link_name}`}
                  ref={(el) => {
                    mobileRowRefs.current[i] = el;
                  }}
                  className="border-b border-nav-text/8 last:border-0"
                >
                  {isDropdown ? (
                    <>
                      <button
                        onClick={() => toggleAccordion(accordionIdx)}
                        className="w-full flex items-center justify-between py-2 text-nav-text font-helvetica-now font-semibold text-nav-mobile tracking-nav-tight"
                      >
                        <span>{navlink.link_name}</span>
                        <span
                          ref={(el) => {
                            mobileChevronRefs.current[accordionIdx] = el;
                          }}
                          className="flex items-center will-change-transform"
                        >
                          <Down_arrow width={14} height={14} />
                        </span>
                      </button>

                      <div className="overflow-hidden">
                        <div
                          ref={(el) => {
                            accordionRefs.current[accordionIdx] = el;
                          }}
                          className="will-change-transform origin-top pb-3"
                        >
                          {getVisibleMobileLinks(
                            (dropdownData?.dropdown_links as SimplePanelLink[]) ??
                              [],
                          ).map((item) => (
                            <Link
                              key={`mob-link-${item.link_name}`}
                              href={item.href}
                              className="block py-2 pl-2 text-nav-muted font-medium text-lg font-helvetica-now"
                            >
                              {item.link_name}
                            </Link>
                          ))}
                          {hasSeeAll(
                            (dropdownData?.dropdown_links as SimplePanelLink[]) ??
                              [],
                          ) && (
                            <Link
                              href={navlink.href}
                              className="block py-2 pl-2 text-nav-muted underline underline-offset-2 text-lg font-helvetica-now font-medium"
                            >
                              See All
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={navlink.href}
                      className="block py-2 text-nav-text font-helvetica-now font-semibold text-nav-mobile tracking-nav-tight"
                    >
                      {navlink.link_name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="absolute w-full h-nav-height-mobile left-0 mt-2 flex items-center justify-between bg-nav-bg rounded-xl px-5 py-4">
            <span className="text-nav-text font-helvetica-now font-semibold text-nav-mobile tracking-nav-tight">
              Contact us
            </span>
            <Link
              href="/contact"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-nav-cta"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none">
                <path
                  d="M7 7H17M17 7V17M17 7L7 17"
                  stroke="#1C2B2B"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarSimple;
