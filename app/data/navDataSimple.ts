// ============================================================
// navDataSimple.ts
// Used by NavbarSimple — one image per panel, not per link
// ============================================================

export interface SimplePanelLink {
  link_name: string;
  href: string;
}

export interface SimpleNavLink {
  id: number;
  link_name: string;
  href: string;
  dropdown: boolean;
  image?: string; // panel level — only on dropdown links
  imageCaption?: string;
  imageCaptionHref?: string;
  dropdown_links: SimplePanelLink[] | boolean;
}

const methodologyLinks: SimplePanelLink[] = [
  { link_name: "Online Bulletins", href: "/methodology/bulletins" },
  { link_name: "Methodology", href: "/methodology/overview" },
  { link_name: "Hashed Maps", href: "/methodology/maps" },
  { link_name: "Tried & Tested", href: "/methodology/tested" },
  { link_name: "Customized Briefs", href: "/methodology/briefs" },
  { link_name: "Creative Insights", href: "/methodology/insights" },
  { link_name: "New Articles", href: "/methodology/articles" },
  { link_name: "One-offs", href: "/methodology/oneoffs" },
  { link_name: "White Boards", href: "/methodology/whiteboards" },
];

const criteriaLinks: SimplePanelLink[] = [
  { link_name: "Brand Criteria", href: "/criteria/brand" },
  { link_name: "Design Standards", href: "/criteria/design" },
  { link_name: "Content Rules", href: "/criteria/content" },
  { link_name: "Accessibility", href: "/criteria/accessibility" },
  { link_name: "Performance", href: "/criteria/performance" },
  { link_name: "Motion Language", href: "/criteria/motion" },
  { link_name: "Typography", href: "/criteria/typography" },
  { link_name: "Color System", href: "/criteria/color" },
  { link_name: "Spacing", href: "/criteria/spacing" },
];

export const nav_links_simple: SimpleNavLink[] = [
  {
    id: 1,
    link_name: "Overview",
    href: "/overview",
    dropdown: false,
    dropdown_links: false,
  },
  {
    id: 2,
    link_name: "Systems",
    href: "/systems",
    dropdown: true,
    image: "/assets/nav2/pix1.webp",
    imageCaption: "Systems",
    imageCaptionHref: "/methodology",
    dropdown_links: methodologyLinks,
  },
  {
    id: 3,
    link_name: "Framework",
    href: "/framework",
    dropdown: true,
    image: "/assets/nav2/pix2.webp",
    imageCaption: "Framework",
    imageCaptionHref: "/criteria",
    dropdown_links: criteriaLinks,
  },
  {
    id: 4,
    link_name: "Process",
    href: "/process",
    dropdown: false,
    dropdown_links: false,
  },
  {
    id: 4,
    link_name: "Archive",
    href: "/archive",
    dropdown: false,
    dropdown_links: false,
  },
];

// ── Helpers ──────────────────────────────────────────────────

// Mobile: show first 5 links then "See All"
export const MOBILE_LINK_LIMIT = 5;

export const getVisibleMobileLinks = (
  links: SimplePanelLink[],
): SimplePanelLink[] => links.slice(0, MOBILE_LINK_LIMIT);

export const hasSeeAll = (links: SimplePanelLink[]): boolean =>
  links.length > MOBILE_LINK_LIMIT;
