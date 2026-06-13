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
  dropdown_links: SimplePanelLink[];
}

const methodologyLinks: SimplePanelLink[] = [
  { link_name: "Online Bulletins", href: "/systems/bulletins" },
  { link_name: "Methodology", href: "/systems/overview" },
  { link_name: "Hashed Maps", href: "/systems/maps" },
  { link_name: "Tried & Tested", href: "/systems/tested" },
  { link_name: "Customized Briefs", href: "/systems/briefs" },
  { link_name: "Creative Insights", href: "/systems/insights" },
  { link_name: "New Articles", href: "/systems/articles" },
  { link_name: "One-offs", href: "/systems/oneoffs" },
  { link_name: "White Boards", href: "/systems/whiteboards" },
];

const criteriaLinks: SimplePanelLink[] = [
  { link_name: "Brand Criteria", href: "/framework/brand" },
  { link_name: "Design Standards", href: "/framework/design" },
  { link_name: "Content Rules", href: "/framework/content" },
  { link_name: "Accessibility", href: "/framework/accessibility" },
  { link_name: "Performance", href: "/framework/performance" },
  { link_name: "Motion Language", href: "/framework/motion" },
  { link_name: "Typography", href: "/framework/typography" },
  { link_name: "Color System", href: "/framework/color" },
  { link_name: "Spacing", href: "/framework/spacing" },
];

export const nav_links_simple: SimpleNavLink[] = [
  {
    id: 1,
    link_name: "Overview",
    href: "/overview",
    dropdown: false,
    dropdown_links: [],
  },
  {
    id: 2,
    link_name: "Systems",
    href: "/systems",
    dropdown: true,
    image: "/assets/nav2/pix1.webp",
    imageCaption: "Systems",
    imageCaptionHref: "/systems",
    dropdown_links: methodologyLinks,
  },
  {
    id: 3,
    link_name: "Framework",
    href: "/framework",
    dropdown: true,
    image: "/assets/nav2/pix2.webp",
    imageCaption: "Framework",
    imageCaptionHref: "/framework",
    dropdown_links: criteriaLinks,
  },
  {
    id: 4,
    link_name: "Process",
    href: "/process",
    dropdown: false,
    dropdown_links: [],
  },
  {
    id: 5,
    link_name: "Archive",
    href: "/archive",
    dropdown: false,
    dropdown_links: [],
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
