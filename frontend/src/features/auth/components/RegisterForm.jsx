import {useRegister} from '../hooks/useRegister'

export const RegisterForm = () => {
    const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading, error,
    handleSubmit
    } = useRegister();
    // Vẽ giao diện
};