import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  actions?: ReactNode;
}

const Header = ({ title = "Products", actions }: HeaderProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between min-h-[22px] max-h-[22px]">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {actions && <div className="flex gap-3">{actions}</div>}
      </CardContent>
    </Card>
  );
};

export default Header;
