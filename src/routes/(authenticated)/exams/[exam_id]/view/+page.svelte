<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	let {
		examData: { results, sample, examType, patient, ...examData }
	} = data;

	const orgFullName = 'Laboratorio Clínico Marsal C.A';
	const orgRif = 'J-30197029-2';
	const orgAddress = 'Urbanizacion Los Guaritos III, Calle N° 7 Maturín, Monagas';
	const orgPhones = '0424-9188205';
	const orgEmail = 'roccajess@gmail.com';
</script>

<div class="w-full !p-0">
	<!-- Membrete -->
	<div>
		<p>{'<img>'}</p>
		<p class="uppercase">{orgFullName}</p>
		<p class="uppercase">RIF. {orgRif}</p>
	</div>

	======================================== ========================================
	<div>
		<p class="uppercase">{orgAddress}</p>
		<p class="uppercase">Telefonos: {orgPhones}</p>
		<p class="uppercase">E-MAIL: {orgEmail}</p>
	</div>
</div>
