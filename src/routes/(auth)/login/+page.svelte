<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import logo from '$lib/assets/logo.webp';
	import icon from '$lib/assets/icon.png';
</script>

<div class="flex h-full items-center justify-center">
	<Container class={['flex', 'direct-children:p-8', 'rounded-xl']}>
		<!-- <div class="from-secondary-blue to-dark-blue via-primary-blue  rounded-l-lm w-3/5 rounded-l-xl bg-gradient-to-br"> -->
		<div
			class="from-secondary-blue to-primary-blue rounded-l-lm w-3/5 rounded-l-xl bg-gradient-to-br"
		>
			<div class="flex">
				<!-- <img alt="The project logo" src={logo} width="300" height="300" /> -->
				<img alt="The project logo" src={icon} width="150" height="150" />
				<h1 class="text-white">Bienvenido</h1>
			</div>
		</div>
		<div class="w-2/5 rounded-r-xl border bg-white">
			<p>Let's gou</p>
		</div>
	</Container>
</div>
