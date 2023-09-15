<script lang="ts">
	import type { PageData } from './$types';
	import { focus } from '$lib/events';

	export let goals: PageData['goals'];

	let name = '';
	let selected: (typeof goals)[0] | undefined;
	let deleteConfirm = false; //Don't change this (internal use only)

	async function newGoal() {
		await fetch('/goal', { method: 'POST', body: name }).then(async (r) => {
			if (!r.ok) {
				console.log('Goals POST Error: ', await r.text());
				return;
			}
			goals = [...goals, await r.json()];
		});
		name = '';
	}

	//Edit button funcs
	function cancel() {
		deleteConfirm = false;
		selected = undefined;
	}

	//TODO Put only if diff
	async function put() {
		if (!selected) return;
		let s = selected; //selected can become undefined
		await fetch(`/goal`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(selected),
		}).then(async (r) => {
			if (!r.ok) {
				console.log('Goals PUT Error: ', await r.text());
				return;
			}
			goals[goals.findIndex((g) => g.id == s.id)] = s;
		});
		cancel();
	}

	async function del() {
		if (!selected) return;
		let s = selected; //selected can become undefined
		if (!deleteConfirm) {
			deleteConfirm = true;
			return;
		}
		await fetch(`/goal`, {
			method: 'DELETE',
			body: selected.id + '',
		}).then(async (r) => {
			if (!r.ok) {
				console.log('Goals DELETE Error: ', await r.text());
				return;
			}
			goals = goals.filter((g) => g.id != s.id);
		});
		cancel();
	}

	async function add(value: number) {
		if (!selected) return;
		selected.value += value;
		await put();
	}
</script>

<h4>Goals:</h4>
{#each goals as goal}
	<div>
		{#if selected && goal.id == selected.id}
			<!-- TODO onEnterKey -->
			<input type="text" bind:value={selected.name} class="w-20" />:
			<input type="number" bind:value={selected.value} use:focus class="w-20" />
			<button on:click={put}>Set</button>
			<button
				on:click={() => {
					add(goal.value);
				}}>Add</button
			>
			<button
				on:click={() => {
					cancel();
				}}>Cancel</button
			>
			<button
				class:bg-red-900={deleteConfirm}
				class:hover:bg-red-700={deleteConfirm}
				on:click={() => {
					del();
				}}>Delete</button
			>
		{:else}
			{goal.name}: {goal.value}
			<button
				on:click={() => {
					deleteConfirm = false;
					selected = { ...goal };
				}}>Edit</button
			>
		{/if}
	</div>
{/each}
<!-- TODO onEnterKey -->
<input placeholder="New goal" type="text" bind:value={name} />
{#if name}
	<button on:click={newGoal}>Add goal</button>
{/if}
