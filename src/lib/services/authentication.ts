import type { Auth } from 'firebase/auth';

import type { User } from '$types/user';

import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';

import { firebase } from '$services/firebase';

import { firestore } from '$services/firestore';

import { user } from '$stores/user';


class Authentication {
	private authInstance! : Auth;


	constructor() {
		//
	}


	init() : void {
		if (this.authInstance) {
			return;
		}

		this.authInstance = getAuth(firebase.app);

		onAuthStateChanged(this.authInstance, this.upsertUser);
	}

	async upsertUser(providedUser? : any) : Promise<void> {
		let assembledUser : User | null = null;

		if (providedUser) {
			assembledUser = await firestore.upsertUser(providedUser);
		}

		user.set(assembledUser);
	}

	async continueWithGoogle() : Promise<boolean> {
		if (!this.authInstance) {
			this.init();
		}

		const provider = new GoogleAuthProvider();

		try {
			await signInWithPopup(this.authInstance, provider);
		} catch (error) {
			console.error('Something went wrong when attempting to authenticate with Google', error);

			return false;
		}

		console.info('Authentication was successful');

		return true;
	}

	async signInWithEmailAndPassword(email : string, password : string) : Promise<boolean> {
		if (!this.authInstance) {
			this.init();
		}

		try {
			await signInWithEmailAndPassword(this.authInstance, email, password);
		} catch (error) {
			console.error('Something went wrong when attempting to sign in with email and password', error);

			return false;
		}

		console.info('Sign in was successful');

		return true;
	}

	async logout() : Promise<boolean> {
		if (!this.authInstance) {
			this.init();
		}

		try {
			await signOut(this.authInstance);
		} catch (error) {
			console.error('Something went wrong when attempting to sign out', error);

			return false;
		}

		console.info('Sign out was successful');

		return true;
	}
}

export const authentication = new Authentication();
