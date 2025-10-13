const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.argv.includes('--watch');
const isAnalyze = process.argv.includes('--analyze');

const buildConfig = {
  entryPoints: ['src/ts/main.ts'],
  bundle: true,
  minify: isProduction,
  sourcemap: true,
  target: 'es2019',
  format: 'esm',
  outdir: 'assets/js',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
  },
  loader: {
    '.ts': 'ts'
  },
  plugins: [
    // TypeScript checking plugin
    {
      name: 'typescript-checker',
      setup(build) {
        build.onStart(() => {
          console.log('🔍 Checking TypeScript types...');
          const { execSync } = require('child_process');

          try {
            execSync('npx tsc --noEmit', { stdio: 'pipe' });
            console.log('✅ TypeScript types check passed');
          } catch (error) {
            console.error('❌ TypeScript errors found:');
            console.error(error.stdout.toString());

            if (!isWatch) {
              console.error('🚫 Build failed due to TypeScript errors');
              process.exit(1);
            } else {
              console.warn('⚠️ Continuing in watch mode despite errors');
            }
          }
        });
      }
    },

    // Bundle size analyzer plugin
    {
      name: 'bundle-analyzer',
      setup(build) {
        build.onEnd((result) => {
          if (result.metafile) {
            console.log('\n📊 Bundle Analysis:');
            Object.entries(result.metafile.outputs).forEach(([file, output]) => {
              const sizeKB = (output.bytes / 1024).toFixed(2);
              console.log(`  ${file}: ${sizeKB} KB`);

              if (file.includes('main.js') && output.bytes > 153600) {
                console.warn(`⚠️ Bundle size exceeds 150KB: ${sizeKB} KB`);
              }
            });

            // Detailed analysis if requested
            if (isAnalyze) {
              console.log('\n📈 Detailed Bundle Analysis:');
              const mainBundle = result.metafile.outputs['assets/js/main.js'];
              if (mainBundle && mainBundle.inputs) {
                console.log('\n📦 Input Files:');
                Object.entries(mainBundle.inputs).forEach(([file, input]) => {
                  const bytesInKB = (input.bytes / 1024).toFixed(2);
                  console.log(`  ${file}: ${bytesInKB} KB`);
                });
              }

              if (mainBundle && mainBundle.exports) {
                console.log('\n🔗 Exports:');
                mainBundle.exports.forEach(exportName => {
                  console.log(`  ${exportName}`);
                });
              }
            }
          }
        });
      }
    }
  ],
  logLevel: 'info'
};

if (isWatch) {
  esbuild.context(buildConfig).then((context) => {
    console.log('👀 Watching for TypeScript changes...');
    context.watch();
  });
} else {
  esbuild.build(buildConfig).catch(() => {
    console.error('❌ Build failed');
    process.exit(1);
  });
}