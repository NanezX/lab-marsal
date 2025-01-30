import { toast } from '@zerodevx/svelte-toast';
import type { SvelteComponent } from 'svelte';
import LoadingToast from './components/toasts/LoadingToast.svelte';

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
            '--toastBackground': '#bcccd9',
            '--toastColor': '#000',
            "--toastBorderRadius": "0.75rem",
        }
    });
}


export const toastError = (text: string) => toast.push(text, {
    theme: {

    }
})