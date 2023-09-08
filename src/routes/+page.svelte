<script
	lang="ts"
	context="module"
>
	import { logoGoogle } from 'ionicons/icons';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { authentication } from '$services/authentication';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	async function continueWithGoogle() : Promise<void> {
		const result = await authentication.continueWithGoogle();

		if (result) {
			goto('/homepage');
		}
	}
</script>


<style lang="scss">
	:global(body) {
		background:
			linear-gradient(102.92deg, #FF4752 -27.24%, rgba(233, 87, 63, 0) 64.2%),
			linear-gradient(245.06deg, rgba(255, 255, 255, 0) -14.36%, rgba(255, 255, 255, 0.67) 7.21%, #FFFFFF 32.05%, rgba(255, 255, 255, 0.85) 81.07%, rgba(255, 255, 255, 0) 111.14%),
			linear-gradient(231.11deg, #E9573F 8.23%, #FFCE54 75.59%) !important;
		background-blend-mode: overlay, normal, normal;
	}

	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px 20px;
	}

	ion-card-header {
		flex-direction: column;
		align-items: center;
	}

	ion-card-subtitle {
		margin-top: 4px;
		margin-bottom: 0;
	}

	ion-card-content {
		font-size: 14px;
	}

	p {
		font-size: 16px;
	}

	ul {
		padding-inline-start: 1.5em;
	}

	.button-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
</style>


<main>
	<ion-card>
		<ion-card-header>
			<ion-card-title>Cartmigo</ion-card-title>

			<ion-card-subtitle>Your Culinary Companion</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content>
			<p>
				Cartmigo is a digital toolbox to save you time and hassle when planning meals, grocery shopping, and cooking. It can…
			</p>

			<ul>
				<li>Organize your shopping lists to save time at the grocery store.</li>
				<li>Keep track of your favorite recipes.</li>
				<li>Share shopping lists with kitchen collaborators.</li>
				<li>Scale recipes up or down for different occasions or to match what you have on hand.</li>
				<li>Convert measurement units from what's in a recipe to what's on the box or measuring device.</li>
			</ul>

			<div class="button-container">
				{#if $user }
					<ion-button
						href="/homepage"
					>
						Get Started
					</ion-button>

					<ion-button
						fill="clear"
						color="dark"
						size="small"
						on:click={ () => authentication.logout() }
						on:keydown={ (e) => HEK(e, () => authentication.logout()) }
					>
						Sign Out
					</ion-button>
				{:else}
					<ion-button
						on:click={ continueWithGoogle }
						on:keydown={ (e) => HEK(e, continueWithGoogle) }
					>
						<ion-icon
							slot="start"
							size="large"
							icon={ logoGoogle }
						></ion-icon>

						Continue with Google
					</ion-button>

					<ion-button
						fill="clear"
						size="small"
						href="/login"
					>
						Continue with Email/Password
					</ion-button>
				{/if}
			</div>
		</ion-card-content>
	</ion-card>
</main>
