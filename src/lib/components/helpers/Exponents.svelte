<script lang="ts">
	import { clickToCopy } from '../actions/clickToCopy';

	type PropType = { base: number; exponent: number };

	let { base, exponent }: PropType = $props();

	// Function to convert exponent to superscript format
	const formattedExponent = toSuperscript(exponent);

	function toSuperscript(number: string | number): string {
		const superscriptMap: Record<string, string> = {
			'0': '⁰',
			'1': '¹',
			'2': '²',
			'3': '³',
			'4': '⁴',
			'5': '⁵',
			'6': '⁶',
			'7': '⁷',
			'8': '⁸',
			'9': '⁹',
			'-': '⁻'
		};
		return number
			.toString()
			.split('')
			.map((char) => superscriptMap[char] || char)
			.join('');
	}
</script>

<p
	title="Copia este valor"
	class="w-fit cursor-pointer hover:underline"
	use:clickToCopy={`${base}${formattedExponent}`}
>
	{base}{formattedExponent}
</p>
