import React, { useState } from "react";

// PcMarker component represents a single PC dot on the map
function PcMarker({ x, y, status, pc }) {

  // State to control popup visibility
  const [showInfo, setShowInfo] = useState(false);

  // Default color
  let color = "gray";

  // Change color based on status
  if (status === "online") color = "green";
  if (status === "offline") color = "red";

  return (
    <>
      {/* =========================
          PC DOT
      ========================== */}
      <div
        onClick={() => setShowInfo(!showInfo)}

        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "12px",
          height: "12px",
          backgroundColor: color,
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 9999   // 🔥 VERY IMPORTANT FIX
        }}
      />

      {/* =========================
          POPUP
      ========================== */}
      {showInfo && (
        <div
          style={{
            position: "absolute",
            left: x + 15,
            top: y,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 10000  // 🔥 keep popup above everything
          }}
        >
          <strong>{pc.hostname}</strong><br />
          IP: {pc.ip_address}<br />
          Desk: {pc.desk_id}<br />
          Status: {pc.status}
        </div>
      )}
    </>
  );
}

export default PcMarker;