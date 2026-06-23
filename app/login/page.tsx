"use client";

import AuthForm from "@/components/auth-form";
import { supabase } from "@/lib/supabase-client";
import AuthLayoutWrapper from "@/components/auth-layout-wrapper";
import Link from "next/link";

export default function LoginPage() {
    const handleGuestLogin = async () => {
        await supabase.auth.signInAnonymously();
        window.location.href = "/";
    };

    return (
        <AuthLayoutWrapper>
            <AuthForm type="login" />
            <div className="mt-6 text-center">
                <Link href="/signup" className="text-sm text-[#7c6e62] hover:underline">
                    新規登録はこちら
                </Link>
            </div>
        </AuthLayoutWrapper>
    );
}