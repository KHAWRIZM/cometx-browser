// src/ai/sovereign-ai.js
// CometX Sovereign AI - KHAWRIZM

const AZURE_CONFIG = {
    endpoint: "https://alshammaris-2770-resource.services.ai.azure.com/api/projects/alshammaris-2770",
    openaiEndpoint: "https://alshammaris-2770-resource.openai.azure.com/openai/v1/",
    get key() { return localStorage.getItem("AZURE_KEY") || ""; },
    region: "eastus2"
};

const MODELS = {
    gpt4: { id: "gpt-4.1", name: "Executive", icon: "��" },
    claude: { id: "claude-opus-4-5", name: "Cognitive", icon: "🤖" },
    deepseek: { id: "DeepSeek-R1-0528", name: "Analytical", icon: "🔬" },
    llama: { id: "Meta-Llama-3.1-405B-Instruct", name: "Creative", icon: "🦙" }
};

class SovereignAI {
    constructor() { this.currentModel = MODELS.gpt4; this.currentLang = "ar"; }
    setApiKey(key) { localStorage.setItem("AZURE_KEY", key); }
    async chat(message) {
        if (!AZURE_CONFIG.key) return { error: "Set key first" };
        const res = await fetch(AZURE_CONFIG.openaiEndpoint + "chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "api-key": AZURE_CONFIG.key },
            body: JSON.stringify({ model: this.currentModel.id, messages: [{ role: "user", content: message }], temperature: 0.7 })
        });
        return await res.json();
    }
}
window.SovereignAI = SovereignAI;
window.MODELS = MODELS;
