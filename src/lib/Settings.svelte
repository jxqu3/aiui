<script lang="ts">
  import { blur } from "svelte/transition";
    import { options, apiUrl, ollamaApi, apiKey, instructMode, instructTemplate, sysprompt } from "../api";
    import { setSetting } from "../utils";
  import ToggleButton from "./ToggleButton.svelte";

    let syspromptShow = false

</script>

<div class="settings"> 
    <div class="container">
        <label for="api-url">API URL</label>
        <input class="setting-input" type="text" name="api-url" id="api-url" bind:value={$apiUrl} on:input={() => setSetting('apiUrl', $apiUrl)} placeholder="http://127.0.0.1:11434">
    </div>
    <div class="container">
        <div class="toggle">
            <ToggleButton label="Use OLLaMA API" bind:checked={$ollamaApi} on:change={() => setSetting('ollamaApi', $ollamaApi)}/>
        </div>
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
        <label for="api-key">API KEY</label>
        <input class="setting-input" type="text" name="api-key" id="api-key" bind:value={$apiKey} on:input={() => setSetting('apiKey', $apiKey)} placeholder="API KEY">
    </div>
    <div class="container">
        <div class="toggle">
            <ToggleButton label="Instruct Mode" bind:checked={$instructMode} on:change={() => setSetting('instructMode', $instructMode)}/>
        </div>
    </div>
    {#if $instructMode}
        <div class="container">
            <label for="systag">System Tag</label>
            <input class="setting-input" type="text" name="systag" id="systag" bind:value={$instructTemplate.systemTag} on:input={() => setSetting('instructTemplate', $instructTemplate)} placeholder="<|im_start|>system\n">
        </div>
        <div class="container">
            <label for="usertag">User Tag</label>
            <input class="setting-input" type="text" name="usertag" id="usertag" bind:value={$instructTemplate.userTag} on:input={() => setSetting('instructTemplate', $instructTemplate)} placeholder="<|im_end|>\n<|im_start|>user\n">
        </div>
        <div class="container">
            <label for="assistanttag">Assistant Tag</label>
            <input class="setting-input" type="text" name="assistanttag" id="assistanttag" bind:value={$instructTemplate.assistantTag} on:input={() => setSetting('instructTemplate', $instructTemplate)} placeholder="<|im_end|>\n<|im_start|>assistant\n">
        </div>
    {/if}

    <div class="container">
        <button on:click={() => syspromptShow = !syspromptShow} class="settings-button">System Prompt/Jailbreak</button>
    </div>
    {#if syspromptShow}
    <div transition:blur={{duration: 200}} class="modal">
        <div class="modal-body">
            <h1 class="modal-title">System Prompt/Jailbreak</h1>
            <div class="modal-content">
              <input type="text" bind:value={$sysprompt} placeholder="System Prompt/Jailbreak" class="modal-input">
            </div>
            <div class="modal-footer">
                <button on:click={() => {
                    setSetting('sysprompt', $sysprompt)
                    syspromptShow = false
                } } class="modal-button">OK</button>
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
    .settings {
        width: 100%;
        height: fit-content;
        padding: 0rem 1rem;
    }

    input {
        white-space: pre-line;
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

    .settings-button {
        width: 100%;
        margin-bottom: 1rem;
        border-radius: var(--radius);
        padding: 0.5rem;
        background-color: var(--panel-bg);
        border: none;
        color: var(--text-lower);
    }

    .settings-button:hover {
        background-color: var(--primary);
        color: var(--bg);
    }

</style>

