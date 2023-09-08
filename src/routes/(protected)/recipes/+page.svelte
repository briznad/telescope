<script
	lang="ts"
	context="module"
>
	import { reports } from '$stores/reports';
</script>


<script lang="ts">
	const { all } = reports;
</script>


<style lang="scss"></style>


<h1>All Reports</h1>

<ul>
	{#each $all as report, index }
		<li>
			<a href="/report/{ report.id }">{ report.title }</a>
		</li>
	{/each}
</ul>
