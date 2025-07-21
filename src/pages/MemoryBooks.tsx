import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, MessageSquare, Printer, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateMemoryBookDialog } from "@/components/memory-books/CreateMemoryBookDialog";
import { MemoryBookCard } from "@/components/memory-books/MemoryBookCard";
import { MemoryBookEditor } from "@/components/memory-books/MemoryBookEditor";
import { CommentCollectionSection } from "@/components/memory-books/CommentCollectionSection";

interface MemoryBook {
  id: string;
  title: string;
  description: string | null;
  template_id: string;
  is_published: boolean;
  is_public: boolean;
  allow_comments: boolean;
  created_at: string;
  memorial: {
    deceased_name: string;
  } | null;
}

export default function MemoryBooks() {
  const [memoryBooks, setMemoryBooks] = useState<MemoryBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-books");
  const { toast } = useToast();

  useEffect(() => {
    fetchMemoryBooks();
  }, []);

  const fetchMemoryBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('memory_books')
        .select(`
          *,
          memorial:memorials!memorial_id(deceased_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemoryBooks(data || []);
    } catch (error) {
      console.error('Error fetching memory books:', error);
      toast({
        title: "Error",
        description: "Failed to load memory books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookCreated = () => {
    setIsCreateDialogOpen(false);
    fetchMemoryBooks();
    toast({
      title: "Success",
      description: "Memory book created successfully",
    });
  };

  const handleEditBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveTab("editor");
  };

  const handleBackToBooks = () => {
    setSelectedBookId(null);
    setActiveTab("my-books");
    fetchMemoryBooks();
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

  // If editing a specific book, show the editor
  if (selectedBookId && activeTab === "editor") {
    return (
      <MemoryBookEditor 
        bookId={selectedBookId} 
        onBack={handleBackToBooks}
      />
    );
  }

  const myBooks = memoryBooks.filter(book => !book.is_public);
  const publicBooks = memoryBooks.filter(book => book.is_public && book.is_published);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Memory Books</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, printable memory books and scrapbooks to honor and remember loved ones
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px] mx-auto">
            <TabsTrigger value="my-books" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Books
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Public Books
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-books" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">My Memory Books</h2>
                <p className="text-muted-foreground">Create and manage your personal memory books</p>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Memory Book
              </Button>
            </div>

            {myBooks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Memory Books Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first memory book to honor a loved one's memory
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                    Create Memory Book
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myBooks.map((book) => (
                  <MemoryBookCard 
                    key={book.id} 
                    book={book} 
                    onEdit={() => handleEditBook(book.id)}
                    onUpdate={fetchMemoryBooks}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Public Memory Books</h2>
              <p className="text-muted-foreground">Browse and contribute to public memory books in our community</p>
            </div>

            {publicBooks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Public Memory Books</h3>
                  <p className="text-muted-foreground">
                    No memory books have been made public yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publicBooks.map((book) => (
                  <MemoryBookCard 
                    key={book.id} 
                    book={book} 
                    onEdit={() => handleEditBook(book.id)}
                    onUpdate={fetchMemoryBooks}
                    isPublicView={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            <CommentCollectionSection />
          </TabsContent>
        </Tabs>

        <CreateMemoryBookDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onBookCreated={handleBookCreated}
        />
      </div>
    </div>
  );
}