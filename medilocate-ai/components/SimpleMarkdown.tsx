import React from 'react';
import { DirectionIcon } from './Icons';

// Helper to handle bold syntax (**text**), Phone tags [[PHONE: number]], and Coords tags [[COORDS: lat,lng]]
const formatTextWithTags = (text: string) => {
  // Split by both PHONE and COORDS tag patterns
  const parts = text.split(/(\[\[(?:PHONE|COORDS):.*?\]\])/g);
  
  return parts.map((part, i) => {
    // Handle Phone Tag
    if (part.startsWith('[[PHONE:') && part.endsWith(']]')) {
      const number = part.replace('[[PHONE:', '').replace(']]', '').trim();
      return (
        <a 
          key={i}
          href={`tel:${number}`}
          className="inline-flex items-center gap-1 ml-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md hover:bg-green-700 transition-colors shadow-sm align-middle no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
          </svg>
          Call Now
        </a>
      );
    }

    // Handle Coords Tag
    if (part.startsWith('[[COORDS:') && part.endsWith(']]')) {
      const coordsStr = part.replace('[[COORDS:', '').replace(']]', '').trim();
      return (
        <a 
          key={i}
          href={`https://www.google.com/maps/dir/?api=1&destination=${coordsStr}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md hover:bg-blue-700 transition-colors shadow-sm align-middle no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 3.314 6 10 6 10s6-6.686 6-10a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" clipRule="evenodd" />
          </svg>
          Get Directions
        </a>
      );
    }

    // Handle Bold Text inside the regular parts
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={i}>
        {boldParts.map((subPart, j) => {
          if (subPart.startsWith('**') && subPart.endsWith('**')) {
            return <strong key={j} className="font-semibold text-slate-900">{subPart.slice(2, -2)}</strong>;
          }
          return <span key={j}>{subPart}</span>;
        })}
      </React.Fragment>
    );
  });
};

// A lightweight component to format text with basic markdown-like syntax
export const SimpleMarkdown = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-slate-700 leading-relaxed">
      {lines.map((line, index) => {
        const key = `line-${index}`;
        
        // Header detection
        if (line.startsWith('## ')) {
          return (
            <div key={key} className="flex flex-wrap items-center gap-y-2 mt-4 mb-2">
                <h3 className="text-xl font-bold text-slate-900 inline-block mr-2">
                    {formatTextWithTags(line.replace('## ', ''))}
                </h3>
            </div>
          );
        }
        if (line.startsWith('### ')) {
          return <h4 key={key} className="text-lg font-semibold text-slate-800 mt-3 mb-1">{formatTextWithTags(line.replace('### ', ''))}</h4>;
        }

        // List item detection
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const listContent = line.trim().substring(2);
          return (
            <div key={key} className="flex items-start ml-2 mb-1">
              <span className="mr-2 mt-2 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
              <span className="flex-1">
                {formatTextWithTags(listContent)}
              </span>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(line.trim())) {
           return (
            <div key={key} className="ml-2 mb-1 font-medium text-slate-900 mt-4">
              {formatTextWithTags(line)}
            </div>
           );
        }

        // Empty line
        if (!line.trim()) {
          return <div key={key} className="h-2"></div>;
        }

        // Standard paragraph
        return <p key={key}>{formatTextWithTags(line)}</p>;
      })}
    </div>
  );
};