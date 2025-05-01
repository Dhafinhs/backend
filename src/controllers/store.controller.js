const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    return baseResponse(
      res,
      true,
      200,
      "Stores retrieved successfully",
      stores
    );
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving stores", error);
  }
};

exports.getStoreById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return baseResponse(res, false, 400, "Store ID is required");
  }

  try {
    const store = await storeRepository.getStoreById(id);
    if (!store) {
      return baseResponse(res, false, 404, "Store not found");
    }
    return baseResponse(res, true, 200, "Store retrieved successfully", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving store", error);
  }
};

exports.createStore = async (req, res) => {
  if (!req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "Name and address are required");
  }

  try {
    const store = await storeRepository.createStore(req.body);
    return baseResponse(res, true, 201, "Store created", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating store", error);
  }
};

exports.updateStore = async (req, res) => {
  if (!req.body.id || !req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "ID, name, and address are required");
  }

  try {
    const updatedStore = await storeRepository.updateStore(req.body);
    if (!updatedStore) {
      return baseResponse(res, false, 404, "Store not found");
    }
    return baseResponse(res, true, 200, "Store updated successfully", updatedStore);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating store", error);
  }
};

exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return baseResponse(res, false, 400, "Store ID is required");
  }

  try {
    const deleted = await storeRepository.deleteStore(id);
    if (!deleted) {
      return baseResponse(res, false, 404, "Store not found");
    }
    return baseResponse(res, true, 200, "Store deleted successfully");
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting store", error);
  }
};
