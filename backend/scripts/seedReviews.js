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
    name: "김민준",
    email: "seed-reviewer-1@goreon.local",
    phone: "010-2451-1032",
  },
  {
    name: "박서연",
    email: "seed-reviewer-2@goreon.local",
    phone: "010-3187-4421",
  },
  {
    name: "이도윤",
    email: "seed-reviewer-3@goreon.local",
    phone: "010-5714-8250",
  },
  {
    name: "최지우",
    email: "seed-reviewer-4@goreon.local",
    phone: "010-8042-6613",
  },
  {
    name: "정하윤",
    email: "seed-reviewer-5@goreon.local",
    phone: "010-4628-1995",
  },
  {
    name: "한예준",
    email: "seed-reviewer-6@goreon.local",
    phone: "010-7365-2804",
  },
  {
    name: "윤서진",
    email: "seed-reviewer-7@goreon.local",
    phone: "010-5293-7146",
  },
  {
    name: "오지호",
    email: "seed-reviewer-8@goreon.local",
    phone: "010-6834-5527",
  },
];

const REVIEW_VARIANTS = [
  {
    rating: 5,
    content: (product) =>
      `${product.name} 마감이나 체감 성능이 기대 이상이었습니다. 처음 세팅하고 바로 써봤는데 반응이 빠르고 전체적으로 완성도가 높게 느껴졌어요.`,
  },
  {
    rating: 4,
    content: (product) =>
      `${product.name} 기본기 탄탄한 느낌입니다. 성능이 안정적이고 사용하면서 크게 거슬리는 부분이 없어서 무난하게 만족했습니다.`,
  },
  {
    rating: 5,
    content: (product) =>
      `${product.name} 실사용 만족도가 높습니다. 화면이나 동작 속도, 전반적인 밸런스가 좋아서 메인으로 쓰기에도 충분하다고 느꼈어요.`,
  },
  {
    rating: 3,
    content: (product) =>
      `${product.name} 전반적으로는 괜찮지만 세세한 부분에서 조금 아쉬움이 남습니다. 그래도 가격 생각하면 납득 가능한 수준입니다.`,
  },
  {
    rating: 4,
    content: (product) =>
      `${product.name} 설치 후 바로 써봤는데 사용감이 깔끔했습니다. 성능 대비 가격이 괜찮아서 입문용이나 교체용으로도 괜찮아 보여요.`,
  },
  {
    rating: 5,
    content: (product) =>
      `${product.name} 생각했던 용도에 잘 맞았습니다. 성능과 안정성이 모두 괜찮아서 오래 써도 크게 스트레스 없을 것 같습니다.`,
  },
  {
    rating: 3,
    content: (product) =>
      `${product.name} 장점은 분명하지만 기대가 컸던 만큼 평범하게 느껴진 부분도 있었습니다. 그래도 기본 사용에는 큰 문제 없었습니다.`,
  },
  {
    rating: 4,
    content: (product) =>
      `${product.name} 첫인상보다 실사용이 더 괜찮았습니다. 세팅도 어렵지 않았고 일상 작업이나 취미용으로 쓰기 충분했습니다.`,
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

async function findExistingSeedUsers() {
  return User.find(
    {
      email: {
        $regex: /^seed-reviewer-\d+@goreon\.local$/i,
      },
    },
    { _id: 1, email: 1 },
  );
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
    } else {
      user.name = reviewer.name;
      user.phone = reviewer.phone;
      await user.save();
    }

    users.push(user);
  }

  return users;
}

function getReviewCountForProduct(productIndex) {
  const counts = [2, 2, 3, 3, 4];
  return counts[productIndex % counts.length];
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

  const existingSeedUsers = await findExistingSeedUsers();
  const existingSeedUserIds = existingSeedUsers.map((user) => user._id);
  const seedUsers = await ensureSeedUsers();
  const seedUserIds = seedUsers.map((user) => user._id);

  const deleteResult = await Review.deleteMany({
    user: { $in: [...existingSeedUserIds, ...seedUserIds] },
  });

  const reviewDocs = products.flatMap((product, productIndex) => {
    const reviewCount = getReviewCountForProduct(productIndex);

    return Array.from({ length: reviewCount }, (_, reviewIndex) => {
      const variant = REVIEW_VARIANTS[(productIndex + reviewIndex) % REVIEW_VARIANTS.length];

      return {
        user: seedUsers[reviewIndex % seedUsers.length]._id,
        product: product._id,
        rating: variant.rating,
        content: variant.content(product),
        images: [],
        ...buildReviewTimestamp(productIndex, reviewIndex),
      };
    });
  });

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
