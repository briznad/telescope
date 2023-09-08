<script
	lang="ts"
	context="module"
>
	import { company as companyStore } from '$stores/company';
</script>


<script lang="ts">
	const { all } = companyStore;
</script>


<style lang="scss"></style>


<h1>All Shopping Companies</h1>

<ul>
	{#each $all as company, index }
		<li>
			<a href="/company/{ company.id }">{ company.title }</a>
		</li>
	{/each}
</ul>
