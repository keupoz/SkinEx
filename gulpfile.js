if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

const OUTPUTDIR = 'docs',
      PRODUCTION = process.env.NODE_ENV === 'production';

let cachePlugins = {};
function plugin (name) {
  if (!(name in cachePlugins)) cachePlugins[name] = require('rollup-plugin-' + name);
  return cachePlugins[name];
}

const gulp  = require('gulp'),
      newer = require('gulp-newer'),

      pug    = require('gulp-pug'),
      stylus = require('gulp-stylus'),

      rollup = require('rollup'),

      fs        = require('fs'),
      rmdirSync = require('rimraf').sync,

      sync = require('browser-sync').create();

function getPlugins () {
  return [
    plugin('node-resolve')(),
    plugin('commonjs')(),
    plugin('json')(),
    plugin('replace')({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    plugin('vue')(),
    PRODUCTION ? plugin('babel')() : undefined,
    PRODUCTION ? plugin('uglify').uglify() : undefined
  ];
}

gulp.task('clean', function (done) {
  if (fs.existsSync(OUTPUTDIR)) rmdirSync(OUTPUTDIR);
  fs.mkdirSync(OUTPUTDIR);
  done();
});

gulp.task('assets', function () {
  return gulp.src('src/assets/**', { since: gulp.lastRun('assets') })
    .pipe(newer(OUTPUTDIR + '/assets'))
    .pipe(gulp.dest(OUTPUTDIR + '/assets'));
});

gulp.task('html', function () {
  return gulp.src('src/*.pug', { since: gulp.lastRun('html') })
    .pipe(pug())
    .pipe(gulp.dest(OUTPUTDIR));
});

gulp.task('css', function () {
  return gulp.src('src/styles/index.styl')
    .pipe(stylus({
      'inline css': true,
      compress: PRODUCTION
    }))
    .pipe(gulp.dest(OUTPUTDIR));
});

let oldWatchFiles = [], jswatcher, cache,
    plugins = getPlugins();

gulp.task('js', async function () {
  let bundle = await rollup.rollup({
    input: 'src/scripts/main.js',
    cache, plugins,
    treeshake: PRODUCTION ? {
      pureExternalModules: true
    } : false
  });

  cache = bundle.cache;

  await bundle.write({
    file: OUTPUTDIR + '/app.js',
    format: 'iife'
  });

  if (!jswatcher) return;

  let newWatchFiles = bundle.watchFiles.filter(file => !file.startsWith('\u0000')),
      watch = newWatchFiles.filter(file => oldWatchFiles.indexOf(file) == -1),
      unwatch = oldWatchFiles.filter(file => bundle.watchFiles.indexOf(file) == -1);

  jswatcher.unwatch(unwatch);
  jswatcher.add(watch);

  oldWatchFiles = bundle.watchFiles;
});

gulp.task('watch', function (done) {
  gulp.watch('src/assets/**',        gulp.series('assets'));
  gulp.watch('src/*.pug',            gulp.series('html'));
  gulp.watch('src/styles/**/*.styl', gulp.series('css'));

  jswatcher = gulp.watch('src/scripts/main.js', gulp.series('js'));

  done();
});

gulp.task('server', function () {
  sync.init({
    server: OUTPUTDIR,
    files: OUTPUTDIR + '/**/*',
    open: false
  });
});

gulp.task('build', gulp.series('assets', 'html', 'css', 'js'));
gulp.task('dev',   gulp.series('watch', 'build', 'server'));

gulp.task('default', gulp.series('clean', 'build'));
