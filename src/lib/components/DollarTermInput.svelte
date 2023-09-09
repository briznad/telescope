<script
	lang="ts"
	context="module"
>
	import { createEventDispatcher } from 'svelte';

	import type { Term } from '$types/report';


	const termOptions : Term[] = [
		'annually',
		'quarterly',
		'monthly',
		'weekly',
		'daily',
	];
</script>


<script lang="ts">
	export let name      : string;
	export let value     : number | undefined;
	export let term      : Term | undefined;
	export let disabled  : boolean = false;
	export let label     : string | undefined = undefined;
	export let ariaLabel : string | undefined = undefined;;

	const dispatch = createEventDispatcher();

	function handleInput(event : any) {
		value = parseFloat(event.detail?.value);

		parseAnnualizedValue();
	}

	function handleChange(event : any) {
		term = event.detail?.value;

		parseAnnualizedValue();
	}

	function parseAnnualizedValue() : void {
		const safeValue : number = value ?? 0;

		if (!term || term === 'annually') {
			emit(safeValue);
		} else if (term === 'quarterly') {
			emit(safeValue * 4);
		} else if (term === 'monthly') {
			emit(safeValue * 12);
		} else if (term === 'weekly') {
			emit(safeValue * 52);
		} else {
			emit(safeValue * 365);
		}
	}

	function emit(annualizedValue : number) : void {
		dispatch('change', {
			value,
			annualizedValue,
			term : term ?? 'annually',
		});
	}
</script>


<style lang="scss">
	ion-input {
		:global(.native-input) {
			padding-left: 0.9em;
		}

		&::before {
			content: '$';
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			color: rgb(125, 125, 125);
		}

		&[label-placement="stacked"] {
			&::before {
				top: auto;
				bottom: 8px;
				transform: none;
			}
		}
	}
</style>

<ion-item { disabled }>
	{#if label }
		<ion-input
			name={ name }
			{ label }
			label-placement="stacked"
			type="number"
			placeholder="enter figures"
			value={ value }
			debounce={ 200 }
			on:ionInput={ handleInput }
		></ion-input>
	{:else}
		<ion-input
			name={ name }
			aria-label={ ariaLabel }
			type="number"
			placeholder="enter figures"
			value={ value }
			debounce={ 200 }
			on:ionInput={ handleInput }
		></ion-input>
	{/if}

	<ion-select
		slot="end"
		aria-label="term"
		interface="popover"
		placeholder="Term"
		value={ term ?? 'annually' }
		on:ionChange={ handleChange }
	>
		{#each termOptions as term }
			<ion-select-option value={ term }>{ term }</ion-select-option>
		{/each}
	</ion-select>
</ion-item>
