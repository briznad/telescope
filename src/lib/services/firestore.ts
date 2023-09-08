import type { Firestore as FirestoreType, CollectionReference, DocumentData, Query, QuerySnapshot, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';

import type { User } from '$types/user';
import type { Company } from '$types/company';
import type { Data } from '$types/data';

import { getFirestore, doc, runTransaction, collection, getDoc, getDocs, query, where, orderBy, limit, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

import { createId } from 'briznads-helpers';

import { firebase } from '$services/firebase';


type QueryOrCollectionRef =
	| CollectionReference<DocumentData, DocumentData>
	| Query<DocumentData, DocumentData>
	;


class Firestore {
	private db : FirestoreType;


	constructor() {
		this.db = getFirestore(firebase.app);
	}


	async upsertUser(user : any) : Promise<User> {
		const id = user.uid;

		const docRef = doc(this.db, 'users', id);

		let returnedUser : any;

		try {
			await runTransaction(this.db, async (transaction) => {
				const docSnapshot = await transaction.get(docRef);

				const timestamp = new Date().toISOString();

				let partialData : any = {
					updatedAt : timestamp,
					updatedBy : id,
					email     : user.email,
					provider  : user.providerData?.[0]?.providerId ?? 'unknown',
				};

				if (user.displayName) {
					partialData.displayName = user.displayName;
				}

				if (user.photoURL) {
					partialData.imageUrl = user.photoURL;
				}

				if (docSnapshot.exists()) {
					transaction.update(docRef, partialData);

					returnedUser = {
						...docSnapshot.data(),
						...partialData,
					};
				} else {
					partialData = {
						...partialData,
						id,
						createdAt : timestamp,
						createdBy : id,
					};

					transaction.set(docRef, partialData);

					returnedUser = partialData;
				}
			});
		} catch (error) {
			console.error('Something went wrong when attempting to upsert user', error);
		}

		return returnedUser;
	}

	private getCollectionName(type : 'company' | 'data') : 'companies' | 'data' {
		return type === 'company'
			? 'companies'
			: 'data';
	}

	getCompany(id : string) : Promise<Company | null> {
		return this.getCompanyOrData('company', id);
	}

	private async getCompanyOrData(type : 'company' | 'data', id : string) : Promise<Company | Data | null> {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		let docSnapshot : DocumentSnapshot;

		try {
			docSnapshot = await getDoc(docRef);
		} catch (error) {
			console.error(`Something went wrong when attempting to read ${ type } with id: ${ id }`, error);

			return null;
		}

		if (docSnapshot.exists()) {
			return docSnapshot.data() as Company | Data;
		} else {
			// no item exists with the provided id
			return null;
		}
	}

	getData(id : string) : Promise<Data | null> {
		return this.getCompanyOrData('data', id);
	}

	getCompanyReactive(id : string, callback : (data : null | Company) => void) : Unsubscribe {
		return this.getCompanyOrDataReactive('company', id, callback);
	}

	private getCompanyOrDataReactive(type : 'company' | 'data', id : string, callback : (data : null | Company | Data) => void) : Unsubscribe {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		return onSnapshot(docRef, (docSnapshot : DocumentSnapshot) : void => {
			const doc : null | Company | Data = docSnapshot.exists()
				? docSnapshot.data() as Company | Data
				: null;

			callback(doc);
		});
	}

	getDataReactive(id : string, callback : (data : null | Data) => void) : Unsubscribe {
		return this.getCompanyOrDataReactive('data', id, callback);
	}

	// getCompanies(limitDocuments? : number, sortByUpdated = true) : Promise<Company[]> {
	// 	return this.getCompaniesOrDatas('company', limitDocuments, sortByUpdated);
	// }

	// private async getCompaniesOrDatas(type : 'company' | 'data', limitDocuments? : number, sortByUpdated = true) : Promise<Company[] | Data[]> {
	// 	const querySnapshot = await getDocs(this.getCompaniesOrDatasQuery(type, limitDocuments, sortByUpdated));

	// 	return this.getCompaniesOrDatasFromSnapshot(querySnapshot);
	// }

	// getDatas(limitDocuments? : number, sortByUpdated = true) : Promise<Data[]> {
	// 	return this.getCompaniesOrDatas('data', limitDocuments, sortByUpdated);
	// }

	private getCompaniesOrDatasQuery(type : 'company' | 'data', limitDocuments? : number, sortByUpdated = true) : QueryOrCollectionRef {
		let queryRef : QueryOrCollectionRef = collection(this.db, this.getCollectionName(type));

		if (sortByUpdated && limitDocuments != null) {
			const queryParameters : any[] = [];

			if (sortByUpdated) {
				queryParameters.push(orderBy('updatedAt', 'desc'));
			}

			if (limitDocuments != null) {
				queryParameters.push(limit(limitDocuments));
			}

			queryRef = query(queryRef, ...queryParameters);
		}

		return queryRef;
	}

	private getCompaniesOrDatasFromSnapshot(querySnapshot : QuerySnapshot<DocumentData, DocumentData>) : Company[] | Data[] {
		const docs : any[] = querySnapshot.docs;

		const items : Company[] | Data[] = docs
			.map((doc) => doc.data());

		return items;
	}

	getCompaniesReactive(callback : (companies : Company[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getCompaniesOrDatasReactive('company', callback, limitDocuments, sortByUpdated);
	}

	private getCompaniesOrDatasReactive(type : 'company' | 'data', callback : (items : Company[] | Data[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		const q = this.getCompaniesOrDatasQuery(type, limitDocuments, sortByUpdated);

		return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
			const items : Company[] | Data[] = this.getCompaniesOrDatasFromSnapshot(querySnapshot);

			callback(items);
		});
	}

	getDatasReactive(callback : (datas : Data[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getCompaniesOrDatasReactive('data', callback, limitDocuments, sortByUpdated);
	}

	async createCompanyOrData(type : 'company' | 'data', userId : string, title : string) : Promise<Company | Data | null> {
		const id = createId('lowercase', 8);

		const timestamp = new Date().toISOString();

		const docRef = doc(this.db, this.getCollectionName(type), id);

		const item : Company | Data = {
			id,
			title,
			createdAt : timestamp,
			createdBy : userId,
			updatedAt : timestamp,
			updatedBy : userId,
		};

		try {
			await setDoc(docRef, item);
		} catch (error) {
			console.error(`Something went wrong when attempting to create ${ type }`, error);

			return null;
		}

		return item;
	}

	async updateCompanyOrData(type : 'company' | 'data', id : string, userId : string, updates : Partial<Company | Data>) : Promise<boolean> {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		const updatePayload = {
			...updates,
			updatedAt : new Date().toISOString(),
			updatedBy : userId,
		};

		try {
			await updateDoc(docRef, updatePayload);
		} catch (error) {
			console.error(`Something went wrong when attempting to update ${ type } with id ${ id }`, error);

			return false;
		}

		return true;
	}

	// async addItem(type : 'company' | 'data', docId : string, userId : string, originalInput : string) : Promise<boolean> {
	// 	const docRef    = doc(this.db, this.getCollectionName(type), docId);
	// 	const timestamp = new Date().toISOString();
	// 	const id        = createId('lowercase', 8);

	// 	const item : Item = {
	// 		originalInput,
	// 		createdAt : timestamp,
	// 		createdBy : userId,
	// 		id,
	// 		updatedAt : timestamp,
	// 		updatedBy : userId,
	// 		// DEV: replace with parsed real values
	// 		quantity        : 1,
	// 		measurement     : 'gram',
	// 		measurementType : 'weight',
	// 		description     : originalInput,
	// 		department      : 'unknown',
	// 	};

	// 	const updatePayload = {
	// 		[ 'itemMap.' + id ] : item,
	// 		updatedAt         : timestamp,
	// 		updatedBy         : userId,
	// 	};

	// 	try {
	// 		await updateDoc(docRef, updatePayload);
	// 	} catch (error) {
	// 		console.error(`Something went wrong when attempting to add item to ${ type }`, error);

	// 		return false;
	// 	}

	// 	return true;
	// }

	// async updateItem(type : 'company' | 'data', docId : string, itemId : string, userId : string, updates : Partial<Item>) : Promise<boolean> {
	// 	const docRef = doc(this.db, this.getCollectionName(type), docId);

	// 	try {
	// 		await runTransaction(this.db, async (transaction) => {
	// 			const doc = await transaction.get(docRef);

	// 			if (!doc.exists()) {
	// 				throw `${ type } does not exist!`;
	// 			}

	// 			const existingItem : Item = doc.data()?.itemMap?.[ itemId ];

	// 			if (existingItem === undefined) {
	// 				throw 'item does not exist!';
	// 			}

	// 			const timestamp = new Date().toISOString();

	// 			const item : Item = {
	// 				...existingItem,
	// 				...updates,
	// 				updatedAt : timestamp,
	// 				updatedBy : userId,
	// 			};

	// 			const updatePayload = {
	// 				[ 'itemMap.' + itemId ] : item,
	// 				updatedAt               : timestamp,
	// 				updatedBy               : userId,
	// 			};

	// 			transaction.update(docRef, updatePayload);
	// 		});
	// 	} catch (error) {
	// 		console.error(`something went wrong when attempting to update ${ type } item`, error);

	// 		return false;
	// 	}

	// 	return true;
	// }
}

export const firestore = new Firestore();
