import { Link } from "@heroui/link";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  isSidebarOpen: boolean;
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarLink({
  isSidebarOpen,
  href,
  icon: Icon,
  label,
}: SidebarLinkProps) {
  return (
    <Link
      className={clsx(
        "px-2 py-2 rounded-md transition-colors duration-300 cursor-pointer flex items-center gap-3",
        "text-sm font-medium",
        "hover:bg-primary hover:text-primary-foreground",
        !isSidebarOpen && "justify-center transition-colors duration-300",
      )}
      color="foreground"
      href={href}
    >
      <Icon className="size-4 shrink-0" />
      {isSidebarOpen && (
        <span className=" whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
    </Link>
  );
}
