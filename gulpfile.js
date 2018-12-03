const gulp = require('gulp');
const hogan = require('gulp-hogan');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const image = require('gulp-image');
const autoReload = require('gulp-auto-reload');
const twig = require('gulp-twig');
var outapp = "dist";

gulp.task('html', function(){
  return gulp.src(['src/templates/*.hogan','src/templates/**/*.hogan'])
    .pipe(hogan({handle: 'gnumanth'}, null, '.html'))
    .pipe(gulp.dest('dist'))
});
gulp.task('twig', function(){
  return gulp.src(['src/templates/*.twig','src/templates/**/*.twig'])
    .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
    .pipe(gulp.dest('dist'))
});

gulp.task('css', function(){
  return gulp.src(['src/scss/*.scss', 'src/scss/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('stylesheets.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('static', function(){
  return gulp.src(['src/static/*', 'src/static/**/*'])
    .pipe(gulp.dest('dist/static'))
});

gulp.task('staticscss', function(){
  return gulp.src(['src/static/*.scss', 'src/static/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/static'))
});


gulp.task('js', function(){
  return gulp.src('src/js/*.js')
    // .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('image', function () {
  gulp.src(['src/images/*', 'src/images/**/*'])
    // .pipe(image({
    //   pngquant: true,
    //   optipng: false,
    //   zopflipng: true,
    //   jpegRecompress: false,
    //   mozjpeg: true,
    //   guetzli: false,
    //   gifsicle: true,
    //   svgo: true,
    //   concurrent: 10,
    //   quiet: true // defaults to false
    // }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('reloader', function() {
  console.log("reload");
  var reloader = autoReload();
  reloader.script()
    .pipe(gulp.dest(outapp));
  htmlInject = reloader.inject;
  gulp.watch(outapp + "/**/*", reloader.onChange);
});

gulp.task('watch', ['reloader'],function(){
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['css']);
  gulp.watch(['src/staticscss*', 'src/staticscss/**/*'], ['static','staticscss'])
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch(['src/templates/*.hogan','src/templates/**/*.hogan'], ['html']);
  gulp.watch(['src/images/*', 'src/images/**/*'], ['image']);
});

gulp.task('default', [ 'reloader', 'watch', 'html', 'css', 'js', 'image' , 'static','staticscss']);