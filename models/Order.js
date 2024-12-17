const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryType: {
      type: String,
      enum: ["Home", "Nova Poshta"],
      required: true,
    },
    homeDelivery: {
      street: String,
      houseNumber: String,
      apartmentNumber: String,
      city: String,
    },
    novaPoshtaDelivery: {
      novaPoshtaBranch: String, 
      label: String,            
      shortAddress: String,     
      category: String,         
      value: String,            
      warehouseIndex: String,   
    },
    phone: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
