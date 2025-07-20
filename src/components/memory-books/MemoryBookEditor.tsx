import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Canvas as FabricCanvas, Text as FabricText, Image as FabricImage, Rect } from "fabric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Eye, Share, Printer, Type, Image, Square, Circle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MemoryBookEditorProps {
  bookId: string;
  onBack: () => void;
}

interface MemoryBook {
  id: string;
  title: string;
  description: string | null;
  template_id: string;
  canvas_data: any;
  is_published: boolean;
  is_public: boolean;
  memorial: {
    deceased_name: string;
  } | null;
}

export function MemoryBookEditor({ bookId, onBack }: MemoryBookEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [memoryBook, setMemoryBook] = useState<MemoryBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "text" | "image" | "rectangle" | "circle">("select");
  const { toast } = useToast();

  useEffect(() => {
    fetchMemoryBook();
  }, [bookId]);

  useEffect(() => {
    if (!canvasRef.current || !memoryBook) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 1000, // A4-like ratio
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);

    // Load existing canvas data if available
    if (memoryBook.canvas_data && Object.keys(memoryBook.canvas_data).length > 0) {
      canvas.loadFromJSON(memoryBook.canvas_data, () => {
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
    };
  }, [memoryBook]);

  const fetchMemoryBook = async () => {
    try {
      const { data, error } = await supabase
        .from('memory_books')
        .select(`
          *,
          memorial:memorials(deceased_name)
        `)
        .eq('id', bookId)
        .single();

      if (error) throw error;
      setMemoryBook(data);
    } catch (error) {
      console.error('Error fetching memory book:', error);
      toast({
        title: "Error",
        description: "Failed to load memory book",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fabricCanvas || !memoryBook) return;

    setIsSaving(true);
    try {
      const canvasData = fabricCanvas.toJSON();
      
      const { error } = await supabase
        .from('memory_books')
        .update({
          canvas_data: canvasData
        })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Memory book saved successfully",
      });
    } catch (error) {
      console.error('Error saving memory book:', error);
      toast({
        title: "Error",
        description: "Failed to save memory book",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddText = () => {
    if (!fabricCanvas) return;

    const text = new FabricText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
      fontFamily: 'Arial'
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const handleAddRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      fill: '#cccccc',
      width: 150,
      height: 100,
      stroke: '#000000',
      strokeWidth: 1
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = document.createElement('img');
      imgElement.onload = () => {
        const img = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!memoryBook) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Memory Book Not Found</h1>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memory Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{memoryBook.title}</h1>
              {memoryBook.memorial && (
                <p className="text-muted-foreground">For {memoryBook.memorial.deceased_name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool("select")}
                  className="w-full justify-start"
                >
                  Select
                </Button>
                
                <Button
                  variant={activeTool === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveTool("text");
                    handleAddText();
                  }}
                  className="w-full justify-start"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
                
                <Button
                  variant={activeTool === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveTool("rectangle");
                    handleAddRectangle();
                  }}
                  className="w-full justify-start"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>

                <div className="pt-2">
                  <label className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start cursor-pointer"
                      asChild
                    >
                      <span>
                        <Image className="h-4 w-4 mr-2" />
                        Add Image
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="col-span-8">
            <Card>
              <CardContent className="p-6">
                <div className="border border-border rounded-lg overflow-hidden bg-white shadow-inner">
                  <canvas ref={canvasRef} className="max-w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Select an object to edit its properties
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}