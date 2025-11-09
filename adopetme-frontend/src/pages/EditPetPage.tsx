// adopetme-frontend/src/pages/EditPetPage.tsx
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, PawPrint, Upload } from 'lucide-react';
import { useSession } from '../context/SessionContext';
// 1. Importar updatePet e getPetById
import { updatePet, getPetById, PetRegistrationData } from '../services/PetService'; 
import { Pet } from '../models/PetModel';

const EditPetPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Pega o ID da URL
    const { token, userRole } = useSession();
    
    // 2. Estado do formulário
    const [formData, setFormData] = useState<PetRegistrationData>({
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
    
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Loading do submit
    const [loadingPage, setLoadingPage] = useState(true); // 3. Loading da página
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // 4. Redireciona se não for ONG
    useEffect(() => {
        if (userRole && userRole !== 'ADMIN_ONG') {
            navigate('/');
        }
    }, [userRole, navigate]);

    // 5. Busca os dados do Pet para preencher o formulário
    useEffect(() => {
        const fetchPetData = async () => {
            if (!id) {
                setError("ID do pet não encontrado.");
                setLoadingPage(false);
                return;
            }

            try {
                // (getPetById não precisa de token, é público)
                const petId = parseInt(id);
                const petData: Pet = await getPetById(petId);

                // Formata a data para o input (vem "YYYY-MM-DD" ou null)
                const birthDate = petData.dtNascimento ? petData.dtNascimento.split('T')[0] : '';

                // Popula o formulário
                setFormData({
                    nome: petData.nome,
                    especie: petData.especie,
                    sexo: petData.sexo,
                    idade: petData.idade,
                    descricao: petData.descricao,
                    status: petData.status,
                    ninhada: petData.ninhada || '',
                    castracao: petData.castracao,
                    dtNascimento: birthDate
                });

            } catch (err: any) {
                setError(err.message || "Erro ao buscar dados do pet.");
            } finally {
                setLoadingPage(false);
            }
        };

        fetchPetData();
    }, [id]); // Depende do 'id' da URL

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName(null);
        }
    };

    // 6. handleSubmit agora chama updatePet
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token || !id) {
            setError("Autenticação ou ID do pet inválidos.");
            return;
        }

        setLoading(true);

        try {
            const dataToSubmit: PetRegistrationData = {
                ...formData,
                dtNascimento: formData.dtNascimento === '' ? undefined : formData.dtNascimento
            };

            const petId = parseInt(id);
            await updatePet(petId, dataToSubmit, token); // <--- MUDANÇA AQUI
            
            setSuccess("Pet atualizado com sucesso! Redirecionando...");
            
            // Redireciona de volta para a página de gerenciamento
            setTimeout(() => {
                navigate('/manage-ong');
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
    
    // Estilos (iguais ao PetRegistrationPage)
    const inputStyle = "border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 w-full";
    const labelStyle = "text-sm font-semibold text-neutral-700 mb-1";

    // 7. Renderização do Loading da página
    if (loadingPage) {
        return (
            <div className="min-h-screen w-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow flex justify-center items-center">
                    <Loader2 className="w-12 h-12 animate-spin text-amber-700" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                    <h1 className="text-2xl font-bold text-center mb-6 text-black flex items-center justify-center gap-2">
                        <PawPrint className="text-amber-700"/> Editar Pet {/* <--- TÍTULO MUDADO */}
                    </h1>

                    {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}
                    {success && <div className="text-green-600 mb-4 text-sm text-center bg-green-100 p-2 rounded border border-green-200">{success}</div>}

                    {/* FORMULÁRIO (idêntico ao de Registro) */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        <div>
                            <label htmlFor="nome" className={labelStyle}>Nome do Pet</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className={inputStyle} />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="especie" className={labelStyle}>Espécie</label>
                                <select name="especie" id="especie" value={formData.especie} onChange={handleChange} className={inputStyle}>
                                    <option value="Cachorro">Cachorro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="sexo" className={labelStyle}>Sexo</label>
                                <select name="sexo" id="sexo" value={formData.sexo} onChange={handleChange} className={inputStyle}>
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                 <label htmlFor="idade" className={labelStyle}>Idade (anos)</label>
                                 <input type="number" name="idade" id="idade" value={formData.idade} onChange={handleChange} required min="0" className={inputStyle} />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="dtNascimento" className={labelStyle}>Data de Nasc. (Opcional)</label>
                                <input type="date" name="dtNascimento" id="dtNascimento" value={formData.dtNascimento} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="ninhada" className={labelStyle}>Ninhada / Irmãos (Opcional)</label>
                            <input type="text" name="ninhada" id="ninhada" value={formData.ninhada} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div>
                            <label htmlFor="descricao" className={labelStyle}>Descrição</label>
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} required className={inputStyle} rows={4} />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex-1 w-full">
                                <label htmlFor="status" className={labelStyle}>Status de Adoção</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                    <option value="Disponível">Disponível</option>
                                    <option value="Adotado">Adotado</option>
                                    <option value="Em tratamento">Em tratamento</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <input type="checkbox" name="castracao" id="castracao" checked={formData.castracao} onChange={handleChange} className="h-5 w-5 accent-amber-700" />
                                <label htmlFor="castracao" className="ml-2 text-neutral-800 font-medium">Castrado(a)?</label>
                            </div>
                        </div>
                        
                        <div>
                            <label className={labelStyle}>Fotos do Pet (Opcional)</label>
                            <label htmlFor="fotos" className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <Upload className="w-5 h-5 text-gray-500" />
                                <span className="text-neutral-700">{fileName || "Clique para selecionar fotos"}</span>
                            </label>
                            <input type="file" name="fotos" id="fotos" multiple onChange={handleFileChange} className="hidden" />
                            <p className="text-xs text-gray-500 mt-1">O upload de fotos ainda não é funcional.</p>
                        </div>

                        <button
                            type="submit"
                            className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditPetPage;