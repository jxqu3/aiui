<script lang="ts">
    import { type Chat, chatRequest } from "../../api";
    import IconButton from "../IconButton.svelte";
    import { generatingStore } from "../../api";

    export let selectedChat = 0
    export let selectedModel = ""
    export let chats: Chat[]

    let writtenMessage = ""
    let textarea: HTMLTextAreaElement

    const sendMessage = async () => {
        if (writtenMessage.trim() == "" || $generatingStore) return
        
        chats[selectedChat].push({
            role: 'user',
            content: writtenMessage
        })
        writtenMessage = ""

        chats[selectedChat].push({
            role: 'assistant',
            content: "..."
        })
        chats = chats

        const message = chats[selectedChat][chats[selectedChat].length - 1]
        
        // Request yield
        const request = chatRequest(selectedModel, chats[selectedChat], {max_tokens: 100, temperature: 0.8})
        message.content = ""

        for await (const response of request) {
            message.content += response
            chats = chats
        }
    }

</script>

<div class="message-sender">
    <IconButton width={2.5} icon="/remove.svg" on:click={() =>{
        chats[selectedChat] = []
    }}/>
    <IconButton width={2.5} icon="/new.svg"/>
    <div class="text-container">
        <textarea placeholder="Type a message..." rows="1" bind:this={textarea} bind:value={writtenMessage} on:keyup={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
                return
            }
            // scale to fit height
            textarea.style.height = "auto"
            textarea.style.height = `${textarea.scrollHeight}px`
        }}></textarea>
    </div>
    <IconButton width={2.5} icon="/send.svg"/>
</div>

<style>
    .message-sender {
        display: flex;
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
        width: calc(100% - 2rem);
        margin: 1rem auto;
        padding: 0.5rem;
        border-radius: var(--radius);
        height: auto;
        background-color: var(--bg);
        position: relative;
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
</style>