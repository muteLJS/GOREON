const path = require("node:path");
const dns = require("node:dns");

const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../src/models/Product");
const Review = require("../src/models/Review");
const User = require("../src/models/User");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const REVIEWER_DEFINITIONS = [
  {
    name: "고런 리뷰어 1",
    email: "seed-reviewer-1@goreon.local",
    phone: "010-0000-0001",
  },
  {
    name: "고런 리뷰어 2",
    email: "seed-reviewer-2@goreon.local",
    phone: "010-0000-0002",
  },
];

const REVIEW_VARIANTS = [
  {
    rating: 5,
    content: (product) =>
      `${product.name} 만족도가 높아요. 배송 이후 바로 써봤는데 성능이 안정적이고 전반적으로 기대한 느낌과 잘 맞았습니다.`,
  },
  {
    rating: 4,
    content: (product) =>
      `${product.name} 가성비가 괜찮습니다. 기본 성능은 충분했고 설치나 세팅 과정도 무난해서 부담 없이 쓰기 좋았습니다.`,
  },
];

function buildReviewTimestamp(productIndex, reviewIndex) {
  const daysAgo = productIndex * 2 + reviewIndex + 1;
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    createdAt,
    updatedAt: createdAt,
  };
}

async function ensureSeedUsers() {
  const hashedPassword = await bcrypt.hash("seedreview123!", 10);
  const users = [];

  for (const reviewer of REVIEWER_DEFINITIONS) {
    let user = await User.findOne({ email: reviewer.email });

    if (!user) {
      user = await User.create({
        ...reviewer,
        password: hashedPassword,
      });
    }

    users.push(user);
  }

  return users;
}

async function seedReviews() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  dns.setServers(
    (process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean),
  );

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  });

  const products = await Product.find({}).sort({ _id: 1 }).lean();

  if (products.length === 0) {
    throw new Error("No products found. Seed products first.");
  }

  const seedUsers = await ensureSeedUsers();
  const seedUserIds = seedUsers.map((user) => user._id);

  const deleteResult = await Review.deleteMany({ user: { $in: seedUserIds } });

  const reviewDocs = products.flatMap((product, productIndex) =>
    REVIEW_VARIANTS.map((variant, reviewIndex) => ({
      user: seedUsers[reviewIndex % seedUsers.length]._id,
      product: product._id,
      rating: variant.rating,
      content: variant.content(product),
      images: [],
      ...buildReviewTimestamp(productIndex, reviewIndex),
    })),
  );

  const insertedReviews = await Review.insertMany(reviewDocs, { ordered: false });

  console.log(`Seeded reviews for ${products.length} products`);
  console.log(`Deleted ${deleteResult.deletedCount} old seeded reviews`);
  console.log(`Inserted ${insertedReviews.length} reviews`);
}

seedReviews()
  .catch((error) => {
    console.error("Failed to seed reviews:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
