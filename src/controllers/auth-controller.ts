import { Request, Response } from "express";
import { supabase } from "../utils/supabase-client";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Set a cookie with the session token
    res.cookie("sb:token", data.session?.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
