<script lang="ts">
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: {
		console.log(data);
	}
</script>

<h1 class={cn('text-green-200 text-2xl', 'text-green-500 text-3xl', 'px-5 py-6')}>
	Welcome to SvelteKit
</h1>
<p class="px-5">
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
