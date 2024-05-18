module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['text', 'html', 'lcov'],
    roots: ['<rootDir>/test/'],
    coverageDirectory: '<rootDir>/coverage',
    coverageThreshold: {
        "global": {
            "branches": 75,
            "functions": 75,
            "lines": 75,
            "statements": 75
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