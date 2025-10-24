import React from "react";
export default function SunIcon({width=18,height=18,fill="currentColor"}) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.8 1.8-1.79zM1 13h3v-2H1v2zm10 8h2v-3h-2v3zm8.83-17.96l-1.79 1.8 1.8 1.79 1.8-1.79-1.81-1.8zM17.24 19.16l1.79 1.79 1.42-1.41-1.79-1.79-1.42 1.41zM20 11v2h3v-2h-3zM4.22 18.36l-1.41 1.41 1.79 1.79 1.41-1.41-1.79-1.79zM12 6a6 6 0 100 12 6 6 0 000-12z" fill={fill}/>
    </svg>
  );
}
