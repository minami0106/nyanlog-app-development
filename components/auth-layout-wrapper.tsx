export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        // メインページと同じ背景色 (bg-[#fcfaf7])
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#fcfaf7]">
            {/* メインページと同じカード色 (bg-[#f3ede4]) と角丸 */}
            <div className="w-full max-w-[400px] p-8 bg-[#f3ede4] border border-[#dcd3c9] rounded-2xl shadow-sm">
                {children}
            </div>
        </main>
    );
}