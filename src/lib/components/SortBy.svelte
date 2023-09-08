<script
	lang="ts"
	context="module"
>
	import type { SortBy } from '$types/sort-by';

	import { swapVertical, checkmark } from 'ionicons/icons';

	import { objectEntries } from 'briznads-helpers';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import KeyValueButton from '$components/KeyValueButton.svelte';
</script>


<script lang="ts">
	export let type   : 'list' | 'recipe';
	export let id     : string;
	export let sortBy : SortBy;

	const optionsMap : { [ key in SortBy ] : string | undefined } = {
		added        : 'Order Added',
		alphabetical : undefined,
		custom       : undefined,
	};

	function update(newSortBy : SortBy) : void {
		firestore.updateListOrRecipe(type, id, $user?.id ?? '', {
			sortBy : newSortBy,
		});
	}
</script>


<style lang="scss">
	.key-value-button {
		--padding-top: 4px;
		--padding-bottom: 4px;

		height: auto;

		ion-label {
			// text-align: left;
			font-weight: 500;
			text-transform: capitalize;

			:first-child {
				font-size: 11px;
			}

			:last-child {
				font-size: 14px;

				&:not(:first-child) {
					margin-top: 2px;
				}
			}
		}
	}

	ion-popover {
		ion-label {
			text-transform: capitalize;
		}
	}
</style>


<KeyValueButton
	key="Sort By"
	value={ optionsMap[sortBy] ?? sortBy }
	htmlId="sortByPopoverTrigger"
	icon={ swapVertical }
/>

<ion-popover
	trigger="sortByPopoverTrigger"
	dismiss-on-select={ true }
>
	<ion-list>
		{#each objectEntries(optionsMap) as [ key, value ], index }
			<ion-item
				button={ true }
				detail={ false }
				disabled={ sortBy === key }
				lines={ index === Object.keys(optionsMap).length - 1 ? 'none' : undefined }
				on:click={ () => update(key) }
				on:keydown={ (e) => HEK(e, () => update(key)) }
			>
				<ion-label>{ value ?? key }</ion-label>

				{#if sortBy === key }
					<ion-icon
						slot="end"
						icon={ checkmark }
					></ion-icon>
				{/if}
			</ion-item>
		{/each}
	</ion-list>
</ion-popover>
