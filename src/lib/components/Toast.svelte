<script lang="ts">
	export let message = '';
</script>

<div class:d-none={!message} class="py-3 px-4 bg-info rounded position-fixed">
	<i class="position-absolute bi bi-x" on:click={() => (message = '')} />
	<p class="m-0 mt-2">{message}</p>
</div>

<style lang="scss">
	$navbar-height: 3.5rem;

	div {
		max-width: 55vw;
		right: 1rem;
		top: calc($navbar-height + 1rem);
		i {
			cursor: pointer;
			right: 0.25rem;
			top: 0;
		}
	}
</style>
