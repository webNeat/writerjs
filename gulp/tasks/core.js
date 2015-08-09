var gulp = require('gulp'),
    del = require('del');

var config = require('../config.json'),
    run = require('../utils/run'),
    helper = require('../utils/helper');

gulp.task('core:views', function(cb){
    run.jadeAll(config.core.views, cb);
});
gulp.task('watch:core:views', function(){
    var srcs = helper.getSources(config.core.views);
    return gulp.watch(srcs, ['core:views']);
});

gulp.task('core:scripts', function(){
    return gulp.src(config.core.scripts.src)
      .pipe(gulp.dest(config.core.scripts.dest));
});
gulp.task('watch:core:scripts', function(){
    // var srcs = helper.getSources(config.core.scripts);
    return gulp.watch(config.core.scripts.src, ['core:scripts']);
});

gulp.task('core:styles', function(){
    var dest = helper.splitPath(config.core.styles.dest);
    return run.less(config.core.styles.src, dest.dir, config.core.styles.path);
});
gulp.task('watch:core:styles', function(){
    return gulp.watch(config.core.styles.src, ['core:styles']);
});

// Core Images
gulp.task('core:imgs', function(){
    return gulp.src(config.core.imgs.src)
        .pipe(gulp.dest(config.core.imgs.dest));
});

// All Core Tasks
gulp.task('core', ['core:views', 'core:styles', 'core:imgs', 'core:scripts']);
gulp.task('watch:core', ['watch:core:views', 'watch:core:styles', 'watch:core:scripts']);
