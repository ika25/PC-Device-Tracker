import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  const [pcs, setPcs] = useState([]);

  // ===============================
  // FETCH PCs
  // ===============================
  useEffect(() => {
    fetch("http://localhost:5000/api/pcs")
      .then(res => res.json())
      .then(data => setPcs(data));
  }, []);

  // ===============================
  // HANDLE DROP (WHEN PC IS MOVED)
  // ===============================
  const handleDrop = async (e) => {

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    // Get PC id from drag
    const pcId = e.dataTransfer.getData("pcId");

    console.log("Moving PC:", pcId, "to", x, y);

    try {
      // Update DB
      await fetch(`http://localhost:5000/api/pcs/${pcId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          x_position: x,
          y_position: y
        })
      });

      // Refresh data
      const res = await fetch("http://localhost:5000/api/pcs");
      const data = await res.json();
      setPcs(data);

    } catch (err) {
      console.error("Error updating position:", err);
    }
  };

  // Allow dropping
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // ===============================
  // RENDER
  // ===============================
  return (

    <div
      style={{ position: "relative", width: "800px" }}
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >

      {/* FLOOR PLAN */}
      <img
        src="/floorplan.png"
        alt="Floor Plan"
        style={{ width: "100%", display: "block" }}
      />

      {/* PC MARKERS */}
      {pcs
        .filter(pc => pc.x_position !== null && pc.y_position !== null)
        .map(pc => (
          <PcMarker
            key={pc.id}
            x={Number(pc.x_position)}
            y={Number(pc.y_position)}
            status={pc.status}
            pc={pc}
          />
        ))
      }

    </div>
  );
}

export default FloorMap;