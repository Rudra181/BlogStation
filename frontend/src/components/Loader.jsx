import React from "react";

export default function Loader({small}) {
  return (
    <div className="loader" aria-hidden={!small}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}
