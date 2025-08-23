/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
	testMatch: ['**/__tests__/**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	setupFiles: ['dotenv/config'],
};