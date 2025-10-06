import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import useProductsPopups from "../_store/products-popups";

const Header = () => {
  const { togglePopup } = useProductsPopups();

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <CardTitle>Products</CardTitle>
        <CardAction className="flex gap-3">
          <Button variant="outline" onClick={() => togglePopup("add")}>
            <Plus />
          </Button>
          <Button variant="outline" onClick={() => togglePopup("delete")}>
            <Trash />
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
};

export default Header;
