import ProductContainer from "./ProductContainer";

export default function WarehousePage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <ProductContainer warehouseID={Number(id)} />
    </div>
  );
}
