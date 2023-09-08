<script
	lang="ts"
	context="module"
>
	import { recipes } from '$stores/recipes';
</script>


<script lang="ts">
	const { all } = recipes;
</script>


<style lang="scss"></style>


<h1>All Recipes</h1>

<ul>
	{#each $all as recipe, index }
		<li>
			<a href="/recipe/{ recipe.id }">{ recipe.title }</a>
		</li>
	{/each}
</ul>
