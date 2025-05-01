const transactionRepository = require("../repository/transaction.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
  const { user_id, item_id, quantity, total } = req.body;

  if (!user_id || !item_id || !quantity || !total) {
    return baseResponse(res, false, 400, "All fields are required");
  }

  try {
    const transaction = await transactionRepository.createTransaction(user_id, item_id, quantity, total);
    return baseResponse(res, true, 201, "Transaction created successfully", transaction);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating transaction", error);
  }
};

exports.payTransaction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "Transaction ID is required");
  }

  try {
    const transaction = await transactionRepository.payTransaction(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found");
    }
    return baseResponse(res, true, 200, "Payment successful", transaction);
  } catch (error) {
    return baseResponse(res, false, 500, "Error processing payment", error);
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return baseResponse(res, false, 400, "Transaction ID is required");
  }

  try {
    const deleted = await transactionRepository.deleteTransaction(id);
    if (!deleted) {
      return baseResponse(res, false, 404, "Transaction not found");
    }
    return baseResponse(res, true, 200, "Transaction deleted successfully");
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting transaction", error);
  }

};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepository.getAllTransactions();
    return baseResponse(res, true, 200, "Transactions found", transactions);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving transactions", error);
  }
};

