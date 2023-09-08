import type { Writable } from 'svelte/store';

import type { Report } from '$types/report';

import { writable } from 'svelte/store';

import { firestore } from '$services/firestore';


class Reports {
	public recent : Writable<Report[]>;
	public all    : Writable<Report[]>;


	constructor() {
		this.recent = this.initRecent();
		this.all    = this.initAll();
	}


	private initRecent() : Writable<Report[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getReportsReactive(
					(reports : Report[]) => set(reports),
					5,
				);

				return () => unsubscribe();
			},
		);
	}

	private initAll() : Writable<Report[]> {
		return writable(
			[],
			(set : (value : any) => void) => {
				const unsubscribe = firestore.getReportsReactive(
					(reports : Report[]) => set(reports),
				);

				return () => unsubscribe();
			},
		);
	}
}

export const reports = new Reports();
