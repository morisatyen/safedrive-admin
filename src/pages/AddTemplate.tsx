import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function AddTemplate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [template, setTemplate] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: { name: string; subject: string; body: string }) => {
      const response = await fetch(`${API_URL}/web/v1/auth/email-templates/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(templateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create template');
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Template created successfully!");
      queryClient.invalidateQueries({ queryKey: ['TemplatesData'] });
      navigate("/templates");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create template");
    },
  });

  const handleSave = () => {
    if (!template.name || !template.subject || !template.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTemplateMutation.mutate({
      name: template.name,
      subject: template.subject,
      body: template.body,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/templates`)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
            <h1 className="text-3xl font-bold">Add Template</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">

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
              <Label htmlFor="body">
                Email Body <span className="text-destructive">*</span>
              </Label>
              {/* <div className="text-xs text-muted-foreground mb-2">
                Use variables: {"{"}{"{"} USER_NAME {"}"}{"}"}, {"{"}{"{"} REPORT_LINK {"}"}{"}"}, {"{"}{"{"} DATE {"}"}{"}"}
              </div> */}
              <div className="border rounded-md" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                <ReactQuill
                  theme="snow"
                  value={template.body}
                  onChange={(value) => setTemplate({ ...template, body: value })}
                  placeholder="Enter the email body content here..."
                  style={{
                    height: '100%',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video'],
                        ['clean']
                      ]
                    }
                  }}
                />
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .ql-toolbar {
                      position: sticky !important;
                      top: 0 !important;
                      z-index: 1000 !important;
                      background: white !important;
                      border-bottom: 1px solid #ccc !important;
                    }
                    .ql-container {
                      flex: 1 !important;
                      overflow-y: auto !important;
                    }
                    .ql-editor {
                      overflow-y: auto !important;
                    }
                  `
                }} />
              </div>
            </div>

            <div className="flex justify-end gap-3 relative z-10 mt-6">
              <Button variant="outline" className="gap-2" onClick={() => navigate("/templates")}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleSave}
                disabled={createTemplateMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {createTemplateMutation.isPending ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
