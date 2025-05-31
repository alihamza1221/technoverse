import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [{
    optionText: { type: String },
    votes: { type: Number, default: 0 }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  deadline: Date,
  isClosed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Poll', pollSchema);
