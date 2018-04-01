var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
 
gulp.task('pack-js', function () {	
    return gulp.src(['src/libs/sortable.min.js',
                        'src/libs/fuse.min.js',
                        'src/js/utils.js',
                        'src/js/highlight.js',
                        'src/js/snapshot.js',
                        'src/js/tab-manager.js'])
        .pipe(concat('bundle.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: true
        }))
		.pipe(gulp.dest('dest/js'));
});
 
gulp.task('pack-css', function () {	
    return gulp.src(['src/styles/snapshot.css',
                        'src/libs/fontawesome-all.css',
                        'src/styles/header.css'])
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCss())
		.pipe(gulp.dest('dest/css'))
});

gulp.task('minify-themes', function () {	
    return gulp.src(['src/styles/themes/day_theme.css',
                        'src/styles/themes/dark_theme.css'])
        .pipe(cleanCss())
		.pipe(gulp.dest('dest/css'))
});

gulp.task('imagemin', function() {
    var imgSrc = 'src/images/*.+(png|jpg|svg)',
    imgDst = 'dest/images';
    
    gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
 });

// gulp.task('watch', function() {
//     gulp.watch('src/', ['pack-js', 'pack-css', 'minify-themes']);
// });

gulp.task('default', ['pack-js', 'pack-css', 'minify-themes', 'imagemin']);
// gulp.task('default', ['watch']);