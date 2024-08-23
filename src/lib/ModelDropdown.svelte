<script lang="ts">
    import { onMount } from 'svelte'
    import { getModelList, type Model } from '../api'
    import IconButton from './IconButton.svelte';
    import { slide } from 'svelte/transition';
  import { setSetting } from '../utils';

    let active: boolean;

    let modelList: Model[] = []
    export let selectedModel: string

    onMount(async () => {
        modelList = await getModelList()
    })
</script>

<div class="model-dropdown-container">
    <button class="model-dropdown {active ? 'active' : ''}" on:click={() => active = !active}>
        {selectedModel}
    </button>
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
    <IconButton width={1.5} icon="/regen.svg"/>
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
        margin: 0.5rem;
        height: var(--input-height);
        align-items: center;
        gap: 0.5rem;
        width: 30rem;
        position: relative;
        cursor: pointer;
        color: var(--text-lower);
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
        margin: 0px;
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
        width: 100%;
        height: var(--input-height);
        background-color: var(--panel-bg);
        border: 0px;
        color: var(--text-lower);
    }

    .model-element:hover {
        color: var(--fg);
        background-color: var(--secondary);
    }

    .list {
        position: absolute;
        top: 100%;
        border-radius: var(--radius);
        overflow: hidden;
    }

</style>