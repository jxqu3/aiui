<script lang="ts">
  import { onMount } from 'svelte';
  import { apiKey, apiUrl, instructMode, ollamaApi, options, persona, prompts, selectedPrompt, sysprompt, type Chat } from './api';
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
  
  const loadSettings = async () => {
    try {
      const chatsStorage = await getStorage("chats")
      const promptsStorage = await getStorage("prompts")

      $sysprompt = getSetting('sysprompt', "You are a helpful assistant.")
      
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

      $apiUrl = getSetting('apiUrl', 'http://127.0.0.1:11434')
      $apiKey = getSetting('apiKey', '')

      $ollamaApi = getSetting('ollamaApi', true)
      $instructMode = getSetting('instructMode', true)

      selectedChat = getSetting('selectedChat', 0)
      if (chatsStorage) {
        chats = chatsStorage
        prompts.set(promptsStorage)
      }

      if (selectedChat > chats.length - 1) {
        selectedChat = 0
      }
      if ($selectedPrompt > $prompts.length - 1) {
        $selectedPrompt = 0
      }

      prompts.subscribe(async (value) => {
        await setStorage("prompts", value)
      })

      console.log("Loaded")
      return true // Settings loaded
      
    } catch (error:any) {
      errorStore.set("Error loading settings: " + error.toString())
      return false
    }
  }

</script>

<main class="{darkMode}">
  {#if $errorStore != ""}
    <ErrorModal on:close={() => clearError()}>{$errorStore}</ErrorModal>
  {/if}
  {#await loadSettings() then _} <!-- wait until settings are loaded -->
    <header class="header">
      <IconToggle width={1.5} bind:value={dark}/>
      <ModelDropdown bind:selectedModel={selectedModel}/>
    </header>
    <div class="content">
      <div class="settings-panel">
        <span class="title panel-title">settings</span>
        <div class="settings-body">
          <PersonaEditor/>
          <Settings/>
        </div>
      </div>
      <div class="chat-panel">
        <MessagesPanel selectedModel={selectedModel} chats={chats} selectedChat={selectedChat}/>
        <MessageSender on:written={() => scrollToBottom(document.getElementById("messages-container"))} bind:chats bind:selectedChat bind:selectedModel/>
      </div>
      <div class="chats-panel">
        {#if showChats}
        <span class="title"><button on:click={() => showChats=!showChats} class="panel-title-button">chat</button></span>
        <IconButton classes="add" width={1.5} icon="new" on:click={() => chats = [...chats, []]}/>
        <ChatSelector bind:chats bind:selectedChat />
        {:else}
        <span class="title"><button on:click={() => showChats=!showChats} class="panel-title-button">prompts</button></span>
        <PromptCreatorModal bind:chats={chats} bind:selectedChat/>
        <PromptSelector />
        {/if}
      </div>
    </div>
  {/await}
</main>

<style>

  .settings-panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-y: hidden;
  }

  .panel-title-button, .panel-title {
    border: none;
    font-weight: normal;
    background-color: transparent;
    color: var(--text-lower);
    cursor: pointer;
    font-size: 1.3rem;
  }

  .settings-body {
    width: 100%;
    height: 100%;
    overflow-y: auto; 
    overflow-x: hidden;
  }

  .header {
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .content {
    width: 100vw;
    height: calc(100svh - 4rem);
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    position: absolute;
    bottom: 0;
  }

  .chat-panel {
    height: 100%;
    border-radius: var(--radius) var(--radius) 0 0;
    display: flex;
    flex-direction: column;
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
    overflow-y: hidden;
  }

  :global(.add) {
    position: absolute;
    right: 2rem;
  }

</style>
