var gulp = require('gulp'),
    del = require('del');

var config = require('../config.json'),
    run = require('../utils/run'),
    helper = require('../utils/helper');

// *** Vendors Tasks *** //

gulp.task('vendors', function(cb){
    var size = 3;
    var done = function(){
        size --;
        if(size == 0)
            cb(null);
    }
    // Scripts
    run.concat(config.vendors.js.src, config.vendors.js.dest)
        .on('end', done);
    // Styles
    run.concat(config.vendors.css.src, config.vendors.css.dest)
        .on('end', done);
    // Fonts
    gulp.src(config.vendors.fonts.src)
        .pipe(gulp.dest(config.vendors.fonts.dest))
        .on('end', done);
});
