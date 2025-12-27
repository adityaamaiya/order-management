import mongoose, { Document, Types, Schema } from "mongoose";

export type TOrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: TOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"],
        message: "{VALUE} is not a valid status",
      },
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
