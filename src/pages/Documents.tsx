import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Search, Calendar, User, Eye, FileIcon } from "lucide-react";

interface Document {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  access_level: string;
  tags: string[];
  version_number: number;
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents' as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data as any || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // Increment download count
      await supabase
        .from('documents' as any)
        .update({ download_count: document.download_count + 1 })
        .eq('id', document.id);

      // Open download link
      window.open(document.file_url, '_blank');

      toast({
        title: "Download Started",
        description: `Downloading ${document.file_name}`,
      });

      // Refresh the documents list to update download count
      fetchDocuments();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📋';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📁';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      ministry: "bg-purple-100 text-purple-800",
      worship: "bg-green-100 text-green-800",
      admin: "bg-gray-100 text-gray-800",
      financial: "bg-orange-100 text-orange-800",
      resources: "bg-indigo-100 text-indigo-800",
      forms: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getAccessLevelColor = (accessLevel: string) => {
    const colors = {
      public: "bg-green-100 text-green-800",
      members: "bg-blue-100 text-blue-800",
      leaders: "bg-orange-100 text-orange-800",
      admin: "bg-red-100 text-red-800"
    };
    return colors[accessLevel as keyof typeof colors] || colors.public;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesType = typeFilter === "all" || doc.file_type.includes(typeFilter);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Document Library</h1>
          <p className="text-muted-foreground">Access important documents, forms, and resources</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="ministry">Ministry</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="resources">Resources</SelectItem>
              <SelectItem value="forms">Forms</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Word Document</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="powerpoint">PowerPoint</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <Card key={document.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{getFileIcon(document.file_type)}</div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {document.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getCategoryColor(document.category)}>
                            {document.category}
                          </Badge>
                          <Badge className={getAccessLevelColor(document.access_level)}>
                            {document.access_level}
                          </Badge>
                          {document.version_number > 1 && (
                            <Badge variant="outline">
                              v{document.version_number}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {document.description}
                  </CardDescription>

                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2" />
                      {document.file_name}
                    </div>
                    
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      {formatFileSize(document.file_size)} • {document.download_count} downloads
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(document.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {document.tags && document.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(document)}
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      onClick={() => window.open(document.file_url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;