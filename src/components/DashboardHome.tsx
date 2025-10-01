import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardHome() {
  return (
    <Card className="text-center">
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
export default DashboardHome;
