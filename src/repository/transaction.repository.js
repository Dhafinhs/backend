const db = require("../database/pg.database");

exports.createTransaction = async (user_id, item_id, quantity, total) => {
  const res = await db.query(
    "INSERT INTO transactions (user_id, item_id, quantity, total) VALUES ($1, $2, $3, $4) RETURNING *",
    [user_id, item_id, quantity, total]
  );
  return res.rows[0];
};

exports.payTransaction = async (id) => {
  const res = await db.query(
    "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
};

exports.deleteTransaction = async (id) => {
  const res = await db.query(
    "DELETE FROM transactions WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rowCount > 0;

};

exports.getAllTransactions = async () => {
  const query = `
    SELECT 
      t.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'password', u.password,
        'balance', u.balance,
        'created_at', u.created_at
      ) AS user,
      json_build_object(
        'id', i.id,
        'name', i.name,
        'price', i.price,
        'store_id', i.store_id,
        'image_url', i.image_url,
        'stock', i.stock,
        'created_at', i.created_at
      ) AS item
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN items i ON t.item_id = i.id
    ORDER BY t.created_at DESC;
  `;

  const res = await db.query(query);
  return res.rows;
};
