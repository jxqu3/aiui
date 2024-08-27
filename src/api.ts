import { errorStore, setError } from "./utils";
import { get, writable } from "svelte/store";

export let ollamaApi = writable(true);
export let apiKey = writable("YOUR_API_KEY");

export let apiUrl = writable("http://127.0.0.1:11434"); // ollama default api url
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

export let options = writable(
    {
        temperature: 0.7,
        max_tokens: 400,
    }
)

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
    apiUrl.set(url);
}

export async function getModelList(): Promise<Model[]> {
    if (get(ollamaApi)) {
        try {
            const response = await fetch(`${get(apiUrl)}/api/tags`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const json = await response.json();
            return json["models"];
        } catch (error: any) {
            return []
        }
    } else {
        try {
            const response = await fetch(`${get(apiUrl)}/models`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const json = await response.json();
            return json["data"].map((model: any) => {
                return {
                    name: model.id,
                    details: {
                        parameter_size: "?"
                    }
                }
            });
        } catch (error: any) {
            setError("Error fetching model list: " + error.toString());
            return [
                {
                    name: "error",
                    details: {
                        parameter_size: "?"
                    }
                }
            ]
        }
    }
}

function parseMessages(messages: Message[]) {
    const prompt = get(prompts)[get(selectedPrompt)]
    let personaPrompt = `\nUser Persona:\n Name: ${get(persona).name}\nDescription: ${get(persona).description}`

    if (get(persona).use == false) {
        personaPrompt = ""
    }

    let messagePrompt = `${prompt.prompt.replaceAll("{{char}}", prompt.name).replaceAll("{{user}}", get(persona).name)}`

    const parsed = messages.map((message) => {
        if (message.images && message.images.length > 0) {
            if (get(ollamaApi)) {
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
                    content: message.content,
                    image_url: [
                        message.images[0] // OAI API requires the Base64 header.
                    ] 
                }
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
            content: `${messagePrompt}\n${personaPrompt}`
        },
        ...parsed
    ]
}

export async function* chatRequest(model: string, messages: Message[], options: any) {
    generatingStore.set(true);
    try {
        let parsedMessages = parseMessages(messages)
        console.log("Request messages:", parsedMessages);
        let response: Response;
        if (get(ollamaApi)) {
            response = await fetch(`${get(apiUrl)}/api/chat`, {
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
        } else {
            response = await fetch(`${get(apiUrl)}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${get(apiKey)}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: parsedMessages,
                    max_tokens: options.max_tokens,
                    temperature: options.temperature, 
                    stream: true
                })
            });
        }

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
            const chunkValue: any = decoder.decode(value, {stream: true});
            
            // send to update message 
            if(!done) {
                if (aborted) {
                    await reader?.cancel()
                    aborted = false
                    break
                }
                if(get(ollamaApi)) {
                    const token = JSON.parse(chunkValue)['message']['content'];
                    if(token) {
                        yield token
                    }
                } else {
                    const lines = chunkValue.split('\n');
                    for (let line of lines) {
                        const data = line.substring(6).trim()
                        if (data === '') continue; // Skip empty lines
                        if (data === '[DONE]') {
                            done = true; // End of the stream
                            break;
                        }
                        try {
                            const json = JSON.parse(data)
                            if (json.choices) {
                                const text = json.choices[0].delta.content || ''; // Extract the content
                                yield text; // Handle the streamed data
                            }
                        } catch (error) {
                            console.log(line)
                            setError(`Error parsing JSON: ${error}`);
                        }
                    }
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