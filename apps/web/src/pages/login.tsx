import LoginForm from "@/components/forms/LoginForm";


export default function LoginPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}