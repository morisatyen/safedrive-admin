import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, FileText } from "lucide-react";

const dummyReports = [
  {
    id: "SD-9876",
    date: "2025-01-15 14:30",
    location: "I-95 Exit 42, Northbound",
    severity: "Critical",
    status: "In Progress",
    submittedBy: "App User",
  },
  {
    id: "SD-9875",
    date: "2025-01-15 12:15",
    location: "Main St & 5th Ave",
    severity: "High",
    status: "Pending EMT",
    submittedBy: "Police Officer",
  },
  {
    id: "SD-9874",
    date: "2025-01-15 09:45",
    location: "Highway 101, Mile Marker 23",
    severity: "Medium",
    status: "Resolved",
    submittedBy: "App User",
  },
  {
    id: "SD-9873",
    date: "2025-01-14 18:20",
    location: "Oak Street Parking Lot",
    severity: "Low",
    status: "Resolved",
    submittedBy: "Fire Department",
  },
  {
    id: "SD-9872",
    date: "2025-01-14 16:00",
    location: "Route 50 & Commerce Blvd",
    severity: "High",
    status: "In Progress",
    submittedBy: "App User",
  },
  {
    id: "SD-9871",
    date: "2025-01-14 11:30",
    location: "Downtown Bridge",
    severity: "Critical",
    status: "Pending Wrecker",
    submittedBy: "Police Officer",
  },
  {
    id: "SD-9870",
    date: "2025-01-13 20:45",
    location: "Industrial Park Entrance",
    severity: "Medium",
    status: "Resolved",
    submittedBy: "EMT",
  },
];

export default function ReportsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = dummyReports.filter(
    (report) =>
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.severity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-destructive text-destructive-foreground";
      case "High":
        return "bg-warning text-warning-foreground";
      case "Medium":
        return "bg-info text-info-foreground";
      case "Low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Resolved")) return "bg-success text-success-foreground";
    if (status.includes("Pending")) return "bg-warning text-warning-foreground";
    return "bg-info text-info-foreground";
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Accident Reports</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell>
                        <Badge className={`${getSeverityColor(report.severity)} font-semibold`}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.submittedBy}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
