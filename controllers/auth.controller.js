import { getSession } from "@auth/express";

export async function authSession(req, res) {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    message: "Current session",
    user: session.user,
  });
};

// export async function authSession(req, res, next) {
//   res.locals.session = await getSession(req)
//   next()
// }