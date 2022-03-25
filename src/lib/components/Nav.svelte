<script lang="ts">
	import { page } from '$app/stores';
	import type { NavigationItem } from '$lib/types';
	import user from '$lib/stores/user';

	let navigationItems: Array<NavigationItem> = [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'School Day',
			href: '/school-day',
			guard: true
		},
		{
			name: 'Staff',
			href: '/staff',
			guard: true
		},
		{
			name: 'Students',
			href: '/students',
			guard: true
		},
		{
			name: 'Log In',
			href: '/login',
			guard: false
		},
		{
			name: 'Log Out',
			href: '/logout',
			guard: true
		}
	];
</script>

<nav class="navbar navbar-expand-md navbar-dark bg-primary mb-4">
	<div class="container-fluid">
		<a href="/" class="navbar-brand">
			<i class="bi bi-table" />
			Scheduling
		</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse justify-content-end" id="navbarNav">
			<ul class="navbar-nav">
				{#each navigationItems as item}
					{#if item.guard === undefined || item.guard == !!$user}
						<li class="nav-item">
							<a
								href={item.href}
								class="nav-link"
								class:active={($page.url.pathname.startsWith(item.href) && item.href !== '/') ||
									item.href === $page.url.pathname}
							>
								{item.name}
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>
</nav>
