<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'

    export let icon: string;
    export let width: number = 2;
    export let classes: string = "";

    const dispatch = createEventDispatcher()

    let svg: string

    onMount(async () => {
        const response = await fetch(icon)
        svg = await response.text()
    })
</script>

<button style="width: {width}rem; height: {width}rem" on:click={() => dispatch('click')} class="icon-button {classes}">
    {@html svg}
</button>

<style>
    .icon-button {
        border: none;
        background-color: #0000;
        cursor: pointer;
    }   

    .icon-button:hover > :global(svg) {
        transform: scale(1.2);
    }

    :global(.icon-button > svg), :global(.icon-button > svg path) {
        fill: var(--text-lower);
        width: 100%;
        height: 100%;

        transition: ease-in-out 0.15s;
    }
    :global(button:hover > svg path) {
        fill: var(--fg);
    }
</style>