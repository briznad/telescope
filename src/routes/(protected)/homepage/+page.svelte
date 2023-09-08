<script
	lang="ts"
	context="module"
>
	import { HEK } from '$utilities/helper';

	import { lists } from '$stores/lists';

	import { recipes } from '$stores/recipes';

	import NewListOrRecipeModal from '$components/NewListOrRecipeModal.svelte';
</script>


<script lang="ts">
	const recentLists   = lists.recent;
	const recentRecipes = recipes.recent;
</script>


<style lang="scss"></style>


<h2>Recent Shopping Lists</h2>

<ul>
	{#each $recentLists as list }
		<li>
			<a href="/list/{ list.id }">{ list.title }</a>
		</li>
	{/each}
</ul>

<NewListOrRecipeModal
	type="list"
/>

<h2>Recent Recipes</h2>

<ul>
	{#each $recentRecipes as recipe }
		<li>
			<a href="/recipe/{ recipe.id }">{ recipe.title }</a>
		</li>
	{/each}
</ul>

<NewListOrRecipeModal
	type="recipe"
/>
