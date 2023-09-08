<script
	lang="ts"
	context="module"
>
	import { closeOutline } from 'ionicons/icons';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	export let type : 'list' | 'recipe';

	let modalElement : HTMLIonModalElement;

	let title : string;

	function handleTitleInput(event : any) {
		title = event.detail?.value;
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		if (!title) {
			return;
		}

		saveClicked = true;

		const item = await firestore.createListOrRecipe(type, $user?.id ?? '', title);

		if (item?.id) {
			goto(`/${ type }/${ item.id }`);

			title = '';
		}

		saveClicked = false;
	}
</script>


<style lang="scss">
	.toggle-button {
		text-transform: capitalize;
	}

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


<ion-button
	class="toggle-button"
	on:click={ () => modalElement.present() }
	on:keydown={ (e) => HEK(e, () => modalElement.present()) }
>
	New { type === 'list' ? 'Shopping List' : 'Recipe' }
</ion-button>

<ion-modal
	bind:this={ modalElement }
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

			<ion-title>New { type === 'list' ? 'Shopping List' : 'Recipe' }</ion-title>

			<ion-buttons slot="end">
				<ion-button
					disabled={ !title || saveClicked }
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
					label="Title"
					label-placement="stacked"
					placeholder="Enter text"
					disabled={ saveClicked }
					on:ionInput={ handleTitleInput }
					on:keydown={ (e) => HEK(e, save) }
				></ion-input>
			</ion-item>
		</ion-list>
	</div>
</ion-modal>
