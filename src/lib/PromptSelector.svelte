<script lang="ts">
  import { selectedPrompt, prompts } from "../api";
  import { setSetting } from "../utils";
  import IconButton from "./IconButton.svelte";

</script>

<div class="prompts">
    {#each $prompts as prompt, id}
        <button class="selector-button {id == $selectedPrompt ? 'selected' : ''}" on:click={() => {
            $selectedPrompt = id
            setSetting('selectedPrompt', $selectedPrompt)
        }}>
            <span>{prompt.name}</span>
            <IconButton classes="remove-chat" width={1.5} icon="/remove.svg" on:click={() => {
                $prompts = $prompts.splice(id, 1)
            }}/>
        </button>
    {/each}
</div>

<style>
    :global(.selected svg *) {
        fill: var(--bg) !important
    }
</style>