module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['text', 'html', 'lcov'],
    roots: ['<rootDir>/test/'],
    coverageDirectory: '<rootDir>/coverage',
    coverageThreshold: {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    },
    collectCoverageFrom: [
        "./src/**/*.js"
    ],
    reporters: ['default', ['jest-sonar', {
        outputDirectory: './.reports',
        outputName: 'testreport.xml'
    }]]
};