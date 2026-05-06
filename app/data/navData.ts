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
  { link_name: "Online Bulletins", href: "/", image: "/assets/nav/pex1.webp" },
  { link_name: "Methodology", href: "/", image: "/assets/nav/pex2.webp" },
  { link_name: "Hashed Maps", href: "/", image: "/assets/nav/pex3.webp" },
  { link_name: "Tried & Tested", href: "/", image: "/assets/nav/pex4.webp" },
  { link_name: "Customized Briefs", href: "/", image: "/assets/nav/pex5.webp" },
  { link_name: "Creative Insights", href: "/", image: "/assets/nav/pex6.webp" },
  { link_name: "New Articles", href: "/", image: "/assets/nav/pex7.webp" },
  { link_name: "One-offs", href: "/", image: "/assets/nav/pex8.webp" },
  { link_name: "White Boards", href: "/", image: "/assets/nav/pex9.webp" },
];

const criteriaDropdown: DropdownItem[] = [
  {
    link_name: "Performance Metrics",
    href: "/",
    image: "/assets/nav/pex5.webp",
  },
  { link_name: "User Behavior", href: "/", image: "/assets/nav/pex1.webp" },
  {
    link_name: "Engagement Signals",
    href: "/",
    image: "/assets/nav/pex9.webp",
  },
  { link_name: "Data Benchmarks", href: "/", image: "/assets/nav/pex3.webp" },
  {
    link_name: "Conversion Drivers",
    href: "/",
    image: "/assets/nav/pex7.webp",
  },
  {
    link_name: "Quality Indicators",
    href: "/",
    image: "/assets/nav/pex2.webp",
  },
  { link_name: "Trend Analysis", href: "/", image: "/assets/nav/pex8.webp" },
  { link_name: "Scoring Models", href: "/", image: "/assets/nav/pex6.webp" },
  { link_name: "Evaluation Matrix", href: "/", image: "/assets/nav/pex4.webp" },
];

export const nav_links: NavLink[] = [
  {
    link_name: "Services",
    dropdown: false,
    href: "/services",
    dropdown_links: [],
  },
  {
    link_name: "Methodology",
    dropdown: true,
    href: "/methodology",
    dropdown_links: methodologyDropdown,
  },
  {
    link_name: "Criteria",
    dropdown: true,
    href: "/criteria",
    dropdown_links: criteriaDropdown,
  },
  {
    link_name: "Explorations",
    dropdown: false,
    href: "/explorations",
    dropdown_links: [],
  },
];
