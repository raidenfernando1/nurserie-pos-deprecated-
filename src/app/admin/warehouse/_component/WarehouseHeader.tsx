"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useWarehouseStore from "@/store/useWarehouse";

export interface WarehouseHeaderProps {
  title?: string;
  showActions?: boolean;
  showAdmin?: boolean;
  onEditProduct?: () => void;
  onDeleteProduct?: () => void;
  onAddProduct?: () => void;
  companyTotalStock: number;
  companyTotalProducts: number;
}

const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({
  title = "Total Warehouse",
  showActions = true,
  showAdmin = false,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  companyTotalStock,
  companyTotalProducts,
}) => {
  return (
    <Card className="shadow-sm py-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Warehouse Info */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">
                  Stock:{" "}
                  <span className="font-semibold">{companyTotalStock}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">
                  Products:{" "}
                  <span className="font-semibold">{companyTotalProducts}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={onDeleteProduct}
              >
                Delete Product
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={onAddProduct}
              >
                Add Product
              </Button>
            </div>
          )}

          {showAdmin && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={onEditProduct}
              >
                Edit Product
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseHeader;
