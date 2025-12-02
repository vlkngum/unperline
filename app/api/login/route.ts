import { prisma } from "@/app/lib/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) return Response.json({ error: "Email ve şifre gerekli." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ error: "Kullanıcı bulunamadı." }, { status: 400 });

    const valid = await compare(password, user.password);
    if (!valid) return Response.json({ error: "Şifre yanlış." }, { status: 400 });

    const token = sign({ userId: user.id }, process.env.AUTH_SECRET as string, { expiresIn: "7d" });

    return Response.json({ token });
}
