import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardCard() {
  return (
    <Card className="text-center py-15">
      <CardHeader>
        <CardTitle>Welcome to Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Welcome back! Your dashboard is ready with the latest updates and
          insights to help you manage your business.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
export default DashboardCard;
