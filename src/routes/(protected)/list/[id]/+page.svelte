<script
	lang="ts"
	context="module"
>
	import { list } from '$stores/list';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
</script>


<script lang="ts">
	const { currentList } = list;
</script>


<style lang="scss">
	h1 {
		margin-top: 4px;
	}
</style>


<ChunkyLabel>Shopping List</ChunkyLabel>

{#if $currentList }
	<h1>{ $currentList?.title }</h1>
{:else}
	<h2>Uh oh! Item can't be loaded right now.</h2>
{/if}
