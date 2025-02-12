
import { generateFromNameUUID, generateRandomUUID, Namespaces } from "$lib/server/db/uuid";
import { describe, it, expect } from 'vitest';

describe('UUID Utilities', () => {
    describe("generateRandomUUID function", () => {
        it("should generate valid UUID using generateRandomUUID", () => {
            const uuid = generateRandomUUID();

            expect(uuid).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
        })

        it('should generate unique UUIDs', () => {
            const uuid1 = generateRandomUUID();
            const uuid2 = generateRandomUUID();

            expect(uuid1).not.toBe(uuid2);
        });

        it('should work in browser and Node.js environments', () => {
            const uuid = generateRandomUUID();
            expect(typeof uuid).toBe('string');
            expect(uuid.length).toBe(36);
        });
    })
    describe("generateFromNameUUID function", () => {
        const testValue = 'test value';
        const testNamespace = Namespaces.Patient;

        it('should generate a valid UUID', () => {
            const uuid = generateFromNameUUID(testValue, testNamespace);

            expect(uuid).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );
        });

        it('should generate the same UUID for the same input', () => {
            const uuid1 = generateFromNameUUID(testValue, testNamespace);
            const uuid2 = generateFromNameUUID(testValue, testNamespace);

            expect(uuid1).toBe(uuid2);
        });

        it('should remove whitespaces when whitespaces=false', () => {
            const uuidWithSpaces = generateFromNameUUID('test value', testNamespace, false);
            const uuidWithoutSpaces = generateFromNameUUID('testvalue', testNamespace, false);

            expect(uuidWithSpaces).toBe(uuidWithoutSpaces);
        });

        it('should remove whitespaces by default', () => {
            const uuidWithSpaces = generateFromNameUUID('test value', testNamespace);
            const uuidWithoutSpaces = generateFromNameUUID('testvalue', testNamespace);

            expect(uuidWithSpaces).toBe(uuidWithoutSpaces);
        });

        it('should preserve whitespaces when whitespaces=true', () => {
            const uuidWithSpaces = generateFromNameUUID('test value', testNamespace, true);
            const uuidWithoutSpaces = generateFromNameUUID('testvalue', testNamespace, true);

            expect(uuidWithSpaces).not.toBe(uuidWithoutSpaces);
        });

        it('should handle empty strings', () => {
            const uuid = generateFromNameUUID('', testNamespace);
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });

        it('should handle special characters', () => {
            const uuid = generateFromNameUUID('test@value#123', testNamespace);
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });

        it('should throw an error for invalid namespaces', () => {
            const invalidNamespace = 'invalid-namespace';
            expect(() => generateFromNameUUID(testValue, invalidNamespace as never)).toThrow();
        });
    })

})