import React, { useState } from "react";

function PcMarker({ x, y, status, pc, refresh, highlight }) {

  const [showInfo, setShowInfo] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    hostname: pc.hostname,
    ip_address: pc.ip_address,
    desk_id: pc.desk_id
  });

  let color = "gray";
  if (status === "online") color = "green";
  if (status === "offline") color = "red";

  const handleDragStart = (e) => {
    e.dataTransfer.setData("pcId", pc.id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/pcs/${pc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    setEditMode(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this PC?")) return;

    await fetch(`http://localhost:5000/api/pcs/${pc.id}`, {
      method: "DELETE"
    });

    refresh();
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={() => setShowInfo(!showInfo)}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "12px",
          height: "12px",
          backgroundColor: highlight ? "yellow" : color,
          borderRadius: "50%",
          cursor: "grab",
          zIndex: 9999
        }}
      />

      {showInfo && (
        <div style={{
          position: "absolute",
          left: x + 15,
          top: y,
          background: "white",
          border: "1px solid black",
          padding: "10px",
          zIndex: 10000
        }}>
          {editMode ? (
            <>
              <input name="hostname" value={formData.hostname} onChange={handleChange} /><br />
              <input name="ip_address" value={formData.ip_address} onChange={handleChange} /><br />
              <input name="desk_id" value={formData.desk_id} onChange={handleChange} /><br />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <strong>{pc.hostname}</strong><br />
              {pc.ip_address}<br />
              {pc.desk_id}<br /><br />
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default PcMarker;