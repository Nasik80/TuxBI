import type { ReactElement, SVGProps } from "react";

export type IconName =
  | "add"
  | "arrowLeft"
  | "arrowRight"
  | "chevronDown"
  | "data"
  | "folder"
  | "home"
  | "model"
  | "moon"
  | "report"
  | "save"
  | "settings"
  | "sun";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, ReactElement> = {
  add: <path d="M12 5v14M5 12h14" />,
  arrowLeft: <path d="m14.5 5-7 7 7 7M8 12h9" />,
  arrowRight: <path d="m9.5 5 7 7-7 7M16 12H7" />,
  chevronDown: <path d="m7 10 5 5 5-5" />,
  data: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v6C5 13 8.1 14 12 14s7-1 7-2.5v-6M5 11.5v6C5 19 8.1 20 12 20s7-1 7-2.5v-6" />
    </>
  ),
  folder: (
    <path d="M3.5 6.5h6l1.7 2H20a.5.5 0 0 1 .5.5v9.5a.5.5 0 0 1-.5.5h-16a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5Z" />
  ),
  home: (
    <path d="m4 10 8-6 8 6v9.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V10Zm5 10v-6h6v6" />
  ),
  model: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="7" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="m8.2 7.1 7.5-.5M7.5 8l3.2 7.5M16.8 9.2l-3.4 6.2" />
    </>
  ),
  moon: <path d="M20.1 15.4A8 8 0 0 1 8.6 3.9 8.1 8.1 0 1 0 20.1 15.4Z" />,
  report: (
    <>
      <path d="M5 20V4h14v16H5Z" />
      <path d="M8 16v-2M12 16V9M16 16v-5" />
    </>
  ),
  save: (
    <path d="M5 3.5h11l3 3V20a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 5 20V3.5ZM8 3.5v5h7v-5M8 20.5v-7h8v7" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.5 2.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-3.6v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.5-2.5.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3.7v-3.6h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.5-2.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h3.6v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.5 2.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
};

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
