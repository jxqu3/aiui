<script lang="ts">
    export let role: string = "user"
    
</script>

<div class="avatar">
    {#if role == "user"}
    <svg viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_9_2)">
        <circle class="body" cx="540" cy="1055" r="472" fill="#7475F8"/>
        <circle class="head" cx="539.5" cy="454.5" r="226.5" fill="#DFDFFE"/>
        </g>
        <defs>
        <clipPath id="clip0_9_2">
        <rect width="1080" height="1080" fill="white"/>
        </clipPath>
        </defs>
    </svg>
    {:else if role == "assistant"}
        <svg viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M716.8 137L716.8 457.6C716.8 513.6 701.866 557.467 672 589.2C642.6 620.933 598.733 636.8 540.4 636.8C482.066 636.8 437.966 620.933 408.1 589.2C378.7 557.467 364 513.6 364 457.6L364 137L456.4 137L456.4 452L456.4 457.6C456.4 486.533 463.166 509.167 476.7 525.5C490.233 541.833 511.466 550 540.4 550C569.333 550 590.566 541.833 604.1 525.5C617.633 509.167 624.4 486.533 624.4 457.6L624.4 452L624.4 137L716.8 137Z" fill="#DFDFFE"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M456.4 452L376.6 452L376.6 540.2L494.2 540.2L494.2 853.8L376.6 853.8L376.6 942L704.2 942L704.2 853.8L586.6 853.8L586.6 540.2L704.2 540.2L704.2 452L624.4 452L624.4 457.6C624.4 486.533 617.633 509.167 604.1 525.5C590.566 541.833 569.333 550 540.4 550C511.466 550 490.233 541.833 476.7 525.5C463.166 509.167 456.4 486.533 456.4 457.6L456.4 452Z" fill="#DFDFFE"/>
        </svg>
    {/if}
</div>

<style>
    .avatar {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 100%;
        background-color: var(--bg);
        overflow: hidden;
    }

    svg {
        width: 100%;
        height: 100%;
    }

    svg path {
        fill: var(--fg);
    }

    .head {
        fill:  var(--fg);
        z-index: 10;
    }
    
    .body {
        fill: var(--fg);
        filter: opacity(0.5);
    }

    :global(.light) .head {
        fill: #7c797b;
    }

    :global(.light) .body {
        filter: opacity(1);
    }
</style>