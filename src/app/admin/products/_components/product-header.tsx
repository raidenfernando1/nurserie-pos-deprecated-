import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  actions?: ReactNode;
}

const Header = ({ title = "Products", actions }: HeaderProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <CardAction className="flex gap-3">{actions}</CardAction>
      </CardContent>
    </Card>
  );
};

export default Header;
