import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, Tag, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Digital Ministry: How AI is Transforming Church Operations",
    excerpt: "Discover how artificial intelligence is revolutionizing church management, from automated pastoral care to intelligent financial stewardship.",
    content: "Full article content here...",
    author: "Dr. Sarah Johnson",
    publishDate: "2024-01-15",
    category: "Ministry Technology",
    tags: ["AI", "Digital Ministry", "Church Management"],
    imageUrl: "/api/placeholder/800/400",
    readTime: "8 min read"
  },
  {
    id: "2",
    title: "Building Stronger Church Communities Through Data-Driven Insights",
    excerpt: "Learn how modern analytics can help pastors better understand their congregation and create more meaningful connections.",
    content: "Full article content here...",
    author: "Pastor Michael Chen",
    publishDate: "2024-01-12",
    category: "Church Growth",
    tags: ["Analytics", "Community Building", "Pastoral Care"],
    imageUrl: "/api/placeholder/800/400",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "Financial Stewardship in the Digital Age: A Complete Guide",
    excerpt: "Comprehensive strategies for managing church finances, donor relationships, and stewardship campaigns using modern technology.",
    content: "Full article content here...",
    author: "Rachel Martinez",
    publishDate: "2024-01-10",
    category: "Financial Management",
    tags: ["Stewardship", "Finances", "Fundraising"],
    imageUrl: "/api/placeholder/800/400",
    readTime: "12 min read"
  },
  {
    id: "4",
    title: "Success Story: How Grace Community Church Doubled Their Engagement",
    excerpt: "Real-world case study showing how one church used Faith Harbor to increase member engagement by 200% in just 6 months.",
    content: "Full article content here...",
    author: "Faith Harbor Team",
    publishDate: "2024-01-08",
    category: "Success Stories",
    tags: ["Case Study", "Member Engagement", "Growth"],
    imageUrl: "/api/placeholder/800/400",
    readTime: "10 min read"
  },
  {
    id: "5",
    title: "The Complete Guide to Church Event Management",
    excerpt: "Everything you need to know about planning, promoting, and executing successful church events that build community.",
    content: "Full article content here...",
    author: "Jennifer Thompson",
    publishDate: "2024-01-05",
    category: "Event Management",
    tags: ["Events", "Planning", "Community"],
    imageUrl: "/api/placeholder/800/400",
    readTime: "15 min read"
  }
];

const categories = ["All", "Ministry Technology", "Church Growth", "Financial Management", "Success Stories", "Event Management"];

const Blog = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    let filtered = blogPosts;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  // Single blog post view
  if (id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) {
      return (
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to blog
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
            ← Back to blog
          </Link>
          
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
          
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                </div>
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
              <div className="mt-8 space-y-6">
                <p>Welcome to the comprehensive world of digital ministry transformation. In this detailed exploration, we'll dive deep into how Faith Harbor's revolutionary platform is changing the landscape of church management and spiritual guidance.</p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">The Digital Ministry Revolution</h2>
                <p>Churches today face unprecedented challenges in connecting with their communities, managing complex operations, and providing meaningful spiritual guidance. Traditional methods, while valuable, often fall short in our increasingly digital world.</p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">AI-Powered Spiritual Guidance</h2>
                <p>Our AI Spiritual Companion represents a breakthrough in pastoral care technology. Available 24/7, this intelligent system provides personalized spiritual guidance, prayer support, and biblical wisdom tailored to each individual's journey.</p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Real-World Impact</h2>
                <p>Churches using Faith Harbor report average increases of 150% in member engagement, 200% improvement in communication effectiveness, and 75% reduction in administrative overhead.</p>
                
                <div className="bg-muted p-6 rounded-lg my-8">
                  <h3 className="text-xl font-semibold mb-3">Key Takeaways</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Digital transformation is essential for modern ministry</li>
                    <li>AI can enhance, not replace, human pastoral care</li>
                    <li>Data-driven insights lead to stronger communities</li>
                    <li>Integrated platforms reduce complexity and increase efficiency</li>
                  </ul>
                </div>
                
                <p>As we look to the future, the integration of technology and faith will continue to evolve. Faith Harbor stands at the forefront of this movement, providing churches with the tools they need to thrive in the digital age.</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Blog list view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Faith Harbor Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, strategies, and success stories from the world of digital ministry and church management
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {filteredPosts.length > 0 && (
            <Card className="mb-12 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={filteredPosts[0].imageUrl} 
                    alt={filteredPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge variant="secondary" className="mb-4">Featured Article</Badge>
                  <h2 className="text-2xl font-bold mb-4">{filteredPosts[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(filteredPosts[0].publishDate).toLocaleDateString()}</span>
                    </div>
                    <span>{filteredPosts[0].readTime}</span>
                  </div>
                  <Link to={`/blog/${filteredPosts[0].id}`}>
                    <Button>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;