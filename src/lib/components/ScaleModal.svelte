<script
	lang="ts"
	context="module"
>
	import { closeOutline, checkmark, resize, radioButtonOn, radioButtonOff } from 'ionicons/icons';

	import { objectEntries } from 'briznads-helpers';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import KeyValueButton from '$components/KeyValueButton.svelte';


	const optionsMap : { [ key : number ] : string | undefined } = {
		0.33333 : '⅓',
		0.5     : '½',
		0.66666 : '⅔',
		0.75    : '¾',
		1       : undefined,
		1.5     : '1½',
		2       : undefined,
		3       : undefined,
		4       : undefined,
	};

	const optionsList : string[] = Object.keys(optionsMap).sort();
</script>


<script lang="ts">
	export let type  : 'list' | 'recipe';
	export let id    : string;
	export let scale : number | undefined;

	let tempScale : number | undefined;

	function reset(passedScale? : number) : void {
		tempScale = passedScale ?? scale;
	}

	$: reset(scale);

	let modalElement : HTMLIonModalElement;

	function handleDidDismiss() : void {
		reset();
	}

	function update(value : number) : void {
		firestore.updateListOrRecipe(type, id, $user?.id ?? '', {
			scale : value,
		});
	}

	function handleCustomInput(event : any) {
		tempScale = parseFloat(event.detail?.value) || undefined;
	}

	let saveClicked : boolean;

	async function saveCustom() : Promise<void> {
		saveClicked = true;

		await firestore.updateListOrRecipe(type, id, $user?.id ?? '', {
			scale : tempScale,
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

	ion-title {
		text-transform: capitalize;
	}
</style>


<KeyValueButton
	key="Scale By"
	value={ optionsMap[ scale ?? 1 ] ?? scale }
	htmlId="scaleModalTrigger"
	icon={ resize }
/>

<ion-popover
	trigger="scaleModalTrigger"
	dismiss-on-select={ true }
>
	<ion-list>
		{#each optionsList as key }
			{ @const keyNumber = parseFloat(key) }
			{ @const value = optionsMap[ keyNumber ] }

			<ion-item
				button={ true }
				detail={ false }
				disabled={ saveClicked || (scale ?? 1) === keyNumber }
				on:click={ () => update(keyNumber) }
				on:keydown={ (e) => HEK(e, () => update(keyNumber)) }
			>
				<ion-label>{ value ?? key }</ion-label>

				{#if (scale ?? 1) === keyNumber }
					<ion-icon
						slot="end"
						icon={ checkmark }
					></ion-icon>
				{/if}
			</ion-item>
		{/each}

		<ion-item
			lines="none"
			button={ true }
			detail={ false }
			disabled={ saveClicked }
			on:click={ () => modalElement.present() }
			on:keydown={ (e) => HEK(e, () => modalElement.present()) }
		>
			<ion-label>Custom</ion-label>

			{#if scale !== undefined && !(scale in optionsMap) }
				<ion-icon
					slot="end"
					icon={ checkmark }
				></ion-icon>
			{/if}
		</ion-item>
	</ion-list>
</ion-popover>

<ion-modal
	bind:this={ modalElement }
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

			<ion-title>Scale { type }</ion-title>

			<ion-buttons slot="end">
				<ion-button
					disabled={ saveClicked || !tempScale || scale === tempScale }
					on:click={ saveCustom }
					on:keydown={ (e) => HEK(e, saveCustom) }
				>
					Save
				</ion-button>
			</ion-buttons>
		</ion-toolbar>

		<ion-content>
			<ion-list>
				<ion-item>
					<ion-input
						value={ tempScale }
						type="number"
						min={ 0.001 }
						label="Scale by"
						label-placement="stacked"
						placeholder="Enter number"
						required={ true }
						disabled={ saveClicked }
						debounce={ 500 }
						on:ionInput={ handleCustomInput }
					></ion-input>
				</ion-item>
			</ion-list>
		</ion-content>
	</div>
</ion-modal>
