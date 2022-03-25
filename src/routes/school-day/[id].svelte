<script context="module" lang="ts">
	export async function load({ params }) {
		return {
			props: {
				schoolDayId: +params.id
			}
		};
	}
</script>

<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { addPeriod, periods } from '$lib/stores/period';
	import { getSchoolDay } from '$lib/stores/schoolDay';
	import user from '$lib/stores/user';
	import type { User } from '@supabase/supabase-js';

	afterNavigate(() => {
		if (!$user) {
			goto('/login');
		}
	});

	export let schoolDayId: number;
	const schoolDay = getSchoolDay(schoolDayId);

	let loadingNew = false;
	let newName = '';
	let invalidNewName = false;
	let newStartTime;
	let invalidNewStartTime = false;
	let newEndTime;
	let invalidNewEndTime = false;

	async function handleAdd() {
		let allValid = true;
		loadingNew = true;
		if (!newName) {
			invalidNewName = true;
			allValid = false;
		}
		if (!newStartTime) {
			invalidNewStartTime = true;
			allValid = false;
		}
		if (!newEndTime) {
			invalidNewEndTime = true;
			allValid = false;
		}
		if (allValid) {
			await addPeriod(newName, newStartTime, newEndTime, schoolDayId, ($user as User).id);
		}
		newName = '';
		newStartTime = '';
		newEndTime = '';
		loadingNew = false;
	}

	function handleTyping(event: KeyboardEvent) {
		const sourceElementId = (event.target as HTMLElement).id;
		switch (sourceElementId) {
			case 'newName':
				invalidNewName = false;
				break;
			case 'newStartTime':
				invalidNewStartTime = false;
				break;
			case 'newEndTime':
				invalidNewEndTime = false;
				break;
			default:
				break;
		}
		if (event.key === 'Enter') {
			handleAdd();
		}
	}

	function formatTime(timeString: string) {
		const [hours, minutes] = timeString.split(':');
		return `${+hours > 12 ? +hours % 12 : +hours}:${minutes} ${+hours < 12 ? 'AM' : 'PM'}`;
	}
</script>

{#if $user}
	{#if !$schoolDay}
		<Spinner color="dark" />
	{:else}
		<div class="d-flex align-items-center">
			<a href="/school-day">
				<button class="btn btn-info me-2">
					<i class="bi bi-arrow-left p-0" />
				</button>
			</a>
			<h1>
				School Day at {$schoolDay.name}
			</h1>
		</div>
		{#if $periods.length === 0}
			<Spinner color="dark" />
		{:else}
			<div>
				<table class="table table-hover">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Start Time</th>
							<th scope="col">End Time</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each $periods[$schoolDay.id] || [] as period}
							<tr>
								<td>
									{period.name}
								</td>
								<td class="text-center">
									{formatTime(period.start_time)}
								</td>
								<td class="text-center">
									{formatTime(period.end_time)}
								</td>
								<td class="text-end">
									<button disabled class="btn btn-primary me-2">
										<i class="bi bi-pencil me-1" />
										Edit
									</button>
									<button disabled class="btn btn-warning">
										<i class="bi bi-trash3 me-1" />
										Delete
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
									id="newName"
									placeholder="Name"
									on:keydown={handleTyping}
									bind:value={newName}
								/>
							</td>
							<td>
								<input
									class:is-invalid={invalidNewStartTime}
									class="form-control"
									type="time"
									id="newStartTime"
									on:keydown={handleTyping}
									bind:value={newStartTime}
								/>
							</td>
							<td>
								<input
									class:is-invalid={invalidNewEndTime}
									class="form-control"
									type="time"
									id="newEndTime"
									on:keydown={handleTyping}
									bind:value={newEndTime}
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
{/if}

<!-- {#if $user}
	{#await schoolDayPromise}
		<Spinner color="dark" />
	{:then { data: [schoolDay] }}
		<div class="d-flex align-items-center">
			<a href="/school-day">
				<button class="btn btn-info me-2">
					<i class="bi bi-arrow-left p-0" />
				</button>
			</a>
			<h1>
				School Day at {schoolDay.name}
			</h1>
		</div>
		{#if $periods.length === 0}
			<Spinner color="dark" />
		{:else}
			<div>
				<table class="table table-hover">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Start Time</th>
							<th scope="col">End Time</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each $periods[schoolDay.id] || [] as period}
							<tr>
								<td>
									{period.name}
								</td>
								<td class="text-center">
									{formatTime(period.start_time)}
								</td>
								<td class="text-center">
									{formatTime(period.end_time)}
								</td>
								<td class="text-end">
									<button disabled class="btn btn-primary me-2">
										<i class="bi bi-pencil me-1" />
										Edit
									</button>
									<button disabled class="btn btn-warning">
										<i class="bi bi-trash3 me-1" />
										Delete
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
									id="newName"
									placeholder="Name"
									on:keydown={handleTyping}
									bind:value={newName}
								/>
							</td>
							<td>
								<input
									class:is-invalid={invalidNewStartTime}
									class="form-control"
									type="time"
									id="newStartTime"
									on:keydown={handleTyping}
									bind:value={newStartTime}
								/>
							</td>
							<td>
								<input
									class:is-invalid={invalidNewEndTime}
									class="form-control"
									type="time"
									id="newEndTime"
									on:keydown={handleTyping}
									bind:value={newEndTime}
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
	{:catch error}
		<p>{error}</p>
	{/await}
{/if} -->
<style lang="scss">
	td {
		vertical-align: middle;
	}
	th {
		text-align: center;
	}
	tr {
		$first-col-width: 10rem;
		th:not(:last-child),
		td:not(:last-child) {
			width: $first-col-width;
		}
	}
</style>
