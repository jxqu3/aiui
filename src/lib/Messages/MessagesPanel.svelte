<script lang="ts">
  import type { Chat } from "../../api";
  import Message from "./Message.svelte";

    export let chats: Chat[];
    export let selectedChat: number;
    export let selectedModel: string;
</script>

<div class="messages-container">
    {#each chats[selectedChat] as message, id}
        <Message bind:chat={chats[selectedChat]} id={id} bind:selectedModel bind:message={message} on:delete={() => {
            chats[selectedChat].splice(id, 1)
            chats = chats
        }}/>
    {/each}    
</div>

<style>
    .messages-container {
        height: min(100%, 86vh);
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }
</style>