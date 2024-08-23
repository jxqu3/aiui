<script>

  import { createEventDispatcher } from "svelte";
    import { blur } from "svelte/transition";

  const dispatch = createEventDispatcher();

</script>
<div transition:blur={{duration: 200}} class="modal">
    <div class="modal-body">
        <h1 class="modal-title error">Error</h1>
        <div class="modal-content">
          <slot></slot>
        </div>
        <div class="modal-footer">
            <button on:click={() => dispatch('close') } class="modal-button">OK</button>
        </div>
    </div>
</div>