<script
	lang="ts"
	context="module"
>
	import { logoGoogle } from 'ionicons/icons';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { authentication } from '$services/authnz';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	let toastErrorMessage : string | undefined;

	async function continueWithGoogle() : Promise<void> {
		const result = await authentication.continueWithGoogle();

		if (result === true) {
			goto('/homepage');

			return;
		}

		toastErrorMessage = 'Something went wrong. Please try again.';
	}
</script>


<style lang="scss">
	main {
		background:
			linear-gradient(102.92deg, #45aeeb -27.24%, rgba(233, 87, 63, 0) 64.2%),
			linear-gradient(245.06deg, rgba(255, 255, 255, 0) -14.36%, rgba(255, 255, 255, 0.67) 7.21%, #FFFFFF 32.05%, rgba(255, 255, 255, 0.85) 81.07%, rgba(255, 255, 255, 0) 111.14%),
			linear-gradient(231.11deg, #45aeeb 8.23%, #45aeeb 75.59%)
			!important;
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

	ion-card {
		max-width: 600px;
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

	.button-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 16px;

		ion-button {
			flex-basis: 100%;
		}
	}
</style>


<main>
	<ion-card>
		<ion-card-header>
			<ion-card-title>Telescope</ion-card-title>

			<ion-card-subtitle>Company Data Ingester</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content>
			<p>
				Telescope is an app, database, and API that facilitates the inputting of company data, which is often exchanged in an unstructured format, into a structured system, allowing it to be used in data modelling.
			</p>

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

<ion-toast
	is-open={ toastErrorMessage != undefined }
	message={ toastErrorMessage }
	color="danger"
	duration={ 5000 }
	on:didDismiss={ () => toastErrorMessage = undefined }
></ion-toast>
