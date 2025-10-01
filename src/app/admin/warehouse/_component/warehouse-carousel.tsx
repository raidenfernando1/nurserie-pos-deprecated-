import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Warehouse } from "@/types/warehouse";
import WarehouseCard from "./warehouse-card";

const WarehouseCarousel = ({ warehouses }: { warehouses: Warehouse[] }) => {
  return (
    <Carousel className="h-full">
      <CarouselContent className="h-full">
        {warehouses.map((w) => (
          <CarouselItem key={w.warehouse_id}>
            <div className="h-full">
              <WarehouseCard id={w.warehouse_id} name={w.warehouse_name} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10
               h-8 w-8 rounded-full
               bg-black/70 text-white
               flex items-center justify-center
               shadow-md
               transition hover:bg-black/90"
      />
      <CarouselNext
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10
               h-8 w-8 rounded-full
               bg-black/70 text-white
               flex items-center justify-center
               shadow-md
               transition hover:bg-black/90"
      />
    </Carousel>
  );
};

export default WarehouseCarousel;
