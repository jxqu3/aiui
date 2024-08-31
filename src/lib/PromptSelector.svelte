<script lang="ts">
  import { selectedPrompt, prompts } from "../api";
  import { setSetting } from "../utils";
  import IconButton from "./IconButton.svelte";

    let name = ""
    let description = ""
    let newPrompt = ""

    let open = false

    function savePrompt() {
        if (name && description && newPrompt) {
            $prompts[$selectedPrompt] = {
                name: name,
                shortDescription: description,
                prompt: newPrompt
            }
        }
        open = false
    }

</script>

{#if open}
<div class="modal">
  <div class="modal-body">
      <h1 class="modal-title">Add Prompt</h1>
      <div class="modal-content">
        <input type="text" bind:value={name} placeholder="Name" class="modal-input">
        <input type="text" bind:value={description} placeholder="Description" class="modal-input">
        <textarea bind:value={newPrompt} placeholder="Prompt" class="modal-textarea"></textarea>
      </div>
      <div class="modal-footer">
          <button on:click={() => open = false } class="modal-button-secondary">Cancel</button>
          <button on:click={() => savePrompt()} class="modal-button">Save</button>
      </div>
  </div>
</div>
{/if}

<div class="prompts">
    {#each $prompts as prompt, id}
        <button class="selector-button {id == $selectedPrompt ? 'selected' : ''}" on:click={() => {
            $selectedPrompt = id
            setSetting('selectedPrompt', $selectedPrompt)
        }}>
            <span>{prompt.name}</span>
            <span class="description">{prompt.shortDescription}</span>
            <div class="prompt-buttons">
                <IconButton width={1.5} icon="remove" on:click={() => {
                    if($selectedPrompt == id)
                        $selectedPrompt = 0
                    if(id == 0){
                        $prompts[0] = {
                            name: "AI Assistant",
                            shortDescription: "Your personal assistant",
                            prompt: "You are {{user}}'s personal assistant"
                        }
                        return
                    }
                    $prompts = $prompts.filter((_, i) => i != id)
                    }}/>
                <IconButton width={1.5} icon="edit" on:click={() => {
                    name = prompt.name
                    description = prompt.shortDescription
                    newPrompt = prompt.prompt

                    open = true
                }}/>
            </div>
        </button>
    {/each}
</div>

<style>
    .description {
        color: var(--text-lower);
    }

    .selected .description {
        color: var(--text-lower-inverted);
    }

    .prompts .selector-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 6rem;
        flex-direction: column;
    } 

    .prompts {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>