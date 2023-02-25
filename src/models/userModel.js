const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unque: true },
    password: { type: String, required: true },
    auth: {
      sessionId: { type: String },
      macId: { type: String },
      refreshToken: { type: String },
    },
    status: { type: String, required: true, default: "active" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

//export default mongoose.model("User", userSchema);
// or
// const userModel = mongoose.model("User", userSchema);
// export default userModel;
