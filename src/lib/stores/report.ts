import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Report } from '$types/report';

import { writable, derived } from 'svelte/store';

import { firestore } from '$services/firestore';

import { company } from '$stores/company';


class ReportStore {
	public id : Writable<string>;

	public current       : Readable<null | Report>;
	public companyLatest : Readable<null | Report>;


	constructor() {
		this.id            = writable('');
		this.current       = this.initCurrent();
		this.companyLatest = this.initCompanyLatest();
	}


	private initCurrent() : Readable<null | Report> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getReportReactive($id, (report : null | Report) => {
					set(report);
				});

				return () => unsubscribe();
			},
			null,
		);
	}

	private initCompanyLatest() : Readable<null | Report> {
		return derived(
			company.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getLatestCompanyReportReactive($id, (report : null | Report) => {
					set(report);
				});

				return () => unsubscribe();
			},
			null,
		);
	}
}

export const report = new ReportStore();
