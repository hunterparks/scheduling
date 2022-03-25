<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import supabase from '$lib/service/supabase';
	import user from '$lib/stores/user';

	afterNavigate(() => {
		if ($user) {
			supabase.auth.signOut();
			goto('/login?logout=success');
		} else {
			goto('/login');
		}
	});
</script>
