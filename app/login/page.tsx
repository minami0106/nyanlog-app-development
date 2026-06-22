"use client";

import AuthForm from "@/components/auth-form";
import { supabase } from "@/lib/supabase-client";
import AuthLayoutWrapper from "@/components/auth-layout-wrapper";

export default function LoginPage() {
    const handleGuestLogin = async () => {
        await supabase.auth.signInAnonymously();
        window.location.href = "/";
    };

    return (
        <AuthLayoutWrapper>
            <AuthForm type="login" />
            <div className="mt-6 flex flex-col items-center gap-4">
                <button onClick={handleGuestLogin} className="text-sm text-muted-foreground hover:underline">
                    ゲストとして体験する
                </button>
                <a href="/signup" className="text-[#8c7e6e] hover:underline text-sm font-medium">
                    アカウントをお持ちでない方はこちら
                </a>
            </div>
        </AuthLayoutWrapper>
    );
}