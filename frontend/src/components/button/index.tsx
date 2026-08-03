"use client";

import React from "react";

export function Button() {
  const [isClicked, setIsClicked] = React.useState(false);

  function handleClick() {
    setIsClicked(true);
    console.log("Button clicked!");

  }
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleClick}>
      Click Me
    </button>
  );
}
