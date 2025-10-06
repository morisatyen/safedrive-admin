import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Code } from "lucide-react";
import { toast } from "sonner";

const dynamicVariables = [
  "{{USER_NAME}}",
  "{{REPORT_ID}}",
  "{{REPORT_LINK}}",
  "{{DATE}}",
  "{{LOCATION}}",
  "{{SEVERITY}}",
  "{{STATUS}}",
];

export default function EmailTemplates() {
  const [subject, setSubject] = useState("Accident Report Acknowledgment - {{REPORT_ID}}");
  const [content, setContent] = useState(
    `Dear {{USER_NAME}},

Thank you for submitting your accident report ({{REPORT_ID}}) through SafeDrive.

Report Details:
- Report ID: {{REPORT_ID}}
- Date & Time: {{DATE}}
- Location: {{LOCATION}}
- Severity Level: {{SEVERITY}}
- Current Status: {{STATUS}}

Your report has been received and is being reviewed by our team. You can track the progress of your report at any time by visiting:
{{REPORT_LINK}}

What happens next?
1. Our emergency response team will review your report
2. Appropriate services (Police, EMT, Fire, Wrecker) will be dispatched if needed
3. You will receive updates as your report progresses
4. Insurance claims can be filed directly through the portal

If you have any immediate concerns or questions, please don't hesitate to contact our support team.

Stay safe,
The SafeDrive Team

---
This is an automated message from SafeDrive Administrator Portal.
For support, please contact: support@safedrive.com`
  );

  const handleSave = () => {
    toast.success("Email template saved successfully!");
  };

  const insertVariable = (variable: string) => {
    setContent((prev) => prev + " " + variable);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground mt-1">
              Manage automated email templates with dynamic variables
            </p>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Template
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter email content..."
                  className="min-h-[500px] font-mono text-sm"
                />
              </div>

              <div className="rounded-lg border border-info/20 bg-info/5 p-4">
                <div className="flex items-start gap-2">
                  <Code className="h-5 w-5 text-info mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-info mb-1">Dynamic Variables</p>
                    <p className="text-xs text-muted-foreground">
                      Use the variables on the right to personalize your emails. They will be automatically replaced with actual data when emails are sent.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dynamic Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Click to insert a variable into your email template:
              </p>
              {dynamicVariables.map((variable) => (
                <button
                  key={variable}
                  onClick={() => insertVariable(variable)}
                  className="w-full text-left"
                >
                  <Badge
                    variant="outline"
                    className="w-full justify-start gap-2 px-3 py-2 cursor-pointer hover:bg-muted transition-colors font-mono text-xs"
                  >
                    <Code className="h-3 w-3" />
                    {variable}
                  </Badge>
                </button>
              ))}

              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="font-semibold text-sm">Variable Descriptions:</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><span className="font-mono text-foreground">USER_NAME</span> - Recipient's full name</p>
                  <p><span className="font-mono text-foreground">REPORT_ID</span> - Unique report identifier</p>
                  <p><span className="font-mono text-foreground">REPORT_LINK</span> - URL to view report</p>
                  <p><span className="font-mono text-foreground">DATE</span> - Report submission date</p>
                  <p><span className="font-mono text-foreground">LOCATION</span> - Accident location</p>
                  <p><span className="font-mono text-foreground">SEVERITY</span> - Severity level</p>
                  <p><span className="font-mono text-foreground">STATUS</span> - Current report status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
