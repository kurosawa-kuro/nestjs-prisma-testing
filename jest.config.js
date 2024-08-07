module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/app.module.ts',
    '!**/main.ts',
    '!**/prisma.module.ts',
    '!**/config/cors.config.ts', 
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};