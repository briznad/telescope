<script
	lang="ts"
	context="module"
>
	import { onMount } from 'svelte';

	import { setupIonicBase } from 'ionic-svelte';

	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';

	/*
		This part - import 'ionic-svelte/components/all'; -  loads all components at once.

		This adds at least >800kb (uncompressed) to your bundle - 80 components (so do your math!!)

		You can also choose to import each component you want to use separately and leave out others.

		It is recommended to do this in this file, as you only need to do such once. But you are free
		to do this elsewhere if you like to code-split differently.

		Example: if you replace the line import 'ionic-svelte/components/all'; with the imports below, you will see the resulting bundle being much smaller

		import 'ionic-svelte/components/ion-app';
		import 'ionic-svelte/components/ion-card';
		import 'ionic-svelte/components/ion-card-title';
		import 'ionic-svelte/components/ion-card-subtitle';
		import 'ionic-svelte/components/ion-card-header';
		import 'ionic-svelte/components/ion-card-content';
		import 'ionic-svelte/components/ion-chip';
		import 'ionic-svelte/components/ion-button';

		Click the ionic-svelte-components-all-import above to go to the full list of possible imports.

		Please don't forget to import ion-app in this file when you decide to code-split:

	    import 'ionic-svelte/components/ion-app';

		You can report issues here - https://github.com/Tommertom/svelte-ionic-npm/issues
		Want to know what is happening more - follow me on Twitter - https://twitter.com/Tommertomm
		Discord channel on Ionic server - https://discordapp.com/channels/520266681499779082/1049388501629681675
	*/

	/* Theme variables */
	import '../theme/variables.css';
	import '../theme/global.css';

	import { ga } from '$services/ga';
</script>


<script lang='ts'>
	/* Call Ionic's setup routine */
	setupIonicBase({
		mode : 'ios',
	});

	onMount(() => {
		ga.init();
	});
</script>


<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/site.webmanifest">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#45aeeb">
	<meta name="apple-mobile-web-app-title" content="Telescope">
	<meta name="application-name" content="Telescope">
	<meta name="msapplication-TileColor" content="#45aeeb">
	<meta name="theme-color" content="#45aeeb">
</svelte:head>


<style lang="scss">
	:global(h1) {
		font-weight: 700;
	}

	:global(h2) {
		font-weight: 600;
	}
</style>


<ion-app>
	<slot />
</ion-app>
