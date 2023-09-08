<script
	lang="ts"
	context="module"
>
	import { report } from '$stores/report';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
	import MainInfo from '$components/MainInfo.svelte';
	import ReportOptionsBar from '$components/ReportOptionsBar.svelte';
	import ReportItemReorderGroup from '$components/ReportItemReorderGroup.svelte';
	import NewItem from '$components/NewItem.svelte';
</script>


<script lang="ts">
	const {
		id,
		info,
	} = report;
</script>


<style lang="scss"></style>


<ChunkyLabel>Report</ChunkyLabel>

{#if $info.title }
	<MainInfo
		title={ $info.title }
		description={ $info.description }
	/>

	<ReportOptionsBar />

	<ion-company>
		<ReportItemReorderGroup />

		<NewItem
			type="report"
			id={ $id }
		/>
	</ion-company>
{:else}
	<h2>Uh oh! Report can't be loaded right now.</h2>
{/if}
