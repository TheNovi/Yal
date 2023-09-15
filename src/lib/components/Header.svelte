<script lang="ts">
	export let name: string;
	export let title = '';

	$: title = title || name;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<h1 class="text-center">{name}</h1>
