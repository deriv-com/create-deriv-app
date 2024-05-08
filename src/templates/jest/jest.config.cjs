module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.svg': '<rootDir>/__mocks__/svgMock.js',
        '@deriv-com/(.*)': '<rootDir>/node_modules/@deriv-com/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui)).+\\.js$'],
};
