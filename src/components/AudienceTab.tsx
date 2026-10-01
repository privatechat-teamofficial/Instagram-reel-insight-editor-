import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { InfoCircleIcon } from './InstagramIcons';
import { AudienceSubTab } from '../types/insights';
import { DEFAULT_REEL_DATA } from '../data/defaultData';
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

  const formatPercent = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? '0.0%' : `${num.toFixed(1)}%`;
  };

  const ageList =
    data?.audience?.age && data.audience.age.length > 0
      ? data.audience.age
      : DEFAULT_REEL_DATA.audience.age;

  const countryList =
    data?.audience?.country && data.audience.country.length > 0
      ? data.audience.country
      : DEFAULT_REEL_DATA.audience.country;

  const genderList =
    data?.audience?.gender && data.audience.gender.length > 0
      ? data.audience.gender
      : DEFAULT_REEL_DATA.audience.gender;

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
    <div className="flex flex-col px-4 pt-6 pb-14 w-full text-white select-none bg-[#0d0f12]">
      {/* 1. Who viewed your reel */}
      <section className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Who viewed your reel</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        {/* Followers & Non-followers with exact Instagram rhythm */}
        <div className="flex flex-col gap-6 mt-6">
          {/* Followers */}
          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-normal text-white leading-tight">Followers</span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8247ff] rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, data.audience.followersPercentage))}%` }}
                />
              </div>
              <EditableValue
                path="audience.followersPercentage"
                title="Followers percentage"
                type="percentage"
                value={data.audience.followersPercentage}
                className="text-[15px] font-normal text-white tabular-numbers w-14 text-right shrink-0"
              >
                {formatPercent(data?.audience?.followersPercentage)}
              </EditableValue>
            </div>
          </div>

          {/* Non-followers */}
          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-normal text-white leading-tight">Non-followers</span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8247ff] rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, Number(data?.audience?.nonFollowersPercentage) || 0))}%` }}
                />
              </div>
              <EditableValue
                path="audience.nonFollowersPercentage"
                title="Non-followers percentage"
                type="percentage"
                value={data.audience.nonFollowersPercentage}
                className="text-[15px] font-normal text-white tabular-numbers w-14 text-right shrink-0"
              >
                {formatPercent(data?.audience?.nonFollowersPercentage)}
              </EditableValue>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Audience details */}
      <section className="flex flex-col mt-11">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Audience details</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        {/* Sub-tabs filter pills: Age | Country | Gender */}
        <div className="flex items-center gap-2 mt-4">
          {subTabs.map((tab) => {
            const isActive = audienceSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceSubTab(tab.id)}
                className={`h-[34px] px-4 inline-flex items-center justify-center text-[13.5px] font-medium leading-none rounded-full border outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-colors ${
                  isActive
                    ? 'bg-[#282d35] text-white border-[#38404c]'
                    : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-white hover:border-[#323842]'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="leading-none text-center font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-tab Breakdown */}
        <div className="flex flex-col mt-6 min-h-[220px]">
          {/* A. AGE SUBTAB */}
          <div className={audienceSubTab === 'age' ? 'flex flex-col gap-[22px]' : 'hidden'}>
            {ageList.map((item, idx) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <EditableValue
                    path={`audience.age.${idx}.name`}
                    title="Age group label"
                    type="text"
                    value={item.name}
                    className="text-[15px] font-normal text-white leading-tight"
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
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FE36FF] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                  <EditableValue
                    path={`audience.age.${idx}.percentage`}
                    title={`${item.name} percentage`}
                    type="percentage"
                    value={item.percentage}
                    className="text-[15px] font-normal text-white tabular-numbers w-14 text-right shrink-0"
                  >
                    {formatPercent(item.percentage)}
                  </EditableValue>
                </div>
              </div>
            ))}

            {isEditMode && (
              <button
                type="button"
                onClick={handleAddAgeBucket}
                className="text-[#FE36FF] hover:opacity-80 text-[12px] font-medium flex items-center gap-1 self-start pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add age bracket
              </button>
            )}
          </div>

          {/* B. COUNTRY SUBTAB */}
          <div className={audienceSubTab === 'country' ? 'flex flex-col gap-[22px]' : 'hidden'}>
            {countryList.map((item, idx) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <EditableValue
                    path={`audience.country.${idx}.name`}
                    title="Country name"
                    type="country_select"
                    value={item.name}
                    className="text-[15px] font-normal text-white leading-tight"
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
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FE36FF] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                  <EditableValue
                    path={`audience.country.${idx}.percentage`}
                    title={`${item.name} percentage`}
                    type="percentage"
                    value={item.percentage}
                    className="text-[15px] font-normal text-white tabular-numbers w-14 text-right shrink-0"
                  >
                    {formatPercent(item.percentage)}
                  </EditableValue>
                </div>
              </div>
            ))}

            {isEditMode && (
              <button
                type="button"
                onClick={() => addCountryItem('United States', 5.0)}
                className="text-[#FE36FF] hover:opacity-80 text-[12px] font-medium flex items-center gap-1 self-start pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add country
              </button>
            )}
          </div>

          {/* C. GENDER SUBTAB */}
          <div className={audienceSubTab === 'gender' ? 'flex flex-col gap-[22px]' : 'hidden'}>
            {genderList.map((item, idx) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <EditableValue
                    path={`audience.gender.${idx}.name`}
                    title="Gender label"
                    type="text"
                    value={item.name}
                    className="text-[15px] font-normal text-white leading-tight"
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
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FE36FF] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    />
                  </div>
                  <EditableValue
                    path={`audience.gender.${idx}.percentage`}
                    title={`${item.name} percentage`}
                    type="percentage"
                    value={item.percentage}
                    className="text-[15px] font-normal text-white tabular-numbers w-14 text-right shrink-0"
                  >
                    {formatPercent(item.percentage)}
                  </EditableValue>
                </div>
              </div>
            ))}

            {isEditMode && (
              <button
                type="button"
                onClick={handleAddGenderItem}
                className="text-[#FE36FF] hover:opacity-80 text-[12px] font-medium flex items-center gap-1 self-start pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add gender category
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
