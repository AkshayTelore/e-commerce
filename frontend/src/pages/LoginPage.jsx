
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login Successful 🔥');
            navigate('/Home');
        } catch (error) {
            toast.error('Invalid email or password ❌');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="w-full flex items-center justify-right px-5 py-3 bg-white/100 backdrop-blur-md shadow-lg">
                <h1 className="px-4  text-2l font-extrabold text-indigo-700">Clothify! Try Once</h1>
                <Link to="/login">
                    <button className="mx-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                        Login
                    </button>
                </Link>
                <Link to="/resister">
                    <button className="mx-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                        Resister
                    </button>
                </Link>
                <Link to="/admin">
                    <button className="mx-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                        Admin Panel
                    </button>
                </Link>
            </header>
            <div className="w-screen min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-white to-purple-800">
                <form onSubmit={handleLogin} className="bg-black-300 text-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl text-black font-bold mb-6 text-center">Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full p-3 border rounded-md text-black"
                        required
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6 w-full p-3 border rounded-md text-black"
                        required
                        autoComplete="current-password"
                    />
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
