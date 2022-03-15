'use strict';

module.exports = () => ({
  compilerOptions: {
    lib: ['es2019', 'es2020.promise', 'es2020.bigint', 'es2020.string', 'DOM'],
    module: 'commonjs',
    target: 'es2019',
    strict: false,
    jsx: 'react',
    noImplicitAny: false,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    allowJs: true,
    outDir: 'dist',
    rootDir: '.',
    noEmitOnError: true,
    resolveJsonModule: true,
  },

  include: ['src/**/*.json', './'],
  exclude: ['node_modules/', 'build/', 'dist/', 'src/admin', '.cache/', '.tmp/'],
});