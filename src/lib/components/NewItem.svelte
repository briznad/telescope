<script
	lang="ts"
	context="module"
>
	import { add } from 'ionicons/icons';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	export let type : 'list' | 'recipe';
	export let id   : string;

	let newItemInputElement : HTMLIonInputElement;

	function handleNewItemInput(event : any) : void {
		const message = event.detail?.value;

		if (!message) {
			return;
		}

		firestore.addItem(type, id, $user?.id ?? '', message);

		newItemInputElement.value = undefined;
	}
</script>


<style lang="scss">
	ion-item {
		--padding-start: 0;
		--inner-padding-end: 0;

		&:not(:first-child) {
			margin-top: 10px
		}
	}
</style>


<ion-item>
	<ion-icon
		slot="start"
		icon={ add }
	></ion-icon>

	<ion-input
		bind:this={ newItemInputElement }
		aria-label="New item"
		placeholder="New item"
		debounce={ 500 }
		on:ionInput={ handleNewItemInput }
	></ion-input>
</ion-item>
