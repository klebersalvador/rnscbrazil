import React from 'react';

export default function HorseIcon({ size = 24, className = '', color = 'currentColor', ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 21l8 0" />
      <path d="M10 21l0 -4l-1.5 -1.5l2.5 -2.5" />
      <path d="M14 21l0 -5l-3 -1.5l6 -4.5l-2 -7l-7 0l-2 4l2 4l-3 1.5l1 3l2.5 -1.5" />
    </svg>
  );
}
