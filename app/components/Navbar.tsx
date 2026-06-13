"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DropdownItem, nav_links } from "@/app/data/navData";
import { NavCta } from "@/app/components/icons/navCta";
import { ArrowRight } from "./icons/arrowRight";
import { LogoSvg } from "./icons/logo";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Down_arrow } from "./icons/downArrow";
import { getVisibleMobileLinks, hasSeeAll } from "../data/navDataSimple";

const Navbar = () => {
  const pathname = usePathname();

  // ── Mobile refs ──────────────────────────────────────────
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileChevronRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Mobile tracking refs ─────────────────────────────────
  const isMobileOpen = useRef<boolean>(false);
  const openAccordion = useRef<number>(-1);
  const burgerTopRef = useRef<HTMLSpanElement>(null);
  const burgerBottomRef = useRef<HTMLSpanElement>(null);
  const [mobPanelHeight, setMobPanelHeight] = useState<boolean>(false);

  // ── Desktop refs ─────────────────────────────────────────
  const overlayRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plainPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[][]>([]);
  const arrowRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  // ── Tracking refs ────────────────────────────────────────
  const openPanelIndex = useRef<number>(-1);
  const activeImgIndex = useRef<number[]>([]);
  const activeLinkIndex = useRef<number[]>([]);

  // ── Derived data ─────────────────────────────────────────
  const dropdownTriggers = nav_links.filter((link) => link.dropdown);
  const plainLinks = nav_links.filter((l) => !l.dropdown);

  // ============================================================
  // GSAP INITIAL SETUP + ACTIVE PILL ON ROUTE CHANGE
  // ============================================================

  useGSAP(() => {
    pillRefs.current.forEach((pill) => {
      if (pill) gsap.set(pill, { opacity: 0 });
    });
    plainPillRefs.current.forEach((pill) => {
      if (pill) gsap.set(pill, { opacity: 0 });
    });

    nav_links.forEach((navlink) => {
      if (!navlink.dropdown) return;
      const dropdownIndex = dropdownTriggers.findIndex(
        (d) => d.link_name === navlink.link_name,
      );
      if (navlink.href === pathname) {
        const pill = pillRefs.current[dropdownIndex];
        if (pill) gsap.set(pill, { opacity: 1 });
      }
    });

    plainLinks.forEach((navlink, index) => {
      if (navlink.href === pathname) {
        const pill = plainPillRefs.current[index];
        if (pill) gsap.set(pill, { opacity: 1 });
      }
    });

    dropdownRefs.current.forEach((dropdown) => {
      if (dropdown)
        gsap.set(dropdown, { opacity: 0, y: 16, pointerEvents: "none" });
    });

    dropdownTriggers.forEach((trigger, panelIndex) => {
      activeImgIndex.current[panelIndex] = 0;
      activeLinkIndex.current[panelIndex] = 0;

      trigger.dropdown_links.forEach((_, itemIndex) => {
        const img = imgRefs.current[panelIndex]?.[itemIndex];
        if (img) {
          gsap.set(img, {
            clipPath:
              itemIndex === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            scale: itemIndex === 0 ? 1 : 1.2,
          });
        }
      });

      trigger.dropdown_links.forEach((_, itemIndex) => {
        const arrow = arrowRefs.current[panelIndex]?.[itemIndex];
        if (arrow) {
          gsap.set(arrow, {
            x: itemIndex === 0 ? 0 : -8,
            rotation: itemIndex === 0 ? 0 : 90,
            opacity: itemIndex === 0 ? 1 : 0,
          });
        }
      });
    });

    chevronRefs.current.forEach((chevron) => {
      if (chevron) gsap.set(chevron, { rotation: 0 });
    });

    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });

    // Mobile panel
    resetMobileMenu();
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
    const navlink = dropdownTriggers[panelIndex];
    const isActive = navlink?.href === pathname;

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

    linkRefs.current[panelIndex]?.forEach((link) => {
      if (link) link.tabIndex = 0;
    });
  };

  // ============================================================
  // CLOSE DROPDOWN
  // ============================================================

  const closeDropdown = (panelIndex: number = openPanelIndex.current) => {
    if (panelIndex === -1) return;

    const dropdown = dropdownRefs.current[panelIndex];
    const chevron = chevronRefs.current[panelIndex];
    const pill = pillRefs.current[panelIndex];
    const navlink = dropdownTriggers[panelIndex];
    const isActive = navlink?.href === pathname;

    if (dropdown) {
      gsap.killTweensOf(dropdown);
      gsap.to(dropdown, {
        opacity: 0,
        pointerEvents: "none",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(dropdown, { y: 16 });
          dropdownTriggers[panelIndex]?.dropdown_links.forEach((_, i) => {
            const img = imgRefs.current[panelIndex]?.[i];
            if (img) {
              gsap.set(img, {
                clipPath:
                  i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                scale: i === 0 ? 1 : 1.2,
              });
            }
            const arrow = arrowRefs.current[panelIndex]?.[i];
            if (arrow) {
              gsap.set(arrow, {
                x: i === 0 ? 0 : -8,
                opacity: i === 0 ? 1 : 0,
              });
            }
          });
          activeImgIndex.current[panelIndex] = 0;
          activeLinkIndex.current[panelIndex] = 0;
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

    linkRefs.current[panelIndex]?.forEach((link) => {
      if (link) link.tabIndex = -1;
    });

    openPanelIndex.current = -1;
  };

  // ============================================================
  // LINK HOVER — image swap + arrow + label offset
  // ============================================================

  const handleLinkHover = (panelIndex: number, itemIndex: number) => {
    const prevIndex = activeLinkIndex.current[panelIndex];

    if (prevIndex !== itemIndex) {
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

    const prevImgIndex = activeImgIndex.current[panelIndex];
    if (prevImgIndex === itemIndex) return;

    const prevImg = imgRefs.current[panelIndex]?.[prevImgIndex];
    const newImg = imgRefs.current[panelIndex]?.[itemIndex];

    if (prevImg) {
      gsap.killTweensOf(prevImg);
      gsap.set(prevImg, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
      gsap.to(prevImg, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(prevImg, {
            clipPath: "inset(0% 0% 100% 0%)",
            scale: 1.2,
            opacity: 1,
          });
        },
      });
    }
    if (newImg) {
      gsap.killTweensOf(newImg);
      gsap.fromTo(
        newImg,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
      gsap.fromTo(
        newImg,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
    }

    activeImgIndex.current[panelIndex] = itemIndex;
  };

  const handleLinkLeave = (panelIndex: number, itemIndex: number) => {
    const currentArrow = arrowRefs.current[panelIndex]?.[itemIndex];
    const currentLink = linkRefs.current[panelIndex]?.[itemIndex];
    if (currentArrow) {
      gsap.killTweensOf(currentArrow);
      gsap.to(currentArrow, {
        x: -8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
    if (currentLink) {
      gsap.killTweensOf(currentLink);
      gsap.to(currentLink, {
        x: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  // ============================================================
  // PLAIN LINK PILL HOVER
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
  // MOBILE — HAMBURGER TOGGLE & HELPERS
  // ============================================================

  const closeMobileMenu = () => {
    const panel = mobilePanelRef.current;

    if (openAccordion.current !== -1) {
      closeAccordion(openAccordion.current);
    }

    isMobileOpen.current = false;

    // Close burger menu
    gsap.to(burgerTopRef.current, {
      position: "relative",
      rotate: 0,
      duration: 0.25,
      ease: "back.out(2)",
    });

    gsap.to(burgerBottomRef.current, {
      position: "relative",
      rotate: 0,
      duration: 0.25,
      ease: "back.out(2)",
    });

    if (panel) {
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

  const resetMobileMenu = () => {
    isMobileOpen.current = false;
    openAccordion.current = -1;

    // Reset burger icon instantly
    gsap.set(burgerTopRef.current, {
      position: "relative",
      rotate: 0,
    });

    gsap.set(burgerBottomRef.current, {
      position: "relative",
      rotate: 0,
    });

    // Reset mobile panel instantly
    if (mobilePanelRef.current) {
      gsap.set(mobilePanelRef.current, {
        opacity: 0,
        y: 16,
        pointerEvents: "none",
      });
    }

    // Reset accordions instantly
    accordionRefs.current.forEach((a) => {
      if (a) {
        gsap.set(a, {
          opacity: 0,
          height: 0,
        });
      }
    });

    // Reset accordion chevrons instantly
    mobileChevronRefs.current.forEach((c) => {
      if (c) {
        gsap.set(c, {
          rotation: 0,
        });
      }
    });
  };

  const toggleMobileMenu = () => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (!isMobileOpen.current) {
      isMobileOpen.current = true;

      // Hamburger Menu
      gsap.to(burgerTopRef.current, {
        position: "absolute",
        rotate: 45,
        duration: 0.3,
        ease: "back.out(2)",
      });
      gsap.to(burgerBottomRef.current, {
        position: "absolute",
        rotate: -45,
        duration: 0.3,
        ease: "back.out(2)",
      });

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
      closeMobileMenu();
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
          delay: 0.25,
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

    openAccordion.current = index;
    setMobPanelHeight(true);
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

  const closeAllAccordions = (index: number) => {
    closeAccordion(index);
    setMobPanelHeight(false);
  };

  const toggleAccordion = (index: number) => {
    openAccordion.current === index
      ? closeAllAccordions(index)
      : openAccordionPanel(index);
  };

  // ============================================================
  // NAV FOCUS - Helper function to re-focus to nav link
  // ============================================================
  const handleDropdownLinkkeyDown = (
    e: React.KeyboardEvent,
    panelIndex: number,
    itemIndex: number,
    totalItems: number,
  ) => {
    if (e.key === "Tab") {
      // 1. Shift + Tab on the first link -> Go back to the trigger
      if (e.shiftKey && itemIndex === 0) {
        e.preventDefault();
        // This focuses the "trigger" link in the main bar
        pillRefs.current[panelIndex]?.parentElement?.focus();
        closeDropdown(panelIndex);
      }

      // 2. Tab (no shift) on the LAST link -> Go to NEXT nav item
      else if (!e.shiftKey && itemIndex === totalItems - 1) {
        e.preventDefault();
        closeDropdown(panelIndex);

        // Calculate the next focusable item in the main nav list
        // We look for the parent of the trigger and find its next sibling
        const currentTrigger = pillRefs.current[panelIndex]?.parentElement;
        const nextTriggerContainer =
          currentTrigger?.parentElement?.nextElementSibling;
        const nextFocusable = nextTriggerContainer?.querySelector("a");

        if (nextFocusable) {
          (nextFocusable as HTMLElement).focus();
        } else {
          // Fallback: if no next link, go to CTA
          document.querySelector<HTMLElement>(".nav-cta-button")?.focus();
        }
      }
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 pointer-events-none z-40 opacity-0 hidden nav:block backdrop-blur-md"
      />

      {/* ── DESKTOP ─────────────────────────────────────── */}
      <div className="fixed top-nav-offset left-0 right-0 flex-col items-center z-50 hidden nav:flex">
        <div
          onMouseLeave={() => closeDropdown(openPanelIndex.current)}
          className="relative"
        >
          {/* Floating nav */}
          <div className="w-[95vw] navWide:w-[72vw] max-w-nav h-nav-height bg-nav-bg rounded-nav flex items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <LogoSvg width={32} height={32} />
              <span className="text-nav-text font-bold font-p-n-montreal text-nav-logo">
                Logo
              </span>
            </Link>

            <nav
              aria-label="Main navigation"
              className="flex items-center gap-nav-gap"
            >
              {nav_links.map((navlink, i) => {
                const dropdownIndex = dropdownTriggers.findIndex(
                  (d) => d.link_name === navlink.link_name,
                );
                const plainIndex = plainLinks.findIndex(
                  (l) => l.link_name === navlink.link_name,
                );
                return (
                  <div key={`${navlink.link_name}${i}`} className="relative">
                    {navlink.dropdown === true ? (
                      <Link
                        href={navlink.href}
                        className="relative z-0 flex items-center gap-1 px-nav-pill-x py-nav-pill-y font-p-n-montreal font-bold text-nav-label text-nav-text"
                        onMouseEnter={() => openDropdown(dropdownIndex)}
                        onFocus={() => openDropdown(dropdownIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            closeDropdown(dropdownIndex);
                          }

                          // Tab pressed on trigger - move into dropdown
                          if (e.key === "Tab" && !e.shiftKey) {
                            const firstLink =
                              linkRefs.current[dropdownIndex]?.[0];
                            if (firstLink) {
                              e.preventDefault(); // Stop browser's natural tab
                              firstLink.focus(); // manually focus first dropdown link
                            }
                          }
                        }}
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
            const half = Math.ceil(trigger.dropdown_links.length / 2);
            const colA = trigger.dropdown_links.slice(0, half);
            const colB = trigger.dropdown_links.slice(half);

            if (!imgRefs.current[panelIndex]) imgRefs.current[panelIndex] = [];
            if (!linkRefs.current[panelIndex])
              linkRefs.current[panelIndex] = [];
            if (!arrowRefs.current[panelIndex])
              arrowRefs.current[panelIndex] = [];

            return (
              <div
                id={`dropdown-panel-${panelIndex}`}
                role="menu"
                aria-label={trigger.link_name}
                key={trigger.link_name}
                ref={(el) => {
                  dropdownRefs.current[panelIndex] = el;
                }}
                className="absolute opacity-0 top-nav-height left-0 w-[95vw] navWide:w-[72vw] max-w-nav pt-dropdown-gap will-change-transform"
              >
                <div className="bg-nav-bg p-dropdown-pad rounded-dropdown h-93.75 flex overflow-hidden">
                  {/* Image column */}
                  <div className="w-image-col relative rounded-pill shrink-0 overflow-hidden">
                    <div className="absolute inset-0">
                      {trigger.dropdown_links.map((item, itemIndex) => (
                        <div
                          key={item.link_name}
                          ref={(el) => {
                            imgRefs.current[panelIndex][itemIndex] = el;
                          }}
                          className="absolute inset-0 will-change-transform"
                        >
                          <Image
                            src={item.image}
                            alt={item.link_name}
                            fill
                            sizes="(min-width: 1440px) 320px, (min-width: 1024px) 28vw, 40vw"
                            priority={panelIndex === 0 && itemIndex === 0}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ))}
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
                              key={item.link_name}
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
                          const totalItems = trigger.dropdown_links.length;

                          return (
                            <Link
                              key={item.link_name}
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

      {/* ── MOBILE ──────────────────────────────────────── */}
      <div className="fixed top-nav-offset left-0 right-0 flex flex-col items-center z-50 nav:hidden px-4">
        {/* Mobile bar */}
        <div className="w-full h-nav-height-mobile bg-nav-bg rounded-nav flex items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {/* <LogoSvg width={28} height={28} /> */}
            <span className="text-nav-text font-bold font-p-n-montreal text-xl">
              Logo
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-nav-cta"
            aria-label="Toggle navigation menu"
          >
            <div className="relative flex flex-col justify-center items-center gap-1.25 w-4.5">
              <span
                ref={burgerTopRef}
                className="block w-full h-[1.5px] bg-[#1C2B2B] will-change-transform"
              />
              <span
                ref={burgerBottomRef}
                className="block w-full h-[1.5px] bg-[#1C2B2B] will-change-transform"
              />
            </div>
          </button>
        </div>

        {/* Mobile panel */}
        <div
          ref={mobilePanelRef}
          style={
            mobPanelHeight === true
              ? {
                  height: "calc(100vh - 176px)",
                }
              : { height: "auto" }
          }
          className="relative w-full mt-2 bg-nav-bg rounded-nav will-change-transform opacity-0"
        >
          <div className="max-h-screen-nav overflow-y-scroll scrollbar-hide px-5 py-3">
            {nav_links.map((navlink, i) => {
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
                  className="border-b border-nav-text/20 last:border-0"
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
                            (dropdownData?.dropdown_links as DropdownItem[]) ??
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
                            (dropdownData?.dropdown_links as DropdownItem[]) ??
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
                      className="block py-3 text-nav-text font-helvetica-now font-semibold text-nav-mobile tracking-nav-tight"
                    >
                      {navlink.link_name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="absolute w-full h-nav-height-mobile flex items-center left-0 top-full mt-2 bg-nav-bg rounded-dropdown px-5 py-4">
            <Link
              href="/contact"
              className="flex items-center justify-between w-full"
            >
              <span className="text-nav-text font-helvetica-now font-semibold text-nav-mobile tracking-nav-tight">
                Contact us
              </span>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-nav-cta">
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none">
                  <path
                    d="M7 7H17M17 7V17M17 7L7 17"
                    stroke="#1C2B2B"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
