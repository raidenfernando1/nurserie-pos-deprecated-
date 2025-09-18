import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const WarehouseCard = ({
  id,
  name,
  stock,
}: {
  id: string;
  name: string;
  stock: number;
}) => {
  return (
    <Link className=" w-full" href={`/admin/warehouse/${id}`}>
      <Card className="rounded-2xl hover:shadow-lg transition-shadow duration-200 w-full">
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <p className="text-sm text-muted-foreground">
            Stock: <span className="font-semibold">{stock}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default WarehouseCard;
