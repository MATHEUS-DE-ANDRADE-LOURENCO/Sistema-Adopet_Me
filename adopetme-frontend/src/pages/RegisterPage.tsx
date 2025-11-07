import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPaw, FaUsers } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { register, RegisterData } from '../services/AuthService'; // Importar o serviço

// Tipo para o Role
type Role = 'TUTOR' | 'ONG';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    
    const [role, setRole] = useState<Role>('TUTOR');
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        nome: '',
        sobrenome: '',
        nomeOng: '',
        cnpj: '', // Futuro
        telefone: '',
        endereco: ''
    });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.senha !== passwordConfirm) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        const dataToSubmit: RegisterData = {
            tipoUsuario: role,
            email: formData.email,
            senha: formData.senha,
            ...(role === 'TUTOR' && {
                nome: formData.nome,
                sobrenome: formData.sobrenome
            }),
            ...(role === 'ONG' && {
                nomeOng: formData.nomeOng,
                telefone: formData.telefone,
                endereco: formData.endereco,
                // cnpj: formData.cnpj
            })
        };

        try {
            const response = await register(dataToSubmit);
            setSuccess(response.message + " Redirecionando para o login...");
            
            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black">Crie sua Conta</h1>

                    {/* Seletor de Tipo de Conta */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('ONG')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${
                                role === 'ONG' 
                                ? 'bg-white text-amber-600 hover:bg-amber-50' 
                                : 'bg-amber-600 text-white shadow-md'
                            }`}
                        >
                            <FaUsers className="w-5 h-5" />
                            <span className="font-semibold">Sou uma ONG</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('TUTOR')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${
                                role === 'TUTOR' 
                                ? 'bg-white text-amber-600 hover:bg-amber-50' 
                                : 'bg-amber-600 text-white shadow-md'
                            }`}
                        >
                            <FaPaw className="w-5 h-5" />
                            <span className="font-semibold">Sou um Tutor</span>
                        </button>
                    </div>

                    {/* Mensagens de Erro/Sucesso */}
                    {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}
                    {success && <div className="text-green-600 mb-4 text-sm text-center bg-green-100 p-2 rounded border border-green-200">{success}</div>}


                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        {/* Campos Condicionais */}
                        {role === 'TUTOR' && (
                            <>
                                <input
                                    type="text"
                                    name="nome"
                                    placeholder="Nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                    className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                                <input
                                    type="text"
                                    name="sobrenome"
                                    placeholder="Sobrenome"
                                    value={formData.sobrenome}
                                    onChange={handleChange}
                                    required
                                    className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                            </>
                        )}

                        {role === 'ONG' && (
                            <>
                                <input
                                    type="text"
                                    name="nomeOng"
                                    placeholder="Nome da ONG"
                                    value={formData.nomeOng}
                                    onChange={handleChange}
                                    required
                                    className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                                 <input
                                    type="text"
                                    name="telefone"
                                    placeholder="Telefone de Contato"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    required
                                    className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                                 <input
                                    type="text"
                                    name="endereco"
                                    placeholder="Endereço (Cidade, Estado)"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    required
                                    className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                            </>
                        )}

                        {/* Campos Comuns */}
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="password"
                            name="senha"
                            placeholder="Senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="Confirme sua Senha"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                        />

                        <button
                            type="submit"
                            className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Registrando...' : 'Registrar'}
                        </button>
                    </form>

                    <p className="text-center mt-4 text-sm text-neutral-950">
                        Já tem uma conta?{" "}
                        <span
                            className="text-yellow-600 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")} // <-- LINK CORRETO
                        >
                            Faça Login
                        </span>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;