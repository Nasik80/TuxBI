import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  shortcut?: string;
}

export function ToolbarButton({
  icon,
  label,
  shortcut,
  ...buttonProps
}: ToolbarButtonProps) {
  const title = shortcut ? `${label} (${shortcut})` : label;

  return (
    <button
      className="toolbar-button"
      title={title}
      type="button"
      {...buttonProps}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
