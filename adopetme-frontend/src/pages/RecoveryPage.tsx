import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Importe o Navbar e o ícone do Google se necessário. 
// Para este exemplo, vamos manter apenas o ícone de e-mail.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../components/Navbar'; // Mantenha comentado por enquanto para evitar o loop!

const RecoveryPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // Estado para feedback ao usuário

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleRecovery = (e: FormEvent) => {
        e.preventDefault();
        
        // Simulação de envio para o backend
        console.log('Solicitação de recuperação para:', email);
        setMessage(`Se as informações estiverem corretas, as instruções foram enviadas para ${email}.`);
        
        // Opcional: Redirecionar para uma página de confirmação após um pequeno atraso
        // setTimeout(() => navigate('/login'), 3000); 
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-100">
            <Navbar />

            <main className="flex-grow flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                    
                    <h1 className="text-2xl font-bold mb-3 text-center text-neutral-950">
                        Recuperar Senha
                    </h1>
                    
                    <p className="text-center text-sm mb-6 text-gray-600">
                        Digite seu e-mail para receber as instruções de redefinição.
                    </p>

                    {/* Mensagem de Feedback */}
                    {message && (
                        <div className={`p-3 mb-4 rounded text-sm ${message.includes('enviadas') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleRecovery} className="flex flex-col gap-4">
                        
                        {/* Campo de E-mail */}
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Seu e-mail cadastrado"
                                value={email}
                                onChange={handleChange}
                                required
                                className="border-2 border-yellow-600 pl-10 pr-4 text-neutral-950 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        {/* Botão de Envio */}
                        <button
                            type="submit"
                            className="bg-yellow-600 text-white py-2 px-4 rounded font-semibold hover:bg-yellow-700 transition"
                        >
                            Enviar Instruções
                        </button>
                        
                    </form>

                    <p className="text-center mt-6 text-sm">
                        <span
                            className="text-yellow-600 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Voltar para o Login
                        </span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RecoveryPage;