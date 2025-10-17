import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import {
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Edit3,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";

async function getModerationStats() {
  try {
    // Check if we have a database connection
    await prisma.$connect();

    const [
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      pendingReports,
      resolvedReports,
      pendingSuggestions,
      implementedSuggestions,
      totalUsers,
    ] = await Promise.all([
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.submission.count({ where: { status: "APPROVED" } }),
      prisma.submission.count({ where: { status: "REJECTED" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "RESOLVED" } }),
      prisma.suggestion.count({ where: { status: "PENDING" } }),
      prisma.suggestion.count({ where: { status: "IMPLEMENTED" } }),
      prisma.user.count(),
    ]);

    return {
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      pendingReports,
      resolvedReports,
      pendingSuggestions,
      implementedSuggestions,
      totalUsers,
    };
  } catch (error) {
    console.error("Error fetching moderation stats:", error);
    return {
      pendingSubmissions: 0,
      approvedSubmissions: 0,
      rejectedSubmissions: 0,
      pendingReports: 0,
      resolvedReports: 0,
      pendingSuggestions: 0,
      implementedSuggestions: 0,
      totalUsers: 0,
    };
  }
}

export async function ModerationStats() {
  const stats = await getModerationStats();

  const statCards = [
    {
      title: "Pending Submissions",
      value: stats.pendingSubmissions,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      title: "Approved Submissions",
      value: stats.approvedSubmissions,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Rejected Submissions",
      value: stats.rejectedSubmissions,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "Resolved Reports",
      value: stats.resolvedReports,
      icon: Flag,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Pending Suggestions",
      value: stats.pendingSuggestions,
      icon: Edit3,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Implemented Suggestions",
      value: stats.implementedSuggestions,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
