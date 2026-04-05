import React from "react";

function PcMarker({ x, y, status }) {

  let color = "gray";

  if (status === "online") color = "green";
  if (status === "offline") color = "red";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "12px",
        height: "12px",
        backgroundColor: color,
        borderRadius: "50%"
      }}
    />
  );
}

export default PcMarker;