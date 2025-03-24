import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

const taskSchema = new Schema(
    {
        title: { type: String, required: [true, "Please enter a task title"] },
        description: { type: String, required: false},
        completed: { type: Boolean, required: true },
    },
    { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;