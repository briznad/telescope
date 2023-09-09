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

		onAuthStateChanged(this.authInstance, this.upsertUser.bind(this));
	}

	async upsertUser(providedUser? : any) : Promise<boolean | string> {
		let assembledUser : User | null = null;

		try {
			this.verifyEmail({ user : providedUser });

			if (providedUser) {
				assembledUser = await firestore.upsertUser(providedUser);
			}
		} catch (error) {
			console.error('Something went wrong when attempting to authenticate', error);

			return (error as any)?.code ?? false;
		}

		user.set(assembledUser);

		return assembledUser != null;
	}

	async continueWithGoogle() : Promise<boolean> {
		if (!this.authInstance) {
			this.init();
		}

		const provider = new GoogleAuthProvider();

		try {
			this.verifyEmail(await signInWithPopup(this.authInstance, provider));
		} catch (error) {
			console.error('Something went wrong when attempting to authenticate with Google', error);

			await this.logout();

			return false;
		}

		console.info('Authentication was successful');

		return true;
	}

	private verifyEmail(response : any) : any {
		const email : string = response?.user?.email ?? '';

		if (email) {
			const domain : string = email.split('@')[1];

			if (email === 'brad.mallow@gmail.com' || ['base10.vc', 'paineventures.com'].includes(domain)) {
				return response;
			}
		}

		throw {
			code    : 'auth/unauthorized',
			message : 'User attempted to sign in with an unauthorized email address',
		};
	}

	async signInWithEmailAndPassword(email : string, password : string) : Promise<boolean | string> {
		if (!this.authInstance) {
			this.init();
		}

		try {
			this.verifyEmail(await signInWithEmailAndPassword(this.authInstance, email, password));
		} catch (error) {
			console.error('Something went wrong when attempting to sign in with email and password', error);

			return (error as any)?.code ?? false;
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
