var gulp = require('gulp'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    less = require('gulp-less');
var helper = require('./helper');

var run = {};

run.jade = function(src, dest){
    var target = helper.splitPath(dest);
    if(target.name.indexOf('.') != -1)
        dest = target.dir;
    return gulp.src(src)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(dest));
};

run.jadeAll = function(list, cb){
    var size = list.length;
    var done = function(){
        size --;
        if(size == 0)
            cb(null);
    };
    list.forEach(function(e){
        run.jade(e.src, e.dest).on('end', done);
    });
};

run.concat = function(srcs, dest) {
    var target = helper.splitPath(dest);
    return gulp.src(srcs)
        .pipe(concat(target.name))
        .pipe(gulp.dest(target.dir));
};

run.concatAll = function(list, cb){
    var size = list.length;
    var done = function(){
        size --;
        if(size == 0)
            cb(null);
    };
    list.forEach(function(e){
        run.jade(e.src, e.dest).on('end', done);
    });
};

run.less = function(srcs, dest, path){
    return gulp.src(srcs)
        .pipe(less({ paths: path }))
        .pipe(gulp.dest(dest));
}

module.exports = run;
