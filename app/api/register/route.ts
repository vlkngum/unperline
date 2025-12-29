export const runtime = "nodejs";

import { prisma } from "@/app/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          error:
            existingUser.username === username
              ? "Username already exists"
              : "Email already exists",
        }),
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      return new Response(
        JSON.stringify({ error: `${field} already exists` }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error?.message ?? "Unknown error",
      }),
      { status: 500 }
    );
  }
}
