import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});


type FormValues = z.infer<typeof schema>;


export default function LoginForm() {
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });


    const onSubmit = handleSubmit(async (v) => {
        try {
            await loginApi(v);
            toast.success("Welcome back!");
            nav("/");
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? "Login failed");
        }
    });


    return (
        <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3">
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
                <label className="block text-sm mb-1">Password</label>
                <input className="w-full border rounded px-3 py-2" type="password" {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <button disabled={isSubmitting} className="w-full bg-black text-white rounded py-2 disabled:opacity-50">{isSubmitting ? "Signing in..." : "Sign in"}</button>
        </form>
    );
}