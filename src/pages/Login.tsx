import { LoginForm } from "@/components/login-form";

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                <LoginForm />
            </div>
        </div>
    );
}