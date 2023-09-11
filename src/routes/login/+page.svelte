<script
	lang="ts"
	context="module"
>
	import { chevronBack } from 'ionicons/icons';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { authentication } from '$services/authnz';

	import { user } from '$stores/user';
</script>


<script lang="ts">
	const input : { email : string, password : string } = {
		email    : '',
		password : '',
	};

	function handleInput(event : any) {
		const name : 'email' | 'password' = event.target?.name;
		const value : string = event.detail?.value;

		input[ name ] = value;
	}

	let toastErrorMessage : string | undefined;

	async function handleSubmit(event : any) : Promise<void> {
		event.preventDefault();

		const result = await authentication.signInWithEmailAndPassword(input.email, input.password);

		if (result === true) {
			goto('/homepage');

			return;
		}

		toastErrorMessage = 'Something went wrong. Please try again.';
	}
</script>


<style lang="scss">
	// ion-item {
	// 	--padding-start: 0;
	// 	--inner-padding-end: 0;
	// }
</style>


<ion-header>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-button
				href="/"
			>
				<ion-icon
					slot="start"
					icon={ chevronBack }
				/>

				Back
			</ion-button>
		</ion-buttons>

		<ion-title>Login</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<ion-item lines="none">
		<h1>Continue with Email/Password</h1>
	</ion-item>

	<ion-item lines="none">
		<p>Enter the credentials provided by your friendly Telescope admin, or refer to the placeholder text for a helpful hint.</p>
	</ion-item>

	<form
		on:submit={ handleSubmit }
	>
		<ion-item>
			<ion-input
				label="Email"
				name="email"
				label-placement="stacked"
				type="email"
				placeholder="email@example.com"
				required={ true }
				autocapitalize="off"
				autocomplete="email"
				inputmode="email"
				spellcheck={ false }
				on:ionInput={ handleInput }
			></ion-input>
		</ion-item>

		<ion-item>
			<ion-input
				label="Password"
				name="password"
				label-placement="stacked"
				type="password"
				placeholder="letmein123"
				required={ true }
				autocapitalize="off"
				autocomplete="current-password"
				inputmode="text"
				spellcheck={ false }
				on:ionInput={ handleInput }
			></ion-input>
		</ion-item>

		<ion-item lines="none">
			<ion-button
				slot="end"
				size="default"
				type="submit"
				disabled={ !(input.email && input.password) }
			>
				Submit
			</ion-button>
		</ion-item>
	</form>
</ion-content>

<ion-toast
	is-open={ toastErrorMessage != undefined }
	message={ toastErrorMessage }
	color="danger"
	duration={ 5000 }
	on:didDismiss={ () => toastErrorMessage = undefined }
></ion-toast>
