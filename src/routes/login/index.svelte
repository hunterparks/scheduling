<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import supabase from '$lib/service/supabase';
	import user from '$lib/stores/user';

	const emailPattern = /^[\w\+]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

	let email = '';
	let loading = false;
	let validEmail = false;
	let invalidEmail = false;
	let successMessage = '';
	let errorMessage = '';

	// Login message
	const showLoginMessage = !!$page.url.searchParams.get('login');
	if (showLoginMessage) {
		successMessage = '✨ Check your email for the magic link! 🧙‍♂️';
	}

	// Logout message
	const showLogoutMessage = !!$page.url.searchParams.get('logout');
	const logoutMessageDuration = 3 * 1000;
	if (showLogoutMessage) {
		successMessage = 'You have been logged out!';
		setTimeout(() => {
			successMessage = '';
		}, logoutMessageDuration);
	}

	async function handleLogin() {
		clearErrors();
		if (!emailPattern.test(email)) {
			errorMessage = 'Please enter a valid email address.';
			invalidEmail = true;
			return;
		}
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) {
				throw error;
			}
			successMessage = 'Check your email for the magic link!';
			validEmail = true;
		} catch (error) {
			errorMessage = error.error_description || error.message;
			email = '';
		} finally {
			loading = false;
		}
	}

	function textEntered(event) {
		clearErrors();
		if (event.key === 'Enter') {
			handleLogin();
		}
	}

	function clearErrors() {
		validEmail = false;
		invalidEmail = false;
		successMessage = '';
		errorMessage = '';
	}

	afterNavigate(() => {
		if ($user) {
			goto('/');
		}
	});
</script>

{#if !$user}
	<div class="card col-12 col-md-10 col-lg-8 col-xl-6 col-xxl-6 mx-auto">
		<div class="card-header fw-bold">Login</div>
		<div class="card-body">
			<p class="mb-3">Sign in via magic link with your email below.</p>
			<div class="input-group mb-3">
				<span class="input-group-text">Email</span>
				<input
					type="email"
					class="form-control"
					class:is-invalid={invalidEmail}
					class:is-valid={validEmail}
					bind:value={email}
					on:keydown={textEntered}
					placeholder="email@address.com"
				/>
			</div>
			<div class="d-flex justify-content-between align-items-center">
				<p
					class="fst-italic m-0"
					class:text-danger={!!errorMessage}
					class:text-success={!!successMessage}
				>
					{errorMessage}
					{#if errorMessage && successMessage}<br />{/if}
					{successMessage}
				</p>
				<button class="btn btn-primary position-relative" on:click={handleLogin}>
					<div
						class:invisible={!loading}
						class="spinner-border text-dark position-absolute"
						style="left: -2.5rem; top: 0.15rem"
					>
						<span class="visually-hidden">Loading...</span>
					</div>
					Submit
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center">
		<h2 class="mb-3">You are logged in!</h2>
		<button class="btn btn-primary" on:click={() => goto('/')}>Go home</button>
	</div>
{/if}
