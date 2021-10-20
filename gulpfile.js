const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const minifyCss = require('gulp-clean-css');

// compile sass
gulp.task('sass', function () {   
   return gulp.src('src/scss/**/*.scss')
          .pipe(sass())
          .pipe(autoprefixer())
          .pipe(browserSync.reload({
               stream:true
           }))
          .pipe(gulp.dest('src/css'))
});


// serve the page in live server
gulp.task('serve', function(){
     browserSync.init({
         server: 'src',
         port: 4000
     });
})


// Browser Reload Function
gulp.task('reload', function(done){
    browserSync.reload();
    done();
})

// compile sass & reload the browser
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass','reload'));
})

// create a live-server function.
gulp.task('live-server', gulp.parallel('serve', 'watch'));


// concatenates & minification of CSS & JavaScript files into a single file
gulp.task('asset-opt', function(){
   return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'))
});

// copy assets (eg. fonts) to disto
gulp.task('fonts', function(){
   return gulp.src('src/fonts/**/*')
         .pipe(gulp.dest('dist/fonts'))
});

// build for production
gulp.task('build', gulp.series('sass', 'asset-opt', 'fonts'));


gulp.task('default', gulp.parallel('serve','watch'));