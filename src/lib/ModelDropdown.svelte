<script lang="ts">
    import { onMount } from 'svelte'
    import { getModelList, type Model } from '../api'
    import IconButton from './IconButton.svelte';
    import { slide } from 'svelte/transition';
  import { getSetting, setSetting } from '../utils';

    let active: boolean;

    let modelList: Model[] = []
    export let selectedModel: string

    selectedModel = getSetting('model') ?? modelList[0].name
    async function refresh() {
        modelList = []
        const lastModel = selectedModel
        selectedModel = "..."
        modelList = await getModelList()
        setTimeout(() => {
            if (modelList.find(m => m.name === lastModel)) {
                selectedModel = lastModel
            } else {
                selectedModel = modelList[0].name
            }
        }, 200)
    }
</script>

<div class="model-dropdown-container">
    <div class="dropdown">
        <button class="model-dropdown {active ? 'active' : ''}" on:click={() => active = !active}>
            {selectedModel}
        </button>
        {#await refresh() then _} 
        {#if active}
            <div class="list" transition:slide={{ duration: 200 }}>
                {#each modelList as model}
                    <button class="model-element" on:click={() => {
                        selectedModel = model.name
                        setSetting('model', model.name)
                        active = false
                    }} value={model.name}>{model.name} ({model.details.parameter_size})</button>
                {/each}
            </div>
        {/if}
        {/await}
    </div>
    <IconButton on:click={refresh} classes="dropdown-icon" width={1.5} icon="/regen.svg"/>
</div>

<style>
    .model-dropdown-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }  

    .model-dropdown {
        outline: none;
        border: 0;
        display: flex;
        justify-content: center;
        background-color: var(--panel-bg);
        border-radius: var(--radius);
        height: var(--input-height);
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        position: relative;
        cursor: pointer;
        color: var(--text-lower);
    }


    .dropdown {
        width: 40rem;
        margin: 0.5rem;
        position: relative;
    }

    :global(.dropdown-icon:active) {
        transform: rotate(-360deg);
    }

    .model-dropdown:hover {
        color: var(--fg);
    }


    .model-dropdown::after {
        content: "";
        z-index: 20;
        width: 1rem;
        height: 1rem;
        position: absolute;
        right: 1rem;
        background-color: var(--text-lower);
        clip-path: polygon(100% 0%, 0 0%, 50% 75%);
        transform: rotate(90deg);
    }

    .model-dropdown:hover::after {
        background-color: var(--primary);
    }

    .active::after {
        background-color: var(--primary);

        clip-path: polygon(100% 0%, 0 0%, 50% 100%);
        rotate: -90deg;
    }
    
    .active {
        color: var(--fg);
    }

    .model-element {
        height: var(--input-height);
        background-color: var(--panel-bg);
        border: 0px;
        color: var(--text-lower);
    }

    .model-element:hover {
        color: var(--fg);
        background-color: var(--secondary);
    }

    :global(.light .model-dropdown), :global(.light .list) {
        border: 2px solid var(--text-lower);
    }

    .list {
        position: absolute;
        width: 100%;
        top: calc(100% + 1rem);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        z-index: 10;
    }

</style>