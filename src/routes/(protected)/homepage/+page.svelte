<script
	lang="ts"
	context="module"
>
	import { add } from 'ionicons/icons';

	import { HEK } from '$utilities/helper';

	import { authentication } from '$services/authentication';

	import { user } from '$stores/user';
	import { companies } from '$stores/companies';
	import { reports } from '$stores/reports';

	import CreatedOrUpdated from '$components/CreatedOrUpdated.svelte';
</script>


<script lang="ts">
	const recentCompanies = companies.recent;
	const recentReports   = reports.recent;

	let userPopoverElement : HTMLIonPopoverElement;

	function handleUserPopoverClick(event : any) : void {
		userPopoverElement.present(event);
	}
</script>


<style lang="scss">
	ion-content {
		--padding-bottom: 60px;
	}

	ion-avatar {
		width: 30px;
		height: 30px;
	}

	ion-item-group {
		+ ion-item-group {
			margin-top: 20px;
		}
	}

	ion-button {
		ion-item-group & {
			position: relative;
			top: 4px;
		}
	}
</style>


<ion-header translucent={ true }>
	<ion-toolbar>
		<ion-title>My Telescope</ion-title>

		<ion-buttons
			slot="end"
			collapse={ true }
		>
			<ion-button
				on:click={ handleUserPopoverClick }
				on:keydown={ (e) => HEK(e, handleUserPopoverClick) }
			>
				<ion-avatar>
					<img
						alt={ $user?.imageUrl ? 'Your profile image' : 'Illustrated silhouette of a person\'s head' }
						src={ $user?.imageUrl ?? 'https://ionicframework.com/docs/img/demos/avatar.svg' }
					/>
				</ion-avatar>
			</ion-button>
		</ion-buttons>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen={ true }>
	<ion-header collapse="condense">
		<ion-toolbar>
			<ion-title size="large">My Telescope</ion-title>

			<ion-buttons
				slot="end"
				collapse={ true }
			>
				<ion-button
					size="small"
					on:click={ handleUserPopoverClick }
					on:keydown={ (e) => HEK(e, handleUserPopoverClick) }
				>
					<ion-avatar slot="icon-only">
						<img
							alt={ $user?.imageUrl ? 'Your profile image' : 'Illustrated silhouette of a person\'s head' }
							src={ $user?.imageUrl ?? 'https://ionicframework.com/docs/img/demos/avatar.svg' }
						/>
					</ion-avatar>
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-item-group>
		<ion-item>
			<h2>Scoreboard</h2>
		</ion-item>
	</ion-item-group>

	<ion-item-group>
		<ion-item>
			<h2>Recent Companies</h2>

			<ion-button
				slot="end"
				href="/company/new"
			>
				Add

				<ion-icon
					slot="end"
					icon={ add }
				/>
			</ion-button>
		</ion-item>

		<ion-list>
			{#each $recentCompanies as company }
				<ion-item
					href="/company/{ company.id }"
				>
					<ion-label>
						<h3>{ company.name }</h3>

						<p><CreatedOrUpdated createdAt={ company.createdAt } updatedAt={ company.updatedAt } /></p>
					</ion-label>
				</ion-item>
			{:else}
				<ion-item>
					<ion-label>
						<h3>Uh oh! No companies found.</h3>
					</ion-label>
				</ion-item>
			{/each}
		</ion-list>
	</ion-item-group>

	<ion-item-group>
		<ion-item>
			<h2>Recent Reports</h2>

			<ion-button
				slot="end"
				href="/report/new"
			>
				Add

				<ion-icon
					slot="end"
					icon={ add }
				/>
			</ion-button>
		</ion-item>

		<ion-list>
			{#each $recentReports as report }
				<ion-item
					href="/report/{ report.id }"
				>
					<ion-label>
						<h3>For { report.companyName }</h3>

						<p><CreatedOrUpdated createdAt={ report.createdAt } updatedAt={ report.updatedAt } /></p>
					</ion-label>
				</ion-item>
			{:else}
				<ion-item>
					<ion-label>
						<h3>Uh oh! No reports found.</h3>
					</ion-label>
				</ion-item>
			{/each}
		</ion-list>
	</ion-item-group>
</ion-content>

<ion-popover
	bind:this={ userPopoverElement }
	dismiss-on-select={ true }
>
	<ion-list>
		<ion-item
			button={ true }
			detail={ false }
			lines="none"
			on:click={ () => authentication.logout() }
			on:keydown={ (e) => HEK(e, () => authentication.logout()) }
		>
			<ion-label>Sign Out</ion-label>
		</ion-item>
	</ion-list>
</ion-popover>
