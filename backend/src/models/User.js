const mongoose = require("mongoose");

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

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
