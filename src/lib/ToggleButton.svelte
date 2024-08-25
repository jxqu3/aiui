<script>

    import { createEventDispatcher } from "svelte";

    export let checked = false
    export let label = ""
    const dispatch = createEventDispatcher()
    
    function change() {
        checked = !checked
        dispatch('change')
    }
</script>

<div class="toggle-container">
    <span>{label}</span>
    <button on:click={() => change()} class="toggle-button {checked ? 'checked' : ''}"/>
</div>

<style>

    .toggle-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        justify-content: space-between;
    }

    .toggle-button {
        border: none;
        background-color: var(--panel-bg);
        cursor: pointer;
        border-radius: 0.5rem;
        width: 3rem;
        border-radius: var(--radius);
        height: 1.5rem;
        position: relative;
    }

    span {
        color: var(--text-lower);
    }
    
    .toggle-button::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 1.5rem;
        height: 1.5rem;
        background-color: var(--highlighted-bg);
        border-radius: var(--radius);
        transition: ease-in-out 0.15s;
    }

    .toggle-button.checked::after {
        background-color: var(--primary);
        left: 1.5rem;
    }

    :global(.light .toggle-button), :global(.light .toggle-button::after) {
        border: 2px solid var(--text-lower);
    }

    :global(.light .toggle-button), :global(.light .toggle-button::after) {
        top: -1.5px;
        left: -1.5px;
    }

</style>