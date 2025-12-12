'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from './ui/Modal';  

interface AuthModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialMode?: 'login' | 'register';
    maxW?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function AuthModal({ open, setOpen, initialMode = 'login', maxW = 'md' }: AuthModalProps) {
    const [isRegister, setIsRegister] = useState(initialMode === 'register');
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        setIsRegister(initialMode === 'register');
    }, [initialMode]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username")?.toString() ?? "";
        const emailOrUsername = formData.get(isRegister ? "email" : "emailOrUsername")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        if (isRegister) {
            try {
                console.log("[AUTH_MODAL] Register attempt started");
                console.log("[AUTH_MODAL] Register data:", { 
                    username: username?.substring(0, 3) + "***", 
                    email: emailOrUsername?.substring(0, 3) + "***",
                    hasPassword: !!password 
                });
                
                const registerRes = await fetch("/api/register", {
                    method: "POST",
                    body: JSON.stringify({ username, email: emailOrUsername, password }),
                    headers: { "Content-Type": "application/json" },
                });
                
                console.log("[AUTH_MODAL] Register response status:", registerRes.status);
                
                if (!registerRes.ok) {
                    const errorData = await registerRes.json().catch(() => ({}));
                    console.error("[AUTH_MODAL] Register failed:", errorData);
                    setError(errorData.error || "Register failed");
                    return;
                }
                
                const userData = await registerRes.json();
                console.log("[AUTH_MODAL] Register successful:", { id: userData.id });
                
                console.log("[AUTH_MODAL] Attempting auto-login...");
                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email: emailOrUsername, 
                    password: password,
                });
                
                console.log("[AUTH_MODAL] Login response:", { error: loginRes?.error, ok: loginRes?.ok });
                
                if (loginRes?.error) {
                    console.error("[AUTH_MODAL] Auto-login failed:", loginRes.error);
                    setError("Registered but login failed. Please try logging in.");
                } else {
                    console.log("[AUTH_MODAL] Auto-login successful, closing modal");
                    setOpen(false);

                    router.refresh();
                }
            } catch (err: any) {
                console.error("[AUTH_MODAL] Register error:", err);
                setError(`Register failed: ${err.message || "Unknown error"}`);
            }
        } else {
            try {
                console.log("[AUTH_MODAL] Login attempt started");
                console.log("[AUTH_MODAL] Login data:", { 
                    emailOrUsername: emailOrUsername?.substring(0, 3) + "***",
                    hasPassword: !!password 
                });
                
                const res = await signIn("credentials", {
                    redirect: false,
                    email: emailOrUsername, 
                    password,
                });
                
                console.log("[AUTH_MODAL] Login response:", { error: res?.error, ok: res?.ok });
                
                if (res?.error) {
                    console.error("[AUTH_MODAL] Login failed:", res.error);
                    setError("Invalid credentials");
                } else {
                    console.log("[AUTH_MODAL] Login successful, closing modal");
                    setOpen(false);
                    
                    router.refresh();
                }
            } catch (err: any) {
                console.error("[AUTH_MODAL] Login error:", err);
                setError(`Login failed: ${err.message || "Unknown error"}`);
            }
        }
    };

    return (
        <Modal open={open} setOpen={() => setOpen(false)} maxW={maxW}>
            <h2 className="text-2xl font-semibold">{isRegister ? "Register" : "Login"}</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form className="space-y-4 mt-4 flex flex-row gap-2 " onSubmit={handleSubmit}>
                {isRegister && (
                    <input
                        name="username"
                        placeholder="Username"
                        required
                        className="w-full px-4 py-2 border rounded-md h-12 bg-neutral-800 text-white"
                    />
                )}
                <input
                    name={isRegister ? "email" : "emailOrUsername"}
                    placeholder={isRegister ? "Email" : "Email or Username"}
                    required
                    className="w-full px-4 py-2 border rounded-md h-12 bg-neutral-800 text-white"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border rounded-md h-12 bg-neutral-800 text-white"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#1600c0] hover:bg-[#1300e0] h-12 text-white text-sm text-nowrap"
                >
                    {isRegister ? "Register" : "Sign In"}
                </button>
            </form>
            <p className="text-sm text-gray-400">
                {isRegister ? "Already have an account?" : "No account yet?"}{" "}
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="underline hover:text-white"
                >
                    {isRegister ? "Login" : "Register"}
                </button>
            </p>
        </Modal>
    );
}
