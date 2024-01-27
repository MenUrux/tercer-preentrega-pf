import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';


const ticketSchema = new Schema({
  code: { type: String, required: true, default: () => nanoid(), unique: true },
  purchaser: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: { type: Number, required: false, default: 0 },
  total: { type: Number, required: false },
  purchase_datetime: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);