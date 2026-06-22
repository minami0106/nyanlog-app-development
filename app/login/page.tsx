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
        </AuthLayoutWrapper>
    );
}