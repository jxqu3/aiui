import { setError } from "./utils";
import { writable } from "svelte/store";

let apiUrl: string = "http://127.0.0.1:11434"; // ollama default api url
let isGenerating: boolean = false;
export let generatingStore = writable(isGenerating);

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

export type Chat = Message[]

export type Persona = {
    name: string,
    description: string,
    use: boolean,
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
        return json["models"];
    } catch (error: any) {
        setError("Error loading models: " + error.toString() + "\n Is OLLaMA running?");
        return []
    }
}

export async function* chatRequest(model: string, messages: Message[], options: any) {
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
        // json streaming
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let done = false;
        
        while (!done) {
            const { value, done: doneReading } = await reader!.read();
            done = doneReading;
            generatingStore.set(!done);
            const chunkValue: any = decoder.decode(value);
            const token = JSON.parse(chunkValue)['message']['content'];

            // send to update message 
            if(!done) {
                if(token) {
                    yield token
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

