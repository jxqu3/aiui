<script lang="ts">
  import type { Chat } from './api';
  import ErrorModal from './lib/ErrorModal.svelte';
  import IconToggle from './lib/IconToggle.svelte';
  import MessageSender from './lib/Messages/MessageSender.svelte';
  import MessagesPanel from './lib/Messages/MessagesPanel.svelte';
  import ModelDropdown from './lib/ModelDropdown.svelte';
  import { clearError, errorStore } from './utils';

  export let dark = true
  $: darkMode = dark ? 'dark' : 'light' 

  let selectedModel: string = ""

  let chats: Chat[] = [
    [
    ],
  ]
  let selectedChat = 0

</script>

<main class="{darkMode}">
  {#if $errorStore != ""}
    <ErrorModal on:close={() => clearError()}>{$errorStore}</ErrorModal>
  {/if}
  <header class="header">
    <IconToggle icon="/lighttoggle.svg" width={1.5} bind:value={dark}/>
    <ModelDropdown bind:selectedModel={selectedModel}/>
  </header>
  <div class="content">
    <div class="settings-panel"></div>
    <div class="chat-panel">
      <MessagesPanel selectedModel={selectedModel} chats={chats} selectedChat={selectedChat}/>
      <MessageSender bind:chats bind:selectedChat bind:selectedModel/>
    </div>
    <div class="prompts-panel"></div>
  </div>
</main>

<style>

  .header {
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 100vw;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
  }

  .chat-panel {
    height: 100%;
    border-radius: var(--radius) var(--radius) 0 0;
    display: flex;
    flex-direction: column;
    background-color: var(--panel-bg);
  }

</style>
