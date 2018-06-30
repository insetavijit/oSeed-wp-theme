/**
 * @name : oSeedTasker - v1.0
 * @description : all font end tasks goes here
 * @version  1.0.0
 * @since 1.0.0
 * @author avijit sarkar
 */

var
    gulp = require('gulp'),
    fs = require('fs'),
    glob = require("glob"),
    pkg = require('./package.json'),
    vl = require('./vl.json'), //dir list
    //util
    del = require('del'),
    ren = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    pump = require('pump'),
    _if = require('gulp-if')
//js
    uglify = require('gulp-uglify'),
    webpack = require('webpack-stream'),
    //sass
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    cssMin = require('gulp-clean-css')
    ;

var
    dirs = {
        'dist': 'dist',
        'bin': '.bin',
        'src': "src",

        'entryScss': vl.sass.src + '/**.scss',
        "entryJs": vl.js.src + "/index.js",
    }
    ;
gulp.task('tst', gulp.parallel((done) => {
    log("Gulp - #4 - test");
    done();
}));
/**
 * @type Move Files
 * @desc : pipe
 * @version 1.0
 */
gulp.task('sft:vendor', gulp.parallel((done) => {
    // var rr = ['/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'];
    gulp.src(vl.libs.src) // we have created a saparated file for all our vendor pkg lists called vl.json
        .pipe(gulp.dest(vl.libs.dist));
    done();
}));
gulp.task('sft:mdc', gulp.parallel((done) => {
    // var rr = ['/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'];
    gulp.src(vl.mdc.sass.src) // we have created a saparated file for all our vendor pkg lists called vl.json
        .pipe(gulp.dest(vl.mdc.sass.dist))
        .pipe(gulp.dest(vl.mdc.js.dist));
    done();
}));

/**
 * @type cleaning 
 * @desc none 
 * @version 1.0.0
 */
gulp.task('clr:bin', gulp.parallel((done) => {
    del(dirs.bin + '/*');
    done();
}));
gulp.task('clr:libs', gulp.parallel((done) => {
    del(vl.base.lib);
    done();
}));
gulp.task('clr:mdc', gulp.parallel((done) => {
    del(vl.mdc.js.dist + '/@material');
    del(vl.mdc.sass.dist + '/@material');
    done();
}));
/**
 * @type sass compiling taks
 */
gulp.task('sass:min', gulp.parallel((done) => {
    sassCompiler(dirs.entryScss, vl.sass.dist, true, 'min');
    done();
}));
gulp.task('sass:full', gulp.parallel((done) => {
    sassCompiler(dirs.entryScss, vl.sass.dist, true, 'full');
    done();
}));
gulp.task('sass:all', gulp.parallel((done) => {
    sassCompiler(dirs.entryScss, vl.sass.dist, true, 'all');
    done();
}));
/**
 * @type js compiling taks
 */
gulp.task('js:min', gulp.parallel((done) => {
    jsCompile(dirs.entryJs, vl.js.dist, 'min');
    done();
}));
gulp.task('js:full', gulp.parallel((done) => {
    //compilaer function  : re-useable
    jsCompile(dirs.entryJs, vl.js.dist, 'full');
    //requerd callback
    done();
}));
gulp.task('js:all', gulp.parallel((done) => {
    jsCompile(dirs.entryJs, vl.js.dist);
    done();
}));
/**
 * @type watches
 * @version 1.0
 */

gulp.task('sass:w', gulp.parallel('sass:min', (done) => {
    gulp.watch(vl.sass.watch, gulp.parallel('sass:min'))
    done();
}))
gulp.task('js:w', gulp.parallel('js:min', (done) => {
    gulp.watch(vl.js.watch, gulp.parallel('js:min'))
    done();
}));
/**
 * @type caller
 * @desc everything
 * @version 1.0.0
 */
gulp.task('clr:all', gulp.parallel('clr:bin', 'clr:libs', 'clr:mdc'));
gulp.task('sft:all', gulp.parallel('sft:vendor', 'sft:mdc'));
gulp.task('dev:all', gulp.parallel('sass:w', 'js:w'))
gulp.task('dev:font', gulp.parallel('sass:w'))
/**
 * @type sudo cmnds
 */
gulp.task('clear', gulp.parallel('clr:all'));
gulp.task('sft', gulp.parallel('sft:all'));
gulp.task('build', gulp.parallel('sass:min', 'js:min', 'sass:full', 'js:full'))

/// functions :
function sassCompiler(fileName = '', dist = '.bin', map = true, _with = 'all') {

    pump([
        gulp.src(fileName),
        plumber(), // for continue with error - no brake during run time . bkz their is others too
        _if(map === true, sourcemaps.init()),
        sass({
            // important for includeing other files from root 
            includePaths: ['./src/styles/'] // and this is the root
        }),
        postcss([autoprefixer]),
        _if(_with === 'full' || _with === 'all' && map === true, sourcemaps.write('./')),
        _if(_with === 'full' || _with === 'all', gulp.dest(dist)),
        _if(_with === 'min' || _with === 'all', cssMin()),
        _if(_with === 'min' || _with === 'all', ren({
            suffix: '.min'
        })),
        _if(_with === 'min' || _with === 'all' && map === true, sourcemaps.write('./')),
        _if(_with === 'min' || _with === 'all', gulp.dest(dist)),
    ])
    // log( glob(fileName) , dist )

}
function jsCompile(fileSource = '', fileDest = '.bin', _with = 'all') {

    pump([
        gulp.src(fileSource),
        plumber(),
        webpack({
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }]
            }
        }),
        ren({
            basename: pkg.name,
            suffix: "-bundil",
            extname: ".js"
        }),
        _if(_with !== 'min', gulp.dest(fileDest)),
        _if(_with === 'min' || _with === 'all', uglify()),
        _if(_with === 'min' || _with === 'all', ren({
            extname: '.min.js'
        })),
        _if(_with === 'min' || _with === 'all', gulp.dest(fileDest)),
    ]);
}
