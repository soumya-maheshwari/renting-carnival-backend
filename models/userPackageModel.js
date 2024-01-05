const mongoose = require("mongoose");

const userPackageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
});

const UserPackage = mongoose.model("UserPackage", userPackageSchema);
