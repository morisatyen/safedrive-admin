import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AddTemplate() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    subject: "",
    description: "",
    body: "",
  });

  const handleSave = () => {
    if (!template.name || !template.subject || !template.body) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Template created successfully!");
    navigate("/templates");
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Email Template</h1>
            <p className="text-muted-foreground mt-1">Create a new email template</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Template Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Welcome Email"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Welcome to SafeDrive"
                value={template.subject}
                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this template"
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">
                Email Body <span className="text-destructive">*</span>
              </Label>
              <div className="text-xs text-muted-foreground mb-2">
                Use variables: {"{"}{"{"} USER_NAME {"}"}{"}"}, {"{"}{"{"} REPORT_LINK {"}"}{"}"}, {"{"}{"{"} DATE {"}"}{"}"}
              </div>
              <Textarea
                id="body"
                placeholder="Enter the email body content here..."
                value={template.body}
                onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" className="gap-2" onClick={() => navigate("/templates")}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
