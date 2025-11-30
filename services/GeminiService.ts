
import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult, ChatMessage } from "../types";

class GeminiService {
    private client: GoogleGenAI;
    private modelName: string = 'gemini-2.5-flash';

    constructor() {
        // Menggunakan API Key dari environment variable sesuai aturan
        this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    /**
     * Menganalisis gambar untuk menentukan apakah itu limbah organik kompos.
     */
    async analyzeWasteImage(base64Data: string): Promise<AIAnalysisResult> {
        try {
            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: [{
                    parts: [
                        { 
                            text: `
                            Analyze this image. First, determine if the main subject is organic waste suitable for composting (food scraps, leaves, peels, etc.).
                            If it is a person, face, electronic device, car, plastic, or non-organic object, set 'is_waste' to false.
                            
                            Return JSON ONLY:
                            {
                                "is_waste": boolean, 
                                "items": ["list", "of", "items"],
                                "is_edible": boolean, (true if it looks like good food for donation, false if scraps/waste)
                                "ratio": number 0-1 (for compost C/N ratio, default 0.5 if not waste),
                                "advice": "short advice string"
                            }
                            ` 
                        },
                        { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
                    ]
                }]
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as AIAnalysisResult;
            } else {
                throw new Error("Invalid JSON Format");
            }
        } catch (error) {
            console.error("Gemini Analysis Error:", error);
            // Fallback response agar aplikasi tidak crash
            return {
                is_waste: false,
                items: ["Gagal Deteksi"],
                is_edible: false,
                ratio: 0,
                advice: "Terjadi kesalahan saat menganalisis gambar."
            };
        }
    }

    /**
     * Mengirim pesan chat (Global atau Konteks Spesifik).
     */
    async chat(message: string, history: ChatMessage[] = [], contextPrompt: string = ""): Promise<string> {
        try {
            // Format history agar sesuai dengan yang diharapkan model (User/Model turn)
            const historyText = history.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join("\n");
            
            const fullPrompt = `
                ${contextPrompt}
                
                Riwayat Chat:
                ${historyText}
                
                User: ${message}
            `;

            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: fullPrompt
            });

            return response.text || "Maaf, saya tidak dapat menjawab saat ini.";
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            return "Maaf, terjadi gangguan koneksi ke otak AI saya.";
        }
    }

    /**
     * Mendapatkan diagnosa dan solusi masalah kompos.
     */
    async getTroubleshootingAdvice(problemType: string, severity: string, userDescription: string): Promise<string> {
        try {
            const prompt = `
                Peran: Ahli Kompos Organik.
                Masalah: ${problemType}
                Tingkat Keparahan: ${severity}
                Deskripsi User: ${userDescription}

                Tugas: Berikan solusi langkah demi langkah (Step-by-step) yang konkret untuk mengatasi masalah ini.
                Format Output: Text polos, gunakan poin-poin (-), maksimal 100 kata. Langsung ke solusi. JANGAN pakai markdown bold (**).
            `;

            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: prompt
            });

            return response.text || "Lakukan aerasi dan atur kelembaban.";
        } catch (error) {
            return "Gagal mendapatkan saran AI. Coba cek koneksi internet.";
        }
    }
}

// Export sebagai Singleton Instance
export const geminiService = new GeminiService();
