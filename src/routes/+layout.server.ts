import { loadFlash, flashCookieOptions } from 'sveltekit-flash-message/server';

flashCookieOptions.secure = false;

export const load = loadFlash(async (_event) => {
	//
});
