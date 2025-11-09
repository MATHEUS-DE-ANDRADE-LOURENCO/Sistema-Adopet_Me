// adopetme-frontend/src/pages/ReportPage.tsx
import React, { useState, FormEvent } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldAlert, Send, Loader2 } from 'lucide-react'; // Ícones para a página
import { useSession } from '../context/SessionContext'; // 1. Importar o useSession

const ReportPage: React.FC = () => {
    const [reportText, setReportText] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // 2. Estados separados para erro/sucesso
    const [loading, setLoading] = useState(false); // 3. Estado de loading
    
    const { token } = useSession(); // 4. Pegar o token de autenticação, se houver

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (reportText.trim().length < 20) {
            setError("Por favor, detalhe um pouco mais a sua denúncia (mínimo de 20 caracteres).");
            setMessage(null);
            return;
        }

        setError(null);
        setMessage(null);
        setLoading(true);

        // 5. Preparar a requisição para o backend
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Adiciona o token de autorização SE o usuário estiver logado
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const body = JSON.stringify({ message: reportText });

        try {
            const response = await fetch('http://localhost:8081/api/report', {
                method: 'POST',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                // Tenta ler a mensagem de erro do backend
                const errorText = await response.text();
                throw new Error(errorText || "Falha ao enviar denúncia.");
            }

            // Sucesso
            setMessage("Sua denúncia foi enviada com sucesso. Obrigado por nos ajudar a manter a plataforma segura.");
            setReportText(''); // Limpa o campo de texto
            
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        } finally {
            setLoading(false); // Para o loading
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex justify-center items-start py-12">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                    <h1 className="text-2xl font-bold text-center mb-4 text-black flex items-center justify-center gap-2">
                        <ShieldAlert className="text-red-600"/> Canal de Denúncias
                    </h1>

                    <p className="text-center text-neutral-700 mb-6">
                        Este espaço é dedicado a denúncias de maus-tratos, ONGs falsas ou qualquer 
                        comportamento inadequado. Sua denúncia será enviada à nossa equipe de moderação. 
                        Se estiver logado, sua identidade será anexada.
                    </p>

                    {/* Mensagens de Feedback Atualizadas */}
                    {message && (
                        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-sm text-center">
                            {message}
                        </div>
                    )}
                    {error && (
                         <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="reportText" className="text-sm font-semibold text-neutral-700 mb-1">
                                Descreva sua denúncia
                            </label>
                            <textarea
                                name="reportText"
                                id="reportText"
                                placeholder="Forneça o máximo de detalhes possível, como o nome da ONG, o pet envolvido, datas, e o que ocorreu..."
                                value={reportText}
                                onChange={(e) => {
                                    setReportText(e.target.value);
                                    if (message) setMessage(null);
                                    if (error) setError(null);
                                }}
                                required
                                className="border-2 border-gray-300 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 w-full"
                                rows={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-red-700 text-white py-3 rounded font-bold hover:bg-red-800 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                            disabled={loading} // 6. Desabilitar o botão durante o envio
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            {loading ? 'Enviando...' : 'Enviar Denúncia'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReportPage;