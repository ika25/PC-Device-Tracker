import React, { useState } from "react";

// Draggable PC Marker
function PcMarker({ x, y, status, pc, onDrop }) {

  const [showInfo, setShowInfo] = useState(false);

  // Determine color
  let color = "gray";
  if (status === "online") color = "green";
  if (status === "offline") color = "red";

  // ===============================
  // HANDLE DRAG START
  // ===============================
  const handleDragStart = (e) => {
    // Save PC id so we know which one is moving
    e.dataTransfer.setData("pcId", pc.id);
  };

  return (
    <>
      {/* PC DOT */}
      <div
        draggable   // 👈 enables dragging
        onDragStart={handleDragStart}
        onClick={() => setShowInfo(!showInfo)}

        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "12px",
          height: "12px",
          backgroundColor: color,
          borderRadius: "50%",
          cursor: "grab",
          zIndex: 9999
        }}
      />

      {/* POPUP */}
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
            zIndex: 10000
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