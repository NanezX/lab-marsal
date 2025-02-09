import { toast } from '@zerodevx/svelte-toast';
import type { SvelteComponent } from 'svelte';
import LoadingToast from './components/toasts/LoadingToast.svelte';
import ErrorToast from './components/toasts/ErrorToast.svelte';
import SuccessToast from './components/toasts/SuccessToast.svelte';

export function showToast(text: string, type: App.Superforms.Message['type'] | 'loading'): number {
	switch (type) {
		case "error": {
			return toastError(text)
		}
		case 'warning': {
			return toast.push("WARNING!")
		}
		case 'loading': {
			return toastLoading(text)
		}
		// Success
		default: {
			return toastSuccess(text)
		}
	}

}

export const toastLoading = (text: string = 'Cargando...') => {
	return toast.push({
		component: {
			// This is a workaround. The toast expect that `src` being a `SvelteComponent` type.
			// But all the components created by Svelte/SvelteKit (on this version) are type `Component<PropType, {}, "">`
			src: LoadingToast as unknown as typeof SvelteComponent,
			props: {
				text
			}
		},
		dismissable: false,
		initial: 0,
		theme: {
			'--toastWidth': 'auto',
			'--toastBackground': '#bcccd9',
			'--toastColor': '#000',
			'--toastBorderRadius': '0.75rem'
		}
	});
};

export const toastError = (text: string) => {
	return toast.push(text, {
		component: {
			src: ErrorToast as unknown as typeof SvelteComponent,
			props: {
				text
			}
		},
		theme: {
			'--toastWidth': 'auto',
			'--toastBackground': '#bcccd9',
			'--toastColor': '#000',
			'--toastBorderRadius': '0.75rem',
			'--toastBarBackground': '#ef4444'
		}
	});
};

export const toastSuccess = (text: string) => {
	return toast.push(text, {
		component: {
			src: SuccessToast as unknown as typeof SvelteComponent,
			props: {
				text
			}
		},
		theme: {
			'--toastWidth': 'auto',
			'--toastBackground': '#bcccd9',
			'--toastColor': '#000',
			'--toastBorderRadius': '0.75rem',
			'--toastBarBackground': '#22c55e'
		}
	});
};
