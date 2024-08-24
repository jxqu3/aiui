<script>

  import { createEventDispatcher } from "svelte";
    import { blur } from "svelte/transition";
  import IconButton from "./IconButton.svelte";
  import { addPrompt } from "../api";

  const dispatch = createEventDispatcher();

  let open = false

  let name = ""
  let description = ""
  let prompt = ""

  function savePrompt() {
    if (name && description && prompt) {
      addPrompt({
        name: name,
        shortDescription: description,
        prompt: prompt
      })
      open = false
    } else {
      alert("All fields are required")
    }
  }

  function importPrompt() {
    
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
          <button on:click={() => importPrompt() } class="modal-button-secondary">Import</button>
      </div>
  </div>
</div>
{/if}

<style>
  .modal-textarea {
    width: 90%;
    height: 10rem;
    resize: vertical;
    background-color: var(--bg);
    border-radius: var(--radius);
    border: 0;
    padding: 0.5rem;
    margin: .5rem;
    overflow-wrap: break-word;
    overflow-x: hidden;
}
</style>