const express = require("express");
const multer = require("multer");
const itemController = require("../controllers/item.controller");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.single("image"), (req, res, next) => {
    console.log("Isi req.body:", req.body);
    next();
  }, itemController.createItem);
  
router.get("/", itemController.getAllItems);
router.get("/byId/:id", itemController.getItemById);
router.get("/byStoreId/:store_id", itemController.getItemsByStoreId);
router.put("/", upload.single("image"), itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
