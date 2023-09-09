<script
	lang="ts"
	context="module"
>
	import { parseDate } from 'briznads-helpers';
</script>


<script lang="ts">
	export let createdAt : string;
	export let updatedAt : string;

	$: isUpdated = createdAt !== updatedAt;

	$: dateObject = isUpdated
		? parseDate(updatedAt)
		: parseDate(createdAt);
</script>


<style lang="scss"></style>


{ isUpdated ? 'upd' : 'cre' }ated { dateObject.toLocaleString(undefined, { dateStyle : 'short', timeStyle: 'short' }) }
