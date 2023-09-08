<script
	lang="ts"
	context="module"
>
	import { company } from '$stores/company';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
</script>


<script lang="ts">
	const { currentCompany } = company;
</script>


<style lang="scss">
	h1 {
		margin-top: 4px;
	}
</style>


<ChunkyLabel>Shopping Company</ChunkyLabel>

{#if $currentCompany }
	<h1>{ $currentCompany?.title }</h1>
{:else}
	<h2>Uh oh! Item can't be loaded right now.</h2>
{/if}
