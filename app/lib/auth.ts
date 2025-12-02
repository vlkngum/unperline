import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User as PrismaUser } from "@prisma/client"
import { compare } from "bcryptjs"
import { prisma } from "@/app/lib/prisma"

interface CredentialsInput {
    email: string
    password: string
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
                    console.log("[AUTH] Authorize attempt started");
                    console.log("[AUTH] Received credentials:", { 
                        hasEmail: !!credentials?.email,
                        hasPassword: !!credentials?.password,
                        emailType: typeof credentials?.email,
                        passwordType: typeof credentials?.password
                    });
                    
                    if (!credentials?.email || !credentials.password) {
                        console.log("[AUTH] Missing credentials:", { 
                            email: credentials?.email,
                            password: credentials?.password ? "***" : undefined
                        });
                        return null;
                    }

                    const emailOrUsername = credentials.email as string
                    const password = credentials.password as string
                    
                    console.log("[AUTH] Looking for user with:", { 
                        emailOrUsername: emailOrUsername.substring(0, 3) + "***" 
                    });

                    const user: PrismaUser | null = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: emailOrUsername },
                                { username: emailOrUsername },
                            ],
                        },
                    })

                    if (!user) {
                        console.log("[AUTH] User not found");
                        return null;
                    }

                    console.log("[AUTH] User found:", { id: user.id, username: user.username, email: user.email });
                    console.log("[AUTH] Comparing password...");

                    const isValid = await compare(password, user.password);
                    
                    if (!isValid) {
                        console.log("[AUTH] Password mismatch");
                        return null;
                    }

                    console.log("[AUTH] Password valid, returning user");
                    
                    return {
                        id: user.id.toString(),
                        name: user.username ?? user.email,
                        email: user.email,
                        isVerified: user.isVerified,
                    }
                } catch (error: any) {
                    console.error("[AUTH] Authorize error:", error);
                    console.error("[AUTH] Error details:", { message: error.message, stack: error.stack });
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
            if (user) token.user = user
            return token
        },
        session({ session, token }) {
            session.user = token.user as any
            return session
        },
    },
})
