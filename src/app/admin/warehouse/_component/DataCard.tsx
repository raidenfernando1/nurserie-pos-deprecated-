import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

const DataCard: React.FC<DataCardProps> = ({ label, value }) => {
  return (
    <Card className="w-full border-2 rounded-2xl">
      <CardHeader>{label}</CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
};

export default DataCard;
