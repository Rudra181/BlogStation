import React from "react";
export default function MoonIcon({width=18,height=18,fill="currentColor"}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={fill}/>
    </svg>
  );
}
