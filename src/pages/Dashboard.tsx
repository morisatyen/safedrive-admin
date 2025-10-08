import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, TrendingUp, Clock, CheckCircle2, Smartphone, Shield, Ambulance, Flame, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const kpiData = [
  { title: "Total Reports", value: "4,521", icon: FileText, trend: "+12.5%", color: "text-secondary" },
  { title: "Active Users", value: "685", icon: Users, trend: "+8.2%", color: "text-info" },
  { title: "Severe Cases", value: "112", icon: AlertTriangle, trend: "-3.1%", color: "text-destructive" },
  { title: "Resolution Rate", value: "94.2%", icon: TrendingUp, trend: "+2.4%", color: "text-success" },
];

const recentActivities = [
  { id: 1, type: "report", message: "Report ID SD-4521 submitted by App User", time: "5 mins ago", icon: FileText },
  { id: 2, type: "user", message: "Police User John Doe Activated", time: "15 mins ago", icon: Users },
  { id: 3, type: "template", message: "Email Template 'Acknowledgment' Updated", time: "1 hour ago", icon: CheckCircle2 },
  { id: 4, type: "report", message: "High severity report SD-4520 requires attention", time: "2 hours ago", icon: AlertTriangle },
  { id: 5, type: "user", message: "EMT User Sarah Johnson registered", time: "3 hours ago", icon: Users },
  { id: 6, type: "report", message: "Report SD-4519 closed successfully", time: "4 hours ago", icon: CheckCircle2 },
];

const reportsByUserType = [
  { type: "App Users", count: 2150, icon: Smartphone, color: "bg-secondary" },
  { type: "Police", count: 892, icon: Shield, color: "bg-primary" },
  { type: "EMT", count: 654, icon: Ambulance, color: "bg-destructive" },
  { type: "Fire", count: 421, icon: Flame, color: "bg-warning" },
  { type: "Wrecker", count: 404, icon: Truck, color: "bg-accent" },
];

const reportsBySeverity = [
  { level: "Critical", count: 112, color: "bg-destructive", percentage: 2.5 },
  { level: "High", count: 678, color: "bg-warning", percentage: 15 },
  { level: "Medium", count: 1580, color: "bg-info", percentage: 35 },
  { level: "Low", count: 2151, color: "bg-success", percentage: 47.5 },
];

const reportsByStatus = [
  { status: "Pending Review", count: 324, color: "bg-warning" },
  { status: "In Progress", count: 892, color: "bg-info" },
  { status: "Resolved", count: 3305, color: "bg-success" },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <h3 className="text-3xl font-bold mt-2">{kpi.value}</h3>
                    <Badge variant="outline" className="mt-2">
                      {kpi.trend}
                    </Badge>
                  </div>
                  <div className={`rounded-full p-3 bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Reports by User Type */}
          <Card>
            <CardHeader>
              <CardTitle>Reports By User Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsByUserType.map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <span className="text-sm font-bold">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${(item.count / 4521) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reports by Severity */}
          <Card>
            <CardHeader>
              <CardTitle>Reports By Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsBySeverity.map((item) => (
                  <div key={item.level}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.level}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                        <span className="text-sm font-bold">{item.count}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reports by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Reports By Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsByStatus.map((item) => (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.status}</span>
                      <span className="text-sm font-bold">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${(item.count / 4521) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="rounded-full p-2 bg-muted">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
