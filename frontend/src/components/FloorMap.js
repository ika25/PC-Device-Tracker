import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  const [pcs, setPcs] = useState([]);

  // ===============================
  // SEARCH STATE
  // ===============================
  const [search, setSearch] = useState("");

  // ===============================
  // FETCH PCs
  // ===============================
  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/pcs");
    const data = await res.json();
    setPcs(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===============================
  // ADD PC (FORM)
  // ===============================
  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    hostname: "",
    ip_address: "",
    desk_id: ""
  });

  const handleMapClick = (e) => {
    if (e.target.tagName !== "IMG") return;

    const rect = e.target.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setClickPosition({ x, y });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPC = {
      ...formData,
      status: "online",
      x_position: clickPosition.x,
      y_position: clickPosition.y
    };

    await fetch("http://localhost:5000/api/pcs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPC)
    });

    setShowForm(false);
    setFormData({ hostname: "", ip_address: "", desk_id: "" });

    fetchData();
  };

  // ===============================
  // DRAG DROP
  // ===============================
  const handleDrop = async (e) => {

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pcId = e.dataTransfer.getData("pcId");

    await fetch(`http://localhost:5000/api/pcs/${pcId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x_position: x, y_position: y })
    });

    fetchData();
  };

  const allowDrop = (e) => e.preventDefault();

  // ===============================
  // FILTER PCS BASED ON SEARCH
  // ===============================
  const filteredPCs = pcs.filter(pc =>
    pc.hostname.toLowerCase().includes(search.toLowerCase())
  );

  // ===============================
  // RENDER
  // ===============================
  return (
    <div>

      {/* =========================
          SEARCH BAR
      ========================== */}
      <input
        type="text"
        placeholder="Search PC..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "5px",
          width: "200px"
        }}
      />

      {/* =========================
          MAP CONTAINER
      ========================== */}
      <div
        style={{ position: "relative", width: "800px" }}
        onDrop={handleDrop}
        onDragOver={allowDrop}
      >

        <img
          src="/floorplan.png"
          alt="Floor Plan"
          style={{ width: "100%", display: "block", cursor: "crosshair" }}
          onClick={handleMapClick}
        />

        {/* FORM */}
        {showForm && (
          <div style={{
            position: "absolute",
            left: clickPosition.x,
            top: clickPosition.y,
            background: "white",
            border: "1px solid black",
            padding: "10px",
            zIndex: 10000
          }}>
            <form onSubmit={handleSubmit}>
              <input name="hostname" placeholder="Hostname" onChange={handleChange} required /><br />
              <input name="ip_address" placeholder="IP" onChange={handleChange} required /><br />
              <input name="desk_id" placeholder="Desk" onChange={handleChange} required /><br />
              <button type="submit">Save</button>
            </form>
          </div>
        )}

        {/* =========================
            PC MARKERS (FILTERED)
        ========================== */}
        {pcs
          .filter(pc => pc.x_position !== null && pc.y_position !== null)
          .map(pc => {

            const isMatch = pc.hostname
              .toLowerCase()
              .includes(search.toLowerCase());

            return (
              <PcMarker
                key={pc.id}
                x={Number(pc.x_position)}
                y={Number(pc.y_position)}
                status={pc.status}
                pc={pc}
                refresh={fetchData}
                highlight={isMatch}   // 👈 NEW
              />
            );
          })
        }

      </div>
    </div>
  );
}

export default FloorMap;