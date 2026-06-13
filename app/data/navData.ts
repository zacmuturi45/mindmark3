// app/data/navData.ts

export interface DropdownItem {
  link_name: string;
  href: string;
  image: string; // path to image in /public/assets/
}

export interface NavLink {
  link_name: string;
  href: string;
  dropdown: boolean;
  dropdown_links: DropdownItem[];
}

const methodologyDropdown: DropdownItem[] = [
  { link_name: "Online Bulletins", href: "/", image: "/assets/nav2/pix1.webp" },
  { link_name: "Methodology", href: "/", image: "/assets/nav2/pix2.webp" },
  { link_name: "Hashed Maps", href: "/", image: "/assets/nav2/pix3.webp" },
  { link_name: "Tried & Tested", href: "/", image: "/assets/nav2/pix4.webp" },
  {
    link_name: "Customized Briefs",
    href: "/",
    image: "/assets/nav2/pix5.webp",
  },
  {
    link_name: "Creative Insights",
    href: "/",
    image: "/assets/nav2/pix6.webp",
  },
  { link_name: "New Articles", href: "/", image: "/assets/nav2/pix7.webp" },
  { link_name: "One-offs", href: "/", image: "/assets/nav2/pix8.webp" },
  { link_name: "White Boards", href: "/", image: "/assets/nav2/pix9.webp" },
];

const criteriaDropdown: DropdownItem[] = [
  {
    link_name: "Performance Metrics",
    href: "/",
    image: "/assets/nav2/pix5.webp",
  },
  { link_name: "User Behavior", href: "/", image: "/assets/nav2/pix1.webp" },
  {
    link_name: "Engagement Signals",
    href: "/",
    image: "/assets/nav2/pix9.webp",
  },
  { link_name: "Data Benchmarks", href: "/", image: "/assets/nav2/pix3.webp" },
  {
    link_name: "Conversion Drivers",
    href: "/",
    image: "/assets/nav2/pix7.webp",
  },
  {
    link_name: "Quality Indicators",
    href: "/",
    image: "/assets/nav2/pix2.webp",
  },
  { link_name: "Trend Analysis", href: "/", image: "/assets/nav2/pix8.webp" },
  { link_name: "Scoring Models", href: "/", image: "/assets/nav2/pix6.webp" },
  {
    link_name: "Evaluation Matrix",
    href: "/",
    image: "/assets/nav2/pix4.webp",
  },
];

export const nav_links: NavLink[] = [
  {
    link_name: "Overview",
    dropdown: false,
    href: "/services",
    dropdown_links: [],
  },
  {
    link_name: "Systems",
    dropdown: true,
    href: "/methodology",
    dropdown_links: methodologyDropdown,
  },
  {
    link_name: "Framework",
    dropdown: true,
    href: "/criteria",
    dropdown_links: criteriaDropdown,
  },
  {
    link_name: "Process",
    dropdown: false,
    href: "/process",
    dropdown_links: [],
  },
  {
    link_name: "Archive",
    dropdown: false,
    href: "/archive",
    dropdown_links: [],
  },
];

// ── Helpers ──────────────────────────────────────────────────

// Mobile: show first 5 links then "See All"
export const MOBILE_LINK_LIMIT = 5;

export const getVisibleMobileLinks = (links: DropdownItem[]): DropdownItem[] =>
  links.slice(0, MOBILE_LINK_LIMIT);

export const hasSeeAll = (links: DropdownItem[]): boolean =>
  links.length > MOBILE_LINK_LIMIT;
