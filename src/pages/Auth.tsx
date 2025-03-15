
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Welcome to Memoria</h1>
      <AuthForm />
    </div>
  );
};

export default Auth;
