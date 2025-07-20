import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Activity,
  BarChart3,
  Shield,
  Globe
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const DashboardNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const dashboardLinks = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
      description: 'User dashboard and profile'
    },
    {
      href: '/admin-dashboard',
      icon: Settings,
      label: t('nav.admin'),
      description: 'Admin management panel'
    },
    {
      href: '/admin-activity-monitor',
      icon: Activity,
      label: 'Activity Monitor',
      description: 'Real-time user activity tracking'
    },
    {
      href: '/custom-domains',
      icon: Globe,
      label: 'Custom Domains',
      description: 'Manage custom domains for your websites'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground">
              Access your dashboards and monitoring tools
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} to={link.href}>
                <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isActive(link.href) ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        isActive(link.href) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {link.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Access Instructions</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>🔗 <strong>Direct URLs:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• <code>/dashboard</code> - User dashboard</li>
              <li>• <code>/admin-dashboard</code> - Admin management panel</li>
              <li>• <code>/admin-activity-monitor</code> - Real-time activity monitoring</li>
            </ul>
            <p className="mt-4">🌍 <strong>Language Support:</strong></p>
            <p className="ml-4">Use the language switcher (🌐) to change between English, Spanish, French, German, and Portuguese.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;