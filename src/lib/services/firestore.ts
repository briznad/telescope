import type { Firestore as FirestoreType, CollectionReference, DocumentData, Query, QuerySnapshot, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';

import type { User } from '$types/user';
import type { List } from '$types/list';
import type { Recipe } from '$types/recipe';
import type { Item } from '$types/item';

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


	// async getUser(id : string) : Promise<User | null> {
	// 	const docRef = doc(this.db, 'users', id);

	// 	let docSnapshot;

	// 	try {
	// 		docSnapshot = await getDoc(docRef);
	// 	} catch (error) {
	// 		console.error(`Something went wrong when attempting to read user with id: ${ id }`, error);

	// 		return null;
	// 	}

	// 	if (docSnapshot.exists()) {
	// 		return docSnapshot.data() as User;
	// 	} else {
	// 		// no user exists with the provided id

	// 		return null;
	// 	}
	// }

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

	// async createUser(user : User) : Promise<boolean> {
	// 	const docRef = doc(this.db, 'users', user.id);

	// 	try {
	// 		await setDoc(docRef, user);
	// 	} catch (error) {
	// 		console.error('Something went wrong when attempting to create user', error);

	// 		return false;
	// 	}

	// 	return true;
	// }

	// async updateUser(user : User) : Promise<boolean> {
	// 	const docRef = doc(this.db, 'users', user.id);

	// 	try {
	// 		await updateDoc(docRef, user as any);
	// 	} catch (error) {
	// 		console.error('Something went wrong when attempting to update user', error);

	// 		return false;
	// 	}

	// 	return true;
	// }

	getList(id : string) : Promise<Recipe | null> {
		return this.getListOrRecipe('list', id);
	}

	private async getListOrRecipe(type : 'list' | 'recipe', id : string) : Promise<List | Recipe | null> {
		const docRef = doc(this.db, type + 's', id);

		let docSnapshot : DocumentSnapshot;

		try {
			docSnapshot = await getDoc(docRef);
		} catch (error) {
			console.error(`Something went wrong when attempting to read ${ type } with id: ${ id }`, error);

			return null;
		}

		if (docSnapshot.exists()) {
			return docSnapshot.data() as List | Recipe;
		} else {
			// no item exists with the provided id
			return null;
		}
	}

	getRecipe(id : string) : Promise<Recipe | null> {
		return this.getListOrRecipe('recipe', id);
	}

	getListReactive(id : string, callback : (recipe : null | List) => void) : Unsubscribe {
		return this.getListOrRecipeReactive('list', id, callback);
	}

	private getListOrRecipeReactive(type : 'list' | 'recipe', id : string, callback : (recipe : null | List | Recipe) => void) : Unsubscribe {
		const docRef = doc(this.db, type + 's', id);

		return onSnapshot(docRef, (docSnapshot : DocumentSnapshot) : void => {
			const doc : null | List | Recipe = docSnapshot.exists()
				? docSnapshot.data() as List | Recipe
				: null;

			callback(doc);
		});
	}

	getRecipeReactive(id : string, callback : (recipe : null | Recipe) => void) : Unsubscribe {
		return this.getListOrRecipeReactive('recipe', id, callback);
	}

	// getLists(limitDocuments? : number, sortByUpdated = true) : Promise<List[]> {
	// 	return this.getListsOrRecipes('list', limitDocuments, sortByUpdated);
	// }

	// private async getListsOrRecipes(type : 'list' | 'recipe', limitDocuments? : number, sortByUpdated = true) : Promise<List[] | Recipe[]> {
	// 	const querySnapshot = await getDocs(this.getListsOrRecipesQuery(type, limitDocuments, sortByUpdated));

	// 	return this.getListsOrRecipesFromSnapshot(querySnapshot);
	// }

	// getRecipes(limitDocuments? : number, sortByUpdated = true) : Promise<Recipe[]> {
	// 	return this.getListsOrRecipes('recipe', limitDocuments, sortByUpdated);
	// }

	private getListsOrRecipesQuery(type : 'list' | 'recipe', limitDocuments? : number, sortByUpdated = true) : QueryOrCollectionRef {
		let queryRef : QueryOrCollectionRef = collection(this.db, type + 's');

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

	private getListsOrRecipesFromSnapshot(querySnapshot : QuerySnapshot<DocumentData, DocumentData>) : List[] | Recipe[] {
		const docs : any[] = querySnapshot.docs;

		const items : List[] | Recipe[] = docs
			.map((doc) => doc.data());

		return items;
	}

	getListsReactive(callback : (lists : List[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getListsOrRecipesReactive('list', callback, limitDocuments, sortByUpdated);
	}

	private getListsOrRecipesReactive(type : 'list' | 'recipe', callback : (items : List[] | Recipe[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		const q = this.getListsOrRecipesQuery(type, limitDocuments, sortByUpdated);

		return onSnapshot(q, (querySnapshot : QuerySnapshot<DocumentData, DocumentData>) => {
			const items : List[] | Recipe[] = this.getListsOrRecipesFromSnapshot(querySnapshot);

			callback(items);
		});
	}

	getRecipesReactive(callback : (recipes : Recipe[]) => void, limitDocuments? : number, sortByUpdated = true) : Unsubscribe {
		return this.getListsOrRecipesReactive('recipe', callback, limitDocuments, sortByUpdated);
	}

	async createListOrRecipe(type : 'list' | 'recipe', userId : string, title : string) : Promise<List | Recipe | null> {
		const id = createId('lowercase', 8);

		const timestamp = new Date().toISOString();

		const docRef = doc(this.db, type + 's', id);

		const item : List | Recipe = {
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

	async updateListOrRecipe(type : 'list' | 'recipe', id : string, userId : string, updates : Partial<List | Recipe>) : Promise<boolean> {
		const docRef = doc(this.db, type + 's', id);

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

	async addItem(type : 'list' | 'recipe', docId : string, userId : string, originalInput : string) : Promise<boolean> {
		const docRef    = doc(this.db, type + 's', docId);
		const timestamp = new Date().toISOString();
		const id        = createId('lowercase', 8);

		const item : Item = {
			originalInput,
			createdAt : timestamp,
			createdBy : userId,
			id,
			updatedAt : timestamp,
			updatedBy : userId,
			// DEV: replace with parsed real values
			quantity        : 1,
			measurement     : 'gram',
			measurementType : 'weight',
			description     : originalInput,
			department      : 'unknown',
		};

		const updatePayload = {
			[ 'itemMap.' + id ] : item,
			updatedAt         : timestamp,
			updatedBy         : userId,
		};

		try {
			await updateDoc(docRef, updatePayload);
		} catch (error) {
			console.error(`Something went wrong when attempting to add item to ${ type }`, error);

			return false;
		}

		return true;
	}

	async updateItem(type : 'list' | 'recipe', docId : string, itemId : string, userId : string, updates : Partial<Item>) : Promise<boolean> {
		const docRef = doc(this.db, type + 's', docId);

		try {
			await runTransaction(this.db, async (transaction) => {
				const doc = await transaction.get(docRef);

				if (!doc.exists()) {
					throw `${ type } does not exist!`;
				}

				const existingItem : Item = doc.data()?.itemMap?.[ itemId ];

				if (existingItem === undefined) {
					throw 'item does not exist!';
				}

				const timestamp = new Date().toISOString();

				const item : Item = {
					...existingItem,
					...updates,
					updatedAt : timestamp,
					updatedBy : userId,
				};

				const updatePayload = {
					[ 'itemMap.' + itemId ] : item,
					updatedAt               : timestamp,
					updatedBy               : userId,
				};

				transaction.update(docRef, updatePayload);
			});
		} catch (error) {
			console.error(`something went wrong when attempting to update ${ type } item`, error);

			return false;
		}

		return true;
	}
}

export const firestore = new Firestore();
