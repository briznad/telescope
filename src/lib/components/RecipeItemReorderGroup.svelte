<script
	lang="ts"
	context="module"
>
	import { firestore } from '$services/firestore';

	import { recipe } from '$stores/recipe';
	import { user } from '$stores/user';

	import Item from '$components/Item.svelte';
</script>


<script lang="ts">
	const {
		id,
		sortBy,
		items,
	} = recipe;

	async function handleReorder(event : any) : Promise<void> {
		const customOrder = $items
			.map(item => item.id);

		await event.detail.complete(customOrder);

		await firestore.updateListOrRecipe('recipe', $id, $user?.id ?? '', {
			customOrder,
		});
	}
</script>


<style lang="scss"></style>


{#if $items?.length > 0 }
	<ion-reorder-group
		disabled={ $sortBy !== 'custom' }
		on:ionItemReorder={ handleReorder }
	>
		{#each $items as item }
			<Item
				type="recipe"
				id={ $id }
				{ item }
			/>
		{/each}
	</ion-reorder-group>
{/if}
