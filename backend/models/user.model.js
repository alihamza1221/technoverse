const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const defaultImage = null;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    socketId: {
      type: String,
    },
    role: { 
      type: String, 
      enum: ['Citizen', 'Worker', 'DepartmentOfficial', 'DepartmentHead'],
      default: 'Citizen' 
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    profileImage: { type: String ,required: false, },
    isActive: { type: Boolean, default: true },
    notifications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }]

    // username: {
    //   type: String,
    //   required: false,
    // },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   select: false,
    // },
    // imageUri: {
    //   type: String,
    //   required: false,
    // },
    
  },
  { timestamps: true }
);

// userSchema.pre('save', async function(next){
//   if(!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
