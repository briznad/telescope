import type { Writable } from 'svelte/store';

import type { User } from '$types/user';

import { firestore } from '$services/firestore';

import { writable } from 'svelte/store';


export const user : Writable<User | null> = writable(null);

export const users : Writable<User[]> = writable(
	[],
	(set : (value : any) => void) => {
		const unsubscribe = firestore.getUsersReactive(
			(users : User[]) => set(users),
			undefined,
			false,
		);

		return () => unsubscribe();
	},
);
