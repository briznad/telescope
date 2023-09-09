<script
	lang="ts"
	context="module"
>
	import type { Company, Industry, BusinessModel, FounderQualityType } from '$types/company';

	import { informationCircleOutline, add } from 'ionicons/icons';

	import { objectEntries } from 'briznads-helpers';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';

	import ChunkyLabel from '$components/ChunkyLabel.svelte';


	type TextInput = {
		name                : string;
		hqLocation?         : string;
		otherIndustry?      : string;
		otherBusinessModel? : string;
	};

	type ListInput = {
		industry?      : Industry[];
		businessModel? : BusinessModel[];
		featureSet?    : string[];
	};

	type FounderQualityInput = {
		[ key in FounderQualityType ]? : number;
	};


	const industryOptions : Industry[] = [
		'technology',
		'healthcare',
		'financial services',
		'retail and consumer goods',
		'manufacturing',
		'media and entertainment',
		'telecommunications',
		'transportation and logistics',
		'energy',
		'government',
		'other',
	];

	const businessModelOptions : BusinessModel[] = [
		'product',
		'retail',
		'wholesale',
		'manufacturer',
		'subscription',
		'freemium',
		'service',
		'franchising',
		'advertising',
		'other',
	];

	const founderQualityOptionsMap : { [ key in FounderQualityType ] : string } = {
		'track record'         : 'What previous startups or companies have they founded or worked at? What were their roles and responsibilities? What successes or failures did they drive?',
		'industry expertise'   : 'How much experience do they have in the specific market the startup is tackling? Do they have relevant skills and connections?',
		'leadership ability'   : 'Do they display strategic vision and ability to inspire teams? Are they able to recruit top talent?',
		'technical abilities'  : 'If building a tech-driven company, how strong are their technical skills? Can they architect solutions and make solid technical decisions?',
		'persistence and grit' : 'Do they have a demonstrated ability to push through tough challenges and lead under pressure?',
		'culture and values'   : 'Do they exhibit integrity, transparency, humility and other desired leadership qualities?',
		'skin in the game'     : 'How much of their own "skin" or money are they putting on the line? Are they personally invested and incentivized?',
		'coachability'         : 'Are they open to feedback and self-improvement to evolve as a leader?',
		'past exits'           : 'Have they successfully built and exited companies in the past?',
	};
</script>


<script lang="ts">
	let textInput : TextInput = {
		name : '',
	};

	let listInput : ListInput = {};

	let founderQualityInput : FounderQualityInput = {};

	function handleTextInput(event : any) {
		const name  : 'name' | 'hqLocation' | 'otherIndustry' | 'otherBusinessModel' = event.target?.name;
		const value : string = event.detail?.value;

		textInput[ name ] = value;
	}

	function handleListChange(event : any) {
		const name  : 'industry' | 'businessModel' | 'featureSet' = event.target?.name;
		const value : Industry[] | BusinessModel[] | string[] = event.detail?.value;

		if (name === 'industry') {
			listInput[ name ] = value as Industry[];
		} else if (name === 'businessModel') {
			listInput[ name ] = value as BusinessModel[];
		} else {
			listInput[ name ] = value as string[];
		}
	}

	function handleRangeInput(event : any) {
		const name  : FounderQualityType = event.target?.name;
		const value : number = event.detail?.value;

		founderQualityInput[ name ] = value;
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		saveClicked = true;

		const payload : Partial<Company> = {
			...textInput,
			...listInput,
		};

		if (Object.keys(founderQualityInput).length > 0) {
			payload.founderQuality = {
				...founderQualityInput,
				aggregateScore : parseAggregateFounderScore(founderQualityInput),
			};
		}

		const item = await firestore.createCompany($user?.id ?? '', payload);

		if (item?.id) {
			initActionSheet(item.id);
		}

		saveClicked = false;
	}

	function initActionSheet(id : string) : void {
		actionSheetElement.buttons = [
			{
				text    : 'Add Report',
				handler : () => goto('/report/new?cid=' + id),
			},
			{
				text    : 'View Company',
				handler : () => goto('/company/' + id),
			},
			{
				text    : 'Add Another',
				handler : reset,
			},
			{
				text    : 'Go Home',
				role    : 'cancel',
				handler : () => goto('/homepage'),
			},
		];

		actionSheetElement.present();
	}

	function reset() : void {
		textInput = {
			name : '',
		};

		listInput = {};

		founderQualityInput = {};
	}

	function parseId(key : string) : string {
		return key.replace(/\s/g, '_');
	}

	function parseAggregateFounderScore(founderQualityInput : FounderQualityInput) : number {
		return Object.values(founderQualityInput)
			.reduce((sum, item) => sum + item, 0);
	}

	let newItemInputElement : HTMLIonInputElement;

	function handleAddItemChange(event : any) : void {
		const message = event.detail?.value;

		if (!message) {
			return;
		}

		listInput.featureSet = [ ...(listInput.featureSet ?? []), message ];

		newItemInputElement.value = undefined;
	}

	function handleFeatureChange(event : any, index : number) : void {
		const message = event.detail?.value;

		if (message) {
			(listInput.featureSet ?? [])[ index ] = message;
		} else {
			(listInput.featureSet ?? []).splice(index, 1);
		}

		listInput.featureSet = listInput.featureSet;
	}

	let actionSheetElement : HTMLIonActionSheetElement;
</script>


<style lang="scss">
	ion-content {
		--padding-bottom: 60px;
	}

	ion-item-group {
		> ion-item {
			&:last-child {
				--border-style: none;
			}
		}
	}

	.range-item {
		&,
		ion-label {
			overflow: visible;
		}

		ion-label {
			margin: 0;
		}
	}

	.range-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		ion-button {
			position: relative;
			top: 8px;
		}
	}

	ion-popover {
		font-size: 14px;
	}
</style>


<ion-header translucent={ true }>
  <ion-toolbar>
    <ion-title>New Company</ion-title>

		<ion-buttons
			slot="end"
			collapse={ true }
		>
      <ion-button
				strong={ true }
				disabled={ saveClicked || !textInput.name }
				on:click={ save }
				on:keydown={ (e) => HEK(e, save) }
			>Save</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen={ true }>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">New Company</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
        <ion-button
					strong={ true }
					disabled={ saveClicked || !textInput.name }
					on:click={ save }
					on:keydown={ (e) => HEK(e, save) }
				>Save</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Name/Location</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-input
				label="Name*"
				name="name"
				label-placement="stacked"
				type="text"
				placeholder="enter text"
				required={ true }
				value={ textInput.name }
				on:ionInput={ handleTextInput }
			></ion-input>
		</ion-item>

		<ion-item>
			<ion-input
				label="HQ Location"
				name="hqLocation"
				label-placement="stacked"
				type="text"
				placeholder="enter text"
				value={ textInput.hqLocation }
				on:ionInput={ handleTextInput }
			></ion-input>
		</ion-item>
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Industry</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-select
				name="industry"
				aria-label="Industry(s)"
				placeholder="select one or more"
				multiple={ true }
				value={ listInput.industry }
				on:ionChange={ handleListChange }
			>
				{#each industryOptions as option }
					<ion-select-option value={ option }>{ option }</ion-select-option>
				{/each}
			</ion-select>
		</ion-item>

		{#if listInput.industry?.includes('other') }
			<ion-item>
				<ion-input
					label="Other Industry"
					name="otherIndustry"
					label-placement="stacked"
					type="text"
					placeholder="enter text"
					value={ textInput.otherIndustry }
					on:ionInput={ handleTextInput }
				></ion-input>
			</ion-item>
		{/if}
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Business Model</ion-label>
		</ion-item-divider>

		<ion-item>
			<ion-select
				name="businessModel"
				aria-label="Business Model(s)"
				placeholder="select one or more"
				multiple={ true }
				value={ listInput.businessModel }
				on:ionChange={ handleListChange }
			>
				{#each businessModelOptions as option }
					<ion-select-option value={ option }>{ option }</ion-select-option>
				{/each}
			</ion-select>
		</ion-item>

		{#if listInput.businessModel?.includes('other') }
			<ion-item>
				<ion-input
					label="Other Business Model"
					name="otherBusinessModel"
					label-placement="stacked"
					type="text"
					placeholder="enter text"
					value={ textInput.otherBusinessModel }
					on:ionInput={ handleTextInput }
				></ion-input>
			</ion-item>
		{/if}
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Feature Set</ion-label>
		</ion-item-divider>

		{#each listInput.featureSet ?? [] as feature, index }
			<ion-item>
				<ion-input
					aria-label="feature"
					value={ feature }
					on:ionChange={ (event) => handleFeatureChange(event, index) }
				></ion-input>
			</ion-item>
		{/each}

		<ion-item>
			<ion-icon
				slot="start"
				icon={ add }
			></ion-icon>

			<ion-input
				bind:this={ newItemInputElement }
				aria-label="Add feature"
				placeholder="Add feature"
				on:ionChange={ handleAddItemChange }
			></ion-input>
		</ion-item>
	</ion-item-group>

	<ion-item-group>
		<ion-item-divider>
			<ion-label>Founder Quality</ion-label>
		</ion-item-divider>

		<ion-item>
			<ChunkyLabel>Aggregate Score: { parseAggregateFounderScore(founderQualityInput) }</ChunkyLabel>
		</ion-item>

		{#each objectEntries(founderQualityOptionsMap) as [ key, value ] }
			{ @const id = parseId(key) }

			<ion-item class="range-item">
				<ion-label>
					<div class="range-header">
						<ChunkyLabel>{ key }: { founderQualityInput[ key ] ?? 0 }</ChunkyLabel>

						<ion-button
							{ id }
							fill="clear"
							size="small"
							color="dark"
						>
							<ion-icon
								slot="icon-only"
								icon={ informationCircleOutline }
							></ion-icon>
						</ion-button>

						<ion-popover trigger={ id }>
							<div class="ion-padding">{ value }</div>
						</ion-popover>
					</div>

					<ion-range
						name={ key }
						aria-label={ key }
						min={ -2 }
						max={ 2 }
						value={ founderQualityInput[ key ] ?? 0 }
						ticks={ false }
						snaps={ true }
						on:ionInput={ handleRangeInput }
					></ion-range>
				</ion-label>
			</ion-item>
		{/each}
	</ion-item-group>
</ion-content>

<ion-action-sheet
	bind:this={ actionSheetElement }
	header="Company Saved Successfully"
	sub-header="What Now?"
	backdrop-dismiss={ false }
></ion-action-sheet>
