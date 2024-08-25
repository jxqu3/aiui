<script lang="ts">
    import { options, apiUrl } from "../api";
    import { setSetting } from "../utils";
</script>

<div class="settings">
    <div class="slider-container">
        <label for="temp">Temperature [{$options.temperature}]</label>
        <input bind:value="{$options.temperature}" on:change={() => setSetting('options', $options)} class="slider" type="range" name="temp" id="temp" min="0" max="3" step="0.1">
    </div>
    <div class="slider-container">
        <label for="max-tokens">Max Tokens [{$options.max_tokens}]</label>
        <input bind:value="{$options.max_tokens}" on:change={() => setSetting('options', $options)} class="slider" type="range" name="max-tokens" id="max-tokens" min="20" max="4096" step="10">
    </div>
    <div class="slider-container">
        <label for="api-url">Ollama API URL</label>
        <input class="setting-input" type="text" name="api-url" id="api-url" bind:value={$apiUrl} on:input={() => setSetting('apiUrl', $apiUrl)} placeholder="Persona name">
    </div>
</div>

<style>
    .settings {
        width: 100%;
        height: 100%;
        padding: 0rem 1rem;
    }

    label {
        color: var(--text-lower);
    }

    input {
        margin-top: 1rem;
    }

    .slider-container {
        margin: 0.5rem 0;
        width: 100%;
    }

    .slider {
        width: 100%;
        margin-bottom: 1rem;

        appearance: none;
        -webkit-appearance: none;
        background-color: var(--panel-bg);
        border-radius: var(--radius);
        height: 0.5rem;

        accent-color: var(--primary);
    }
</style>