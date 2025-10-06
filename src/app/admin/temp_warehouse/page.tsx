import ReusableTable from "@/components/reusable-table";
import type { Product } from "@/types/product";
import { columns } from "./_component/table-column";
import Header from "./_component/table-header";

const TABLE_DUMMY_DATA: Product[] = [
  {
    id: 1,
    name: "Vape Pen X100",
    price: 1200,
    brand: "VaporTech",
    category: "Electronics",
    sku: "VPX100",
    barcode: "1234567890123",
    stock: 15,
    stock_threshold: 5,
    warehouse_name: "Main Warehouse",
    image_url: null,
  },
  {
    id: 2,
    name: "E-Liquid Strawberry",
    price: 350,
    brand: "JuicyVape",
    category: "E-Liquids",
    sku: "ELS-STR",
    barcode: "2345678901234",
    stock: 3,
    stock_threshold: 10,
    warehouse_name: "Secondary Warehouse",
    image_url: null,
  },
  {
    id: 3,
    name: "Vape Charger",
    price: 450,
    brand: "VaporTech",
    category: "Accessories",
    sku: "CHG-01",
    barcode: "3456789012345",
    stock: 8,
    stock_threshold: 5,
    warehouse_name: "Main Warehouse",
    image_url: null,
  },
  {
    id: 4,
    name: "Nicotine Pouches",
    price: 200,
    brand: "NicotinePro",
    category: "Consumables",
    sku: "NP-50",
    barcode: "4567890123456",
    stock: 0,
    stock_threshold: 5,
    warehouse_name: "Secondary Warehouse",
    image_url: null,
  },
  {
    id: 5,
    name: "Vape Starter Kit",
    price: 2500,
    brand: "VaporTech",
    category: "Electronics",
    sku: "VSK-2025",
    barcode: "5678901234567",
    stock: 12,
    stock_threshold: 10,
    warehouse_name: "Main Warehouse",
    image_url: null,
  },
];

const Warehouse = () => {
  return (
    <div className="h-screen flex flex-col p-4 gap-3">
      <Header />
      <ReusableTable data={TABLE_DUMMY_DATA} columns={columns} />
    </div>
  );
};

export default Warehouse;
