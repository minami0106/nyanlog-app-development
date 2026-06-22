"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleAuth = async () => {
        try {
            console.log("処理開始...");
            if (type === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("認証エラー:", error);
            alert("認証に失敗しました。コンソールを確認してください。");
        }
    };

    const inputClass = "w-full p-3 border border-[#dcd3c9] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c7e6e] text-[#3d3934]";
    const buttonClass = "w-full bg-[#8c7e6e] hover:bg-[#7a6d5f] text-white font-medium py-3 rounded-full transition-colors cursor-pointer text-center";

    return (
        <div className="space-y-8 text-[#3d3934]">
            <h2 className="text-2xl font-light tracking-widest text-center uppercase">
                {type === 'login' ? 'LOGIN' : 'SIGN UP'}
            </h2>
            <div className="space-y-4">
                <input type="email" placeholder="EMAIL" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="PASSWORD" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button
                    type="button"
                    className={buttonClass}
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("ボタンクリック成功");
                        handleAuth();
                    }}
                >
                    {type === 'login' ? 'LOGIN' : 'SIGN UP'}
                </button>
            </div>
        </div>
    );
}