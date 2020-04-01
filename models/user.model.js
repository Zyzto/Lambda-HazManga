const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = 10;

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  address: {
    houseNo: Number,
    street: String,
    district: String
  },
  password: {
    type: String,
    required: true
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  isSeller: {
    type: Boolean,
    default: false
  },
})

userSchema.pre('save', function (next) {
  this.isModified("password") ? this.password = bcrypt.hashSync(this.password, salt) : next()
  next()
})

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;