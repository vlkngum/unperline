export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User as PrismaUser } from "@prisma/client";
import { compare } from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

interface CredentialsInput {
    email: string;
    password: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials.password) {
                        return null;
                    }

                    const emailOrUsername = credentials.email as string;
                    const password = credentials.password as string;

                    const user: PrismaUser | null = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: emailOrUsername },
                                { username: emailOrUsername },
                            ],
                        },
                    });

                    if (!user) return null;

                    const isValid = await compare(password, user.password);
                    if (!isValid) return null;

                    return {
                        id: user.id.toString(),
                        name: user.username ?? user.email,
                        email: user.email,
                        isVerified: user.isVerified,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
    },
});
