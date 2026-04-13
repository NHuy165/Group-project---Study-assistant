import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";

export const AuthPage = () => {
  // optional: toggle between login/register

  return (
    <div>
      <LoginForm />

      <RegisterForm />
    </div>
  );
};
