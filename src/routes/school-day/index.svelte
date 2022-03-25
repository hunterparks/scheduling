<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { addSchoolDay, deleteSchoolDay, schoolDays } from '$lib/stores/schoolDay';
	import user from '$lib/stores/user';
	import type { User } from '@supabase/supabase-js';

	afterNavigate(() => {
		if (!$user) {
			goto('/login');
		}
	});

	const confirmTimeout = 5 * 1000;

	let newName = '';
	let invalidNewName = false;
	let confirmDelete = [];
	let loadingNew = false;
	let deleting = false;
	let toastMessage = '';

	async function handleAdd() {
		loadingNew = true;
		if (newName) {
			await addSchoolDay(newName, ($user as User).id);
		} else {
			invalidNewName = true;
		}
		newName = '';
		loadingNew = false;
	}

	function handleTyping(event) {
		clearErrors();
		if (event.key === 'Enter') {
			handleAdd();
		}
	}

	function handleDeleteConfirm(schoolDayId: number) {
		confirmDelete[schoolDayId] = true;
		setTimeout(() => {
			confirmDelete[schoolDayId] = undefined;
		}, confirmTimeout);
	}

	function clearErrors() {
		invalidNewName = false;
		confirmDelete = [];
		deleting = false;
	}

	async function handleDelete(schoolDayId: number) {
		if (confirmDelete[schoolDayId]) {
			deleting = true;
			await deleteSchoolDay(schoolDayId);
			deleting = false;
			confirmDelete[schoolDayId] = undefined;
		} else {
			handleDeleteConfirm(schoolDayId);
		}
	}
</script>

<svelte:head>
	<title>School Day | Scheduling</title>
</svelte:head>

{#if $user}
	<Toast message={toastMessage} />

	<h1>School Day</h1>

	{#if $schoolDays.length === 0}
		<Spinner color="dark" />
	{:else}
		<div class="col-8">
			<table class="table table-hover">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each $schoolDays as schoolDay}
						<tr>
							<td>
								{schoolDay.name}
							</td>
							<td class="text-end">
								<button
									on:click={() => goto(`/school-day/${schoolDay.id}`)}
									disabled={deleting}
									class="btn btn-primary me-2"
								>
									<i class="bi bi-pencil me-1" />
									Edit
								</button>
								<button
									on:click={() => handleDelete(schoolDay.id)}
									disabled={deleting}
									class={`btn btn-${confirmDelete[schoolDay.id] ? 'danger fst-italic' : 'warning'}`}
								>
									<i
										class={`bi bi-${
											confirmDelete[schoolDay.id] ? 'question-octagon' : 'trash3'
										} me-1`}
									/>
									{confirmDelete[schoolDay.id] ? 'Confirm' : 'Delete'}
								</button>
							</td>
						</tr>
					{/each}
					<tr>
						<td>
							<input
								class:is-invalid={invalidNewName}
								class="form-control"
								type="text"
								placeholder="Name"
								on:keydown={handleTyping}
								bind:value={newName}
							/>
						</td>
						<td class="text-end">
							<button on:click={handleAdd} disabled={loadingNew} class="btn btn-success">
								{#if loadingNew}
									<Spinner color="light" small andClass="me-1" />
								{:else}
									<i class="bi bi-plus-lg me-1" />
								{/if}
								Add
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
{/if}

<style lang="scss">
	button {
		transition: all 300ms ease-in-out;
	}
	td {
		vertical-align: middle;
	}
</style>
