<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { getSetting, setSetting } from '../utils'

    export let width: number = 2 // rem
    export let value: boolean = false

    const dispatch = createEventDispatcher()

    function change() {
        value = !value
        dispatch('change')
        setSetting('dark', value)
    }

    onMount(async () => {
        value = getSetting('dark', false)
    })
</script>

<div class="icon-toggle-container">
    <button style="width: {width}rem; height: {width}rem" on:click={() => change()} class="icon-toggle">
        <svg viewBox="0 0 1080 1080">
            <circle cx="540" cy="540" r="227" fill="#DFDFFE"/>
            <rect x="475" y="74" width="130" height="193" rx="65" fill="#DFDFFE"/>
            <rect x="475" y="813" width="130" height="193" rx="65" fill="#DFDFFE"/>
            <rect x="813" y="605" width="130" height="193" rx="65" transform="rotate(-90 813 605)" fill="#DFDFFE"/>
            <rect x="74" y="605" width="130" height="193" rx="65" transform="rotate(-90 74 605)" fill="#DFDFFE"/>
            <rect x="823.55" y="164.526" width="130" height="193" rx="65" transform="rotate(45 823.55 164.526)" fill="#DFDFFE"/>
            <rect x="300.998" y="687.078" width="130" height="193" rx="65" transform="rotate(45 300.998 687.078)" fill="#DFDFFE"/>
            <rect x="687.078" y="779.002" width="130" height="193" rx="65" transform="rotate(-45 687.078 779.002)" fill="#DFDFFE"/>
            <rect x="164.526" y="256.45" width="130" height="193" rx="65" transform="rotate(-45 164.526 256.45)" fill="#DFDFFE"/>
        </svg>            
    </button>
</div>

<style>
    .icon-toggle {
        border: none;
        background-color: #0000;
        cursor: pointer;

        transition: ease-out 0.5s linear;
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

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .icon-toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-toggle:hover {
        animation: rotate 1s linear infinite;
    }
</style>