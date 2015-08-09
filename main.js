var path = require('path'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    tasks = require('./gulpfile'),
    fs = require('fs'),
    run = require('./gulp/utils/run'),
    wkhtmltopdf = require('wkhtmltopdf');

var writer = function(opts){
    if(!opts.cwd)
        throw new Error('Missing options !');
    this.cwd = opts.cwd;
};

writer.prototype.compile = function(src, dest) {
    console.log('compile called !');
    var setts = {
        jadeSrc: path.join(this.cwd, src),
        jadeDest: path.join(__dirname, 'user'),
        jadeName: 'doc.jade',
        htmlSrc: path.join(__dirname, 'build/index.html'),
        pdfDest: path.join(this.cwd, dest),
        imgsSrc: path.join(this.cwd, 'imgs/*'),
        imgsDest: path.join(__dirname, 'user/imgs'),
        themeSrc: path.join(this.cwd, 'theme.less'),
        themePath: this.cwd,
        themeDest: path.join(__dirname, 'user')
    };

    gulp.task('compile:copy:jade', function(){
        console.log('compile:copy:jade started');
        return gulp.src(setts.jadeSrc)
            .pipe(rename(setts.jadeName))
            .pipe(gulp.dest(setts.jadeDest));
    });
    gulp.task('compile:copy:imgs', function(){
        console.log('compile:copy:imgs started');
        return gulp.src(setts.imgsSrc)
            .pipe(gulp.dest(setts.imgsDest));
    });
    gulp.task('compile:copy:theme', function(){
        console.log('compile:copy:theme started');
        return run.less(setts.themeSrc, setts.themeDest, setts.themePath);
    });
    gulp.task('compile:init', ['compile:copy:jade', 'compile:copy:imgs', 'compile:copy:theme']);
    
    gulp.task('compile:run', ['core', 'vendors'], function(){
        console.log('compile:run started');
        wkhtmltopdf('file://' + setts.htmlSrc, {marginBottom: '0', marginTop: '0', marginRight: '0', marginLeft: '0'})
          .pipe(fs.createWriteStream(setts.pdfDest));
    });
    gulp.task('watch', ['watch:core'], function(){
        gulp.watch([setts.jadeSrc, setts.themeSrc], ['compile:init', 'compile']);
    });

    gulp.task('compile', ['compile:init'], function(){
        gulp.start('compile:run');
    });

    gulp.start('compile', 'watch');

};

module.exports = function(opts){
    return new writer(opts);
};
