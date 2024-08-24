<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import IconButton from "../IconButton.svelte";
    import { blur } from "svelte/transition";
    import { chatRequest, type Chat, generatingStore, type Message, abort, prompts, selectedPrompt, persona } from "../../api";
    import { formatText, setStorage } from "../../utils"
  import Avatar from "./Avatar.svelte";

    const dispatch = createEventDispatcher()

    export let message: Message
    export let selectedModel = ""
    export let id: number
    export let chats: Chat[]
    export let selectedChat: number

    export const scrollUpdate = () => {
        dispatch('written')
    }

    let generations = [
        message.content
    ]
    let selectedGeneration = 0
    
    $: ({role, images} = message)

    const regenerate = async () => {
        if ($generatingStore) abort()
        
        const previousMessages = chats[selectedChat].slice(0, id)

        // Request yield
        generations = ["...", ...generations]
        selectedGeneration = 0

        const request = chatRequest(selectedModel, previousMessages, {max_tokens: 100, temperature: 0.8})
        generations[0] = ""
        message.content = generations[0]

        for await (const response of request) {
            generations[0] += response
            message.content = generations[0]
        }
        setStorage("chats", chats)
    }

    onMount(async () => {
        dispatch('written', message.content)
    })

    let isEditing = false;
    $: image = images?.[0]
</script>

<div class="message" transition:blur={{duration: 150 }}>
    <div class="message-body {role}">
        <Avatar role={role} />
        <div class="body-container">
            <div class="message-header">
                <span class="title">{role === "user" ? $persona.name : $prompts[$selectedPrompt].name}</span>
                <IconButton width={1.5} icon="/edit.svg" on:click={() => isEditing = true}/>
                <IconButton width={1.5} icon="/remove.svg" on:click={() => dispatch('delete')}/>
                {#if role === "assistant"} 
                <IconButton width={1.5} icon="/regen.svg" on:click={() => regenerate()}/>
                {/if}
            </div>
        
            {#if !isEditing}
            <div class="message-content">
                <p class="content">
                    {@html formatText(message.content)}
                </p>
            </div>
            {#if generations.length > 1}
                <button class="gen-button" on:click={() => {
                    if(selectedGeneration < generations.length - 1)
                        selectedGeneration = (selectedGeneration + 1)
                        message.content = generations[selectedGeneration]
                    }
                }>{"<"}</button>
                <button class="gen-button" on:click={() => {
                    if(selectedGeneration > 0)
                        selectedGeneration = (selectedGeneration - 1)
                        message.content = generations[selectedGeneration]
                    }
                }>{">"}</button>
                <span class="gen-number">
                    {generations.length - selectedGeneration}/{generations.length}
                </span>
            {/if}
            {:else}
            <textarea bind:value={message.content}></textarea>
            <button class="btn" on:click={() => {
                isEditing = false
                generations[selectedGeneration] = message.content
                setStorage("chats", chats)
            }}>Save</button>
            {/if}
            {#if image}
                <img class="uploaded-img" src={image} alt="Uploaded" srcset="">
            {/if}
        </div>
    </div>
</div>

<style>
    .message {
        padding: 2rem;
        width: 100%;
        display: flex;
    }

    .message p {
        color: var(--fg);
    }

    .message-body {
        width: 100%;
        display: flex;
        gap: 0.5rem;
    }

    .message-header {
        display: flex;
        width: 100%;
        align-items: center;
        margin-bottom: 0.3rem;
        gap: 0.5rem;
    }

    .message-header * {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .body-container {
        width: 90%; 
    }

   .message-content {
        width: 100%;
    }

    .message textarea {
        width: 100%;
        height: 10rem;
        resize: vertical;
        background-color: var(--bg);
        border-radius: var(--radius);
        border: 0;
        padding: 0.5rem;
        margin: .2rem;

        font-size: 1rem;
    }

    .user, .user .message-header, .user textarea {
        flex-direction: row-reverse;
        text-align: right;
    }
    
    .uploaded-img {
        width: min(80%, 25rem);
        height: auto;
        border-radius: var(--radius);
        margin-top: 1rem;
    }

    .content {
        /* allow for linebreaks*/
        white-space: pre-wrap;

        line-height: 1.4rem;
    }

    .gen-button {
        border: 0;
        background-color: #0000;
        cursor: pointer;
        padding: 1rem;
        font-size: 1.3rem;
        color: var(--text-lower);
    }

    .gen-button:hover {
        color: var(--primary);
        transform: scale(1.2);
    }
</style>