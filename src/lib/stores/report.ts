import type { Writable, Readable, Unsubscriber } from 'svelte/store';

import type { Report } from '$types/report';
import type { Item, ItemMap } from '$types/item';
import type { SortBy } from '$types/sort-by';

import { writable, derived } from 'svelte/store';

import { smartSort } from 'briznads-helpers';

import { firestore } from '$services/firestore';


type Info = {
	title        : string;
	description? : string;
};

type Sharing = {
	viewers? : string[];
	editors? : string[];
};


class ReportStore {
	private report : Readable<null | Report>;

	public id     : Writable<string>;
	public sortBy : Writable<SortBy>;
	public scale  : Writable<number>;

	public info    : Readable<Info>;
	public sharing : Readable<Sharing>;
	public items   : Readable<Item[]>;


	constructor() {
		this.id      = writable('');
		this.sortBy  = writable('added');
		this.scale   = writable(1);
		this.report  = this.initReport();
		this.info    = this.initInfo();
		this.sharing = this.initSharing();
		this.items   = this.initItems();
	}


	private initReport() : Readable<null | Report> {
		return derived(
			this.id,
			(
				$id : string,
				set : (value : any) => void,
			) : Unsubscriber => {
				const unsubscribe = firestore.getReportReactive($id, (report : null | Report) => {
					this.sortBy.set(report?.sortBy ?? 'added');
					this.scale.set(report?.scale ?? 1);

					set(report);
				});

				return () => unsubscribe();
			},
			null,
		);
	}

	private initInfo() : Readable<Info> {
		return derived(
			this.report,
			($report : null | Report) : Info => ({
				title       : $report?.title ?? '',
				description : $report?.description,
			}),
			{
				title : '',
			},
		);
	}

	private initSharing() : Readable<Sharing> {
		return derived(
			this.report,
			($report : null | Report) : Sharing => ({
				viewers : $report?.viewers,
				editors : $report?.editors,
			}),
			{},
		);
	}

	private initItems() : Readable<Item[]> {
		return derived(
			[
				this.report,
				this.sortBy,
				this.scale,
			],
			([
				$report,
				$sortBy,
				$scale,
			]) : Item[] => this.parseItems($report, $sortBy, $scale),
			[],
		);
	}

	private parseItems(report : null | Report, sortBy : SortBy, scale : number) : Item[] {
		const itemMap : ItemMap = report?.itemMap ?? {};

		// sort items
		const items : Item[] = sortBy === 'custom'
			? this.sortByCustomOrder(itemMap, report?.customOrder ?? [])
			: smartSort(Object.values(itemMap), undefined, undefined, sortBy === 'alphabetical' ? 'description' : 'createdAt');

		// scale items, if applicable
		if (scale !== 1) {
			for (const item of items) {
				item.displayedQuantity = item.quantity * scale;
			}
		}

		return items;
	}

	private sortByCustomOrder(itemMap : ItemMap, customOrder : string[]) : Item[] {
		const sortedItems : Item[] = [];

		// iterate through the company of custom order ids
		for (const id of customOrder) {
			// attempt to locate the item in the item map
			const item = itemMap[ id ];

			// if it doesn't exist, move on
			if (!item) {
				continue;
			}

			// otherwise, add it to the sorted items company
			sortedItems.push(item);

			// and remove it from the item map
			delete itemMap[ id ];
		}

		// add any remaining items from the item map,
		// which don't exist in the custom order company,
		// to the end of the items company,
		// sorted by when they were added to the company
		const remainingItems = smartSort(Object.values(itemMap), undefined, undefined, 'createdAt');

		sortedItems.push(...remainingItems);

		return sortedItems;
	}
}

export const report = new ReportStore();
