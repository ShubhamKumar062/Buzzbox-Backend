const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

GroupSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Group', GroupSchema);