import { ExpressAuth } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import Google from "@auth/express/providers/google";
import express from "express";
import { authSession } from "../controllers/auth.controller.js";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../db/mongodb.js";
import userModel from "../models/user.model.js";
import { DBConnection } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

const authRouter = express.Router();

authRouter.get("/favicon.ico", (req, res) => res.status(204).end());

authRouter.use(
  ExpressAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID_DEV,
        clientSecret: process.env.GITHUB_CLIENT_SECRET_DEV,
      }),
      // Google({
      //   clientId: process.env.GOOGLE_CLIENT_ID,
      //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // }),
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true,

    cookies: {
      callbackUrl: {
        name: "__Secure-authjs.callback-url",
        options: {
          httpOnly: true,
          sameSite: "none", // <-- Key fix
          secure: true,     // <-- Required for __Secure-* cookies
        },
      },
      sessionToken: {
        name: "__Secure-authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        },
      },
    },
    
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Always redirect to frontend
        return "https://chronoss.vercel.app/";
      },
    },
    events: {
      async signIn({ user }) {
        await DBConnection();
        await userModel.create(
          { email: user.email },
          { name: user.name, image: user.image },
          { upsert: true, new: true }
        );
      },
    },
  })
);

authRouter.get("/session", authSession);

export default authRouter;