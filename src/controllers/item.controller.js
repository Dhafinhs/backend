const itemRepository = require("../repository/item.repository");
const baseResponse = require("../utils/baseResponse.util");
const imageService = require("../utils/imageService.util");

exports.createItem = async (req, res) => {
    console.log("Endpoint /item/create dipanggil");
  
    const { name, price, store_id, stock } = req.body;
    if (!name || !price || !store_id) {
      return baseResponse(res, false, 400, "Name, price, and store_id are required");
    }
  
    let imageUrl = null;
    if (req.file) {
      imageUrl = await imageService.uploadImage(req.file);
    }
  
    try {
      const item = await itemRepository.createItem(name, price, store_id, imageUrl, stock || 0);
      
      // Format respons sesuai keinginan
      return res.status(201).json({
        "succes": true,  // *PERBAIKI TYPO (seharusnya success)*
        "message": "Item created",
        "payload": {
          "id": item.id,
          "name": item.name,
          "price": item.price,
          "store_id": item.store_id,
          "image_url": item.image_url || null,
          "stock": item.stock || 0,
          "created_at": item.created_at
        }
      });
    } catch (error) {
      return baseResponse(res, false, 500, "Error creating item", error);
    }
  };

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    return baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving items", error);
  }
};

exports.getItemById = async (req, res) => {
    const { id } = req.params;
    console.log("Mencari item dengan ID:", id);
  
    if (!id) return res.status(400).json({ success: false, message: "Item ID is required" });
  
    try {
      const item = await itemRepository.getItemById(id);
      if (!item) {
        console.log("Item tidak ditemukan:", id);
        return res.status(404).json({ success: false, message: "Item not found" });
      }
  
      console.log("Item ditemukan:", item);
      return res.status(200).json({ success: true, message: "Item retrieved successfully", payload: item });
    } catch (error) {
      console.error("Error retrieving item:", error);
      return res.status(500).json({ success: false, message: "Error retrieving item", payload: {} });
    }
  };
  

  exports.getItemsByStoreId = async (req, res) => {
    const { store_id } = req.params;
    console.log("Mencari item dengan store_id:", store_id);
  
    if (!store_id) {
      return res.status(400).json({ success: false, message: "Store ID is required" });
    }
  
    try {
      const items = await itemRepository.getItemsByStoreId(store_id);
      
      if (!items || items.length === 0) {
        console.log("Tidak ada item ditemukan untuk store_id:", store_id);
        return res.status(404).json({ success: false, message: "No items found for this store" });
      }
  
      console.log("Items ditemukan:", items);
      return res.status(200).json({ success: true, message: "Items retrieved successfully", payload: items });
    } catch (error) {
      console.error("Error retrieving items:", error);
      return res.status(500).json({ success: false, message: "Error retrieving items", payload: {} });
    }
  };
  

exports.updateItem = async (req, res) => {
  const { id, name, price, stock } = req.body;
  if (!id || !name || !price) {
    return baseResponse(res, false, 400, "ID, name, and price are required");
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = await imageService.uploadImage(req.file);
  }

  try {
    const updatedItem = await itemRepository.updateItem(id, name, price, imageUrl, stock);
    if (!updatedItem) return baseResponse(res, false, 404, "Item not found");

    return baseResponse(res, true, 200, "Item updated successfully", updatedItem);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating item", error);
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  if (!id) return baseResponse(res, false, 400, "Item ID is required");

  try {
    const deleted = await itemRepository.deleteItem(id);
    if (!deleted) return baseResponse(res, false, 404, "Item not found");

    return baseResponse(res, true, 200, "Item deleted successfully");
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting item", error);
  }
};
