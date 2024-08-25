<script lang="ts">
  import { onMount } from 'svelte';
  import { options, persona, prompts, selectedPrompt, type Chat } from './api';
  import ErrorModal from './lib/ErrorModal.svelte';
  import IconToggle from './lib/IconToggle.svelte';
  import MessageSender from './lib/Messages/MessageSender.svelte';
  import MessagesPanel from './lib/Messages/MessagesPanel.svelte';
  import ModelDropdown from './lib/ModelDropdown.svelte';
  import { clearError, errorStore, getSetting, getStorage, scrollToBottom, setStorage } from './utils';
  import ChatSelector from './lib/ChatSelector.svelte';
  import PromptSelector from './lib/PromptSelector.svelte';
  import IconButton from './lib/IconButton.svelte';
  import PromptCreatorModal from './lib/PromptCreatorModal.svelte';
  import { blur } from 'svelte/transition';
  import PersonaEditor from './lib/PersonaEditor.svelte';
  import Settings from './lib/Settings.svelte';

  export let dark = true
  $: darkMode = dark ? 'dark' : 'light' 

  let selectedModel: string = ""

  let chats: Chat[] = [
    [
    ],
  ]
  let selectedChat: number = 0

  let showChats: boolean = true
  
  onMount(async () => {
    const chatsStorage = await getStorage("chats")
    const promptsStorage = await getStorage("prompts")
    if (chatsStorage) {
      chats = chatsStorage
      prompts.set(promptsStorage)
    }
    prompts.subscribe(async (value) => {
      await setStorage("prompts", value)
    })
    
    selectedChat = getSetting('selectedChat', 0)
    $selectedPrompt = getSetting('selectedPrompt', 0)
    $persona = getSetting('persona', {
      use: true,
      name: "User",
      description: "The user"
    })
    $options = getSetting('options', {
      temperature: 1,
      max_tokens: 400,
    })
  })

</script>

<main class="{darkMode}">
  {#if $errorStore != ""}
    <ErrorModal on:close={() => clearError()}>{$errorStore}</ErrorModal>
  {/if}
  <header class="header">
    <IconToggle width={1.5} bind:value={dark}/>
    <ModelDropdown bind:selectedModel={selectedModel}/>
  </header>
  <div class="content">
    <div class="settings-panel">
      <span class="title panel-title">settings</span>
      <PersonaEditor/>
      <Settings/>
    </div>
    <div class="chat-panel">
      <MessagesPanel selectedModel={selectedModel} chats={chats} selectedChat={selectedChat}/>
      <MessageSender on:written={() => scrollToBottom(document.getElementById("messages-container"))} bind:chats bind:selectedChat bind:selectedModel/>
    </div>
    <div class="chats-panel">
      {#if showChats}
      <span class="title"><button on:click={() => showChats=!showChats} class="panel-title-button">chat</button></span>
      <IconButton classes="add" width={1.5} icon="/new.svg" on:click={() => chats = [...chats, []]}/>
      <ChatSelector bind:chats bind:selectedChat />
      {:else}
      <span class="title"><button on:click={() => showChats=!showChats} class="panel-title-button">prompts</button></span>
      <PromptCreatorModal bind:chats={chats} bind:selectedChat/>
      <PromptSelector />
      {/if}
    </div>
  </div>
</main>

<style>

  .settings-panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .panel-title-button, .panel-title {
    border: none;
    font-weight: normal;
    background-color: transparent;
    color: var(--text-lower);
    cursor: pointer;
    font-size: 1.3rem;
  }

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
    display: grid;
    grid-template-rows: 1fr auto;
    background-color: var(--panel-bg);
  }

  .light .chat-panel {
    border: 2px solid var(--text-lower);
  }

  .chats-panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  :global(.add) {
    position: absolute;
    right: 2rem;
  }

</style>
