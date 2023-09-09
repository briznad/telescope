import type { Firestore as FirestoreType, CollectionReference, DocumentData, Query, QuerySnapshot, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';

import type { User } from '$types/user';
import type { Company } from '$types/company';
import type { Report } from '$types/report';

import { getFirestore, doc, runTransaction, collection, getDoc, getDocs, query, where, orderBy, limit, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

import { createId, deepCopy } from 'briznads-helpers';

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
					transaction.update(docRef, deepCopy(partialData));

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

					transaction.set(docRef, deepCopy(partialData));

					returnedUser = partialData;
				}
			});
		} catch (error) {
			console.error('Something went wrong when attempting to upsert user', error);
		}

		return returnedUser;
	}

	private getCollectionName(type : 'company' | 'report') : 'companies' | 'reports' {
		return type === 'company'
			? 'companies'
			: 'reports';
	}

	getCompany(id : string) : Promise<Company | null> {
		return this.getCompanyOrReport('company', id);
	}

	getReport(id : string) : Promise<Report | null> {
		return this.getCompanyOrReport('report', id);
	}

	private async getCompanyOrReport(type : 'company' | 'report', id : string) : Promise<Company | Report | null> {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		let docSnapshot : DocumentSnapshot;

		try {
			docSnapshot = await getDoc(docRef);
		} catch (error) {
			console.error(`Something went wrong when attempting to read ${ type } with id: ${ id }`, error);

			return null;
		}

		if (docSnapshot.exists()) {
			return docSnapshot.data() as Company | Report;
		} else {
			// no item exists with the provided id
			return null;
		}
	}

	getCompanyReactive(id : string, callback : (company : null | Company) => void) : Unsubscribe {
		return this.getCompanyOrReportReactive('company', id, callback);
	}

	getReportReactive(id : string, callback : (report : null | Report) => void) : Unsubscribe {
		return this.getCompanyOrReportReactive('report', id, callback);
	}

	private getCompanyOrReportReactive(type : 'company' | 'report', id : string, callback : (data : null | Company | Report) => void) : Unsubscribe {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		return onSnapshot(docRef, (docSnapshot : DocumentSnapshot) : void => {
			const doc : null | Company | Report = docSnapshot.exists()
				? docSnapshot.data() as Company | Report
				: null;

			callback(doc);
		});
	}

	// getCompanies(limitDocuments? : number, sortByUpdated = true) : Promise<Company[]> {
	// 	return this.getCompaniesOrReports('company', limitDocuments, sortByUpdated);
	// }

	// private async getCompaniesOrReports(type : 'company' | 'report', limitDocuments? : number, sortByUpdated = true) : Promise<Company[] | Report[]> {
	// 	const querySnapshot = await getDocs(this.getCompaniesOrReportsQuery(type, limitDocuments, sortByUpdated));

	// 	return this.getCompaniesOrReportsFromSnapshot(querySnapshot);
	// }

	// getReports(limitDocuments? : number, sortByUpdated = true) : Promise<Report[]> {
	// 	return this.getCompaniesOrReports('report', limitDocuments, sortByUpdated);
	// }

	private getCompaniesOrReportsQuery(type : 'company' | 'report', limitDocuments? : number, sortByUpdated = true, byCompanyId? : string) : QueryOrCollectionRef {
		let queryRef : QueryOrCollectionRef = collection(this.db, this.getCollectionName(type));

		if (limitDocuments != null || sortByUpdated || byCompanyId) {
			const queryParameters : any[] = [];

			if (byCompanyId) {
				queryParameters.push(where('companyId', '==', byCompanyId));
			}

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

	private getCompaniesOrReportsFromSnapshot(querySnapshot : QuerySnapshot<DocumentData, DocumentData>) : Company[] | Report[] {
		const docs : any[] = querySnapshot.docs;

		const items : Company[] | Report[] = docs
			.map((doc) => doc.data());

		return items;
	}

	getCompaniesReactive(callback : (companies : Company[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getCompaniesOrReportsReactive('company', callback, limitDocuments, sortByUpdated);
	}

	getReportsReactive(callback : (reports : Report[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getCompaniesOrReportsReactive('report', callback, limitDocuments, sortByUpdated);
	}

	private getCompaniesOrReportsReactive(type : 'company' | 'report', callback : (items : Company[] | Report[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		const q = this.getCompaniesOrReportsQuery(type, limitDocuments, sortByUpdated);

		return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
			const items : Company[] | Report[] = this.getCompaniesOrReportsFromSnapshot(querySnapshot);

			callback(items);
		});
	}

	createCompany(userId : string, payload : Partial<Company>) : Promise<Company | null> {
		return this.createCompanyOrReport('company', userId, payload);
	}

	createReport(userId : string, payload : Partial<Report>) : Promise<Report | null> {
		return this.createCompanyOrReport('report', userId, payload);
	}

	async createCompanyOrReport(type : 'company' | 'report', userId : string, payload : Partial<Company | Report>) : Promise<Company | Report | null> {
		const id = createId('lowercase', 8);

		const timestamp = new Date().toISOString();

		const docRef = doc(this.db, this.getCollectionName(type), id);

		const item : Company | Report = {
			...payload,
			id,
			createdAt : timestamp,
			createdBy : userId,
			updatedAt : timestamp,
			updatedBy : userId,
		};

		try {
			await setDoc(docRef, deepCopy(item));
		} catch (error) {
			console.error(`Something went wrong when attempting to create ${ type }`, error);

			return null;
		}

		return item;
	}

	updateCompany(id : string, userId : string, payload : Partial<Company>) : Promise<Company | null> {
		return this.updateCompanyOrReport('company', id, userId, payload);
	}

	async updateCompanyOrReport(type : 'company' | 'report', id : string, userId : string, updates : Partial<Company | Report>) : Promise<boolean> {
		const docRef = doc(this.db, this.getCollectionName(type), id);

		const updatePayload = {
			...updates,
			updatedAt : new Date().toISOString(),
			updatedBy : userId,
		};

		try {
			await updateDoc(docRef, deepCopy(updatePayload));
		} catch (error) {
			console.error(`Something went wrong when attempting to update ${ type } with id ${ id }`, error);

			return false;
		}

		return true;
	}

	getLatestCompanyReportReactive(id : string, callback : (item : Report) => void) : Unsubscribe {
		const q = this.getCompaniesOrReportsQuery('report', 1, true, id);

		return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
			const items : Report[] = this.getCompaniesOrReportsFromSnapshot(querySnapshot);

			callback((items ?? [])[0] ?? null);
		});
	}
}

export const firestore = new Firestore();
