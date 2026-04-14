import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import backgroundImage from "../assets/background.png";

export const AuthPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 md:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
};
