import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const productNames = [
  "Wireless Bluetooth Headphones",
  "Mechanical Gaming Keyboard",
  "4K Ultra HD Monitor",
  "Ergonomic Office Chair",
  "USB-C Hub Adapter",
  "Portable SSD 1TB",
  "Smart Watch Pro",
  "Noise Cancelling Earbuds",
  "Laptop Stand Aluminum",
  "Webcam HD 1080p",
  "Gaming Mouse RGB",
  "Desk LED Light Strip",
  "Portable Power Bank 20000mAh",
  "Wireless Charging Pad",
  "Bluetooth Speaker",
  "Screen Protector Pack",
  "Phone Case Premium",
  "HDMI Cable 2m",
  "Microphone USB Condenser",
  "Tablet Stylus Pen",
];

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "DELIVERED",
] as const;

async function seed() {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in .env");
      process.exit(1);
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("✅ Cleared existing data");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin
    console.log("👤 Creating admin...");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create 2 Users
    console.log("👥 Creating users...");
    const user1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
      isActive: true,
    });

    const user2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
      isActive: true,
    });
    console.log(`✅ Users created: ${user1.email}, ${user2.email}`);

    // Create 20 Products with varying dates
    console.log("📦 Creating 20 products...");
    const products = [];
    for (let i = 0; i < 20; i++) {
      // Create products with dates spread over the last 60 days
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const product = await Product.create({
        name: productNames[i],
        price: Math.floor(Math.random() * 500) + 10, // $10 - $510
        description: `High quality ${productNames[
          i
        ].toLowerCase()} for everyday use.`,
        isActive: i < 18, // 2 products inactive for testing
        createdAt,
        updatedAt: createdAt,
      });
      products.push(product);
    }
    console.log(`✅ Created ${products.length} products`);

    // Create 10 Orders with different dates and statuses
    console.log("🛒 Creating 10 orders...");
    const users = [user1, user2];

    for (let i = 0; i < 10; i++) {
      // Randomly select 1-4 products for each order
      const numItems = Math.floor(Math.random() * 4) + 1;
      const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
      const selectedProducts = shuffledProducts.slice(0, numItems);

      const items = selectedProducts.map((product) => ({
        productId: product._id,
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
        price: product.price,
      }));

      const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      // Create orders with dates spread over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      // Assign different statuses
      const status = orderStatuses[i % 4]; // Cycle through statuses

      // Alternate between users
      const user = users[i % 2];

      await Order.create({
        user: user._id,
        items,
        totalAmount,
        status,
        createdAt,
        updatedAt: createdAt,
      });
    }
    console.log("✅ Created 10 orders");

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SEED SUMMARY");
    console.log("=".repeat(50));
    console.log(`👤 Admin: admin@example.com (password: password123)`);
    console.log(
      `👥 Users: john@example.com, jane@example.com (password: password123)`
    );
    console.log(`📦 Products: 20 (18 active, 2 inactive)`);
    console.log(`🛒 Orders: 10 (with varying dates and statuses)`);
    console.log("=".repeat(50));

    // Order status breakdown
    const pendingCount = await Order.countDocuments({ status: "PENDING" });
    const confirmedCount = await Order.countDocuments({ status: "CONFIRMED" });
    const cancelledCount = await Order.countDocuments({ status: "CANCELLED" });
    const deliveredCount = await Order.countDocuments({ status: "DELIVERED" });

    console.log("\n📋 ORDER STATUS BREAKDOWN:");
    console.log(`   PENDING: ${pendingCount}`);
    console.log(`   CONFIRMED: ${confirmedCount}`);
    console.log(`   CANCELLED: ${cancelledCount}`);
    console.log(`   DELIVERED: ${deliveredCount}`);
    console.log("");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    console.log("🎉 Seeding completed successfully!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
