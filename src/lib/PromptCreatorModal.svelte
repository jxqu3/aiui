<script lang="ts">

  import { createEventDispatcher } from "svelte";
    import { blur } from "svelte/transition";
  import IconButton from "./IconButton.svelte";
  import { addPrompt, persona, prompts, selectedPrompt, type Chat } from "../api";
  import { setSetting, setStorage } from "../utils";

  const dispatch = createEventDispatcher();

  let open = false

  let name = ""
  let description = ""
  let prompt = ""

  let promptInputFile: HTMLInputElement

  export let chats: Chat[]
  export let selectedChat

  function savePrompt() {
    if (name && description && prompt) {
      addPrompt({
        name: name,
        shortDescription: description,
        prompt: prompt
      })
      open = false
      $selectedPrompt = $prompts.length - 1
      setSetting('selectedPrompt', $selectedPrompt)
      setStorage('prompts', $prompts)
    } else {
      alert("All fields are required")
    }
  }

  function importPrompt(e: Event) {
    if (!promptInputFile.files) return
    let file = promptInputFile.files[0]
    
    if (file) {
      let reader = new FileReader()

      reader.onload = (e) => {
        let json = JSON.parse(e.target?.result as string)

        name = json.data.name
        description = json.data.personality.slice(0, 20).replaceAll("{{char}}", json.data.name) + "..."
        prompt = `Write next {{char}}'s response.\nPersonality: ${json.data.pesonality}\nScenario: ${json.data.scenario}`

        chats = [...chats, [
          {
            role: 'assistant',
            content: json.data.first_mes.replaceAll("{{char}}", json.data.name).replaceAll("{{user}}", $persona.name)
          }
        ]]

        selectedChat = chats.length - 1

        savePrompt()
      }

      reader.readAsText(file)
    }
  }

</script>

<IconButton classes="add" width={1.5} icon="/new.svg" on:click={() => open = true}></IconButton>

{#if open}
<div class="modal">
  <div class="modal-body">
      <h1 class="modal-title">Add Prompt</h1>
      <div class="modal-content">
        <input type="text" bind:value={name} placeholder="Name" class="modal-input">
        <input type="text" bind:value={description} placeholder="Description" class="modal-input">
        <textarea bind:value={prompt} placeholder="Prompt" class="modal-textarea"></textarea>
      </div>
      <div class="modal-footer">
          <button on:click={() => open = false } class="modal-button-secondary">Cancel</button>
          <button on:click={() => savePrompt()} class="modal-button">Save</button>
          <button on:click={() => promptInputFile.click()} class="modal-button-secondary">Import</button>
          <input type="file" bind:this={promptInputFile} on:change={(e) => importPrompt(e)} accept=".json" style="display: none" name="prompt-input-file" id="prompt-input-file">
      </div>
  </div>
</div>
{/if}
