<script lang="ts">
    import { options, apiUrl, ollamaApi, apiKey } from "../api";
    import { setSetting } from "../utils";
  import ToggleButton from "./ToggleButton.svelte";
</script>

<div class="settings">
    <div class="container">
        <label for="api-url">API URL</label>
        <input class="setting-input" type="text" name="api-url" id="api-url" bind:value={$apiUrl} on:input={() => setSetting('apiUrl', $apiUrl)} placeholder="http://127.0.0.1:11434">
    </div>
    <div class="container">
        <label for="temp">Temperature [{$options.temperature}]</label>
        <input bind:value="{$options.temperature}" on:change={() => setSetting('options', $options)} class="slider" type="range" name="temp" id="temp" min="0" max="3" step="0.1">
    </div>
    <div class="container">
        <label for="max-tokens">Max Tokens [{$options.max_tokens}]</label>
        <input bind:value="{$options.max_tokens}" on:change={() => setSetting('options', $options)} class="slider" type="range" name="max-tokens" id="max-tokens" min="20" max="4096" step="10">
    </div>
    <div class="container">
        <div class="toggle">
            <ToggleButton label="Use OLLaMA API" bind:checked={$ollamaApi} on:change={() => setSetting('ollamaApi', $ollamaApi)}/>
        </div>
    </div>
    <div class="container">
        <label for="api-key">API KEY</label>
        <input class="setting-input" type="text" name="api-key" id="api-key" bind:value={$apiKey} on:input={() => setSetting('apiKey', $apiKey)} placeholder="API KEY">
    </div>
</div>

<style>
    .settings {
        width: 100%;
        height: fit-content;
        padding: 0rem 1rem;
    }

    label {
        color: var(--text-lower);
    }

    .container input, .toggle {
        margin-top: 1rem;
    }

    .container {
        margin-bottom: 1rem;
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
