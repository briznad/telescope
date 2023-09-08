import type { DBItem } from '$types/db-item';
import type { Measurement, MeasurementType } from '$types/measurement';
import type { Department } from '$types/department';


export type ItemMap = {
	[ key : string ] : Item;
}

export interface Item extends DBItem {
	originalInput      : string;
	quantity           : number;
	measurement        : Measurement;
	measurementType    : MeasurementType;
	description        : string;
	department         : Department;
	checked?           : boolean;
	displayedQuantity? : number;
}
