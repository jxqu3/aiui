<script lang="ts">
    import { persona } from '../api';

    import { getSetting, setSetting } from '../utils';
    import ToggleButton from './ToggleButton.svelte';
</script>

<div class="persona-editor">
    <ToggleButton label="Use Persona" bind:checked={$persona.use} on:change={() => {
        setSetting('persona', $persona)
    }}/>
    <input class="setting-input" type="text" bind:value={$persona.name} on:change={() => setSetting('persona', $persona)} placeholder="Persona name">
    <textarea bind:value={$persona.description} on:change={() => setSetting('persona', $persona)} placeholder="Persona description (eg. A human being)"></textarea>
</div>

<style>
    .persona-editor {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 1rem;
        width: 100%;
        padding: 1rem;
    }

    textarea, :global(.setting-input) {
        border-radius: var(--radius);
        border: 0;
        background-color: var(--panel-bg);
        width: 100%;
        color: var(--text-lower);
        padding: 0.5rem;
        width: 100%;
        resize: none;
        height: var(--input-height);
    }

    :global(.light input), :global(.light textarea) {
        border: 2px solid var(--text-lower);
    }

    textarea {
        height: 7rem;
    }
</style>