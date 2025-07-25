import { useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import faithHarborLogo from "@/assets/faith-harbor-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-200 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={faithHarborLogo} alt="Faith Harbor Ministry Platform" className="h-10 w-10 rounded-full bg-white p-1" />
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-gold leading-tight">
                  Faith Harbor™
                </h3>
                <p className="text-sm font-semibold text-gold opacity-90">
                  Ministry Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              The complete ministry management platform built specifically for churches and Christian businesses.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Built with faith and purpose</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/demo" className="text-gray-700 hover:text-blue-800 transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/demo-video" className="text-gray-700 hover:text-blue-800 transition-colors">
                  Demo Video
                </Link>
              </li>
              <li>
                <Link to="/sales-churches" className="text-gray-700 hover:text-blue-800 transition-colors">
                  For Churches
                </Link>
              </li>
              <li>
                <Link to="/sales-business" className="text-gray-700 hover:text-blue-800 transition-colors">
                  For Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-700 hover:text-blue-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-700 hover:text-blue-800 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-700 hover:text-blue-800 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@faithharborministryplatform.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a 
                  href="tel:+18555783379" 
                  className="text-gray-700 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  +1 855 578 3379
                </a>
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
          <p className="text-sm text-gray-700">
            © {currentYear} Faith Harbor™ Ministry Platform. All rights reserved.
          </p>
          <p className="text-sm text-gray-700">
            Ministry management platform in development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;