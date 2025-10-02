import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

const DataCard: React.FC<DataCardProps> = ({ label, value }) => {
  return (
    <Card className="w-full h-[150px] border-2 rounded-2xl flex flex-col justify-between">
      <CardHeader>{label}</CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
};

export default DataCard;
