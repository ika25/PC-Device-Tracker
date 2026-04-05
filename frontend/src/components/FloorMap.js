import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  // ===============================
  // STATE
  // ===============================
  const [pcs, setPcs] = useState([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    hostname: "",
    ip_address: "",
    desk_id: ""
  });

  // ===============================
  // FETCH PCs
  // ===============================
  useEffect(() => {
    fetch("http://localhost:5000/api/pcs")
      .then(res => res.json())
      .then(data => setPcs(data));
  }, []);

  // ===============================
  // HANDLE MAP CLICK
  // ===============================
  const handleMapClick = (e) => {

    if (e.target.tagName !== "IMG") return;

    const rect = e.target.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    // Save click position
    setClickPosition({ x, y });

    // Show form
    setShowForm(true);
  };

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ===============================
  // SUBMIT FORM
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPC = {
      ...formData,
      status: "online",
      x_position: clickPosition.x,
      y_position: clickPosition.y
    };

    try {
      await fetch("http://localhost:5000/api/pcs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPC)
      });

      // Refresh PCs
      const res = await fetch("http://localhost:5000/api/pcs");
      const data = await res.json();
      setPcs(data);

      // Reset form
      setShowForm(false);
      setFormData({
        hostname: "",
        ip_address: "",
        desk_id: ""
      });

    } catch (err) {
      console.error("Error adding PC:", err);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (

    <div style={{ position: "relative", width: "800px" }}>

      {/* FLOOR PLAN */}
      <img
        src="/floorplan.png"
        alt="Floor Plan"
        style={{ width: "100%", display: "block", cursor: "crosshair" }}
        onClick={handleMapClick}
      />

      {/* =========================
          FORM POPUP
      ========================== */}
      {showForm && (
        <div
          style={{
            position: "absolute",
            left: clickPosition.x,
            top: clickPosition.y,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 10000
          }}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="hostname"
                placeholder="Hostname"
                value={formData.hostname}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="ip_address"
                placeholder="IP Address"
                value={formData.ip_address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="desk_id"
                placeholder="Desk"
                value={formData.desk_id}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Save</button>
          </form>
        </div>
      )}

      {/* =========================
          PC MARKERS
      ========================== */}
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