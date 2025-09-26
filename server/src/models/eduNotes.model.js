import mongoose from "mongoose";

const eduNotesSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, index: true },
    content: {type: String, required: true},
    tags: [{ type: String, index: true }],
    pinned: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true }
}, {timestamps: true});

eduNotesSchema.index({ createdAt: 1 });

export default mongoose.model("eduNotes", eduNotesSchema);