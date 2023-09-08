<script
	lang="ts"
	context="module"
>
	import type { Item } from '$types/item';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	export let type : 'list' | 'recipe';
	export let id   : string;
	export let item : Item;

	function handleCheckChange(event : any) : void {
		firestore.updateItem(type, id, item.id, $user?.id ?? '', {
			checked : event.detail?.checked,
		});
	}

	function handleItemDescriptionInput(event : any) : void {
		const description = event.detail?.value;

		if (description === item.description) {
			return;
		}

		firestore.updateItem(type, id, item.id, $user?.id ?? '', {
			description,
		});
	}
</script>


<style lang="scss">
	ion-item {
		--padding-start: 0;
		--inner-padding-end: 0;
	}

	ion-checkbox {
    --border-radius: 6px;
  }
</style>


<ion-item>
	<ion-checkbox
		slot="start"
		aria-label="item checked off"
		checked={ item.checked }
		on:ionChange={ handleCheckChange }
	></ion-checkbox>

	<ion-input
		aria-label={ item.description }
		placeholder="Enter description"
		debounce={ 500 }
		value={ item.description }
		on:ionInput={ handleItemDescriptionInput }
	></ion-input>

	<ion-reorder slot="end"></ion-reorder>
</ion-item>
