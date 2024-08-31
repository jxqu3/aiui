<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'

    export let icon: string;
    export let width: number = 2;
    export let classes: string = "";

    export let tooltip: string = "";

    const dispatch = createEventDispatcher()

</script>

<button data-tooltip="{tooltip}" style="width: {width}rem; height: {width}rem" on:click={() => dispatch('click')} class="icon-button {classes} {tooltip ? 'tooltip' : ''}">
    <i class="i-{icon}" style="font-size: {width}em;"></i>
</button>

<style>
    .icon-button {
        border: none;
        background-color: #0000;
        cursor: pointer;
    }   

    i {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-lower);
    }

    .icon-button:hover {
        transform: scale(1.2);
    }

    .icon-button:hover i {
        color: var(--fg);
    }
</style>