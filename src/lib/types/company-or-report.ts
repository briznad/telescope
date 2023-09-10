import type { DBItem } from '$types/db-item';


export interface CompanyOrReport extends DBItem {
	optionalCompletenessScore? : number;
}
