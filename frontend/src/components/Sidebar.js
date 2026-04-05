import React from "react";

function Sidebar({ pcs, onDelete, onSelect }) {

  return (
    <div style={{
      width: "250px",
      height: "100vh",
      overflowY: "auto",
      borderRight: "1px solid #ccc",
      padding: "10px",
      background: "#f9f9f9"
    }}>

      <h3>Assets</h3>

      {pcs.length === 0 && <p>No PCs</p>}

      {pcs.map(pc => (
        <div
          key={pc.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "8px",
            cursor: "pointer"
          }}
        >

          {/* CLICK TO SELECT */}
          <div onClick={() => onSelect(pc)}>
            <strong>{pc.hostname}</strong><br />
            <small>{pc.ip_address}</small>
          </div>

          {/* DELETE BUTTON */}
          <button
            onClick={() => onDelete(pc.id)}
            style={{
              marginTop: "5px",
              background: "red",
              color: "white",
              border: "none",
              padding: "3px 6px",
              cursor: "pointer"
            }}
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default Sidebar;