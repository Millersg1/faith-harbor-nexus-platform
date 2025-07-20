import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  TrendingUp, 
  Globe, 
  FileText, 
  Target, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SEOPage {
  id: string;
  page_url: string;
  page_title: string;
  meta_description: string;
  meta_keywords: string[];
  focus_keyword: string;
  seo_score: number;
  last_updated: string;
}

interface SEOAnalytics {
  total_pages: number;
  avg_seo_score: number;
  pages_optimized: number;
  pages_need_work: number;
  trending_keywords: string[];
}

export default function SEOManagement() {
  const [seoPages, setSeoPages] = useState<SEOPage[]>([]);
  const [analytics, setAnalytics] = useState<SEOAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPage, setNewPage] = useState({
    page_url: "",
    page_title: "",
    meta_description: "",
    meta_keywords: "",
    focus_keyword: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      // Fetch SEO pages using any type to avoid TypeScript issues
      const { data: pages, error: pagesError } = await (supabase as any)
        .from('seo_pages')
        .select('*')
        .order('last_updated', { ascending: false });

      if (pagesError) throw pagesError;
      setSeoPages(pages || []);

      // Calculate analytics
      if (pages && pages.length > 0) {
        const totalPages = pages.length;
        const avgScore = pages.reduce((sum, page) => sum + page.seo_score, 0) / totalPages;
        const optimized = pages.filter(page => page.seo_score >= 80).length;
        const needWork = pages.filter(page => page.seo_score < 60).length;
        
        setAnalytics({
          total_pages: totalPages,
          avg_seo_score: Math.round(avgScore),
          pages_optimized: optimized,
          pages_need_work: needWork,
          trending_keywords: pages.flatMap(p => p.meta_keywords).slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSEOScore = (page: Partial<SEOPage>) => {
    let score = 0;
    
    // Title optimization (0-30 points)
    if (page.page_title) {
      if (page.page_title.length >= 30 && page.page_title.length <= 60) score += 30;
      else if (page.page_title.length > 0) score += 15;
    }
    
    // Meta description (0-25 points)
    if (page.meta_description) {
      if (page.meta_description.length >= 120 && page.meta_description.length <= 160) score += 25;
      else if (page.meta_description.length > 0) score += 12;
    }
    
    // Focus keyword (0-20 points)
    if (page.focus_keyword) {
      score += 20;
      // Bonus if focus keyword is in title
      if (page.page_title?.toLowerCase().includes(page.focus_keyword.toLowerCase())) {
        score += 10;
      }
    }
    
    // Keywords diversity (0-15 points)
    if (page.meta_keywords && page.meta_keywords.length >= 3) score += 15;
    else if (page.meta_keywords && page.meta_keywords.length > 0) score += 8;
    
    // URL structure (0-10 points)
    if (page.page_url && !page.page_url.includes('?') && page.page_url.includes('-')) score += 10;
    else if (page.page_url) score += 5;
    
    return Math.min(score, 100);
  };

  const savePage = async () => {
    try {
      const keywordsArray = newPage.meta_keywords.split(',').map(k => k.trim()).filter(k => k);
      const seoScore = calculateSEOScore({
        ...newPage,
        meta_keywords: keywordsArray
      });

      const pageData = {
        ...newPage,
        meta_keywords: keywordsArray,
        seo_score: seoScore,
        last_updated: new Date().toISOString()
      };

      if (selectedPage) {
        // Update existing page
        const { error } = await (supabase as any)
          .from('seo_pages')
          .update(pageData)
          .eq('id', selectedPage.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "SEO page updated successfully",
        });
      } else {
        // Create new page
        const { error } = await (supabase as any)
          .from('seo_pages')
          .insert([pageData]);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "SEO page created successfully",
        });
      }

      setIsEditing(false);
      setSelectedPage(null);
      setNewPage({
        page_url: "",
        page_title: "",
        meta_description: "",
        meta_keywords: "",
        focus_keyword: ""
      });
      fetchSEOData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('seo_pages')
        .delete()
        .eq('id', pageId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "SEO page deleted successfully",
      });
      fetchSEOData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSitemap = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-sitemap');
      
      if (error) throw error;
      
      // Create and download sitemap file
      const blob = new Blob([data.sitemap], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Sitemap generated and downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Work</Badge>;
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">SEO Management</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimize your church website for search engines and increase online visibility
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Keywords
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            {analytics && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.total_pages}</div>
                    <p className="text-xs text-muted-foreground">Pages being tracked</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getScoreColor(analytics.avg_seo_score)}`}>
                      {analytics.avg_seo_score}%
                    </div>
                    <Progress value={analytics.avg_seo_score} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Optimized Pages</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{analytics.pages_optimized}</div>
                    <p className="text-xs text-muted-foreground">Score 80% or higher</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{analytics.pages_need_work}</div>
                    <p className="text-xs text-muted-foreground">Score below 60%</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent SEO Updates</CardTitle>
                <CardDescription>Latest optimized pages and their scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoPages.slice(0, 5).map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{page.page_title}</h3>
                        <p className="text-sm text-muted-foreground">{page.page_url}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Focus: {page.focus_keyword} • Updated {new Date(page.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-lg font-bold ${getScoreColor(page.seo_score)}`}>
                          {page.seo_score}%
                        </div>
                        {getScoreBadge(page.seo_score)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">SEO Pages</h2>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>

            {/* Page Editor */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
                  <CardDescription>Optimize your page for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="page_url">Page URL</Label>
                      <Input
                        id="page_url"
                        value={newPage.page_url}
                        onChange={(e) => setNewPage({...newPage, page_url: e.target.value})}
                        placeholder="/sermons/latest-message"
                      />
                    </div>
                    <div>
                      <Label htmlFor="focus_keyword">Focus Keyword</Label>
                      <Input
                        id="focus_keyword"
                        value={newPage.focus_keyword}
                        onChange={(e) => setNewPage({...newPage, focus_keyword: e.target.value})}
                        placeholder="church sermons"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="page_title">Page Title (30-60 characters)</Label>
                    <Input
                      id="page_title"
                      value={newPage.page_title}
                      onChange={(e) => setNewPage({...newPage, page_title: e.target.value})}
                      placeholder="Inspiring Church Sermons | Faith Harbor"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {newPage.page_title.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Description (120-160 characters)</Label>
                    <Textarea
                      id="meta_description"
                      value={newPage.meta_description}
                      onChange={(e) => setNewPage({...newPage, meta_description: e.target.value})}
                      placeholder="Join us for inspiring sermons that will strengthen your faith and bring you closer to God. Watch online or attend in person."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {newPage.meta_description.length}/160 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="meta_keywords"
                      value={newPage.meta_keywords}
                      onChange={(e) => setNewPage({...newPage, meta_keywords: e.target.value})}
                      placeholder="church, sermons, faith, ministry, worship, spirituality"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={savePage}>
                      {selectedPage ? 'Update Page' : 'Add Page'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setSelectedPage(null);
                      setNewPage({
                        page_url: "",
                        page_title: "",
                        meta_description: "",
                        meta_keywords: "",
                        focus_keyword: ""
                      });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pages List */}
            <div className="grid gap-4">
              {seoPages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{page.page_title}</h3>
                        <p className="text-primary text-sm">{page.page_url}</p>
                        <p className="text-muted-foreground text-sm mt-2">{page.meta_description}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          <Badge variant="outline" className="text-xs">
                            Focus: {page.focus_keyword}
                          </Badge>
                          {page.meta_keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {page.meta_keywords.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{page.meta_keywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(page.seo_score)}`}>
                            {page.seo_score}%
                          </div>
                          {getScoreBadge(page.seo_score)}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPage(page);
                              setNewPage({
                                page_url: page.page_url,
                                page_title: page.page_title,
                                meta_description: page.meta_description,
                                meta_keywords: page.meta_keywords.join(', '),
                                focus_keyword: page.focus_keyword
                              });
                              setIsEditing(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePage(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>Track your most important keywords and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.trending_keywords && analytics.trending_keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analytics.trending_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No keywords tracked yet. Add some pages to see keyword analysis.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sitemap Generator</CardTitle>
                  <CardDescription>Generate XML sitemap for search engines</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={generateSitemap} className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Generate Sitemap
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schema Markup</CardTitle>
                  <CardDescription>Add structured data for better search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Schema (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}