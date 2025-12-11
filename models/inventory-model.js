const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a single vehicle by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
    `SELECT * FROM public.inventory AS i
    JOIN public.classification AS c
    ON i.classification_id = c.classification_id
    WHERE i.inv_id = $1`,
    [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error" + error)
  }
}

/* *****************************
*   Add New Classification
* *************************** */
async function addClassification(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [classification_name])
        return data.rows[0] 
    } catch (error) {
        return null
    }
}

/* *****************************
*   Add New Inventory Item
* *************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
) {
  try {
    const sql = `
      INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `

    const data = await pool.query(sql, [
      classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    ])

    return data.rows[0]
  } catch (error) {
    console.error("addInventory error: " + error)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rowCount > 0;
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    throw error;
  }
}

async function getVehiclesByFilters(minPrice, maxPrice, minYear) {
  try {
    const sql = `
      SELECT * FROM public.inventory
      WHERE inv_price BETWEEN $1 AND $2
      AND inv_year >= $3
      ORDER BY inv_price ASC
    `;
    const result = await pool.query(sql, [minPrice, maxPrice, minYear]);
    return result.rows;
  } catch (error) {
    console.error("Error in getVehiclesByFilters:", error);
    throw new Error("Database query failed");
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventoryItem, getVehiclesByFilters}