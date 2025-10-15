import { useProductStore } from "@/store/product-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect } from "react";
import ProductContainer from "../_components/product-container";

const AddProduct = ({ onClose }: { onClose: () => void }) => {
  const { fetchProduct } = useProductStore();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <ProductContainer />
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
