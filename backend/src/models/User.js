const mongoose = require("mongoose");

const socialProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "kakao", "naver"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    linkedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 8,
      required: function () {
        return this.provider === "local";
      },
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    provider: {
      type: String,
      enum: ["local", "google", "kakao", "naver"],
      default: "local",
    },

    providerId: {
      type: String,
      default: "",
    },

    socialProviders: {
      type: [socialProviderSchema],
      default: [],
    },

    profileImage: {
      type: String,
      default: "",
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ provider: 1, providerId: 1 });
userSchema.index({ "socialProviders.provider": 1, "socialProviders.providerId": 1 });

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
