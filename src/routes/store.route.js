const controller = require("../controllers/store.controller");
const express = require("express");
const router = express.Router();

router.get("/getAll", controller.getAllStores);
router.get("/:id", controller.getStoreById);
router.post("/create", controller.createStore);
router.put("/", controller.updateStore);
router.delete("/:id", controller.deleteStore);

module.exports = router;
