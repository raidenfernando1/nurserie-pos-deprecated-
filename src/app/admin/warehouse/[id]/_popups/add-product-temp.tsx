import { useProductStore } from "@/store/product-store";

const AddProduct = ({
  onClose,
  warehouseID,
}: {
  onClose: () => void;
  warehouseID: string;
}) => {
  const { fetchProduct } = useProductStore();

  return (
    <h1>
      <button onClick={() => fetchProduct(warehouseID)}>test</button>
    </h1>
  );
};

export default AddProduct;
