import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accessibility, Type, Eye, Volume2, Keyboard } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindMode: string;
  textSpacing: number;
  focusIndicator: boolean;
}

export const AccessibilityEnhancements: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    colorBlindMode: 'none',
    textSpacing: 1,
    focusIndicator: true
  });

  useEffect(() => {
    // Load saved accessibility settings
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to the document
    applyAccessibilitySettings(settings);
    
    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${settings.fontSize}px`;

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
      root.style.setProperty('--transition-duration', '0.01s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Text spacing
    root.style.setProperty('--text-spacing-multiplier', settings.textSpacing.toString());

    // Focus indicator
    if (settings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Color blind mode
    root.setAttribute('data-color-blind-mode', settings.colorBlindMode);

    // Screen reader optimization
    if (settings.screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      colorBlindMode: 'none',
      textSpacing: 1,
      focusIndicator: true
    };
    setSettings(defaultSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Accessibility className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Accessibility Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vision
            </CardTitle>
            <CardDescription>
              Adjust visual settings for better readability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Text Spacing: {settings.textSpacing}x</Label>
              <Slider
                value={[settings.textSpacing]}
                onValueChange={([value]) => updateSetting('textSpacing', value)}
                min={1}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Color Blind Support</Label>
              <Select 
                value={settings.colorBlindMode} 
                onValueChange={(value) => updateSetting('colorBlindMode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  <SelectItem value="achromatopsia">Achromatopsia (Monochrome)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="focus-indicator">Enhanced Focus Indicators</Label>
              <Switch
                id="focus-indicator"
                checked={settings.focusIndicator}
                onCheckedChange={(checked) => updateSetting('focusIndicator', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Motion & Interaction Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Motion & Interaction
            </CardTitle>
            <CardDescription>
              Control animations and interaction preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader">Screen Reader Optimizations</Label>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <CardDescription>
            Navigate the site efficiently using these keyboard shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Skip to main content</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Tab</code>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Open search</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Ctrl + K</code>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Open accessibility menu</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Alt + A</code>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Navigate menu items</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Arrow Keys</code>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Close modal/dialog</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Escape</code>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Activate button/link</span>
                <code className="bg-muted px-2 py-1 rounded text-sm">Space/Enter</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};