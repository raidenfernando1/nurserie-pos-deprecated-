"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePopup } from "../_store/usePopup";

export interface ClientHeaderProps {
  title?: string;
  showActions?: boolean;
  showConsignmentsAction?: boolean;
  onAddClient?: () => void;
  onDeleteClient?: () => void;
  onEditClient?: () => void;
  totalClients?: number;
}

const Header: React.FC<ClientHeaderProps> = ({
  title = "Clients",
  showActions = true,
  showConsignmentsAction = false,
  onAddClient,
  onDeleteClient,
  onEditClient,
  totalClients,
}) => {
  const { togglePopup } = usePopup();

  return (
    <Card className="shadow-sm py-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Client Info */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">
                  Total: <span className="font-semibold">{totalClients}</span>
                </span>
              </div>
            </div>
          </div>
          {showConsignmentsAction && (
            <div className="flex items-center gap-3"></div>
          )}

          {/* Right side - Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={() => {
                  togglePopup("add");
                }}
              >
                Add Client
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={onEditClient}
              >
                Edit Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={onDeleteClient}
              >
                Delete Client
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
