import { useState } from 'react';
import { Sun, Moon, Eye, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function AccessibilityToolbar() {
  const { theme, colorBlindMode, toggleTheme, setColorBlindMode } = useTheme();
  const [showColorBlindMenu, setShowColorBlindMenu] = useState(false);

  const colorBlindModes = [
    { value: 'none', label: 'Normal Vision' },
    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
  ];

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
      <button
        onClick={toggleTheme}
        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all group"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowColorBlindMenu(!showColorBlindMenu)}
          className={`p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all ${
            colorBlindMode !== 'none' ? 'ring-2 ring-blue-500' : ''
          }`}
          title="Color Blind Mode"
        >
          <Eye className={`w-5 h-5 ${colorBlindMode !== 'none' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'}`} />
        </button>

        {showColorBlindMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Color Vision</span>
              </div>
              <button
                onClick={() => setShowColorBlindMenu(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-2">
              {colorBlindModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    setColorBlindMode(mode.value as any);
                    setShowColorBlindMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all mb-1 ${
                    colorBlindMode === mode.value
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{mode.label}</span>
                    {colorBlindMode === mode.value && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
