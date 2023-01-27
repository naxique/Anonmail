import { InferSchemaType, Schema, model } from "mongoose";

const user = new Schema({
  username: { type: String, required: true }
});

type User = InferSchemaType<typeof user>;
export default model<User>("User", user);