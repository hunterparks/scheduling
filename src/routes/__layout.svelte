<script lang="ts">
	import '../app.scss';
	import Nav from '$lib/components/Nav.svelte';
	import user from '$lib/stores/user';
	import supabase from '$lib/service/supabase';

	user.set(supabase.auth.user());
	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});
</script>

<svelte:head>
	<title>Scheduling</title>
</svelte:head>

<Nav />

<main class="container">
	<slot />
</main>
