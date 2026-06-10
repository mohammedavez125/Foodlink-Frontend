import {SignupForm} from "@/components/signup-form.tsx";

function Signup() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl"><SignupForm/></div>
        </div>
    );
}

export default Signup;