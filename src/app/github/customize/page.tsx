'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  darkMode: boolean;
}

export default function CustomizePage() {
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
  });
  const [isCustom, setIsCustom] = useState(false);
  const router = useRouter();

  const colorSchemes: ColorScheme[] = [
    {
      id: 'modern',
      name: 'Modern Blue',
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
      darkMode: false,
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      primary: '#60a5fa',
      secondary: '#34d399',
      accent: '#a78bfa',
      background: '#111827',
      text: '#f9fafb',
      darkMode: true,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      primary: '#4b5563',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#f9fafb',
      text: '#111827',
      darkMode: false,
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      primary: '#f43f5e',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#0f172a',
      darkMode: false,
    },
    {
      id: 'forest',
      name: 'Forest',
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f8fafc',
      text: '#1e293b',
      darkMode: false,
    },
    {
      id: 'custom',
      name: 'Custom Colors',
      primary: customColors.primary,
      secondary: customColors.secondary,
      accent: customColors.accent,
      background: customColors.background,
      text: customColors.text,
      darkMode: false,
    },
  ];

  useEffect(() => {
    // Get selected repositories from localStorage
    const storedRepos = localStorage.getItem('selectedRepos');
    if (!storedRepos) {
      router.push('/github/repositories');
      return;
    }

    try {
      setSelectedRepos(JSON.parse(storedRepos));
    } catch (e) {
      console.error('Failed to parse selected repositories:', e);
      router.push('/github/repositories');
    }
  }, [router]);

  const handleColorSchemeChange = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    setIsCustom(schemeId === 'custom');
  };

  const handleCustomColorChange = (colorKey: keyof typeof customColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const handleContinue = () => {
    // Store color scheme in localStorage
    const selectedScheme = isCustom 
      ? { ...colorSchemes.find(scheme => scheme.id === 'custom'), ...customColors }
      : colorSchemes.find(scheme => scheme.id === selectedColorScheme);
    
    localStorage.setItem('colorScheme', JSON.stringify(selectedScheme));
    
    // Navigate to the next step (preview or generation page)
    router.push('/github/preview');
  };

  const getActiveScheme = () => {
    return isCustom
      ? { ...colorSchemes.find(scheme => scheme.id === 'custom'), ...customColors }
      : colorSchemes.find(scheme => scheme.id === selectedColorScheme);
  };

  const activeScheme = getActiveScheme();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Customize Your Portfolio</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choose a color scheme for your portfolio website.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Color Schemes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`rounded-lg p-4 cursor-pointer transition-all ${
                    selectedColorScheme === scheme.id
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleColorSchemeChange(scheme.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{scheme.name}</span>
                    {selectedColorScheme === scheme.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.accent }}></div>
                  </div>
                </div>
              ))}
            </div>

            {isCustom && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-3">Custom Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-10 h-10 rounded-md border-0 mr-2"
                      />
                      <input
                        type="text"
                        value={customColors.primary}
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="w-10 h-10 rounded-md border-0 mr-2"
                      />
                      <input
                        type="text"
                        value={customColors.secondary}
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                        className="w-10 h-10 rounded-md border-0 mr-2"
                      />
                      <input
                        type="text"
                        value={customColors.accent}
                        onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={customColors.background}
                        onChange={(e) => handleCustomColorChange('background', e.target.value)}
                        className="w-10 h-10 rounded-md border-0 mr-2"
                      />
                      <input
                        type="text"
                        value={customColors.background}
                        onChange={(e) => handleCustomColorChange('background', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={customColors.text}
                        onChange={(e) => handleCustomColorChange('text', e.target.value)}
                        className="w-10 h-10 rounded-md border-0 mr-2"
                      />
                      <input
                        type="text"
                        value={customColors.text}
                        onChange={(e) => handleCustomColorChange('text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.push('/github/repositories')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            {activeScheme && (
              <div 
                className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                style={{ 
                  backgroundColor: activeScheme.background,
                  color: activeScheme.text
                }}
              >
                {/* Header */}
                <div className="p-4" style={{ backgroundColor: activeScheme.primary, color: '#ffffff' }}>
                  <div className="font-bold">Portfolio Preview</div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="mb-4 font-medium" style={{ color: activeScheme.text }}>
                    Selected Projects ({selectedRepos.length})
                  </div>
                  
                  {selectedRepos.slice(0, 2).map(repo => (
                    <div 
                      key={repo.id} 
                      className="mb-3 p-3 rounded-md" 
                      style={{ 
                        backgroundColor: activeScheme.darkMode ? '#1f2937' : '#f3f4f6',
                        borderLeft: `4px solid ${activeScheme.secondary}`
                      }}
                    >
                      <div className="font-medium" style={{ color: activeScheme.text }}>{repo.name}</div>
                      {repo.description && (
                        <div className="text-sm mt-1" style={{ color: activeScheme.text }}>
                          {repo.description.length > 60 
                            ? repo.description.substring(0, 60) + '...' 
                            : repo.description}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {selectedRepos.length > 2 && (
                    <div className="text-sm text-center mt-2" style={{ color: activeScheme.accent }}>
                      + {selectedRepos.length - 2} more projects
                    </div>
                  )}
                  
                  <div 
                    className="mt-4 text-center py-2 rounded-md" 
                    style={{ 
                      backgroundColor: activeScheme.accent,
                      color: '#ffffff'
                    }}
                  >
                    View All Projects
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              This is a simplified preview. Your actual portfolio will include more details and features.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
