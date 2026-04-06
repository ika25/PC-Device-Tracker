import React, { useState } from "react";

function PcMarker({ x, y, status, pc, refresh, isSearchMatch, isSearching }) {

  const [showInfo, setShowInfo] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 🔥 UPDATED FORM DATA (includes new fields)
  const [formData, setFormData] = useState({
    hostname: pc.hostname,
    ip_address: pc.ip_address,
    desk_id: pc.desk_id,
    os: pc.os || "",
    ram: pc.ram || "",
    maker: pc.maker || "",
    age: pc.age || ""
  });

  // ===============================
  // DRAG START
  // ===============================
  const handleDragStart = (e) => {
    e.dataTransfer.setData("pcId", pc.id);
  };

  // ===============================
  // INPUT CHANGE (SAFE VERSION)
  // ===============================
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ===============================
  // UPDATE PC
  // ===============================
  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/pcs/${pc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    setEditMode(false);
    refresh();
  };

  // ===============================
  // DELETE PC
  // ===============================
  const handleDelete = async () => {
    if (!window.confirm("Delete this PC?")) return;

    await fetch(`http://localhost:5000/api/pcs/${pc.id}`, {
      method: "DELETE"
    });

    refresh();
  };

  // ===============================
  // GLOW LOGIC
  // ===============================
  const getGlow = () => {

    if (isSearchMatch) return "drop-shadow(0 0 8px lime)";
    if (isSearching) return "drop-shadow(0 0 5px gold)";

    if (status === "online") return "drop-shadow(0 0 5px green)";
    if (status === "offline") return "drop-shadow(0 0 5px red)";

    return "none";
  };

  return (
    <>
      {/* =========================
          PC ICON MARKER
      ========================== */}
      <div
        className="pc-marker"
        draggable
        onDragStart={handleDragStart}
        onClick={() => setShowInfo(!showInfo)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")
        }
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          cursor: "grab",
          zIndex: 9999,
          opacity: isSearching && !isSearchMatch ? 0.4 : 1
        }}
      >
        <img
          src="/pc.png"
          alt="PC"
          style={{
            width: "24px",
            height: "24px",
            filter: getGlow()
          }}
        />
      </div>

      {/* =========================
          POPUP INFO
      ========================== */}
      {showInfo && (
        <div
          style={{
            position: "absolute",
            left: x + 15,
            top: y,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 10000
          }}
        >

          {editMode ? (
            <>
              <input name="hostname" value={formData.hostname} onChange={handleChange} /><br />
              <input name="ip_address" value={formData.ip_address} onChange={handleChange} /><br />
              <input name="desk_id" value={formData.desk_id} onChange={handleChange} /><br />

              {/* 🔥 NEW FIELDS */}
              <input name="os" value={formData.os} onChange={handleChange} placeholder="OS" /><br />
              <input name="ram" value={formData.ram} onChange={handleChange} placeholder="RAM" /><br />
              <input name="maker" value={formData.maker} onChange={handleChange} placeholder="Maker" /><br />
              <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" /><br />

              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <strong>{pc.hostname}</strong><br />
              IP: {pc.ip_address}<br />
              Desk: {pc.desk_id}<br />
              Status: {pc.status}<br />

              OS: {pc.os || "N/A"}<br />
              RAM: {pc.ram || "N/A"}<br />
              Maker: {pc.maker || "N/A"}<br />
              Age: {pc.age ? pc.age + " yrs" : "N/A"}<br />
              Added: {pc.date_added ? new Date(pc.date_added).toLocaleDateString() : "N/A"}<br /><br />

              {/* ACTIONS */}
              <button onClick={() => setEditMode(true)} style={{ marginRight: "5px" }}>
                Edit
              </button>

              <button onClick={handleDelete}>
                Delete
              </button>
            </>
          )}

        </div>
      )}
    </>
  );
}

export default PcMarker;