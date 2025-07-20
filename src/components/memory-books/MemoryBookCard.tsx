import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Eye, Share, MessageSquare, Printer, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

interface MemoryBookCardProps {
  book: MemoryBook;
  onEdit: () => void;
  onUpdate: () => void;
  isPublicView?: boolean;
}

export function MemoryBookCard({ book, onEdit, onUpdate, isPublicView = false }: MemoryBookCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log('Print book:', book.id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share book:', book.id);
  };

  const getStatusColor = () => {
    if (book.is_published && book.is_public) return 'bg-green-100 text-green-800 border-green-200';
    if (book.is_published) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = () => {
    if (book.is_published && book.is_public) return 'Public';
    if (book.is_published) return 'Published';
    return 'Draft';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-foreground mb-1">{book.title}</CardTitle>
            {book.memorial && (
              <CardDescription className="text-sm text-muted-foreground">
                For {book.memorial.deceased_name}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {!isPublicView && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border shadow-lg z-50">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {format(new Date(book.created_at), "MMM d, yyyy")}</span>
          {book.allow_comments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>Comments enabled</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {isPublicView ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              {book.allow_comments && (
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}