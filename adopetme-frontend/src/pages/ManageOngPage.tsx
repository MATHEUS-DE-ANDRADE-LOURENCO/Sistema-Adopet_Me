// adopetme-frontend/src/pages/ManageOngPage.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// 1. Importar useNavigate
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSession } from '../context/SessionContext';
import { Ong } from '../models/OngModel';
import { Pet } from '../models/PetModel';
import { getMyOngDetails, updateMyOngDetails } from '../services/OngService';
import * as PetService from '../services/PetService';
import { Loader2, User, Home, PawPrint, Edit, Trash2 } from 'lucide-react';

type Tab = 'ong' | 'pets';

const ManageOngPage: React.FC = () => {
    const navigate = useNavigate(); // 2. Instanciar o navigate
    const { token, userRole } = useSession();
    
    const [tab, setTab] = useState<Tab>('ong');
    const [loading, setLoading] = useState(true);
    
    // --- Estados da ONG ---
    const [ongData, setOngData] = useState<Partial<Ong>>({});
    const [loadingOngSave, setLoadingOngSave] = useState(false);
    const [ongError, setOngError] = useState<string | null>(null);
    const [ongSuccess, setOngSuccess] = useState<string | null>(null);
    
    // --- Estados dos Pets ---
    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);
    const [petError, setPetError] = useState<string | null>(null);

    // ... (useEffect de redirecionamento) ...
    useEffect(() => {
        if (userRole && userRole !== 'ADMIN_ONG') {
            navigate('/');
        }
    }, [userRole, navigate]);

    // ... (useEffect de busca de dados) ...
    useEffect(() => {
        if (token && tab === 'ong') {
            loadOngData();
        } else if (token && tab === 'pets') {
            loadPetData();
        }
    }, [token, tab]); 

    // ... (loadOngData) ...
    const loadOngData = async () => {
        if (!token) return;
        setLoading(true);
        setOngError(null);
        try {
            const ongDetails = await getMyOngDetails(token);
            setOngData(ongDetails);
        } catch (err: any) {
            setOngError(err.message || "Erro ao carregar dados da ONG.");
        } finally {
            setLoading(false);
        }
    };

    // ... (loadPetData) ...
    const loadPetData = async () => {
        if (!token) return;
        setLoadingPets(true);
        setPetError(null);
        try {
            const ongPets = await PetService.getMyOngPets(token);
            setPets(ongPets);
        } catch (err: any) {
            setPetError(err.message || "Erro ao carregar pets.");
        } finally {
            setLoadingPets(false);
        }
    };


    // ... (handleOngChange) ...
    const handleOngChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOngData({
            ...ongData,
            [e.target.name]: e.target.value
        });
    };

    // ... (handleOngSubmit) ...
    const handleOngSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoadingOngSave(true);
        setOngSuccess(null);
        setOngError(null);
        
        try {
            await updateMyOngDetails(ongData, token);
            setOngSuccess("Dados da ONG atualizados com sucesso!");
        } catch (err: any) {
            setOngError(err.message);
        } finally {
            setLoadingOngSave(false);
        }
    };

    // --- Handlers dos Pets ---

    // 3. MUDANÇA AQUI
    const handleEditPet = (petId: number) => {
        // MUDADO de alert() para navigate()
        navigate(`/edit-pet/${petId}`);
    };

    const handleDeletePet = async (petId: number) => {
        if (!token) return;
        
        if (!window.confirm("Tem certeza que deseja deletar este pet? Esta ação não pode ser desfeita.")) {
            return;
        }

        setPetError(null);
        try {
            await PetService.deletePet(petId, token);
            // Remove o pet da lista local
            setPets(pets.filter(pet => pet.id !== petId));
        } catch (err: any) {
            setPetError(err.message);
        }
    };

    // ... (Estilos) ...
    const inputStyle = "border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 w-full";
    const labelStyle = "text-sm font-semibold text-neutral-700 mb-1";
    const tabStyle = (active: boolean) => 
        `py-3 px-6 font-semibold cursor-pointer border-b-4 ${
            active 
            ? 'border-amber-700 text-amber-700' 
            : 'border-transparent text-gray-500 hover:text-black'
        }`;

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                    
                    {/* Abas */}
                    <div className="flex border-b mb-6">
                        <div className={tabStyle(tab === 'ong')} onClick={() => setTab('ong')}>
                            <User className="w-5 h-5 inline mr-2" />
                            Gerenciar ONG
                        </div>
                        <div className={tabStyle(tab === 'pets')} onClick={() => setTab('pets')}>
                            <PawPrint className="w-5 h-5 inline mr-2" />
                            Gerenciar Pets
                        </div>
                    </div>

                    {/* Conteúdo da Aba */}
                    {tab === 'ong' && (
                        // --- Formulário da ONG ---
                        <form onSubmit={handleOngSubmit} className="flex flex-col gap-5">
                            <h2 className="text-xl font-bold text-black">Informações da ONG</h2>
                            
                            {loading && <Loader2 className="w-8 h-8 animate-spin text-amber-700 mx-auto" />}
                            
                            {ongError && <div className="text-red-600 text-sm bg-red-100 p-2 rounded">{ongError}</div>}
                            {ongSuccess && <div className="text-green-600 text-sm bg-green-100 p-2 rounded">{ongSuccess}</div>}

                            {!loading && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="nome" className={labelStyle}>Nome da ONG</label>
                                            <input type="text" name="nome" value={ongData.nome || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div>
                                            <label htmlFor="responsavel" className={labelStyle}>Responsável</label>
                                            <input type="text" name="responsavel" value={ongData.responsavel || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className={labelStyle}>E-mail (Não editável)</label>
                                            <input type="email" name="email" value={ongData.email || ''} readOnly disabled className={`${inputStyle} bg-gray-100`} />
                                        </div>
                                        <div>
                                            <label htmlFor="telefone" className={labelStyle}>Telefone</label>
                                            <input type="text" name="telefone" value={ongData.telefone || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="endereco" className={labelStyle}>Endereço</label>
                                            <input type="text" name="endereco" value={ongData.endereco || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div>
                                            <label htmlFor="cidade" className={labelStyle}>Cidade</label>
                                            <input type="text" name="cidade" value={ongData.cidade || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div>
                                            <label htmlFor="estado" className={labelStyle}>Estado (Sigla)</label>
                                            <input type="text" name="estado" maxLength={2} value={ongData.estado || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="descricao" className={labelStyle}>Descrição / Sobre</label>
                                            <textarea name="descricao" rows={4} value={ongData.descricao || ''} onChange={handleOngChange} className={inputStyle} />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
                                        disabled={loadingOngSave}
                                    >
                                        {loadingOngSave ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Alterações'}
                                    </button>
                                </>
                            )}
                        </form>
                    )}

                    {tab === 'pets' && (
                        // --- Lista de Pets ---
                        <div>
                            <h2 className="text-xl font-bold text-black mb-4">Meus Pets Registrados</h2>
                            {petError && <div className="text-red-600 text-sm bg-red-100 p-2 rounded mb-4">{petError}</div>}
                            
                            <div className="flex flex-col gap-4">
                                {loadingPets ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                                    </div>
                                ) : pets.length === 0 ? (
                                    <p className="text-gray-500 text-center">Nenhum pet registrado ainda.</p>
                                ) : (
                                    pets.map(pet => (
                                        <div key={pet.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={`https://place-puppy.com/60x60?image=${pet.id}`} // Placeholder
                                                    alt={pet.nome}
                                                    className="w-16 h-16 rounded-md object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-lg font-bold text-black">{pet.nome}</h3>
                                                    <span className="text-sm text-gray-600">{pet.especie} | {pet.status}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEditPet(pet.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                                    title="Editar Pet"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePet(pet.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                                    title="Deletar Pet"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageOngPage;