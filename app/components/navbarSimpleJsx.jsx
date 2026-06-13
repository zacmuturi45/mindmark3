"use client";

import { useRef, useState } from "react";
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
} from "../data/navDataSimple";
import "../css/index.css";

const NavbarSimpleJsx = () => {
  const pathname = usePathname();

  // ── Mobile refs ──────────────────────────────────────────
  const mobilePanelRef = useRef(null);
  const mobileRowRefs = useRef([]);
  const accordionRefs = useRef([]);
  const mobileChevronRefs = useRef([]);
  const [mobPanelHeight, setMobPanelHeight] = useState(false);

  // ── Mobile tracking refs ─────────────────────────────────
  const isMobileOpen = useRef(false);
  const openAccordion = useRef(-1);
  const burgerTopRef = useRef(null);
  const burgerBottomRef = useRef(null);

  // ── Desktop refs ─────────────────────────────────────────
  const overlayRef = useRef(null);
  const pillRefs = useRef([]);
  const plainPillRefs = useRef([]);
  const chevronRefs = useRef([]);
  const dropdownRefs = useRef([]);
  const linkRefs = useRef([]);
  const arrowRefs = useRef([]);
  const imgRefs = useRef([]);
  const imageLinkRefs = useRef([]);
  const captionRefs = useRef([]);
  const imgWrapperRefs = useRef([]);
  const roundButtonRefs = useRef([]);

  // ── Tracking refs ────────────────────────────────────────
  const openPanelIndex = useRef(-1);
  const activeLinkIndex = useRef([]);

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
      const links = trigger.dropdown_links;
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
    resetMobileMenu();
  }, [pathname]);

  // ============================================================
  // OPEN DROPDOWN
  // ============================================================

  const openDropdown = (panelIndex) => {
    if (openPanelIndex.current === panelIndex) return;
    if (openPanelIndex.current !== -1) closeDropdown(openPanelIndex.current);

    openPanelIndex.current = panelIndex;

    const dropdown = dropdownRefs.current[panelIndex];
    const chevron = chevronRefs.current[panelIndex];
    const pill = pillRefs.current[panelIndex];
    const img = imgRefs.current[panelIndex];
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

    linkRefs.current[panelIndex]?.forEach((link) => {
      if (link) link.tabIndex = 0;
    });
  };

  // ============================================================
  // CLOSE DROPDOWN
  // ============================================================

  const closeDropdown = (panelIndex = openPanelIndex.current) => {
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
          const links = dropdownTriggers[panelIndex]?.dropdown_links ?? [];
          linkRefs.current[panelIndex]?.forEach((link) => {
            if (link) link.tabIndex = -1;
          });
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

  const handleLinkHover = (panelIndex, itemIndex) => {
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

  const handleLinkLeave = (panelIndex, itemIndex) => {
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

  const handlePlainLinkEnter = (el) => {
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

  const handlePlainLinkLeave = (el, href) => {
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

  const handleImageEnter = (panelIndex) => {
    const img = imgRefs.current[panelIndex];
    const roundButton = roundButtonRefs.current[panelIndex];
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: 1.08,
      rotateZ: 2,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(roundButton, {
      scale: 1.1,
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  const handleImageLeave = (panelIndex) => {
    const img = imgRefs.current[panelIndex];
    const roundButton = roundButtonRefs.current[panelIndex];
    if (!img) return;
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(roundButton, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
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

    gsap.set(burgerTopRef.current, { position: "relative", rotate: 0 });
    gsap.set(burgerBottomRef.current, { position: "relative", rotate: 0 });

    if (mobilePanelRef.current) {
      gsap.set(mobilePanelRef.current, {
        opacity: 0,
        y: 16,
        pointerEvents: "none",
      });
    }

    accordionRefs.current.forEach((a) => {
      if (a) gsap.set(a, { opacity: 0, height: 0 });
    });
    mobileChevronRefs.current.forEach((c) => {
      if (c) gsap.set(c, { rotation: 0 });
    });
  };

  const toggleMobileMenu = () => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (!isMobileOpen.current) {
      isMobileOpen.current = true;

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

  const openAccordionPanel = (index) => {
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

  const closeAccordion = (index) => {
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

  const closeAllAccordions = (index) => {
    closeAccordion(index);
    setMobPanelHeight(false);
  };

  const toggleAccordion = (index) => {
    openAccordion.current === index
      ? closeAllAccordions(index)
      : openAccordionPanel(index);
  };
  // ============================================================
  // NAV FOCUS
  // ============================================================

  const handleDropdownLinkkeyDown = (e, panelIndex, itemIndex, totalItems) => {
    if (e.key === "Tab") {
      if (e.shiftKey && itemIndex === 0) {
        e.preventDefault();
        pillRefs.current[panelIndex]?.parentElement?.focus();
        closeDropdown(panelIndex);
      } else if (!e.shiftKey && itemIndex === totalItems - 1) {
        e.preventDefault();
        closeDropdown(panelIndex);

        const currentTrigger = pillRefs.current[panelIndex]?.parentElement;
        const nextTriggerContainer =
          currentTrigger?.parentElement?.nextElementSibling;
        const nextFocusable = nextTriggerContainer?.querySelector("a");

        if (nextFocusable) {
          nextFocusable.focus();
        } else {
          document.querySelector(".nav-cta-button")?.focus();
        }
      }
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* Overlay */}
      <div ref={overlayRef} className="nav-overlay" />

      {/* ── DESKTOP ── */}
      <div className="nav-desktop-wrapper">
        <div
          className="nav-float-container"
          onMouseLeave={() => closeDropdown(openPanelIndex.current)}
        >
          {/* Floating bar */}
          <div className="nav-bar">
            <Link href="/" className="nav-logo">
              <LogoSvg width={32} height={32} />
              <span className="nav-logo-text">Logo</span>
            </Link>

            <nav aria-label="Main navigation" className="nav-links">
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
                    className="nav-link-wrap"
                  >
                    {navlink.dropdown ? (
                      <Link
                        href={navlink.href}
                        className="nav-trigger"
                        onMouseEnter={() => openDropdown(dropdownIndex)}
                        onFocus={() => openDropdown(dropdownIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") closeDropdown(dropdownIndex);
                          if (e.key === "Tab" && !e.shiftKey) {
                            const imageLink =
                              imageLinkRefs.current[dropdownIndex];
                            if (imageLink) {
                              e.preventDefault();
                              openDropdown(dropdownIndex);
                              imageLink.focus();
                            }
                          }
                        }}
                      >
                        <div
                          ref={(el) => {
                            pillRefs.current[dropdownIndex] = el;
                          }}
                          className="nav-pill"
                        />
                        <span>{navlink.link_name}</span>
                        <div
                          ref={(el) => {
                            chevronRefs.current[dropdownIndex] = el;
                          }}
                          className="nav-chevron"
                        >
                          <Down_arrow width={12} height={12} />
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={navlink.href}
                        className="nav-plain-link"
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
                          className="nav-pill"
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
            const links = trigger.dropdown_links;
            const half = Math.ceil(links.length / 2);
            const colA = links.slice(0, half);
            const colB = links.slice(half);

            if (!linkRefs.current[panelIndex])
              linkRefs.current[panelIndex] = [];
            if (!arrowRefs.current[panelIndex])
              arrowRefs.current[panelIndex] = [];

            return (
              <div
                id={`dropdown-panel-${panelIndex}`}
                role="menu"
                aria-label={trigger.link_name}
                key={`simple-panel-${trigger.link_name}`}
                ref={(el) => {
                  dropdownRefs.current[panelIndex] = el;
                }}
                className="nav-dropdown"
              >
                <div className="nav-dropdown__inner">
                  {/* Image */}
                  <Link
                    ref={(el) => {
                      imageLinkRefs.current[panelIndex] = el;
                    }}
                    href={trigger.imageCaptionHref ?? trigger.href}
                    className="nav-img-link"
                    onMouseEnter={() => handleImageEnter(panelIndex)}
                    onMouseLeave={() => handleImageLeave(panelIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        pillRefs.current[panelIndex]?.parentElement?.focus();
                        closeDropdown(panelIndex);
                      } else if (e.key === "Tab" && !e.shiftKey) {
                        e.preventDefault();
                        linkRefs.current[panelIndex]?.[0]?.focus();
                      }
                    }}
                  >
                    <div
                      ref={(el) => {
                        imgRefs.current[panelIndex] = el;
                      }}
                      className="nav-img-wrap"
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

                    <div
                      ref={(el) => {
                        captionRefs.current[panelIndex] = el;
                      }}
                      className="nav-img-caption"
                    >
                      <div className="nav-caption-inner">
                        <span className="nav-caption-text">
                          {trigger.imageCaption ?? trigger.link_name}
                        </span>
                        <div
                          ref={(el) => {
                            roundButtonRefs.current[panelIndex] = el;
                          }}
                          className="nav-round-btn"
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
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z"
                                fill="#000000"
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Links */}
                  <div className="nav-links-col">
                    <div className="nav-links-grid">
                      <div className="nav-col">
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
                              className="nav-dropdown-link"
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
                                className="nav-arrow"
                              >
                                <ArrowRight width={12} height={12} />
                              </span>
                              <span>{item.link_name}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="nav-col">
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
                              className="nav-dropdown-link"
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
                                className="nav-arrow"
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

      {/* ── MOBILE ── */}
      <div className="nav-mobile-wrapper">
        {/* Mobile bar */}
        <div className="nav-bar-mobile">
          <Link href="/" className="nav-logo">
            <LogoSvg width={28} height={28} />
            <span className="nav-logo-text--mobile">Logo</span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="nav-burger"
            aria-label="Toggle navigation menu"
          >
            <div className="nav-burger-inner">
              <span ref={burgerTopRef} className="nav-burger-line" />
              <span ref={burgerBottomRef} className="nav-burger-line" />
            </div>
          </button>
        </div>

        {/* Mobile panel */}
        <div
          ref={mobilePanelRef}
          style={
            mobPanelHeight
              ? { height: "calc(100vh - 176px)" }
              : { height: "auto" }
          }
          className="nav-mobile-panel"
        >
          <div className="nav-mobile-inner">
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
                  className="nav-mobile-row"
                >
                  {isDropdown ? (
                    <>
                      <button
                        onClick={() => toggleAccordion(accordionIdx)}
                        className="nav-mobile-acc-trigger"
                      >
                        <span>{navlink.link_name}</span>
                        <span
                          ref={(el) => {
                            mobileChevronRefs.current[accordionIdx] = el;
                          }}
                          className="nav-mobile-chevron"
                        >
                          <Down_arrow width={14} height={14} />
                        </span>
                      </button>

                      <div className="nav-mobile-acc-overflow">
                        <div
                          ref={(el) => {
                            accordionRefs.current[accordionIdx] = el;
                          }}
                          className="nav-mobile-acc-body"
                        >
                          {getVisibleMobileLinks(
                            dropdownData?.dropdown_links ?? [],
                          ).map((item) => (
                            <Link
                              key={`mob-link-${item.link_name}`}
                              href={item.href}
                              className="nav-mobile-acc-link"
                            >
                              {item.link_name}
                            </Link>
                          ))}
                          {hasSeeAll(dropdownData?.dropdown_links ?? []) && (
                            <Link
                              href={navlink.href}
                              className="nav-mobile-see-all"
                            >
                              See All
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href={navlink.href} className="nav-mobile-plain-link">
                      {navlink.link_name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="nav-mobile-cta-bar">
            <Link href="/contact" className="nav-mobile-cta-link">
              <span className="nav-mobile-cta-text">Contact us</span>
              <div className="nav-mobile-cta-circle">
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

export default NavbarSimpleJsx;
