import Link from "next/link";

type NavbarCardProps = {
  name: string;
  path: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
};

export default function NavbarCard({
  name,
  path,
  className = "",
  active = false,
  onClick,
}: NavbarCardProps) {
  const base =
    "flex items-center px-3 py-2 rounded-[0.3rem] transition-colors text-sm";
  const activeCls = "bg-primary text-primary-foreground font-semibold";
  const defaultCls = "hover:bg-muted";

  return (
    <Link
      href={path}
      onClick={onClick}
      className={`${base} ${active ? activeCls : defaultCls} ${className}`}
    >
      {name}
    </Link>
  );
}
