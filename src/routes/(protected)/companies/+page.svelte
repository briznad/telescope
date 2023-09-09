<script
	lang="ts"
	context="module"
>
	import { add } from 'ionicons/icons';

	import { companies } from '$stores/companies';

	import CreatedOrUpdated from '$components/CreatedOrUpdated.svelte';
</script>


<script lang="ts">
	const {
		query,
		all,
	} = companies;
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
    <ion-title>All Companies</ion-title>

		<ion-buttons slot="end">
			<ion-button
				href="/company/new"
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
		{#each $all as company }
			<ion-item
				href="/company/{ company.id }"
			>
				<ion-label>
					<h2>{ company.name }</h2>

					<p><CreatedOrUpdated createdAt={ company.createdAt } updatedAt={ company.updatedAt } /></p>
				</ion-label>
			</ion-item>
		{:else}
			<ion-item>
				<ion-label>
					<h2>Uh oh! No companies found.</h2>
				</ion-label>
			</ion-item>
		{/each}
	</ion-list>
</ion-content>
