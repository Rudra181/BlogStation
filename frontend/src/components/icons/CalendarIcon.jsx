import React from "react";
export default function CalendarIcon({width=14,height=14,fill="currentColor"}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10h5v5H7zM19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H5V9h14v9z" fill={fill}/>
    </svg>
  );
}
