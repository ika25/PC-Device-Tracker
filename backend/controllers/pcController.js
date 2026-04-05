const pool = require("../db");

// GET
exports.getAllPCs = async (req, res) => {
  const result = await pool.query("SELECT * FROM pcs");
  res.json(result.rows);
};

// ADD
exports.addPC = async (req, res) => {
  const { hostname, ip_address, desk_id, x_position, y_position, status } = req.body;

  await pool.query(
    "INSERT INTO pcs(hostname, ip_address, desk_id, x_position, y_position, status) VALUES ($1,$2,$3,$4,$5,$6)",
    [hostname, ip_address, desk_id, x_position, y_position, status]
  );

  res.send("Added");
};

// UPDATE (position OR edit)
exports.updateLocation = async (req, res) => {
  const { id } = req.params;

  const {
    hostname,
    ip_address,
    desk_id,
    x_position,
    y_position
  } = req.body;

  await pool.query(
    `UPDATE pcs
     SET hostname = COALESCE($1, hostname),
         ip_address = COALESCE($2, ip_address),
         desk_id = COALESCE($3, desk_id),
         x_position = COALESCE($4, x_position),
         y_position = COALESCE($5, y_position)
     WHERE id=$6`,
    [hostname, ip_address, desk_id, x_position, y_position, id]
  );

  res.send("Updated");
};

// DELETE
exports.deletePC = async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM pcs WHERE id=$1", [id]);

  res.send("Deleted");
};