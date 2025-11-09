// adopetme-frontend/src/pages/PetRegistrationPage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, PawPrint, Upload } from 'lucide-react';
import { useSession } from '../context/SessionContext';
// 1. Importar uploadPetPhoto
import { registerPet, PetRegistrationData, uploadPetPhoto } from '../services/PetService'; 

const PetRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { token, userRole } = useSession(); // Pega token e role da sessão
    
    // 2. Atualizar estado inicial do formulário
    const [formData, setFormData] = useState<PetRegistrationData>({
        nome: '',
        especie: 'Cachorro', // Valor padrão
        sexo: 'Macho',     // Valor padrão
        idade: 0,
        descricao: '',
        status: 'Disponível', // Adicionar status
        ninhada: '',
        castracao: false, // Mudar para boolean
        dtNascimento: ''
    });
    
    // 3. Estado para o ARQUIVO (File), não apenas o nome
    const [file, setFile] = useState<File | null>(null);
    
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
        const { name, value, type } = e.target;
        
        // 4. Lógica para tratar checkbox
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: name === 'idade' ? parseInt(value) : value
            });
        }
    };

    // 5. Handler para o input de arquivo (agora salva o File)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    // 6. handleSubmit ATUALIZADO (Etapa 1: Texto, Etapa 2: Foto)
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
            // Etapa 1: Registrar o Pet (dados de texto)
            const dataToSubmit: PetRegistrationData = {
                ...formData,
                dtNascimento: formData.dtNascimento === '' ? undefined : formData.dtNascimento
            };
            const savedPet = await registerPet(dataToSubmit, token); //
            
            // Etapa 2: Se o registro funcionou E existe um arquivo, faz o upload
            if (savedPet && savedPet.id && file) {
                setSuccess("Pet registrado, enviando foto..."); // Feedback para o usuário
                await uploadPetPhoto(savedPet.id, file, token); //
            }

            setSuccess("Pet registrado com sucesso!");
            
            // 7. Limpar o formulário completo
            setFormData({
                nome: '',
                especie: 'Cachorro',
                sexo: 'Macho',
                idade: 0,
                descricao: '',
                status: 'Disponível',
                ninhada: '',
                castracao: false,
                dtNascimento: ''
            });
            setFile(null); // Limpar o arquivo

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
    // 8. Estilo para a Label (Legenda)
    const labelStyle = "text-sm font-semibold text-neutral-700 mb-1";


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

                    {/* 9. ATUALIZAÇÃO DO FORMULÁRIO COM LABELS E NOVOS CAMPOS */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {/* Nome do Pet */}
                        <div>
                            <label htmlFor="nome" className={labelStyle}>Nome do Pet</label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                placeholder="Ex: Rex, Mia..."
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Espécie */}
                            <div className="flex-1">
                                <label htmlFor="especie" className={labelStyle}>Espécie</label>
                                <select name="especie" id="especie" value={formData.especie} onChange={handleChange} className={inputStyle}>
                                    <option value="Cachorro">Cachorro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            {/* Sexo */}
                            <div className="flex-1">
                                <label htmlFor="sexo" className={labelStyle}>Sexo</label>
                                <select name="sexo" id="sexo" value={formData.sexo} onChange={handleChange} className={inputStyle}>
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Idade */}
                            <div className="flex-1">
                                 <label htmlFor="idade" className={labelStyle}>Idade (anos)</label>
                                 <input
                                    type="number"
                                    name="idade"
                                    id="idade"
                                    placeholder="Ex: 2"
                                    value={formData.idade}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className={inputStyle}
                                />
                            </div>
                            {/* Data de Nascimento (NOVO) */}
                            <div className="flex-1">
                                <label htmlFor="dtNascimento" className={labelStyle}>Data de Nasc. (Opcional)</label>
                                <input
                                    type="date"
                                    name="dtNascimento"
                                    id="dtNascimento"
                                    value={formData.dtNascimento}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Ninhada (NOVO) */}
                        <div>
                            <label htmlFor="ninhada" className={labelStyle}>Ninhada / Irmãos (Opcional)</label>
                            <input
                                type="text"
                                name="ninhada"
                                id="ninhada"
                                placeholder="Ex: Ninhada B, irmão do Bolt..."
                                value={formData.ninhada}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label htmlFor="descricao" className={labelStyle}>Descrição</label>
                            <textarea
                                name="descricao"
                                id="descricao"
                                placeholder="História, temperamento, necessidades especiais..."
                                value={formData.descricao}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                                rows={4}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Status (NOVO) */}
                            <div className="flex-1 w-full">
                                <label htmlFor="status" className={labelStyle}>Status de Adoção</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                    <option value="Disponível">Disponível</option>
                                    <option value="Adotado">Adotado</option>
                                    <option value="Em tratamento">Em tratamento</option>
                                </select>
                            </div>
                            
                            {/* Castração (NOVO) */}
                            <div className="flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    name="castracao"
                                    id="castracao"
                                    checked={formData.castracao}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-amber-700"
                                />
                                <label htmlFor="castracao" className="ml-2 text-neutral-800 font-medium">
                                    Castrado(a)?
                                </label>
                            </div>
                        </div>
                        
                        {/* Upload de Foto (NOVO) */}
                        <div>
                            <label className={labelStyle}>Foto Principal do Pet</label>
                            <label htmlFor="fotos" className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <Upload className="w-5 h-5 text-gray-500" />
                                <span className="text-neutral-700">
                                    {/* 10. Exibe o nome do arquivo (file.name) */}
                                    {file ? file.name : "Clique para selecionar foto"}
                                </span>
                            </label>
                            <input
                                type="file"
                                name="fotos"
                                id="fotos"
                                accept="image/png, image/jpeg, image/webp" // Aceita apenas imagens
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>


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