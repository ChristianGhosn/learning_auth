import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    mingLength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "basic",
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
export default User;
