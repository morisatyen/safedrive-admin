import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, AlertTriangle, Clock, CheckCircle2, FileText } from "lucide-react";

const reportUpdates = [
  {
    id: 1,
    time: "1:15 PM",
    user: "App User",
    userType: "Reporter",
    message: "Initial accident report submitted with photos and location data",
    icon: FileText,
  },
  {
    id: 2,
    time: "1:22 PM",
    user: "Officer John Doe",
    userType: "Police",
    message: "Police arrived on scene. Securing the area and assessing situation",
    icon: User,
  },
  {
    id: 3,
    time: "1:30 PM",
    user: "EMT Emily Davis",
    userType: "EMT",
    message: "EMT report submitted. 2 minor injuries, transported to City Hospital",
    icon: CheckCircle2,
  },
  {
    id: 4,
    time: "2:00 PM",
    user: "Mark Thompson",
    userType: "Wrecker",
    message: "Wrecker dispatched to remove damaged vehicles from scene",
    icon: CheckCircle2,
  },
  {
    id: 5,
    time: "2:45 PM",
    user: "Rachel Green",
    userType: "Insurance",
    message: "Insurance claim initiated - Claim #INS-2025-0142",
    icon: CheckCircle2,
  },
  {
    id: 6,
    time: "4:30 PM",
    user: "Officer John Doe",
    userType: "Police",
    message: "Scene cleared. Final police report filed",
    icon: CheckCircle2,
  },
];

export default function ReportDetail() {
  const { id } = useParams();

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Report Details</h1>
            <p className="text-muted-foreground mt-1">Report ID: {id}</p>
          </div>
          <Badge className="bg-destructive text-destructive-foreground text-lg px-4 py-2">
            Critical
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Accident Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                    <p className="text-base font-semibold mt-1">January 15, 2025 - 1:15 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-secondary/10">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base font-semibold mt-1">I-95 Exit 42, Northbound</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-accent/10">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
                    <p className="text-base font-semibold mt-1">App User - Alex Johnson</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-info/10">
                    <AlertTriangle className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                    <Badge variant="outline" className="mt-1 bg-info text-info-foreground">
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Multi-vehicle collision involving 3 cars on I-95 Northbound near Exit 42. Heavy traffic conditions at the time. 
                  Emergency services were immediately contacted. Two individuals sustained minor injuries and were transported to 
                  City Hospital for evaluation. The left two lanes were blocked, causing significant traffic delays. 
                  Scene was secured by local police and vehicles were removed by authorized wrecker service.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Involved Parties</h3>
                <div className="grid gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Vehicle 1: 2022 Honda Civic</p>
                    <p className="text-sm text-muted-foreground">Driver: John Smith - Minor injuries</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Vehicle 2: 2023 Toyota Camry</p>
                    <p className="text-sm text-muted-foreground">Driver: Sarah Johnson - No injuries</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Vehicle 3: 2021 Ford F-150</p>
                    <p className="text-sm text-muted-foreground">Driver: Mike Wilson - Minor injuries</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Report Updates Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reportUpdates.map((update, index) => (
                  <div key={update.id} className="relative">
                    {index !== reportUpdates.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                    )}
                    <div className="flex gap-3">
                      <div className="rounded-full p-2 bg-primary/10 h-fit">
                        <update.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold">{update.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {update.userType}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{update.user}</p>
                        <p className="text-sm text-muted-foreground">{update.message}</p>
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
