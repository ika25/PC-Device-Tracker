const pool = require("../db");

// ===============================
// GET ALL PCs
// ===============================
exports.getAllPCs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pcs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).send("Server error");
  }
};

// ===============================
// ADD PC (WITH EXTRA FIELDS)
// ===============================
exports.addPC = async (req, res) => {
  try {
    const {
      hostname,
      ip_address,
      desk_id,
      x_position,
      y_position,
      status,
      floor,

      // NEW FIELDS
      os,
      ram,
      maker,
      age
    } = req.body;

    await pool.query(
      `INSERT INTO pcs 
       (hostname, ip_address, desk_id, x_position, y_position, status, floor, os, ram, maker, age)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        hostname,
        ip_address,
        desk_id,
        x_position,
        y_position,
        status || "online",
        floor || "Floor 1",

        // NEW VALUES
        os || null,
        ram || null,
        maker || null,
        age || null
      ]
    );

    res.send("PC added successfully");

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).send("Error adding PC");
  }
};

// ===============================
// UPDATE PC (ADD SUPPORT FOR NEW FIELDS)
// ===============================
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      hostname,
      ip_address,
      desk_id,
      x_position,
      y_position,
      floor,

      // NEW FIELDS
      os,
      ram,
      maker,
      age
    } = req.body;

    await pool.query(
      `UPDATE pcs
       SET 
         hostname = COALESCE($1, hostname),
         ip_address = COALESCE($2, ip_address),
         desk_id = COALESCE($3, desk_id),
         x_position = COALESCE($4, x_position),
         y_position = COALESCE($5, y_position),
         floor = COALESCE($6, floor),

         -- NEW FIELDS
         os = COALESCE($7, os),
         ram = COALESCE($8, ram),
         maker = COALESCE($9, maker),
         age = COALESCE($10, age)

       WHERE id = $11`,
      [
        hostname,
        ip_address,
        desk_id,
        x_position,
        y_position,
        floor,

        // NEW VALUES
        os,
        ram,
        maker,
        age,

        id
      ]
    );

    res.send("PC updated successfully");

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send("Error updating PC");
  }
};

// ===============================
// DELETE PC
// ===============================
exports.deletePC = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM pcs WHERE id = $1", [id]);

    res.send("PC deleted successfully");

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send("Error deleting PC");
  }
};