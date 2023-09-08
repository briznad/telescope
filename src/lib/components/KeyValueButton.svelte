<script
	lang="ts"
	context="module"
></script>


<script lang="ts">
	export let key    : string;
	export let value  : string | number | undefined   = undefined;
	export let htmlId : string | undefined            = undefined;
	export let fill   : 'clear' | 'outline' | 'solid' = 'outline';
	export let icon   : string | undefined            = undefined;
</script>


<style lang="scss">
	ion-button {
		--padding-top: 4px;
		--padding-end: 0.5em;
		--padding-bottom: 4px;
		--padding-start: 0.5em;

		height: auto;
	}

	ion-label {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 27px;
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
</style>


<ion-button
	{ fill }
	id={ htmlId }
>
	<ion-label>
    <div>{ key }</div>

		{#if value != undefined }
			<div>{ value }</div>
		{/if}
  </ion-label>

	{#if icon != undefined }
		<ion-icon
			slot="end"
			{ icon }
		></ion-icon>
	{/if}
</ion-button>
