var _ =             require('lodash-node');
var browserSync =   require('browser-sync');
var clean =         require('gulp-clean');
var gulp =          require('gulp');
var gulpif =        require('gulp-if');
var gulpUtil =      require('gulp-util');
var Q =             require('q');
var plumber =       require('gulp-plumber');
var reload =        browserSync.reload;
var sass =          require('gulp-sass');
var shell =         require('gulp-shell');
var sourcemaps =    require('gulp-sourcemaps');

// ====================================
// Globals
// ====================================

var browserSyncConfig = {
  "browsers": ['google chrome'],
  "server": {
     baseDir: "./_site/"
  },
  watchOptions: {
    debounceDelay: 1000
  }
};
var browserSyncStarted = false;

// ====================================
// Tasks
// ====================================

gulp.task('default', function () {
  jekyllCompile()
    .then(createCSS);
});

gulp.task('dev', function () {
  jekyllCompile()
    .then(createCSS)
    .then(startBrowserSync)
    .then(watch);
});

// ====================================
// Helpers
// ====================================

function helpers_logStart(name) {
  return gulpUtil.log(gulpUtil.colors.green("Started: " + name));
}

function helpers_logEnd(name) {
  return gulpUtil.log(gulpUtil.colors.blue("(completed) - " + name));
}

function helpers_logError(err) {
  return gulpUtil.log(gulpUtil.colors.red(err));
}

// ====================================
// Routines
// ====================================

function createCSS() {
  var deferred = Q.defer();
  helpers_logStart("Create CSS");
  gulp.src('./public/sass/**/*.scss')
  .pipe(plumber(function(err){
    helpers_logError(err);
    return deferred.resolve();
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write())
  .pipe(gulpif(browserSyncStarted, browserSync.reload({
    stream: true
  })))
  .pipe(gulp.dest("./_site/public/stylesheets"))
  .on("end", function() {
    helpers_logEnd("Successfully Created CSS");
    return deferred.resolve();
  });
  return deferred.promise;
}

function jekyllCompile() {
  var deferred = Q.defer();
  helpers_logStart("Jekyll Compile");
  shell.task([
    "bundle exec jekyll b"
  ], {
    "ignoreErrors": true
  })().on('end', function() {
    helpers_logEnd("Jekyll Compile");
    return deferred.resolve();
  });
  return deferred.promise;
}

function startBrowserSync() {
  var deferred = Q.defer();
  browserSync.init([], browserSyncConfig);
  browserSyncStarted = true;
  deferred.resolve();
  return deferred.promise;
}

function watch() {
  helpers_logStart("Started watching for changes...");
  
  // Recompile on HTML Changes
  gulp.watch([
    "**/*.html",
    "!_site/**/*.html"
  ], function() {
    jekyllCompile()
      .then(createCSS)
      .then(reload);
  });
  gulp.watch([
    "public/sass/**/*.scss"
  ], function() {
    createCSS();
  });
}