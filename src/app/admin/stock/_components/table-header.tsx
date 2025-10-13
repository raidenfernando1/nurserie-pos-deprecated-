import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <CardTitle>Total Stocked Products</CardTitle>
        <CardAction className="flex gap-3"></CardAction>
      </CardContent>
    </Card>
  );
};

export default Header;
