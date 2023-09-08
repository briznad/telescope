<script
	lang="ts"
	context="module"
>
	import { options, resize, swapVertical } from 'ionicons/icons';

	import { HEK } from '$utilities/helper';

	import { recipe } from '$stores/recipe';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';
	import MainInfoModal from '$components/MainInfoModal.svelte';
	import SortBy from '$components/SortBy.svelte';
	import ScaleModal from '$components/ScaleModal.svelte';
</script>


<script lang="ts">
	const {
		id,
		sortBy,
		info,
		scale,
	} = recipe;

	let isExpanded : boolean;

	function handleToggleExpanded() : void {
		isExpanded = !isExpanded;
	}
</script>


<style lang="scss">
	.full-width {
		--padding-start: 16px;
		--inner-padding-end: 16px;

		margin-left: -16px;
		margin-right: -16px;
	}

	.options-toggle-icon {
		transform: rotate(-90deg);
	}

	.settings-preview {
		+ .settings-preview {
			margin-left: 0.5em;
		}
	}

	.option-buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
</style>


<ion-item
	class="full-width"
	color="light"
	lines={ isExpanded ? 'none' : 'full' }
	on:click={ handleToggleExpanded }
	on:keydown={ (e) => HEK(e, handleToggleExpanded) }
>
	<ion-icon
		class="options-toggle-icon"
		slot="start"
		icon={ options }
		color="primary"
	></ion-icon>

	{#if $scale != undefined }
		<div
			class="settings-preview"
			slot="end"
		>
			<ChunkyLabel>
				{ $scale }

				<ion-icon icon={ resize } />
			</ChunkyLabel>
		</div>
	{/if}

	{#if $sortBy != undefined }
		<div
			class="settings-preview"
			slot="end"
		>
			<ChunkyLabel>
				{ $sortBy }

				<ion-icon icon={ swapVertical } />
			</ChunkyLabel>
		</div>
	{/if}
</ion-item>

{#if isExpanded }
	<ion-item
		class="full-width"
		color="light"
		lines="full"
	>
		<div class="option-buttons">
			<MainInfoModal
				type="recipe"
				id={ $id }
				title={ $info.title }
				description={ $info.description }
			/>

			<ScaleModal
				type="recipe"
				id={ $id }
				scale={ $scale }
			/>

			<SortBy
				type="recipe"
				id={ $id }
				sortBy={ $sortBy }
			/>
		</div>
	</ion-item>
{/if}
