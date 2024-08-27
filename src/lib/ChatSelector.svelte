<script lang="ts">
    import type { Chat } from "../api";
    import { setSetting } from "../utils";
    import IconButton from "./IconButton.svelte";

    export let chats: Chat[]
    export let selectedChat: number
</script>

<div class="chats">
    {#each chats as chat, id}
        <button class="selector-button {id == selectedChat ? 'selected' : ''}" on:click={() => {
            selectedChat = id
            setSetting('selectedChat', selectedChat)
        }}>
            <span>{chat[0] ? `"${chat[0].content.slice(0, 15)}..."` : "empty chat"}</span>
            <IconButton classes="remove-chat" width={1.5} icon="/remove.svg" on:click={() => {
                selectedChat = 0
                if(id == 0){
                    chats[0] = []
                    return
                }
                chats.splice(id, 1)
                chats = chats
            }}/>
        </button>
    {/each}
</div>

<style>
    .chats {
        width: 100%;
        height: 100%;
        overflow-y: auto; 
        overflow-x: hidden;
    }
</style>