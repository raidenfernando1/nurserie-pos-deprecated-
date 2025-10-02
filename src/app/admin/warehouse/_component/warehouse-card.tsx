import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { WarehouseCard } from "@/types/warehouse";

const WarehouseCard = ({ id, name }: WarehouseCard) => {
  return (
    <Link href={`/admin/warehouse/${id}`}>
      <Card className="h-full p-8 border-2 rounded-2xl hover:shadow-lg transition-shadow duration-200 w-full">
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default WarehouseCard;
