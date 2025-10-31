import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Email body is required"),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function EditTemplate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const { data: template, isLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/web/v1/auth/email-templates/${id}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch template');
      }
      return result.data;
    },
  });

  // Set form values when template data is loaded
  React.useEffect(() => {
    if (template) {
      setValue('name', template.name);
      setValue('subject', template.subject);
      setValue('body', template.body);
    }
  }, [template, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const response = await fetch(`${API_URL}/web/v1/auth/email-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await response.json();      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update template');
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Template updated successfully!",{description: `${template?.name} has been updated.`});
      queryClient.invalidateQueries({ queryKey: ['TemplatesData'] });
      navigate("/templates");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update template",{ description: "Please try again."});
    },
  });

  const onSubmit = (data: TemplateFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

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
            <h1 className="text-3xl font-bold">Edit Template</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('name')}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Welcome to SafeDrive"
                  {...register('subject')}
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">
                  Email Body <span className="text-destructive">*</span>
                </Label>
                <div className="border rounded-md" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                  <ReactQuill
                    theme="snow"
                    value={watch('body') || ''}
                    onChange={(value) => setValue('body', value)}
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
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          [{ 'align': [] }],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
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
                {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
              </div>

              <div className="flex justify-end gap-3 relative z-10 mt-6">
                <Button type="button" variant="outline" className="gap-2" onClick={() => navigate("/templates")}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
