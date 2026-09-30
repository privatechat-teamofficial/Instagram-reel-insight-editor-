import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditFieldType } from '../types/insights';

interface EditableValueProps {
  path: string;
  title: string;
  type: EditFieldType;
  value: any;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    parentIndex?: number;
  };
  className?: string;
  children?: React.ReactNode;
  displayValue?: React.ReactNode;
}

export const EditableValue: React.FC<EditableValueProps> = ({
  path,
  title,
  type,
  value,
  options,
  className = '',
  children,
  displayValue,
}) => {
  const { isEditMode, openEditor } = useInsights();

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    openEditor({
      path,
      title,
      type,
      value,
      options,
    });
  };

  if (!isEditMode) {
    return <span className={className}>{children ?? displayValue ?? String(value)}</span>;
  }

  return (
    <span
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`Click to edit ${title}`}
      className={`cursor-pointer transition-colors duration-150 hover:text-pink-400 active:scale-98 rounded px-0.5 -mx-0.5 hover:bg-pink-500/10 ${className}`}
    >
      {children ?? displayValue ?? String(value)}
    </span>
  );
};
