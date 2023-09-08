<script
	lang="ts"
	context="module"
>
	import { HEK } from '$utilities/helper';

	import { companies } from '$stores/companies';

	import { reports } from '$stores/reports';
</script>


<script lang="ts">
	const recentCompanies = companies.recent;
	const recentReports   = reports.recent;
</script>


<style lang="scss"></style>


<h1>My Telescope</h1>

<h2>Recent Companies</h2>

<ul>
	{#each $recentCompanies as Company }
		<li>
			<a href="/Company/{ Company.id }">{ Company.title }</a>
		</li>
	{/each}
</ul>

<h2>Recent Report</h2>

<ul>
	{#each $recentReports as report }
		<li>
			<a href="/report/{ report.id }">{ report.title }</a>
		</li>
	{/each}
</ul>
