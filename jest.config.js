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
    '!**/*.module.ts',  // すべての .module.ts ファイルを除外
    '!**/main.ts',
    '!**/config/cors.config.ts',
    '!**/config/swagger.config.ts', 
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};