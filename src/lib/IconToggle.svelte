<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { getSetting, setSetting } from '../utils'

    export let icon: string
    export let width: number = 2 // rem
    export let value: boolean = false

    const dispatch = createEventDispatcher()

    let svg: string

    function change() {
        value = !value
        dispatch('change')
        setSetting('dark', value)
    }

    onMount(async () => {
        const response = await fetch(icon)
        svg = await response.text()
        value = getSetting('dark') ?? false
    })
</script>

<div class="icon-toggle-container">
    <button style="width: {width}rem; height: {width}rem" on:click={() => change()} class="icon-toggle">
        {@html svg}
    </button>
</div>

<style>
    .icon-toggle {
        border: none;
        background-color: #0000;
        cursor: pointer;
    }  

    .icon-toggle:hover > :global(svg) {
        transform: scale(1.2) rotate(-45deg);
    }
    
    :global(.icon-toggle > svg) {
        width: 100%;
        height: 100%;
    }

    :global(.icon-toggle > svg *) {
        fill: var(--text-lower);
    }

    :global(button:hover > svg *) {
        fill: var(--fg);
    }
</style>