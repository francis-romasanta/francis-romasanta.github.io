var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create(); // Import browser-sync

gulp.task('scripts', function() {
    return gulp.src('./js/scripts.js')
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        })))
        .pipe(babel({
          presets: [['@babel/env', {modules:false}]]
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream()); // Stream changes to browser-sync
});

gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream()); // Stream changes to browser-sync
});

gulp.task('watch', function() {
    gulp.watch('./js/scripts.js', gulp.series('scripts'));
    gulp.watch('./scss/styles.scss', gulp.series('styles'));
});

// Task to start the development server
gulp.task('serve', function(done) {
    debugger;
    browserSync.init({
        server: './', // Serve files from the current directory
        port: 8080 // Specify the port here
    }, function(err, bs) {
        if (err) {
            console.error('Error starting server:', err);
        } else {
            console.log('Server running at:', bs.options.get('urls').get('local'));
        }
        done();
    });

    // Watch for changes in HTML files and reload the browser
    gulp.watch('./*.html').on('change', browserSync.reload);
});

// Default task to run the server and watch tasks together
gulp.task('default', gulp.parallel('serve', 'watch'));
