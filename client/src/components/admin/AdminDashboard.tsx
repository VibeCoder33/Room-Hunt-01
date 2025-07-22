import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import User from "lucide-react/dist/esm/icons/user";
import Home from "lucide-react/dist/esm/icons/home";
import Handshake from "lucide-react/dist/esm/icons/handshake";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";
import UserCog from "lucide-react/dist/esm/icons/user-cog";
import Download from "lucide-react/dist/esm/icons/download";
import FileText from "lucide-react/dist/esm/icons/file-text";
import TriangleAlert from "lucide-react/dist/esm/icons/triangle-alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
interface Analytics {
  totalUsers: number;
  activeListings: number;
  successfulMatches: number;
}

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

interface AdminActivity {
  id: string;
  action: string;
  userType: string;
  time: string;
  status: string;
  userName: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();

  // Fetch analytics
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
    retry: false,
  });

  // Fetch users
  const { data: users = [] } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${type}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  // Mock recent activity data for demo (replace with actual API call)
  const recentActivity: AdminActivity[] = [
    {
      id: "1",
      action: "Profile Created",
      userType: "Room Seeker",
      time: "2 min ago",
      status: "Active",
      userName: "New User",
    },
    {
      id: "2",
      action: "Room Listed",
      userType: "Room Owner",
      time: "15 min ago",
      status: "Pending Review",
      userName: "Property Owner",
    },
    {
      id: "3",
      action: "Successful Match",
      userType: "Room Owner",
      time: "1 hour ago",
      status: "Completed",
      userName: "Room Owner",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Pending Review":
        return (
          <Badge className="bg-blue-100 text-blue-800">Pending Review</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-xl text-gray-600 mt-2">
          Comprehensive platform management and analytics
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics?.totalUsers || 0}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics?.activeListings || 0}
                </div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics?.successfulMatches || 0}
                </div>
                <div className="text-sm text-gray-600">Successful Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">₹45,670</div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium">Active Users</div>
                <div className="text-sm text-gray-600">
                  {users.length} users currently active
                </div>
              </div>
              <Button size="sm">View All</Button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium">KYC Pending</div>
                <div className="text-sm text-gray-600">
                  156 users awaiting verification
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Review
              </Button>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-medium">Reported Users</div>
                <div className="text-sm text-gray-600">
                  23 users flagged for review
                </div>
              </div>
              <Button variant="destructive" size="sm">
                <TriangleAlert className="w-4 h-4 mr-1" />
                Investigate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-secondary" />
              Data Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => handleExport("users")}>
              <FileText className="w-4 h-4 mr-2" />
              Export User Data (JSON)
            </Button>

            <Button
              className="w-full bg-secondary hover:bg-secondary/90"
              onClick={() => handleExport("listings")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Listings Data
            </Button>

            <Button
              className="w-full bg-accent hover:bg-accent/90"
              onClick={() => handleExport("profiles")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Analytics Report
            </Button>

            <Button
              className="w-full bg-gray-600 hover:bg-gray-700"
              onClick={() => handleExport("messages")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Message Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-medium">
                          {activity.userName[0]}
                        </span>
                      </div>
                      <span className="font-medium">{activity.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.userType}</TableCell>
                  <TableCell className="text-gray-500">
                    {activity.time}
                  </TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
