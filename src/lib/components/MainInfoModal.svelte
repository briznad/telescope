<script
	lang="ts"
	context="module"
>
	import { closeOutline, pencil } from 'ionicons/icons';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import KeyValueButton from '$components/KeyValueButton.svelte';
</script>


<script lang="ts">
	export let type        : 'list' | 'recipe';
	export let id          : string;
	export let title       : string;
	export let description : string | undefined = undefined;

	let tempTitle       : string | undefined;
	let tempDescription : string | undefined;

	function reset(passedTitle? : string, passedDescription? : string) : void {
		tempTitle       = passedTitle ?? title;
		tempDescription = passedDescription ?? description;
	}

	$: reset(title, description);

	let modalElement : HTMLIonModalElement;

	function handleDidDismiss() : void {
		reset();
	}

	function handleTitleInput(event : any) {
		tempTitle = event.detail?.value;
	}

	function handleDescriptionInput(event : any) {
		tempDescription = event.detail?.value;
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		saveClicked = true;

		await firestore.updateListOrRecipe(type, id, $user?.id ?? '', {
			title       : tempTitle,
			description : tempDescription,
		});

		await modalElement.dismiss();

		saveClicked = false;
	}
</script>


<style lang="scss">
	ion-modal {
    --height: auto;
		--border-radius: 10px 10px 0 0;

		align-items: flex-end;
  }

	.modal-content {
		height: 33.333vh;
	}

	.close-button {
		--padding-start: 0;
		--padding-end: 0;
	}
</style>


<KeyValueButton
	key="Main Info"
	htmlId="mainInfoModalTrigger"
	icon={ pencil }
/>

<ion-modal
	bind:this={ modalElement }
	trigger="mainInfoModalTrigger"
	on:didDismiss={ handleDidDismiss }
>
	<div class="modal-content">
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-button
					class="close-button"
					color="medium"
					title="close modal"
					on:click={ () => modalElement.dismiss() }
					on:keydown={ (e) => HEK(e, () => modalElement.dismiss()) }
				>
					<ion-icon
						slot="icon-only"
						icon={ closeOutline }
					></ion-icon>
				</ion-button>
			</ion-buttons>

			<ion-title>Edit Main Info</ion-title>

			<ion-buttons slot="end">
				<ion-button
					disabled={ saveClicked || !tempTitle || (title === tempTitle && description === tempDescription) }
					on:click={ save }
					on:keydown={ (e) => HEK(e, save) }
				>
					Save
				</ion-button>
			</ion-buttons>
		</ion-toolbar>

		<ion-list>
			<ion-item>
				<ion-input
					value={ tempTitle }
					label="Title"
					label-placement="stacked"
					placeholder="Enter text"
					required={ true }
					disabled={ saveClicked }
					debounce={ 200 }
					on:ionInput={ handleTitleInput }
				></ion-input>
			</ion-item>

			<ion-item>
				<ion-textarea
					value={ tempDescription }
					label="Description"
					label-placement="stacked"
					placeholder="Enter text"
					disabled={ saveClicked }
					debounce={ 200 }
					on:ionInput={ handleDescriptionInput }
				></ion-textarea>
			</ion-item>
		</ion-list>
	</div>
</ion-modal>
