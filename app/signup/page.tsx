"use client";

import AuthForm from "@/components/auth-form";
import AuthLayoutWrapper from "@/components/auth-layout-wrapper";

export default function SignupPage() {
    return (
        <AuthLayoutWrapper>
            <AuthForm type="signup" />
            <div className="mt-6 text-center">
                <a href="/login" className="text-sm text-[#7c6e62] hover:underline">
                    ログインはこちら
                </a>
            </div>
        </AuthLayoutWrapper>
    );
}