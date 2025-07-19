import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-100 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{color: "hsl(var(--gold))"}}>
              Faith Harbor
            </h3>
            <p className="text-sm text-muted-foreground">
              The complete ministry management platform built specifically for churches and Christian businesses.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Built with faith and purpose</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/demo-video" className="text-muted-foreground hover:text-primary transition-colors">
                  Demo Video
                </Link>
              </li>
              <li>
                <Link to="/sales-churches" className="text-muted-foreground hover:text-primary transition-colors">
                  For Churches
                </Link>
              </li>
              <li>
                <Link to="/sales-business" className="text-muted-foreground hover:text-primary transition-colors">
                  For Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@faithharbor.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>United States</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Faith Harbor. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Ministry management platform in development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;