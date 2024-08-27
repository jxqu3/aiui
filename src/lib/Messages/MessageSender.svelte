<script lang="ts">
    import { type Chat, chatRequest } from "../../api";
    import IconButton from "../IconButton.svelte";
    import { generatingStore } from "../../api";
    import { fileToBase64, setStorage } from "../../utils";
    import { createEventDispatcher, onMount } from "svelte";
    
    const dispatch = createEventDispatcher()

    export let selectedChat = 0
    export let selectedModel = ""
    export let chats: Chat[]

    let fileInput: HTMLInputElement
    let image: string = "" // base64-encoded image

    let writtenMessage = ""
    let textarea: HTMLTextAreaElement

    const sendMessage = async () => {
        if (writtenMessage.trim() == "" || $generatingStore) return
        
        chats[selectedChat].push({
            role: 'user',
            content: writtenMessage,

            images: image ? [image] : []
        })
        image = ""
        fileInput.value = ""
        writtenMessage = ""
        chats = chats

        const requestChat = chats[selectedChat].map(chat => chat)
        chats[selectedChat].push({
            role: 'assistant',
            content: "..."
        })
        chats = chats

        // scroll to bottom
        dispatch('written')

        const message = chats[selectedChat][chats[selectedChat].length - 1]
        
        // Request yield
        const request = chatRequest(selectedModel, requestChat, {max_tokens: 100, temperature: 0.8})
        message.content = ""

        for await (const response of request) {
            message.content += response
            dispatch('written')
            chats = chats
        }

        setStorage("chats", chats)
    }

    const handleImage = async (e: Event) => {
        if (e.target && e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0]
            const base64 = await fileToBase64(file)

            image = base64
        }
    }
</script>

<div class="sender-container">
    <div class="message-sender">
        <IconButton width={2.5} icon="/remove.svg" on:click={() =>{
            chats[selectedChat] = []
        }}/>
    
        <!-- image uploading -->
        <IconButton width={2.5} icon="/new.svg" on:click={() => fileInput.click()} classes="{image == '' ? '' : 'active'}" tooltip="Upload an image"/>
    
        <input bind:this={fileInput} type="file" accept="image/*" on:change={
            (e) => {
                handleImage(e)
            }
        }>
        <!-- image uploading -->
    
        <div class="text-container">
            <textarea placeholder="Type a message..." rows="1" bind:this={textarea} bind:value={writtenMessage} on:keyup={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !$generatingStore) {
                    e.preventDefault()
                    sendMessage()
                    return
                }
                // scale to fit height
                textarea.style.height = "auto"
                textarea.style.height = `${textarea.scrollHeight}px`
            }}></textarea>
        </div>
        <IconButton width={2.5} icon="/send-ai.svg" tooltip="Send message as AI" on:click={
            () => {
                chats[selectedChat].push({
                    role: 'assistant',
                    content: writtenMessage,
                })
                chats = chats
                writtenMessage = ""
                setStorage("chats", chats)
            }
        }/>
        <IconButton width={2.5} icon="/send.svg" on:click={sendMessage}/>
    </div>
</div>

<style>
    :global(.active > svg *) {
        color: var(--accent);
        fill: var(--accent) !important;
        stroke: var(--accent);
    }

    .message-sender {
        display: flex;
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
        width: calc(100% - 2rem);
        margin: 1rem auto;
        padding: 0.5rem;
        border-radius: var(--radius);
        height: 3.5rem;
        background-color: var(--bg);
    }

    :global(.light .message-sender) {
        border: 2px solid var(--text-lower);
    }
    
    :global(.message-sender button) {
        align-self: flex-start;
    }

    .text-container {
        position: relative;
        width: 100%;
        height: max-content;
        display: flex;
        flex-direction: column;
        flex: 1 1 0%;
        /*overflow: hidden;*/
    }

    .message-sender textarea, textarea::after, textarea::before {
        appearance: none;
        box-sizing: border-box;
        line-height: 1.5;
        min-height: 1rem;
        max-height: 15rem;
        width: 100%;
        overflow-wrap: break-word;
        /*overflow: auto;*/
        white-space-collapse: preserve;
        flex-grow: 1;

        border: 0;
        resize: none;
        outline: none;
        background-color: #0000;
    }

    textarea::-webkit-scrollbar {
        display: none;
    }

    input[type="file"] {
        display: none;
    }

    @media screen and (max-width: 600px) {
        .message-sender {
            position: absolute;
            z-index: 1000;
            width: 100%;
            bottom: 0;
            left: 0;
            margin: 0;
            border-radius: 0;
        }

        .text-container {
            width: 100%;
        }

    }
</style>