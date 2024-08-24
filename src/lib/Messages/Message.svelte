<script lang="ts">
  import { createEventDispatcher } from "svelte";
    import IconButton from "../IconButton.svelte";
  import { blur } from "svelte/transition";
  import { chatRequest, type Chat, generatingStore, type Message } from "../../api";

    const dispatch = createEventDispatcher()

    export let message: Message
    export let selectedModel = ""
    export let chat: Chat
    export let id: number

    $: ({role, images} = message)

    const regenerate = async () => {
        if ($generatingStore) return
        
        const previousMessages = chat.slice(0, id)
        
        // Request yield
        const request = chatRequest(selectedModel, previousMessages, {max_tokens: 100, temperature: 0.8})
        message.content = ""

        for await (const response of request) {
            message.content += response
            chat = chat
        }
    }

    let isEditing = false;
    $: image = images?.[0]
</script>

<div class="message" transition:blur={{duration: 150 }}>
    <div class="message-body {role}">
        <img src={role === "user" ? "/user.svg" : "/ai-profile.svg"} alt="" srcset="">
        <div class="body-container">
            <div class="message-header">
                <span class="sender">{role}</span>
                <IconButton width={1.5} icon="/edit.svg" on:click={() => isEditing = true}/>
                <IconButton width={1.5} icon="/remove.svg" on:click={() => dispatch('delete')}/>
                <IconButton width={1.5} icon="/regen.svg" on:click={() => regenerate()}/>
            </div>
        
            {#if !isEditing}
            <div class="message-content">
                <p class="content">
                    {message.content}
                </p>
            </div>
            {:else}
            <textarea bind:value={message.content}></textarea>
            <button class="btn" on:click={() => {
                isEditing = false

            }}>Save</button>
            {/if}
        </div>
    </div>
    {#if image}
        <img src={image} alt="" srcset="">
    {/if}
</div>

<style>
    .message {
        padding: 2rem;
        width: 100%;
        display: flex;
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
    
    .message-body img {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 100%;
    }

    .content {
        /* allow for linebreaks*/
        white-space: pre-wrap;
    }
</style>