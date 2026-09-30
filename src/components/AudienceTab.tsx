import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { InfoCircleIcon } from './InstagramIcons';
import { AudienceSubTab } from '../types/insights';
import { Plus, Trash2 } from 'lucide-react';

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

  const subTabs: { id: AudienceSubTab; label: string }[] = [
    { id: 'age', label: 'Age' },
    { id: 'country', label: 'Country' },
    { id: 'gender', label: 'Gender' },
  ];

  const handleAddAgeBucket = () => {
    setData((prev) => ({
      ...prev,
      audience: {
        ...prev.audience,
        age: [...prev.audience.age, { id: `age-${Date.now()}`, name: 'Custom', percentage: 5.0 }],
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
        gender: [...prev.audience.gender, { id: `gen-${Date.now()}`, name: 'Other', percentage: 2.0 }],
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
    <div className="flex flex-col gap-3.5 px-4 pt-2.5 pb-12 w-full text-white select-none bg-[#0d0f12]">
      {/* 1. Who viewed your reel */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[15px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Who viewed your reel</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        <div className="flex flex-col gap-2 mt-0.5">
          {/* Followers */}
          <div className="flex flex-col gap-0">
            <span className="text-[13px] font-normal text-white leading-tight">Followers</span>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex-1 h-[6px] bg-[#222730] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#804cf0] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, data.audience.followersPercentage))}%` }}
                />
              </div>
              <EditableValue
                path="audience.followersPercentage"
                title="Followers percentage"
                type="percentage"
                value={data.audience.followersPercentage}
                className="text-[13px] font-normal text-white tabular-numbers w-12 text-right shrink-0"
              >
                {data.audience.followersPercentage.toFixed(1)}%
              </EditableValue>
            </div>
          </div>

          {/* Non-followers */}
          <div className="flex flex-col gap-0">
            <span className="text-[13px] font-normal text-white leading-tight">Non-followers</span>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex-1 h-[6px] bg-[#222730] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#804cf0] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, data.audience.nonFollowersPercentage))}%` }}
                />
              </div>
              <EditableValue
                path="audience.nonFollowersPercentage"
                title="Non-followers percentage"
                type="percentage"
                value={data.audience.nonFollowersPercentage}
                className="text-[13px] font-normal text-white tabular-numbers w-12 text-right shrink-0"
              >
                {data.audience.nonFollowersPercentage.toFixed(1)}%
              </EditableValue>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Audience details */}
      <section className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[15px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Audience details</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        {/* Sub-tabs filter pills: Age | Country | Gender */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {subTabs.map((tab) => {
            const isActive = audienceSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceSubTab(tab.id)}
                className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-[#252932] text-white'
                    : 'bg-transparent text-[#8e959b] border border-[#2b3039] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-tab Breakdown */}
        <div className="flex flex-col gap-2 mt-3.5">
          {/* A. AGE SUBTAB (Default: 13-17, 18-24, 25-34, 35-44, 45-54, 55-64, 65+) */}
          {audienceSubTab === 'age' && (
            <div className="flex flex-col gap-2">
              {data.audience.age.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-0">
                  <div className="flex items-center gap-1.5">
                    <EditableValue
                      path={`audience.age.${idx}.name`}
                      title="Age group label"
                      type="text"
                      value={item.name}
                      className="text-[13px] font-normal text-white leading-tight"
                    >
                      {item.name}
                    </EditableValue>
                    {isEditMode && data.audience.age.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAgeBucket(item.id)}
                        className="text-gray-500 hover:text-red-400 p-0.5"
                        title="Delete age bracket"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex-1 h-[6px] bg-[#222730] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FE36FF] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                      />
                    </div>
                    <EditableValue
                      path={`audience.age.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="text-[13px] font-normal text-white tabular-numbers w-12 text-right shrink-0"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                </div>
              ))}

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddAgeBucket}
                  className="text-[#FE36FF] hover:opacity-80 text-[11.5px] font-medium flex items-center gap-1 self-start pt-1"
                >
                  <Plus className="w-3 h-3" /> Add age bracket
                </button>
              )}
            </div>
          )}

          {/* B. COUNTRY SUBTAB */}
          {audienceSubTab === 'country' && (
            <div className="flex flex-col gap-2">
              {data.audience.country.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-0">
                  <div className="flex items-center gap-1.5">
                    <EditableValue
                      path={`audience.country.${idx}.name`}
                      title="Country name"
                      type="country_select"
                      value={item.name}
                      className="text-[13px] font-normal text-white leading-tight"
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
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex-1 h-[6px] bg-[#222730] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FE36FF] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                      />
                    </div>
                    <EditableValue
                      path={`audience.country.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="text-[13px] font-normal text-white tabular-numbers w-12 text-right shrink-0"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                </div>
              ))}

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => addCountryItem('United States', 5.0)}
                  className="text-[#FE36FF] hover:opacity-80 text-[11.5px] font-medium flex items-center gap-1 self-start pt-1"
                >
                  <Plus className="w-3 h-3" /> Add country
                </button>
              )}
            </div>
          )}

          {/* C. GENDER SUBTAB */}
          {audienceSubTab === 'gender' && (
            <div className="flex flex-col gap-2">
              {data.audience.gender.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-0">
                  <div className="flex items-center gap-1.5">
                    <EditableValue
                      path={`audience.gender.${idx}.name`}
                      title="Gender label"
                      type="text"
                      value={item.name}
                      className="text-[13px] font-normal text-white leading-tight"
                    >
                      {item.name}
                    </EditableValue>
                    {isEditMode && data.audience.gender.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGenderItem(item.id)}
                        className="text-gray-500 hover:text-red-400 p-0.5"
                        title="Delete gender"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex-1 h-[6px] bg-[#222730] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FE36FF] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                      />
                    </div>
                    <EditableValue
                      path={`audience.gender.${idx}.percentage`}
                      title={`${item.name} percentage`}
                      type="percentage"
                      value={item.percentage}
                      className="text-[13px] font-normal text-white tabular-numbers w-12 text-right shrink-0"
                    >
                      {item.percentage.toFixed(1)}%
                    </EditableValue>
                  </div>
                </div>
              ))}

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddGenderItem}
                  className="text-[#FE36FF] hover:opacity-80 text-[11.5px] font-medium flex items-center gap-1 self-start pt-1"
                >
                  <Plus className="w-3 h-3" /> Add gender category
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
