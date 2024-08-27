<script lang="ts">
  import { onMount } from "svelte";
  import type { Chat } from "../../api";
  import { setSetting, setStorage } from "../../utils";
  import Message from "./Message.svelte";

    export let chats: Chat[];
    export let selectedChat: number = 0;
    export let selectedModel: string;

    let container

    onMount(() => {
        container.scrollTo(0, container.scrollHeight)
    })
</script>

<div bind:this={container} class="messages-container" id="messages-container">
    {#each chats[selectedChat] as message, id}
        <Message bind:chats={chats} bind:selectedChat={selectedChat} id={id} bind:selectedModel bind:message={message} on:delete={() => {
            chats[selectedChat].splice(id, 1)
            chats = chats
            setStorage("chats", chats)
        }}/>
    {/each}    
</div>

<style>
    .messages-container {
        position: relative;
        max-height: calc(100svh - 3.5rem - 5.5rem);
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }
</style>