<script
	lang="ts"
	context="module"
></script>


<script lang="ts">
	export let title       : string;
	export let description : string | undefined = undefined;
</script>


<style lang="scss">
	ion-item {
		--padding-start: 0;
		--inner-padding-end: 0;
	}

	ion-label {
		white-space: normal;
	}
</style>


<ion-item>
	<ion-label>
		<h1>{ title }</h1>

		{#if description }
			<p>{ description }</p>
		{/if}
	</ion-label>
</ion-item>
