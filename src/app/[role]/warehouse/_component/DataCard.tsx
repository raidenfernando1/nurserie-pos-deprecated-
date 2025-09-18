import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DataCardProps {
  label: string;
  value: number;
}

const DataCard: React.FC<DataCardProps> = ({ label, value }) => {
  return (
    <Card className="rounded-2xl">
      <CardHeader>{label}</CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
};

export default DataCard;
