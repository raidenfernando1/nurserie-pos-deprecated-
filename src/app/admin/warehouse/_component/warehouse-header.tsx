"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface WarehouseHeaderProps {
  title?: string;
  showActions?: boolean;
  showAdmin?: boolean;
  onEditProduct?: () => void;
  onDeleteProduct?: () => void;
  onAddProduct?: () => void;
  onMoveProduct?: () => void;
  onDeleteWarehouseProduct?: () => void;
  onAddExistingProduct: () => void;
  companyTotalStock?: number;
  companyTotalProducts?: number;
}

const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({
  title = "Total Warehouse",
  showActions = true,
  showAdmin = false,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  onMoveProduct,
  onAddExistingProduct,
  companyTotalStock = 0,
  companyTotalProducts = 0,
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
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={onAddProduct}
              >
                Add Product
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-200 text-green-700"
                onClick={onMoveProduct}
              >
                Move Product
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-200 text-green-700"
                onClick={onAddExistingProduct}
              >
                Add Existing Product
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-200 text-red-700"
                onClick={onDeleteProduct}
              >
                Remove Product
              </Button>
            </div>
          )}

          {showAdmin && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-200 text-blue-700"
                onClick={onEditProduct}
              >
                Edit Product
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={onDeleteProduct}
              >
                Delete Product
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseHeader;
