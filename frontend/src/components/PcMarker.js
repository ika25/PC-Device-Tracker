import React, { useState } from "react";

// PcMarker component represents a single PC dot on the map
function PcMarker({ x, y, status, pc }) {

  // State to control whether popup is visible
  const [showInfo, setShowInfo] = useState(false);

  // Default color
  let color = "gray";

  // Change color based on PC status
  if (status === "online") color = "green";
  if (status === "offline") color = "red";

  return (
    <>
      {/* =========================
          PC DOT (CIRCLE)
      ========================== */}
      <div
        // When user clicks the dot → toggle popup
        onClick={() => setShowInfo(!showInfo)}

        style={{
          position: "absolute",   // allows positioning over image
          left: x,                // horizontal position
          top: y,                 // vertical position
          width: "12px",          // dot size
          height: "12px",
          backgroundColor: color, // color based on status
          borderRadius: "50%",    // makes it a circle
          cursor: "pointer"       // shows clickable cursor
        }}
      />

      {/* =========================
          POPUP INFO BOX
      ========================== */}
      {showInfo && (   // only show if clicked
        <div
          style={{
            position: "absolute",
            left: x + 15,          // offset from dot
            top: y,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "12px"
          }}
        >
          {/* Display PC info */}
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