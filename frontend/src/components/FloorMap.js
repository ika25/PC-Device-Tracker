import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  // ===============================
  // STATE: store list of PCs
  // ===============================
  const [pcs, setPcs] = useState([]);

  // ===============================
  // FETCH PCs FROM BACKEND
  // Runs once when component loads
  // ===============================
  useEffect(() => {

    fetch("http://localhost:5000/api/pcs")
      .then(res => res.json())
      .then(data => {
        setPcs(data);
      })
      .catch(err => console.error("Error fetching PCs:", err));

  }, []);

  // ===============================
  // HANDLE CLICK ON FLOOR MAP
  // ===============================
  const handleMapClick = (e) => {

    // Only allow clicks on image (ignore markers/popups)
    if (e.target.tagName !== "IMG") return;

    const rect = e.target.getBoundingClientRect();

    // Calculate click position relative to image
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    // Add new PC
    addPC(x, y);
  };

  // ===============================
  // ADD NEW PC (POST REQUEST)
  // ===============================
  const addPC = async (x, y) => {

    const newPC = {
      hostname: "NEW-PC",        // placeholder (next step = form)
      ip_address: "192.168.1.200",
      desk_id: "D2",
      status: "online",
      x_position: x,
      y_position: y
    };

    try {
      // Send POST request
      await fetch("http://localhost:5000/api/pcs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPC)
      });

      // Fetch updated data
      const res = await fetch("http://localhost:5000/api/pcs");
      const data = await res.json();

      // Update UI
      setPcs(data);

    } catch (err) {
      console.error("Error adding PC:", err);
    }
  };

  // ===============================
  // RENDER COMPONENT
  // ===============================
  return (

    <div
      style={{
        position: "relative",   // needed for absolute positioning
        width: "800px"          // match image width
      }}
    >

      {/* =========================
          FLOOR PLAN IMAGE
      ========================== */}
      <img
        src="/floorplan.png"
        alt="Floor Plan"
        style={{
          width: "100%",
          display: "block",
          cursor: "crosshair"
        }}
        onClick={handleMapClick}
      />

      {/* =========================
          PC MARKERS (CLEAN)
      ========================== */}
      {pcs
        // Only show valid PCs
        .filter(pc =>
          pc.x_position !== null &&
          pc.y_position !== null
        )
        .map(pc => {

          const x = Number(pc.x_position);
          const y = Number(pc.y_position);

          return (
            <PcMarker
              key={pc.id}
              x={x}
              y={y}
              status={pc.status}
              pc={pc}
            />
          );
        })
      }

    </div>
  );
}

export default FloorMap;