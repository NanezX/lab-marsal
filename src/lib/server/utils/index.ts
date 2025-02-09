// TODO: Remove this dependency '@oslojs/encoding'
// import { encodeBase32LowerCase } from '@oslojs/encoding';

/**
 * Hashing options for argon2
 */
export const hashingOptions = {
	variant: 'argon2id',
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};
