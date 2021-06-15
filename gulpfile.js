const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const stripImportExport = require('gulp-strip-import-export');
const mocha = require('gulp-mocha');

gulp.task('sass', function() {
	return gulp.src('app/scss/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});


gulp.task('browserSync', function(done) {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	});
	done();
});


gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.series(['sass']));
	gulp.watch('app/js/**/*.js', function(done) {
		browserSync.reload();
		done();
	});
});


gulp.task('eslint', function() {
	return gulp.src('app/js/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
});


gulp.task('test', function() {
	return gulp.src('test/**/*.js', {read: false})
		.pipe(mocha({
			require: '@babel/register'
		}));
})

gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', stripImportExport()))
		.pipe(gulpIf('*.js', babel()))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});


gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});


gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});


gulp.task('clean:dist', function(done) {
	del.sync('dist');
	done();
});

gulp.task('clean:tests', function(done) {
	del.sync('tests/js');
	done();
});


gulp.task('clean:cache', function(callback) {
	return cache.clearAll(callback);
});


gulp.task('default', gulp.series('sass', 'browserSync', 'watch', function(done) {
	done();
}));


gulp.task('build', gulp.series('sass', 'eslint', 'test', 'useref', 'images', 'fonts', function(done) {
	done();
}));