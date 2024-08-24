import { errorStore, setError } from "./utils";
import { get, writable } from "svelte/store";

let apiUrl: string = "http://127.0.0.1:11434"; // ollama default api url
let isGenerating: boolean = false;

let aborted = false;

export let generatingStore: any = writable(isGenerating);

export let prompts = writable([
    {
        name: "AI Assistant",
        shortDescription: "A simple AI assistant",
        prompt: "AI Assistant"
    }
])
export let selectedPrompt = writable(0)

export function addPrompt(prompt: Prompt) {
    prompts.set([...get(prompts), prompt])
}


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
    use: boolean
}

export let persona = writable({
    name: "User",
    description: "a user",
    use: true
})

export type Prompt = {
    name: string,
    shortDescription: string,
    prompt: string,
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

function parseMessages(messages: Message[]) {
    const prompt = get(prompts)[get(selectedPrompt)]
    let personaPrompt = `\nUser Persona:\n Name: ${get(persona).name}\nDescription: ${get(persona).description}`

    if (!get(persona).use) {
        personaPrompt = ""
    }

    const parsed = messages.map((message) => {
        if (message.images && message.images.length > 0) {
            return {
                role: message.role,
                content: message.content,
                images: [
                    message.images[0].split(",")[1] // OLLaMA API does not accept the Base64 header.
                ] 
            }
        } else {
            return {
                role: message.role,
                content: message.content
            }
        }
    })
    return [
        {
            role: "system",
            content: `${prompt.prompt.replaceAll("{{char}}", prompt.name).replaceAll("{{user}}", get(persona).name)}`
        },
        ...parsed
    ]
}

export async function* chatRequest(model: string, messages: Message[], options: any) {
    generatingStore.set(true);
    try {
        let parsedMessages = parseMessages(messages)
        console.log("Request messages:", parsedMessages);
        const response = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: parsedMessages,
                options: options,
                keep_alive: "30m",
            })
        });

        // handle errors
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // json streaming
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let done = false;
        
        while (!done) {
            const { value, done: doneReading } = await reader!.read();
            done = doneReading;
            generatingStore.set(!done);
            const chunkValue: any = decoder.decode(value);
            
            // send to update message 
            if(!done) {
                if (aborted) {
                    await reader?.cancel()
                    aborted = false
                    break
                }
                const token = JSON.parse(chunkValue)['message']['content'];
                if(token) {
                    yield token
                }
            }
        }
        generatingStore.set(false);
    } catch (error: any) {
        setError("Error generating response: " + error.toString());
    }
}

export function abort() {
    aborted = true;
    generatingStore.set(false);
}