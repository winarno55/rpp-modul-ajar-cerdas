
import React from 'react';
import { markdownToHtml } from '../utils/markdownUtils';

interface LessonPlanDisplayProps {
  planText: string;
}

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ planText }) => {
  const htmlContent = markdownToHtml(planText);

  // Changed text-slate-200 to text-black for light background preview
  // Prose classes default to dark text on light background, so this reinforces it.
  return (
    <div 
      className="prose prose-sm sm:prose-base max-w-none text-black h-full overflow-y-auto pr-2 print-content-body" 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
