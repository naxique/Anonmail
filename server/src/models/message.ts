import { InferSchemaType, Schema, model } from "mongoose";

const message = new Schema({
  sender: { type: String, required: true },
  destination: { type: String, required: true },
  sentAt: { type: Date, default: Date.now() },
  title: { type: String, required: true },
  message: { type: String, required: true }
});

type Message = InferSchemaType<typeof message>;
export default model<Message>("Message", message);