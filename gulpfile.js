// Папки с исходниками
let projectFolder = require('path').basename(__dirname);
let sourceFolder = '#src';

// Получение к файловой системы
let fs = require('fs')

// Пути к файлам
let path = {
  build: { 
    html: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    img: projectFolder + '/img/',
    fonts: projectFolder + '/fonts/',
  },

  src: { 
    html: [sourceFolder + '/*.html', "!" + sourceFolder + '/_*.html'],
    css: sourceFolder + '/scss/main.scss',
    js: sourceFolder + '/js/main.js',
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },

  watch: { 
    html: sourceFolder + '/**/*.html',
    css: sourceFolder + '/scss/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },

  clean: './' + projectFolder + '/'
}

// Плагины
let {src, dest} = require('gulp')
let gulp = require('gulp')
let browserSync = require('browser-sync').create()
let fileInclude = require('gulp-file-include')
let del = require('del')
let scss = require('gulp-sass')
let autoPrefix = require('gulp-autoprefixer')
let groupMedia = require('gulp-group-css-media-queries')
let cleanCss = require('gulp-clean-css')
let rename = require('gulp-rename')
let uglifyEs = require('gulp-uglify-es').default;
let imageMin = require('gulp-imagemin')
let webp = require('gulp-webp')
let webpHTML = require('gulp-webp-html')
// let webpCSS = require('gulp-webpcss')
let svgSprite = require('gulp-svg-sprite')
let ttf2Woff2 = require('gulp-ttf2woff2')
let ttf2Woff = require('gulp-ttf2woff')
let fonter = require('gulp-fonter')

// Обновление браузера
function browserSyncFunction(params) {
  browserSync.init({
    server: {
      baseDir: './' + projectFolder + '/'
    },
    port: 3000,
    notify: false
  })
}


// Обработка HTML
function html() {
  return src(path.src.html)
  .pipe(fileInclude())
  .pipe(webpHTML())
  .pipe(dest(path.build.html))
  .pipe(browserSync.stream())
}

// Конвертирование  SCSS
function css() {
  return src(path.src.css)  
  .pipe(
    scss({
      outputStyle: 'expanded',
    })
  )
  .pipe(
    autoPrefix({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    })
  )
  .pipe(groupMedia())  
  // .pipe(webpCSS({}))
  .pipe(dest(path.build.css))
  .pipe(cleanCss())
  .pipe(
    rename({
      extname: '.min.css'
    })
  )
  .pipe(dest(path.build.css))
  .pipe(browserSync.stream())
}

// Обработка Ява-скрипта
function js() {
  return src(path.src.js)
  .pipe(fileInclude())
  .pipe(dest(path.build.js))
  .pipe(uglifyEs())
  .pipe(
    rename({
      extname: '.min.js'
    })
  )
  .pipe(dest(path.build.js))
  .pipe(browserSync.stream())
}

// Конвертирование шрифтов с ttf в woff/woff2
function fonts() {
  src(path.src.fonts)
  .pipe(ttf2Woff())
  .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
  .pipe(ttf2Woff2())
  .pipe(dest(path.build.fonts))
}

// Конвертирование картинок в webp + перенос
function images() {
  return src(path.src.img)  
  .pipe(
    webp({
      quality: 70
    })
  )
  .pipe(dest(path.build.img))
  .pipe(src(path.src.img))
  .pipe(
    imageMin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      interlaced: true,
      optimizationLevel: 3 // 0 to 7  
    })
  )
  .pipe(dest(path.build.img))
  .pipe(browserSync.stream())
}

// Создание спрайтов (Для иконок)
gulp.task('svgSprite', function() {
  return gulp.src([sourceFolder + '/iconsprite/*.svg'])
  .pipe(
    svgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg', // sprite file name
          example: true // example create html
        }
      }
    })
  )
  .pipe(dest(path.build.img))
})

// Конвертирование шрифтов с otf в ttf
gulp.task('otf2ttf', function() {  
  return gulp.src([sourceFolder + '/fonts/*.otf'])
  .pipe(fonter({
    formats: ['ttf']
  }))
  .pipe(dest(sourceFolder + '/fonts/*'))
})

// Добавление шрифтов в fonts.scss 
function fontsStyle(){   
  let fileContent = fs.readFileSync(sourceFolder + '/scss/fonts.scss')
  if (fileContent == '') {
    fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb)
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontName
        for (let i = 0; i < items.length; i++) {
          let fontName = items[i].split('.')
          fontName = fontName[0]
          if (c_fontName != fontName) {
            fs.appendFile(sourceFolder + '/scss/fonts.scss', `@include font(${fontName}, ${fontName}, 400, normal);
            `, cb) 
          }
          c_fontName = fontName
        }
      }
    })
  }
}

// Пустышка
function cb() {}

// Отслеживание за изменениеми файлов
function watchFiles(params) {
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.html],html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.img], images)

}

// Очистка папки 
function cleaning(params) {
  return del(path.clean)
}

// Постройка задач
let build = gulp.series(cleaning,gulp.parallel(js, css, html, images, fonts), fontsStyle)
let watch = gulp.parallel(build, watchFiles, browserSyncFunction)

// Объявление переменных для GULP
exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.images = images
exports.css = css
exports.html = html
exports.js = js
exports.build = build
exports.watch = watch
exports.default = watch
