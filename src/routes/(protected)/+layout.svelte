<script
	lang="ts"
	context="module"
>
	import type { User } from '$types/user';

	import { onDestroy } from 'svelte';

	import { sleep } from 'briznads-helpers';

	import { page } from '$app/stores';

	import { goto } from '$app/navigation';

	import { user } from '$stores/user';

	import { HEK } from '$utilities/helper';

	import { business, documentText, home } from 'ionicons/icons';
</script>


<script lang="ts">
	// protect against unauthenticated access
	let userUnsubscribe = () => {};

	async function authenticationCheck() {
		await sleep(2000);

		userUnsubscribe = user.subscribe(async (value : User | undefined) => {
			if (!value?.id) {
				console.info('User is not authenticated');

				goto('/');
			}
		});
	}

	onDestroy(userUnsubscribe);

	authenticationCheck();

	const tabs = [
		{
			link      : '/companies',
			title     : 'Companies',
			icon      : business,
			matchPath : /^\/compan(?:ies$|y\/)/,
		},
		{
			link      : '/homepage',
			title     : 'My Telescope',
			icon      : home,
			matchPath : /^\/homepage$/,
		},
		{
			link      : '/reports',
			title     : 'Reports',
			icon      : documentText,
			matchPath : /^\/report(?:s$|\/)/,
		},
	];
</script>


<style lang="scss"></style>


<ion-tabs>
	<slot />

  <ion-tab-bar slot="bottom">
		{#each tabs as tab }
			<ion-tab-button
				selected={ tab.matchPath.test($page.url.pathname) }
				on:click|preventDefault={ () => goto(tab.link) }
				on:keydown|preventDefault={ (e) => HEK(e, () => goto(tab.link)) }
			>
				<ion-icon
					icon={ tab.icon }
				></ion-icon>

				{ tab.title }
			</ion-tab-button>
		{/each }
  </ion-tab-bar>
</ion-tabs>
