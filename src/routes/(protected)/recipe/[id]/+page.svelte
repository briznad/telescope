<script
	lang="ts"
	context="module"
>
	import { recipe } from '$stores/recipe';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
	import MainInfo from '$components/MainInfo.svelte';
	import RecipeOptionsBar from '$components/RecipeOptionsBar.svelte';
	import RecipeItemReorderGroup from '$components/RecipeItemReorderGroup.svelte';
	import NewItem from '$components/NewItem.svelte';
</script>


<script lang="ts">
	const {
		id,
		info,
	} = recipe;
</script>


<style lang="scss"></style>


<ChunkyLabel>Recipe</ChunkyLabel>

{#if $info.title }
	<MainInfo
		title={ $info.title }
		description={ $info.description }
	/>

	<RecipeOptionsBar />

	<ion-list>
		<RecipeItemReorderGroup />

		<NewItem
			type="recipe"
			id={ $id }
		/>
	</ion-list>
{:else}
	<h2>Uh oh! Recipe can't be loaded right now.</h2>
{/if}
