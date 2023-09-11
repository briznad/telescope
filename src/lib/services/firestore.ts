	import type { Firestore as FirestoreType, CollectionReference, DocumentData, Query, QuerySnapshot, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';
	import type { StringMap } from 'briznads-helpers';

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


		private getCollectionName(type : 'user' | 'company' | 'report') : 'users' | 'companies' | 'reports' {
			return type === 'company'
				? 'companies'
				: type + 's' as 'users' | 'reports';
		}

		async upsertUser(user : any) : Promise<User> {
			const id = user.uid;

			const docRef = doc(this.db, this.getCollectionName('user'), id);

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

		getCompany(id : string) : Promise<Company | undefined> {
			return this.getCompanyOrReport('company', id);
		}

		getReport(id : string) : Promise<Report | undefined> {
			return this.getCompanyOrReport('report', id);
		}

		private async getCompanyOrReport(type : 'user' | 'company' | 'report', id : string) : Promise<User | Company | Report | undefined> {
			const docRef = doc(this.db, this.getCollectionName(type), id);

			let docSnapshot : DocumentSnapshot;

			try {
				docSnapshot = await getDoc(docRef);
			} catch (error) {
				console.error(`Something went wrong when attempting to read ${ type } with id: ${ id }`, error);

				return undefined;
			}

			if (docSnapshot.exists()) {
				return docSnapshot.data() as Company | Report;
			} else {
				// no item exists with the provided id
				return undefined;
			}
		}

		getCompanyReactive(id : string, callback : (company : undefined | Company) => void) : Unsubscribe {
			return this.getCompanyOrReportReactive('company', id, callback);
		}

		getReportReactive(id : string, callback : (report : undefined | Report) => void) : Unsubscribe {
			return this.getCompanyOrReportReactive('report', id, callback);
		}

		private getCompanyOrReportReactive(type : 'user' | 'company' | 'report', id : string, callback : (data : undefined | User | Company | Report) => void) : Unsubscribe {
			const docRef = doc(this.db, this.getCollectionName(type), id);

			return onSnapshot(docRef, (docSnapshot : DocumentSnapshot) : void => {
				const doc : undefined | User | Company | Report = docSnapshot.exists()
					? docSnapshot.data() as User | Company | Report
					: undefined;

				callback(doc);
			});
		}

		getCompanies(limitDocuments? : number, sortByUpdated = true) : Promise<Company[]> {
			return this.getItems('company', limitDocuments, sortByUpdated);
		}

		getReports(limitDocuments? : number, sortByUpdated = true) : Promise<Report[]> {
			return this.getItems('report', limitDocuments, sortByUpdated);
		}

		private async getItems(type : 'user' | 'company' | 'report', limitDocuments? : number, sortByUpdated = true) : Promise<Company[] | Report[]> {
			const querySnapshot = await getDocs(this.getItemsQuery(type, limitDocuments, sortByUpdated));

			return this.getItemsFromSnapshot(querySnapshot);
		}

		private getItemsQuery(type : 'user' | 'company' | 'report', limitDocuments? : number, sortByUpdated = true, byCompanyId? : string) : QueryOrCollectionRef {
			let queryRef : QueryOrCollectionRef = collection(this.db, this.getCollectionName(type));

			if (limitDocuments != undefined || sortByUpdated || byCompanyId) {
				const queryParameters : any[] = [];

				if (byCompanyId) {
					queryParameters.push(where('companyId', '==', byCompanyId));
				}

				if (sortByUpdated) {
					queryParameters.push(orderBy('updatedAt', 'desc'));
				}

				if (limitDocuments != undefined) {
					queryParameters.push(limit(limitDocuments));
				}

				queryRef = query(queryRef, ...queryParameters);
			}

			return queryRef;
		}

		private getItemsFromSnapshot(querySnapshot : QuerySnapshot<DocumentData, DocumentData>) : Company[] | Report[] {
			const docs : any[] = querySnapshot.docs;

			const items : User[] | Company[] | Report[] = docs
				.map((doc) => doc.data());

			return items;
		}

		getUsersReactive(callback : (users : User[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
			return this.getItemsReactive('user', callback, limitDocuments, sortByUpdated);
		}

		getCompaniesReactive(callback : (companies : Company[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
			return this.getItemsReactive('company', callback, limitDocuments, sortByUpdated);
		}

		getReportsReactive(callback : (reports : Report[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
			return this.getItemsReactive('report', callback, limitDocuments, sortByUpdated);
		}

		private getItemsReactive(type : 'user' | 'company' | 'report', callback : (items : User[] | Company[] | Report[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
			const q = this.getItemsQuery(type, limitDocuments, sortByUpdated);

			return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
				const items : User[] | Company[] | Report[] = this.getItemsFromSnapshot(querySnapshot);

				callback(items);
			});
		}

		createCompany(userId : string, payload : Partial<Company>) : Promise<Company | undefined> {
			return this.createItem('company', userId, payload);
		}

		createReport(userId : string, payload : Partial<Report>) : Promise<Report | undefined> {
			return this.createItem('report', userId, payload);
		}

		async createItem(type : 'user' | 'company' | 'report', userId : string, payload : Partial<User | Company | Report>) : Promise<User | Company | Report | undefined> {
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

				return undefined;
			}

			return item;
		}

		updateCompany(id : string, userId : string, payload : Partial<Company>) : Promise<Company | undefined> {
			return this.updateItem('company', id, userId, payload);
		}

		async updateItem(type : 'user' | 'company' | 'report', id : string, userId : string, updates : Partial<User | Company | Report>) : Promise<boolean> {
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
			const q = this.getItemsQuery('report', 1, true, id);

			return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
				const items : Report[] = this.getItemsFromSnapshot(querySnapshot);

				callback((items ?? [])[0] ?? undefined);
			});
		}
	}

	export const firestore = new Firestore();
