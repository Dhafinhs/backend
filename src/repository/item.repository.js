const db = require("../database/pg.database");

exports.createItem = async (name, price, store_id, image_url, stock) => {
    try {
      const res = await db.query(
        "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, price, store_id, image_url, stock]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Error executing query", error);
      return null;
    }
  };

exports.getAllItems = async () => {
  try {
    const res = await db.query("SELECT * FROM items");
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.getItemById = async (id) => {
    try {
      console.log("Mengeksekusi query: SELECT * FROM items WHERE id =", id);
      const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
  
      if (res.rows.length === 0) {
        console.log("Item tidak ditemukan di database:", id);
        return null;
      }
  
      console.log("Item ditemukan di database:", res.rows[0]);
      return res.rows[0];
    } catch (error) {
      console.error("Error executing query", error);
      return null;
    }
  };
  
  exports.getItemsByStoreId = async (store_id) => {
  try {
    console.log("Mengeksekusi query: SELECT * FROM items WHERE store_id =", store_id);
    
    const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);

    if (res.rows.length === 0) {
      console.log("Tidak ada item ditemukan untuk store_id:", store_id);
      return [];
    }

    console.log("Items ditemukan di database:", res.rows);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.getItemsByStoreId = async (store_id) => {
    try {
      console.log("Mengeksekusi query: SELECT * FROM items WHERE store_id =", store_id);
      
      const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
  
      if (res.rows.length === 0) {
        console.log("Tidak ada item ditemukan untuk store_id:", store_id);
        return [];
      }
  
      console.log("Items ditemukan di database:", res.rows);
      return res.rows;
    } catch (error) {
      console.error("Error executing query", error);
      return null;
    }
  };
 
  exports.updateItem = async (id, name, price, image_url, stock) => {
    try {
      console.log("Menjalankan query UPDATE untuk item:", id);
  
      const res = await db.query(
        "UPDATE items SET name = $1, price = $2, image_url = COALESCE($3, image_url), stock = $4 WHERE id = $5 RETURNING *",
        [name, price, image_url, stock, id]
      );
  
      if (res.rows.length === 0) {
        console.log("Item tidak ditemukan di database:", id);
        return null;
      }
  
      console.log("Item berhasil diperbarui:", res.rows[0]);
      return res.rows[0];
    } catch (error) {
      console.error("Error executing update query", error);
      return null;
    }
  };

  exports.deleteItem = async (id) => {
    try {
      console.log("Menjalankan query DELETE untuk item:", id);
  
      const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
  
      if (res.rows.length === 0) {
        console.log("Item tidak ditemukan di database:", id);
        return null;
      }
  
      console.log("Item berhasil dihapus:", res.rows[0]);
      return res.rows[0];
    } catch (error) {
      console.error("Error executing delete query", error);
      return null;
    }
  };
  