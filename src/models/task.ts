import mongoose, { Schema, Document } from "mongoose";

export interface ITaskDocument extends Document {
  description: String;
  completed: Boolean;
  owner: Schema.Types.ObjectId;
}

const taskSchema: Schema<ITaskDocument> = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITaskDocument>("Task", taskSchema);

export default Task;
