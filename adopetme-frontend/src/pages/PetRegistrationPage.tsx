// adopetme-frontend/src/pages/PetRegistrationPage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, PawPrint } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { registerPet, PetRegistrationData } from '../services/PetService'; // Criaremos este serviço

const PetRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { token, userRole } = useSession(); // Pega token e role da sessão
    
    const [formData, setFormData] = useState<PetRegistrationData>({
        nome: '',
        especie: 'Cachorro', // Valor padrão
        sexo: 'Macho',     // Valor padrão
        idade: 0,
        descricao: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Redireciona se não for ONG
    React.useEffect(() => {
        if (userRole && userRole !== 'ADMIN_ONG') {
            navigate('/'); // Volta para home se não for ONG
        }
    }, [userRole, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'idade' ? parseInt(value) : value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Você não está autenticado.");
            return;
        }

        setLoading(true);

        try {
            await registerPet(formData, token);
            setSuccess("Pet registrado com sucesso!");
            // Limpa o formulário
            setFormData({
                nome: '',
                especie: 'Cachorro',
                sexo: 'Macho',
                idade: 0,
                descricao: ''
            });
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
    
    // Estilo base para inputs
    const inputStyle = "border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 w-full";


    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black flex items-center justify-center gap-2">
                        <PawPrint className="text-amber-700"/> Registrar Novo Pet
                    </h1>

                    {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}
                    {success && <div className="text-green-600 mb-4 text-sm text-center bg-green-100 p-2 rounded border border-green-200">{success}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome do Pet"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            className={inputStyle}
                        />
                        
                        <div className="flex gap-4">
                            <select name="especie" value={formData.especie} onChange={handleChange} className={inputStyle}>
                                <option value="Cachorro">Cachorro</option>
                                <option value="Gato">Gato</option>
                                <option value="Outro">Outro</option>
                            </select>
                            
                            <select name="sexo" value={formData.sexo} onChange={handleChange} className={inputStyle}>
                                <option value="Macho">Macho</option>
                                <option value="Fêmea">Fêmea</option>
                            </select>
                        </div>
                        
                         <input
                            type="number"
                            name="idade"
                            placeholder="Idade (anos)"
                            value={formData.idade}
                            onChange={handleChange}
                            required
                            min="0"
                            className={inputStyle}
                        />

                        <textarea
                            name="descricao"
                            placeholder="Descrição (história, temperamento, etc.)"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            className={inputStyle}
                            rows={4}
                        />

                        <button
                            type="submit"
                            className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Registrando...' : 'Registrar Pet'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PetRegistrationPage;