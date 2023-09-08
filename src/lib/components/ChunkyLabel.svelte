<script lang="ts">
	export let allcaps : boolean = true;
	export let title : undefined | string = undefined;
</script>


<style lang="scss">
	ion-card-subtitle {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 0;

		&.mixed-case {
			text-transform: none;
		}
	}
</style>


<ion-card-subtitle
	class="chunky-label"
	title={ title }
	class:mixed-case={ !allcaps }
>
	<slot></slot>
</ion-card-subtitle>
