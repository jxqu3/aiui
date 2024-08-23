<script lang="ts">
  import ErrorModal from './lib/ErrorModal.svelte';
import IconToggle from './lib/IconToggle.svelte';
import ModelDropdown from './lib/ModelDropdown.svelte';
  import { clearError, errorStore } from './utils';

  export let dark = true
  $: darkMode = dark ? 'dark' : 'light' 

  let selectedModel: string = ""
</script>

<main class="{darkMode}">
  <header class="header">
    <IconToggle icon="/lighttoggle.svg" width={1.5} bind:value={dark}/>
    <ModelDropdown bind:selectedModel={selectedModel}/>
  </header>
  <div class="content">
    {#if $errorStore != ""}
      <ErrorModal on:close={() => clearError()}>{$errorStore}</ErrorModal>
    {/if}
  </div>
</main>

<style>

  .header {
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
