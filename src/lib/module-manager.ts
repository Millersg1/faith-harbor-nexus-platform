// Module Manager for Faith Harbor Platform
export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  dependencies: string[];
  permissions: string[];
  routes: string[];
  components: string[];
}

export interface ModuleManifest {
  modules: ModuleConfig[];
  lastUpdated: string;
}

export class ModuleManager {
  private modules: Map<string, ModuleConfig> = new Map();
  private listeners: ((modules: ModuleConfig[]) => void)[] = [];

  constructor() {
    this.loadModules();
  }

  private loadModules(): void {
    const coreModules: ModuleConfig[] = [
      {
        id: 'church-management',
        name: 'Church Management',
        version: '1.0.0',
        enabled: true,
        dependencies: ['auth', 'database'],
        permissions: ['member:read', 'member:write'],
        routes: ['/members', '/events', '/announcements'],
        components: ['MemberDirectory', 'EventsSection', 'AnnouncementsSection']
      },
      {
        id: 'financial-management',
        name: 'Financial Management',
        version: '1.0.0',
        enabled: true,
        dependencies: ['auth', 'payment-processors'],
        permissions: ['finance:read', 'finance:write'],
        routes: ['/financial-management', '/donate'],
        components: ['FinancialManagement', 'DonationForm']
      },
      {
        id: 'ai-spiritual-companion',
        name: 'AI Spiritual Companion',
        version: '1.0.0',
        enabled: true,
        dependencies: ['auth', 'ai-services'],
        permissions: ['ai:interact'],
        routes: ['/ai-companion'],
        components: ['AICompanion']
      },
      {
        id: 'digital-ministry',
        name: 'Digital Ministry Tools',
        version: '1.0.0',
        enabled: true,
        dependencies: ['auth', 'storage'],
        permissions: ['content:create', 'content:manage'],
        routes: ['/webinar-studio', '/podcast-studio', '/mobile-app-builder'],
        components: ['WebinarStudio', 'PodcastStudio', 'MobileAppBuilder']
      },
      {
        id: 'coaching-platform',
        name: 'Coaching Platform',
        version: '1.0.0',
        enabled: false,
        dependencies: ['auth', 'payment-processors', 'video-calling'],
        permissions: ['coaching:access', 'coaching:manage'],
        routes: ['/coaching-platform', '/coaching-marketplace'],
        components: ['CoachingPlatform', 'CoachingMarketplace']
      },
      {
        id: 'business-suite',
        name: 'Business Management Suite',
        version: '1.0.0',
        enabled: true,
        dependencies: ['auth', 'crm', 'analytics'],
        permissions: ['business:manage', 'crm:access'],
        routes: ['/sales-business', '/analytics'],
        components: ['BusinessSales', 'Analytics']
      }
    ];

    coreModules.forEach(module => {
      this.modules.set(module.id, module);
    });

    this.notifyListeners();
  }

  getModule(id: string): ModuleConfig | undefined {
    return this.modules.get(id);
  }

  getAllModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  getEnabledModules(): ModuleConfig[] {
    return this.getAllModules().filter(module => module.enabled);
  }

  enableModule(id: string): boolean {
    const module = this.modules.get(id);
    if (!module) return false;

    // Check dependencies
    const missingDeps = this.checkDependencies(module);
    if (missingDeps.length > 0) {
      console.error(`Cannot enable module ${id}: missing dependencies:`, missingDeps);
      return false;
    }

    module.enabled = true;
    this.saveModules();
    this.notifyListeners();
    return true;
  }

  disableModule(id: string): boolean {
    const module = this.modules.get(id);
    if (!module) return false;

    // Check if other modules depend on this one
    const dependentModules = this.getDependentModules(id);
    if (dependentModules.length > 0) {
      console.error(`Cannot disable module ${id}: other modules depend on it:`, dependentModules);
      return false;
    }

    module.enabled = false;
    this.saveModules();
    this.notifyListeners();
    return true;
  }

  private checkDependencies(module: ModuleConfig): string[] {
    const missing: string[] = [];
    
    for (const depId of module.dependencies) {
      const dep = this.modules.get(depId);
      if (!dep || !dep.enabled) {
        missing.push(depId);
      }
    }
    
    return missing;
  }

  private getDependentModules(moduleId: string): string[] {
    const dependent: string[] = [];
    
    for (const [id, module] of this.modules) {
      if (module.enabled && module.dependencies.includes(moduleId)) {
        dependent.push(id);
      }
    }
    
    return dependent;
  }

  installModule(moduleConfig: ModuleConfig): boolean {
    if (this.modules.has(moduleConfig.id)) {
      console.error(`Module ${moduleConfig.id} already exists`);
      return false;
    }

    this.modules.set(moduleConfig.id, moduleConfig);
    this.saveModules();
    this.notifyListeners();
    return true;
  }

  uninstallModule(id: string): boolean {
    const module = this.modules.get(id);
    if (!module) return false;

    // Disable first
    if (module.enabled && !this.disableModule(id)) {
      return false;
    }

    this.modules.delete(id);
    this.saveModules();
    this.notifyListeners();
    return true;
  }

  private saveModules(): void {
    const manifest: ModuleManifest = {
      modules: this.getAllModules(),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('faith_harbor_modules', JSON.stringify(manifest));
  }

  onModulesChanged(listener: (modules: ModuleConfig[]) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const modules = this.getAllModules();
    this.listeners.forEach(listener => listener(modules));
  }

  getModuleRoutes(): string[] {
    return this.getEnabledModules()
      .flatMap(module => module.routes);
  }

  getModulePermissions(userId: string): string[] {
    // This would typically check user roles and return allowed permissions
    return this.getEnabledModules()
      .flatMap(module => module.permissions);
  }
}

export const moduleManager = new ModuleManager();