const SOURCE_FOLDER = '#src'
const PRODUCTION_FOLDER = require('path').basename(__dirname)

let fs = require('fs')

const PATH = {
  src: {
    html: [`${SOURCE_FOLDER}/*.html`, `!${SOURCE_FOLDER}/_*.html`],
    css: `${SOURCE_FOLDER}/scss/index.scss`,
    js: `${SOURCE_FOLDER}/js/index.js`,
    img: [`${SOURCE_FOLDER}/img/**/*.{gif,jpg,jpeg,png,svg,ico,webp}`, `!${SOURCE_FOLDER}/img/icons/*.svg`],
    fonts: `${SOURCE_FOLDER}/fonts/*.ttf`,
  },
  prod: {
    html: `${PRODUCTION_FOLDER}/`,
    css: `${PRODUCTION_FOLDER}/css/`,
    js: `${PRODUCTION_FOLDER}/js/`,
    img: `${PRODUCTION_FOLDER}/img/`,
    fonts: `${PRODUCTION_FOLDER}/fonts/`,
  },
  watch: {
    html: `${SOURCE_FOLDER}/**/*.html`,
    css: `${SOURCE_FOLDER}/scss/**/*.scss`,
    js: `${SOURCE_FOLDER}/js/**/*.js`,
    img: `${SOURCE_FOLDER}/img/**/*.{gif,jpg,jpeg,png,svg,ico,webp}`,
    fonts: `${SOURCE_FOLDER}/fonts/*.{ttf,otf,woff,woff2}`,
  },
  clean: `./${PRODUCTION_FOLDER}/`
}

const { src, dest, watch, series, parallel } = require('gulp')
const gulp = require('gulp')

const server = require('browser-sync').create(),
  fileInclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  cssMedia = require('gulp-group-css-media-queries'),
  cleanStyle = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  webphtml = require('gulp-webp-html'),
  webpcss = require('gulp-webpcss'),
  svgsprite = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter');


function serverSync() {
  server.init({
    injectChanges: true,
    server: {
      baseDir: `./${PRODUCTION_FOLDER}/`
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(PATH.src.html)
    .pipe(fileInclude())
    .pipe(webphtml())
    .pipe(dest(PATH.prod.html))
    .pipe(server.stream())
}

function styles() {
  return src(PATH.src.css)
    .pipe(scss().on('error', scss.logError))
    .pipe(cssMedia())
    .pipe(autoprefixer({
      cascade: true,
      overrideBrowserslist: ['last 5 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(webpcss())
    .pipe(dest(PATH.prod.css))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(cleanStyle())
    .pipe(dest(PATH.prod.css))
    .pipe(server.stream())
}

function js() {
  return src(PATH.src.js)
    .pipe(fileInclude())
    .pipe(rename('script.js'))
    .pipe(dest(PATH.prod.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest(PATH.prod.js))
    .pipe(server.stream())
}

function images() {
  return src(PATH.src.img)
    .pipe(webp({
      quality: 70
    }))
    .pipe(dest(PATH.prod.img))
    .pipe(src(PATH.src.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: true }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(PATH.prod.img))
    .pipe(server.stream())
}

function svgSprite() {
  return src(`${SOURCE_FOLDER}/img/icons/*.svg`)
    .pipe(svgsprite({
      mode: {
        stack: {
          sprite: '../icons.svg',
        }
      }
    }))
    .pipe(dest(PATH.prod.img))
}

function fonts() {
  src(`${SOURCE_FOLDER}/fonts/*.ttf`)
    .pipe(ttf2woff())
    .pipe(dest(PATH.prod.fonts))
  return src(PATH.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(PATH.prod.fonts))
}

function otfToTtf() {
  return src(`${SOURCE_FOLDER}/fonts/*.otf`)
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(`${SOURCE_FOLDER}/fonts`))
}

function cleanFolder() {
  return del(PATH.clean)
}

function fontsStyle(params) {
  let file_content = fs.readFileSync(SOURCE_FOLDER + '/scss/_fonts.scss');
  if (file_content == '') {
    fs.writeFile(SOURCE_FOLDER + '/scss/_fonts.scss', '', cb);
    return fs.readdir(PATH.prod.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(SOURCE_FOLDER + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}
function cb() { }

function watchFiles() {
  watch([PATH.watch.html], html)
  watch([PATH.watch.css], styles).on('change', server.reload)
  watch([PATH.watch.js], js)
  watch([PATH.watch.img], images)
  watch([`${SOURCE_FOLDER}/img/icons/*.svg`], svgSprite)
  watch([PATH.watch.fonts], fonts)
}

const build = series(cleanFolder, parallel(html, styles, js, images, svgSprite, fonts), fontsStyle)
const watching = parallel(build, watchFiles, serverSync)

exports.fontsStyle = fontsStyle
exports.otfToTtf = otfToTtf
exports.fonts = fonts
exports.svgSprite = svgSprite
exports.images = images
exports.html = html
exports.js = js
exports.styles = styles
exports.build = build
exports.watching = watching
exports.default = watching
