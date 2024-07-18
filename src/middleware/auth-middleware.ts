import { Request, Response, NextFunction } from "express";
import { supabase, getSupabaseClientWithToken } from "../utils/supabase-client";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["sb:token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Attach user and authenticated supabase client to request object
  (req as any).user = user;
  (req as any).supabaseClient = getSupabaseClientWithToken(token);
  next();
};
