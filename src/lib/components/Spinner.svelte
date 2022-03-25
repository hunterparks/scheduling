<script lang="ts">
	import type { SpinnerColors } from '$lib/types';

	export let color: SpinnerColors = 'primary';
	export let grow = false;
	export let small = false;
	export let andClass = '';
</script>

<div
	class:spinner-border={!grow}
	class:spinner-border-sm={!grow && small}
	class:spinner-grow={grow}
	class:spinner-grow-sm={grow && small}
	role="status"
	class={`text-${color} ${andClass}`}
>
	<span class="visually-hidden">Loading...</span>
</div>
