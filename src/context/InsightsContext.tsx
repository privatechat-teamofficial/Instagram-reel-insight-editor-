import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ReelInsightsState,
  TabType,
  AudienceSubTab,
  ViewsChartFilter,
  ActiveEditTarget,
  EditFieldType,
  DemographicItem,
  ViewSource,
} from '../types/insights';
import { DEFAULT_REEL_DATA } from '../data/defaultData';

interface InsightsContextType {
  data: ReelInsightsState;
  setData: React.Dispatch<React.SetStateAction<ReelInsightsState>>;
  isEditMode: boolean;
  setIsEditMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleEditMode: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  audienceSubTab: AudienceSubTab;
  setAudienceSubTab: (tab: AudienceSubTab) => void;
  viewsChartFilter: ViewsChartFilter;
  setViewsChartFilter: (filter: ViewsChartFilter) => void;
  activeEditTarget: ActiveEditTarget | null;
  openEditor: (target: {
    path: string;
    title: string;
    type: EditFieldType;
    value: any;
    options?: ActiveEditTarget['options'];
  }) => void;
  closeEditor: () => void;
  updateValueByPath: (path: string, newValue: any) => void;
  isMediaModalOpen: boolean;
  setIsMediaModalOpen: (open: boolean) => void;
  isChartModalOpen: boolean;
  setIsChartModalOpen: (open: boolean) => void;
  isPresetsModalOpen: boolean;
  setIsPresetsModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isDateShiftModalOpen: boolean;
  setIsDateShiftModalOpen: (open: boolean) => void;
  isTypicalModalOpen: boolean;
  setIsTypicalModalOpen: (open: boolean) => void;
  resetToDefaults: () => void;
  loadPreset: (presetData: ReelInsightsState) => void;
  exportProjectJson: () => void;
  importProjectJson: (jsonString: string) => boolean;
  addCountryItem: (name: string, percentage: number) => void;
  removeCountryItem: (id: string) => void;
  addSourceItem: (name: string, percentage: number) => void;
  removeSourceItem: (id: string) => void;
}

const STORAGE_KEY = 'reel_insights_editor_state_v3';

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export const InsightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ReelInsightsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.topMetrics && parsed.summary && parsed.audience) {
          const merged: ReelInsightsState = {
            ...DEFAULT_REEL_DATA,
            ...parsed,
            topMetrics: { ...DEFAULT_REEL_DATA.topMetrics, ...parsed.topMetrics },
            summary: { ...DEFAULT_REEL_DATA.summary, ...parsed.summary },
            audience: { ...DEFAULT_REEL_DATA.audience, ...parsed.audience },
            impactFactors:
              parsed.impactFactors && parsed.impactFactors.length > 0
                ? parsed.impactFactors
                : DEFAULT_REEL_DATA.impactFactors,
            watchTimeRetention: parsed.watchTimeRetention || DEFAULT_REEL_DATA.watchTimeRetention,
            topSources:
              parsed.topSources && parsed.topSources.length > 0
                ? parsed.topSources
                : DEFAULT_REEL_DATA.topSources,
          };
          // Ensure viewsChart points extend properly to the last date
          if (
            !merged.viewsChart?.points ||
            merged.viewsChart.points.length < 18 ||
            !merged.viewsChart.points.some((p: any) => p.hasData === false)
          ) {
            merged.viewsChart = DEFAULT_REEL_DATA.viewsChart;
          }
          return merged;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved state from localStorage:', e);
    }
    return DEFAULT_REEL_DATA;
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [audienceSubTab, setAudienceSubTab] = useState<AudienceSubTab>('age');
  const [viewsChartFilter, setViewsChartFilter] = useState<ViewsChartFilter>('all');
  const [activeEditTarget, setActiveEditTarget] = useState<ActiveEditTarget | null>(null);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDateShiftModalOpen, setIsDateShiftModalOpen] = useState<boolean>(false);
  const [isTypicalModalOpen, setIsTypicalModalOpen] = useState<boolean>(false);

  // Auto-sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [data]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const openEditor = (target: {
    path: string;
    title: string;
    type: EditFieldType;
    value: any;
    options?: ActiveEditTarget['options'];
  }) => {
    if (!isEditMode) return;
    setActiveEditTarget(target);
  };

  const closeEditor = () => {
    setActiveEditTarget(null);
  };

  const updateValueByPath = (path: string, newValue: any) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let curr = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (curr[part] === undefined) {
          curr[part] = {};
        }
        curr = curr[part];
      }
      const lastKey = parts[parts.length - 1];
      curr[lastKey] = newValue;
      return next;
    });
  };

  const resetToDefaults = () => {
    setData(DEFAULT_REEL_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadPreset = (presetData: ReelInsightsState) => {
    setData(JSON.parse(JSON.stringify(presetData)));
  };

  const exportProjectJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reel-insights-project-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProjectJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.topMetrics && parsed.summary) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON project:', e);
    }
    return false;
  };

  const addCountryItem = (name: string, percentage: number) => {
    setData((prev) => {
      const newCountry: DemographicItem = {
        id: `country-${Date.now()}`,
        name: name.trim() || 'New Country',
        percentage: Number(percentage) || 0,
      };
      return {
        ...prev,
        audience: {
          ...prev.audience,
          country: [...prev.audience.country, newCountry],
        },
      };
    });
  };

  const removeCountryItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        country: prev.audience.country.filter((c) => c.id !== id),
      },
    }));
  };

  const addSourceItem = (name: string, percentage: number) => {
    setData((prev) => {
      const newSource: ViewSource = {
        id: `source-${Date.now()}`,
        name: name.trim() || 'Custom Source',
        percentage: Number(percentage) || 0,
      };
      return {
        ...prev,
        topSources: [...prev.topSources, newSource],
      };
    });
  };

  const removeSourceItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      topSources: prev.topSources.filter((s) => s.id !== id),
    }));
  };

  return (
    <InsightsContext.Provider
      value={{
        data,
        setData,
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        activeTab,
        setActiveTab,
        audienceSubTab,
        setAudienceSubTab,
        viewsChartFilter,
        setViewsChartFilter,
        activeEditTarget,
        openEditor,
        closeEditor,
        updateValueByPath,
        isMediaModalOpen,
        setIsMediaModalOpen,
        isChartModalOpen,
        setIsChartModalOpen,
        isPresetsModalOpen,
        setIsPresetsModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isDateShiftModalOpen,
        setIsDateShiftModalOpen,
        isTypicalModalOpen,
        setIsTypicalModalOpen,
        resetToDefaults,
        loadPreset,
        exportProjectJson,
        importProjectJson,
        addCountryItem,
        removeCountryItem,
        addSourceItem,
        removeSourceItem,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
};

export const useInsights = () => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
};
