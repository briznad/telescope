<script
	lang="ts"
	context="module"
>
	import type { PageData } from './$types';

	import type { Report } from '$types/report';
	import type { Company } from '$types/company';

	import { onMount } from 'svelte';

	import { informationCircleOutline, add, business } from 'ionicons/icons';

	import { objectEntries, sleep } from 'briznads-helpers';

	import { goto } from '$app/navigation';

	import { HEK } from '$utilities/helper';

	import { firestore } from '$services/firestore';

	import { user } from '$stores/user';
	import { companies } from '$stores/companies';

	import DollarTermInput from '$components/DollarTermInput.svelte';
</script>


<script lang="ts">
	export let data : PageData;

	const {
		query,
		all,
	} = companies;

	let reportInput : Partial<Report> = {};

	$ : reportInput.companyId   = data.companyId;
	$ : reportInput.companyName = data.companyName;

	let tempCompanyInput : { companyId : string, companyName : string };

	let companyModalElement : HTMLIonModalElement;

	function handlePickCompany(event : any, company : Company) : void {
		if (!event.detail.checked) {
			return;
		}

		tempCompanyInput = {
			companyId   : company.id,
			companyName : company.name,
		};
	}

	function confirmPickCompany() : void {
		reportInput = {
			...reportInput,
			...tempCompanyInput,
		};

		companyModalElement.dismiss();
	}

	function handleNumberInput(event : any) {
		const name  : 'grossProfitPercentage'| 'cashOnHand'| 'customerAcquisitionCost'| 'lifetimeValue'| 'averageRevenuePerUser'| 'customerCount' = event.target?.name;
		const value : number = parseFloat(event.detail?.value);

		reportInput[ name ] = value;
	}

	let saveClicked : boolean;

	async function save() : Promise<void> {
		saveClicked = true;

		const item = await firestore.createReport($user?.id ?? '', reportInput);

		if (item?.id) {
			initActionSheet(item.id);
		}

		saveClicked = false;
	}

	let actionSheetElement : HTMLIonActionSheetElement;

	function initActionSheet(id : string) : void {
		actionSheetElement.buttons = [
			{
				text    : 'View Report',
				handler : () => goto('/report/' + id),
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
		reportInput = {};
	}

	function handleResetCompany() : void {
		reportInput.companyId   = '';
		reportInput.companyName = '';

		goto(window.location.pathname);
	}

	function handleTextInput(event : any) {
		const name  : 'nextFundraise' = event.target?.name;
		const value : string = event.detail?.value;

		reportInput[ name ] = value;
	}
</script>


<style lang="scss">
	ion-content {
		--padding-bottom: 60px;
	}

	ion-modal {
    --height: auto;
		--border-radius: 10px 10px 0 0;

		align-items: flex-end;

		.modal-content {
			height: 66.666vh;
		}
  }

	.disabled {
		pointer-events: none;
		opacity: 0.3;
	}

	ion-item-group {
		> :global(ion-item:last-child) {
			--border-style: none;
		}

		&:last-child {
			ion-item {
				--padding-start: 12px;
			}
		}
	}

	.dollar-input,
	.percent-input {
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

	.percent-input {
		:global(.native-input) {
			padding-left: 1.2em;
		}

		&::before {
			content: '%';
		}
	}
</style>


<ion-header translucent={ true }>
  <ion-toolbar>
    <ion-title>New Report</ion-title>

		<ion-buttons
			slot="end"
			collapse={ true }
		>
			{#if reportInput.companyId && reportInput.companyName }
				<ion-button
					strong={ true }
					disabled={ saveClicked }
					on:click={ save }
					on:keydown={ (e) => HEK(e, save) }
				>
					Save
				</ion-button>
			{:else}
				<ion-button
					fill="outline"
					on:click={ () => companyModalElement.present() }
					on:keydown={ (e) => HEK(e, () => companyModalElement.present()) }
				>
					Pick Company
				</ion-button>
			{/if}
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen={ true }>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">New Report</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
				{#if reportInput.companyId && reportInput.companyName }
					<ion-button
						strong={ true }
						disabled={ saveClicked }
						on:click={ save }
						on:keydown={ (e) => HEK(e, save) }
					>
						Save
					</ion-button>
				{:else}
					<ion-button
						fill="outline"
						on:click={ () => companyModalElement.present() }
						on:keydown={ (e) => HEK(e, () => companyModalElement.present()) }
					>
						Pick Company
					</ion-button>
				{/if}
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

	{#if reportInput.companyId && reportInput.companyName }
		<ion-item-group>
			<ion-item-divider>
				<ion-label>Company</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-label>
					<h2>{ reportInput.companyName }</h2>

					<p>{ reportInput.companyId }</p>
				</ion-label>

				<ion-button
					slot="end"
					fill="clear"
					on:click={ handleResetCompany }
					on:keydown={ (e) => HEK(e, handleResetCompany) }
				>Reset</ion-button>
			</ion-item>
		</ion-item-group>
	{/if}

	<div class:disabled={ saveClicked || !(reportInput.companyId && reportInput.companyName) }>
		<ion-item-group>
			<ion-item-divider>
				<ion-label>Revenue</ion-label>
			</ion-item-divider>

			<DollarTermInput
				name="revenue"
				ariaLabel="Revenue"
				value={ reportInput.revenue?.value }
				term={ reportInput.revenue?.term }
				on:change={ (event) => reportInput.revenue = event.detail }
			/>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Cash Burn</ion-label>
			</ion-item-divider>

			<DollarTermInput
				name="cashBurn"
				ariaLabel="Cash Burn"
				value={ reportInput.cashBurn?.value }
				term={ reportInput.cashBurn?.term }
				on:change={ (event) => reportInput.cashBurn = event.detail }
			/>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Gross Profit</ion-label>
			</ion-item-divider>

			<DollarTermInput
				name="grossProfit"
				label="Amount"
				value={ reportInput.grossProfit?.value }
				term={ reportInput.grossProfit?.term }
				on:change={ (event) => reportInput.grossProfit = event.detail }
			/>

			<ion-item>
				<ion-input
					class="percent-input"
					name="grossProfitPercentage"
					label="Percentage"
					label-placement="stacked"
					type="number"
					placeholder="enter figures"
					value={ reportInput.grossProfitPercentage }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>EBIDTA</ion-label>
			</ion-item-divider>

			<DollarTermInput
				name="EBIDTA"
				ariaLabel="EBIDTA"
				value={ reportInput.EBIDTA?.value }
				term={ reportInput.EBIDTA?.term }
				on:change={ (event) => reportInput.EBIDTA = event.detail }
			/>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Cash On Hand</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-input
					class="dollar-input"
					name="cashOnHand"
					aria-label="Cash On Hand"
					type="number"
					placeholder="enter figures"
					value={ reportInput.cashOnHand }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Customer Acquisition Cost</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-input
					class="dollar-input"
					name="customerAcquisitionCost"
					aria-label="Customer Acquisition Cost"
					type="number"
					placeholder="enter figures"
					value={ reportInput.customerAcquisitionCost }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Lifetime Value</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-input
					class="dollar-input"
					name="lifetimeValue"
					aria-label="Lifetime Value"
					type="number"
					placeholder="enter figures"
					value={ reportInput.lifetimeValue }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Average Revenue Per User</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-input
					class="dollar-input"
					name="averageRevenuePerUser"
					aria-label="Average Revenue Per User"
					type="number"
					placeholder="enter figures"
					value={ reportInput.averageRevenuePerUser }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Customer Count</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-input
					name="customerCount"
					aria-label="Customer Count"
					type="number"
					placeholder="enter figures"
					value={ reportInput.customerCount }
					debounce={ 200 }
					on:ionInput={ handleNumberInput }
				></ion-input>
			</ion-item>
		</ion-item-group>

		<ion-item-group>
			<ion-item-divider>
				<ion-label>Next Fundraise</ion-label>
			</ion-item-divider>

			<ion-item>
				<ion-datetime-button datetime="datePicker"></ion-datetime-button>

				<ion-modal>
					<ion-datetime
						id="datePicker"
						name="nextFundraise"
						presentation="month-year"
						min="2023"
						max="2099"
						on:ionChange={ handleTextInput }
					></ion-datetime>
				</ion-modal>
			</ion-item>
		</ion-item-group>
	</div>
</ion-content>

<ion-modal
	bind:this={ companyModalElement }
	backdrop-dismiss={ false }
	is-open={ !(reportInput.companyId && reportInput.companyName) }
>
	<div class="modal-content">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						color="dark"
						on:click={ () => companyModalElement.dismiss() }
						on:keydown={ (e) => HEK(e, () => companyModalElement.dismiss()) }
					>Cancel</ion-button>
				</ion-buttons>

				<ion-title>Pick Company</ion-title>

				<ion-buttons slot="end">
					<ion-button
						strong={ true }
						disabled={ !(tempCompanyInput?.companyId && tempCompanyInput?.companyName) }
						on:click={ confirmPickCompany }
						on:keydown={ (e) => HEK(e, confirmPickCompany) }
					>Confirm</ion-button>
				</ion-buttons>
			</ion-toolbar>

			<ion-toolbar>
				<ion-searchbar
					value={ $query }
					debounce={ 100 }
					on:ionInput={ (event) => query.set(event.detail.value ?? '') }
				></ion-searchbar>
			</ion-toolbar>
		</ion-header>

		<ion-content>
			{#if !(reportInput.companyId && reportInput.companyName) }
				<ion-list>
					{#each $all as company }
						<ion-item>
							<ion-checkbox
								justify="space-between"
								checked={ company.id === tempCompanyInput?.companyId }
								on:ionChange={ (event) => handlePickCompany(event, company) }
							>
								<ion-label>
									<h3>{ company.name }</h3>

									<p>{ company.id }</p>
								</ion-label>
							</ion-checkbox>
						</ion-item>
					{:else}
						<ion-item>
							<ion-label>
								<h2>Uh oh! No companies found.</h2>
							</ion-label>
						</ion-item>
					{/each}
				</ion-list>
			{/if}
		</ion-content>
	</div>
</ion-modal>

<ion-action-sheet
	bind:this={ actionSheetElement }
	header="Report Saved Successfully"
	sub-header="What Now?"
	backdrop-dismiss={ false }
></ion-action-sheet>
