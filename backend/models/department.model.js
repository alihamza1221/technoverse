import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  contactEmail: { type: String },
  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  officials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
