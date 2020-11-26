
//modules
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify')

//variables for file paths
var styleSRC = 'src/scss/style.scss';
var styleDIST = './dist/css/';

var jsSRC = 'src/js/script.js';
var jsDIST = './dist/js/';
//input js files here
var jsFILES = [jsSRC];

//var for gulp watch
var styleWatch = 'src/scss/**/*.scss';
var jsWatch = 'src/js/**/*.js';

//convert sass stylesheet in /src/ to .min.css in /dist/
gulp.task('style', async function() {
    gulp.src( styleSRC )
    .pipe( sourcemaps.init() )
    .pipe( sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }) )
    .on( 'error', console.error.bind( console) )
    .pipe( autoprefixer({
        cascade: false }))
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( styleDIST ) )
    
    

});

//convert js babel
gulp.task('js', async function() {
    jsFILES.map(function( entry ){
        return browserify({
            entries: [entry]
        })
        .transform(babelify, {presets: ['env']})
        .bundle()
        .pipe( source( entry ) )
        .pipe( rename({ extname: 'min.js' }) )
        .pipe( buffer() )
        .pipe( sourcemaps.init({ loadMaps: true }) )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( jsDIST ) );

    });
    //Browserify for dependencies
    //transform with babelify [env]
    //bundle
    //source
    //rename.min
    //buffer
    //sourcemap
    //uglify
    //write sourcemap
    //dist

});

//default
gulp.task('default', gulp.series('style', 'js') );

//watchman
gulp.task('watch', function(){

    gulp.watch( styleWatch, { ignoreInitial: false }, gulp.series('style') );
    gulp.watch( jsWatch, { ignoreInitial: false }, gulp.series('js') );

});

