import { setError } from "./utils";

let apiUrl: string = "http://127.0.0.1:11434"; // ollama default api url

export type Model = {
    name: string;
    details: {
        parameter_size: string;
    }
}

export type Message = {
    role: string,
    content: string,
    images?: string[],
}

export function setApiUrl(url: string) {
    if (!url) return;
    apiUrl = url;
}

export async function getModelList(): Promise<Model[]> {
    try {
        const response = await fetch(`${apiUrl}/api/tags`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json)
        return json["models"];
    } catch (error: any) {
        setError("Error loading models: " + error.toString() + "\n Is OLLaMA running?");
        return []
    }
}

export async function chatRequest(model: string, messages: Message[], options: any) {
    try {
        const response = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                options: options
            })
        });
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
}

