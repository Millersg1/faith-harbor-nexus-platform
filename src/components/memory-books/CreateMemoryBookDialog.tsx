import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Memorial {
  id: string;
  deceased_name: string;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

interface CreateMemoryBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookCreated: () => void;
}

export function CreateMemoryBookDialog({ open, onOpenChange, onBookCreated }: CreateMemoryBookDialogProps) {
  console.log('CreateMemoryBookDialog rendering, open:', open);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    memorial_id: "",
    template_id: "",
    allow_comments: true
  });
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, fetching data...');
      fetchMemorials();
      fetchTemplates();
    }
  }, [open]);

  const fetchMemorials = async () => {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('id, deceased_name')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemorials(data || []);
    } catch (error) {
      console.error('Error fetching memorials:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      console.log('Fetching templates...');
      const { data, error } = await supabase
        .from('memory_book_templates')
        .select('id, name, description, category')
        .order('category', { ascending: true });

      if (error) throw error;
      console.log('Templates fetched:', data?.length || 0);
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.template_id) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('memory_books')
        .insert({
          title: formData.title,
          description: formData.description || null,
          memorial_id: formData.memorial_id === "none" ? null : formData.memorial_id || null,
          template_id: formData.template_id,
          creator_id: userData.user?.id || null,
          allow_comments: formData.allow_comments,
          canvas_data: {},
          is_published: false,
          is_public: false
        });

      if (error) throw error;

      // Reset form
      setFormData({
        title: "",
        description: "",
        memorial_id: "",
        template_id: "",
        allow_comments: true
      });

      onBookCreated();
    } catch (error) {
      console.error('Error creating memory book:', error);
      toast({
        title: "Error",
        description: "Failed to create memory book",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Create Memory Book</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border border-gray-200">
          <p>Dialog is open: {open ? 'Yes' : 'No'}</p>
          <p>Templates loaded: {templates.length}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Remembering John Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Associated Memorial (Optional)</Label>
              <Select 
                value={formData.memorial_id} 
                onValueChange={(value) => setFormData({ ...formData, memorial_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select memorial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No memorial selected</SelectItem>
                  {memorials.map((memorial) => (
                    <SelectItem key={memorial.id} value={memorial.id}>
                      {memorial.deceased_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this memory book will contain..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Template *</Label>
            <Select 
              value={formData.template_id} 
              onValueChange={(value) => setFormData({ ...formData, template_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col items-start">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCategory(template.category)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Memory Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}