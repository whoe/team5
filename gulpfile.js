var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer');
gulp.task('autoprefix - плагин', function () {
    return gulp.src('*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css/')); // применим ко всем css внутри директории css
});
