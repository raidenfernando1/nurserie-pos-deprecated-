// app/components/options.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

export function NavSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full">Settings</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="theme-select" className="min-w-[60px]">
                Theme
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
