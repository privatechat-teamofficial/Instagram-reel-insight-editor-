import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditFieldType } from '../types/insights';
import { Pencil } from 'lucide-react';

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
      title={`Click to edit ${title}`}
      className={`group/edit inline-flex items-center gap-1 cursor-pointer transition-all duration-150 rounded px-1 -mx-1 py-0.5 -my-0.5 hover:bg-pink-500/15 hover:ring-1 hover:ring-pink-500/40 relative ${className}`}
    >
      <span>{children ?? displayValue ?? String(value)}</span>
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-pink-400 shrink-0">
        <Pencil className="w-2.5 h-2.5" />
      </span>
    </span>
  );
};
