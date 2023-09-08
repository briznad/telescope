<script
	lang="ts"
	context="module"
>
	import { list as listStore } from '$stores/list';
</script>


<script lang="ts">
	const { all } = listStore;
</script>


<style lang="scss"></style>


<h1>All Shopping Lists</h1>

<ul>
	{#each $all as list, index }
		<li>
			<a href="/list/{ list.id }">{ list.title }</a>
		</li>
	{/each}
</ul>
