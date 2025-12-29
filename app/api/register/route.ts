import { prisma } from "@/app/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  console.log("[REGISTER] Env:", { DATABASE_URL: process.env.DATABASE_URL?.slice(0, 30) + "..." });
  try {
    console.log("[REGISTER] Request received");
    const body = await req.json();
    const { username, email, password } = body;

    console.log("[REGISTER] Data received:", {
      username: username?.substring(0, 3) + "***",
      email: email?.substring(0, 3) + "***",
      hasPassword: !!password
    });

    if (!username || !email || !password) {
      console.error("[REGISTER] Missing fields:", { username: !!username, email: !!email, password: !!password });
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      console.error("[REGISTER] User already exists:", {
        username: existingUser.username === username,
        email: existingUser.email === email
      });
      return new Response(
        JSON.stringify({ error: existingUser.username === username ? "Username already exists" : "Email already exists" }),
        { status: 409 }
      );
    }

    console.log("[REGISTER] Hashing password...");
    const hashedPassword = await hash(password, 10);
    console.log("[REGISTER] Password hashed successfully");

    console.log("[REGISTER] Creating user in database...");
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });
    console.log("[REGISTER] User created successfully:", { id: user.id, username: user.username, email: user.email });

    return new Response(JSON.stringify({ id: user.id, username: user.username, email: user.email }), { status: 201 });
  } catch (error: any) {
    console.error("[REGISTER] Error:", error);
    console.error("[REGISTER] Error code:", error.code);
    console.error("[REGISTER] Error message:", error.message);

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return new Response(
        JSON.stringify({ error: `${field} already exists` }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500 }
    );
  }
}
