import mongoose from "mongoose";

export async function DBConnection() {
    await mongoose.connect(`${process.env.DB_URL}/chronos`).then(() => console.log(`db connected ${process.env.DB_URL}`)).catch(() => console.log("error connecting db"));
};