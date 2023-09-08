import type { Writable } from 'svelte/store';

import type { User } from '$types/user';

import { writable } from 'svelte/store';


export const user : Writable<User | null> = writable(null);
