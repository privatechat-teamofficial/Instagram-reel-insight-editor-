import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { InfoCircleIcon } from './InstagramIcons';
import { AudienceSubTab } from '../types/insights';
import { Plus, Trash2, Globe, Users, Calendar } from 'lucide-react';

export const AudienceTab: React.FC = () => {
  const {
    data,
    audienceSubTab,
    setAudienceSubTab,
    isEditMode,
    addCountryItem,
    removeCountryItem,
    setData,
  } = useInsights();

  const subTabs: { id: AudienceSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'age', label: 'Age', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'country', label: 'Country', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'gender', label: 'Gender', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  // Helper to add demographic item
  const handleAddAgeBucket = () => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        age: [...prev.audience.age, { id: `age-${Date.now()}`, name: 'Custom Age', percentage: 5.0 }],
      },
    }));
  };

  const handleRemoveAgeBucket = (id: string) => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        age: prev.audience.age.filter((item) => item.id !== id),
      },
    }));
  };

  const handleAddGenderItem = () => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        gender: [...prev.audience.gender, { id: `gen-${Date.now()}`, name: 'Non-binary', percentage: 2.0 }],
      },
    }));
  };

  const handleRemoveGenderItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        gender: prev.audience.gender.filter((item) => item.id !== id),
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-4 max-w-md mx-auto text-[#f5f5f5] select-none">
      {/* 1. Who viewed your reel */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Who viewed your reel</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        {/* Followers vs Non-followers */}
        <div className="flex flex-col gap-4 mt-1">
          {/* Followers */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-[#f5f5f5]">Followers</span>
              <EditableValue
                path="audience.followersPercentage"
                title="Followers percentage"
                type="percentage"
                value={data.audience.followersPercentage}
                className="font-medium text-[#f5f5f5] tabular-numbers"
              >
                {data.audience.followersPercentage.toFixed(1)}%
              </EditableValue>
            </div>
            {/* Purple Progress Bar */}
            <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b5cf6] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, data.audience.followersPercentage))}%` }}
              />
            </div>
          </div>

          {/* Non-followers */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-[#f5f5f5]">Non-followers</span>
              <EditableValue
                path="audience.nonFollowersPercentage"
                title="Non-followers percentage"
                type="percentage"
                value={data.audience.nonFollowersPercentage}
                className="font-medium text-[#f5f5f5] tabular-numbers"
              >
                {data.audience.nonFollowersPercentage.toFixed(1)}%
              </EditableValue>
            </div>
            {/* Purple Progress Bar */}
            <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b5cf6] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, data.audience.nonFollowersPercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Audience details */}
      <section className="flex flex-col gap-3 border-t border-[#181818] pt-4 mb-8">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Audience details</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        {/* Sub-tabs: Age | Country | Gender */}
        <div className="flex items-center gap-2 mt-1">
          {subTabs.map((tab) => {
            const isActive = audienceSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceSubTab(tab.id)}
                className={`px-3.5 py-1 text-[13px] font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-[#262626] text-[#ffffff] border border-[#3f3f46]'
                    : 'bg-[#181818] text-[#8e8e8e] border border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-tab Content */}
        <div className="flex flex-col gap-4 mt-2">
          {/* A. AGE SUBTAB */}
          {audienceSubTab === 'age' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#8e8e8e]">Age distribution</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddAgeBucket}
                    className="text-pink-400 hover:text-pink-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Age Bracket
                  </button>
                )}
              </div>

              {data.audience.age.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <EditableValue
                        path={`audience.age.${idx}.name`}
                        title="Age group label"
                        type="text"
                        value={item.name}
                        className="font-medium text-[#f5f5f5]"
                      >
                        {item.name}
                      </EditableValue>
                      {isEditMode && data.audience.age.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAgeBucket(item.id)}
                          className="text-gray-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <EditableValue
                      path={`audience.age.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="font-medium text-[#f5f5f5] tabular-numbers"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                  {/* Pink/Magenta Progress Bar */}
                  <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d9287a] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* B. COUNTRY SUBTAB (CRITICAL EDITABLE REQUIREMENT) */}
          {audienceSubTab === 'country' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#8e8e8e]">Top countries</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => addCountryItem('United States', 5.0)}
                    className="text-pink-400 hover:text-pink-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Country
                  </button>
                )}
              </div>

              {data.audience.country.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <EditableValue
                        path={`audience.country.${idx}.name`}
                        title="Country Name (e.g. India, United States, Germany)"
                        type="country_select"
                        value={item.name}
                        className="font-medium text-[#f5f5f5]"
                      >
                        {item.name}
                      </EditableValue>
                      {isEditMode && data.audience.country.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCountryItem(item.id)}
                          className="text-gray-500 hover:text-red-400 p-0.5"
                          title="Delete country"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <EditableValue
                      path={`audience.country.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="font-medium text-[#f5f5f5] tabular-numbers"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                  {/* Pink/Magenta Progress Bar */}
                  <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d9287a] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* C. GENDER SUBTAB */}
          {audienceSubTab === 'gender' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#8e8e8e]">Gender breakdown</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddGenderItem}
                    className="text-pink-400 hover:text-pink-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Category
                  </button>
                )}
              </div>

              {data.audience.gender.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <EditableValue
                        path={`audience.gender.${idx}.name`}
                        title="Gender label"
                        type="text"
                        value={item.name}
                        className="font-medium text-[#f5f5f5]"
                      >
                        {item.name}
                      </EditableValue>
                      {isEditMode && data.audience.gender.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGenderItem(item.id)}
                          className="text-gray-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <EditableValue
                      path={`audience.gender.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="font-medium text-[#f5f5f5] tabular-numbers"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                  {/* Purple/Pink Progress Bar */}
                  <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8b5cf6] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
