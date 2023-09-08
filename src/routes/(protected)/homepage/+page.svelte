<script
	lang="ts"
	context="module"
>
	import { HEK } from '$utilities/helper';

	import { Companies } from '$stores/Companies';

	import { Datas } from '$stores/Datas';
</script>


<script lang="ts">
	const recentCompanies   = Companies.recent;
	const recentDatas = Datas.recent;
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

<h2>Recent Data</h2>

<ul>
	{#each $recentDatas as recipe }
		<li>
			<a href="/recipe/{ recipe.id }">{ recipe.title }</a>
		</li>
	{/each}
</ul>
