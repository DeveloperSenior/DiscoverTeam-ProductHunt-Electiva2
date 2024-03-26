module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['text', 'html', 'lcov'],
    roots: ['<rootDir>/test/'],
    coverageDirectory: '<rootDir>/coverage',
    coverageThreshold: {
        "global": {
            "branches": 50,
            "functions": 90,
            "lines": 90,
            "statements": 90
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