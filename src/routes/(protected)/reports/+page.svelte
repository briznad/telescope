<script
	lang="ts"
	context="module"
>
	import { add } from 'ionicons/icons';

	import { reports } from '$stores/reports';

	import CreatedOrUpdated from '$components/CreatedOrUpdated.svelte';
</script>


<script lang="ts">
	const {
		query,
		all,
	} = reports;
</script>


<style lang="scss">
	ion-content {
		--padding-bottom: 60px;
	}

	ion-toolbar {
		ion-icon {
			margin-left: 0.1em;
		}
	}
</style>


<ion-header>
  <ion-toolbar>
    <ion-title>All Reports</ion-title>

		<ion-buttons slot="end">
			<ion-button
				href="/report/new"
			>
				Add

				<ion-icon
					slot="end"
					icon={ add }
				></ion-icon>
			</ion-button>
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
	<ion-list>
		{#each $all as report }
			<ion-item
				href="/report/{ report.id }"
			>
				<ion-label>
					<h2>For { report.companyName }</h2>

					<p><CreatedOrUpdated createdAt={ report.createdAt } updatedAt={ report.updatedAt } /></p>
				</ion-label>
			</ion-item>
		{:else}
			<ion-item>
				<ion-label>
					<h2>Uh oh! No reports found.</h2>
				</ion-label>
			</ion-item>
		{/each}
	</ion-list>
</ion-content>
