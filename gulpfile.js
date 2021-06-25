const projectFolder = require("path").basename(__dirname);
const sourceFolder  = "#src";
const fs            = require("fs");

let path = {
    build: {
        html: `${projectFolder}/`
        ,css: `${projectFolder}/css/`
        ,js: `${projectFolder}/js/`
        ,img: `${projectFolder}/images/`
        ,fonts: `${projectFolder}/fonts/`
        ,libs: `${projectFolder}/libs/`
        ,data: `${projectFolder}/data/`
    }
    ,src: {
        html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`]
        ,css: `${sourceFolder}/scss/style.scss`
        ,js: `${sourceFolder}/js/script.js`
        ,img: `${sourceFolder}/images/**/*.+(png|jpg|gif|ico|svg|webp)`
        ,fonts: `${sourceFolder}/fonts/*.ttf`
        ,fontsWoff: `${sourceFolder}/fonts/*.+(woff|woff2)`
        ,php: `${sourceFolder}/*.php`
        ,libs: `${sourceFolder}/libs/**/*.+(js|min.js|css|min.css)`
        ,data: `${sourceFolder}/data/**/*.json`
    }
    ,watch: {
        html: `${sourceFolder}/**/*.html`
        ,css: `${sourceFolder}/scss/**/*.scss`
        ,js: `${sourceFolder}/js/**/*.js`
        ,img: `${sourceFolder}/images/**/*.+(png|jpg|gif|ico|svg|webp)`
        ,php: `${sourceFolder}/*.php`
        ,libs: `${sourceFolder}/libs/*.+(js|min.js|css|min.css)`
        ,data: `${sourceFolder}/data/**/*.json`
    }
    ,clean: `./${projectFolder}/`
}

const { src, dest }    = require("gulp");
const gulp             = require("gulp");
const broswersync      = require("browser-sync").create();
const fileInclude      = require("gulp-file-include");
const del              = require("del");
const scss             = require("gulp-sass");
const autoprefixer     = require("gulp-autoprefixer");
const groupMedia       = require("gulp-group-css-media-queries");
const cleanCss         = require("gulp-clean-css");
const rename           = require("gulp-rename");
const uglify           = require("gulp-uglify-es").default;
const imagemin         = require("gulp-imagemin");
const webp             = require("gulp-webp");
const webpHTML         = require("gulp-webp-html");
const webpCSS          = require("gulp-webp-css");
const svgSprite        = require("gulp-svg-sprite");
const ttf2woff         = require("gulp-ttf2woff");
const ttf2woff2        = require("gulp-ttf2woff2");
const fonter           = require("gulp-fonter");
const scssResets       = require("scss-resets"); //! Css normalize 
const stripCssComments = require('gulp-strip-css-comments'); //! Удаляет коментарии в CSS

function browserSync(){
    broswersync.init({
        server: {
            baseDir: `./${projectFolder}/`
        }
        ,port: 3000
        ,notify: false
    })
}

function html(){
    return src(path.src.html)
           .pipe(fileInclude())
           .pipe(webpHTML())
           .pipe(dest(path.build.html))
           .pipe(broswersync.stream())
}

function php(){
    return src(path.src.php)
           .pipe(fileInclude())
           .pipe(dest(path.build.html))
           .pipe(broswersync.stream())
}
function libs(){
    return src(path.src.libs)
           .pipe(dest(path.build.libs))
           .pipe(broswersync.stream())
}
function data(){
    return src(path.src.data)
           .pipe(dest(path.build.data))
           .pipe(broswersync.stream())
}

function css() {
    return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: "expanded"
                    ,includePaths: scssResets.includePaths //! Добавляет normalize
                }))
            .pipe(
                stripCssComments({
                    preserve : false //! Удаляет все коментарии
                })
            )
            .pipe(groupMedia())
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ["last 5 versions"]
                    ,cascade: true
                })
            )
            .pipe(webpCSS())
            .pipe(dest(path.build.css))
            .pipe(
                cleanCss()
            )
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(dest(path.build.css))
            .pipe(broswersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileInclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            }))
        .pipe(dest(path.build.js))
        .pipe(broswersync.stream())
}

function images() {
    return src(path.src.img)
            .pipe(
                webp({
                    quality: 85
                })
            )
            .pipe(dest(path.build.img))
            .pipe(src(path.src.img))
            .pipe(
                imagemin({
                    progressive: true
                    ,svgoPlugins: [{ removeViewBox: false }]
                    ,interlaced: true
                    ,optimiztionLevel: 3 // 0 to 7
                })
            )
            .pipe(dest(path.build.img))
            .pipe(broswersync.stream())
}

function fontsStyle() {
    let file_content = fs.readFileSync(`${sourceFolder}/scss/fonts.scss`);
    let fontsWeight = {
        hairline: 100
        ,extralight: 200
        ,light: 300
        ,regular: 400
        ,medium: 500
        ,semibold: 600
        ,bold: 700
        ,extrabold: 800
        ,black: 900
    };
    if (file_content == '') {
        fs.writeFile(`${sourceFolder}/scss/fonts.scss`, '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.')
                        ,currentWeight = 400
                        ;
                    fontname = fontname[0];
                    for (let weight in fontsWeight){
                        if (fontname.toLowerCase().replace(" ", "").includes(weight)) currentWeight = fontsWeight[weight];
                    }
                    if (c_fontname != fontname) {
                        fs.appendFile(`${sourceFolder}/scss/fonts.scss`, `@include font("${fontname}", "${fontname}", ${currentWeight}, "normal");\r\n`, cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb(){
}

function watchFiles(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.php], php);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.libs], libs);
    gulp.watch([path.watch.data], data);
}

function clean(){
    return del(path.clean)
}

function fonts() {
    return src(path.src.fonts)
           .pipe(ttf2woff())
           .pipe(dest(path.build.fonts))
           .pipe(src(path.src.fonts))
           .pipe(ttf2woff2())
           .pipe(dest(path.build.fonts))
           .pipe(src(path.src.fontsWoff))
           .pipe(dest(path.build.fonts))
}

function importFonts(){
    return src(path.src.fontsWoff)
            .pipe(dest(path.build.fonts));
}

gulp.task("otf2ttf", function(){
    return src([`${sourceFolder}/fonts/*.otf`])
            .pipe(fonter({
                formats: ["ttf"]
            }))
        .pipe(dest(`${sourceFolder}/fonts/`))
})

gulp.task("svgSprite", function(){ //! Таск для свг спрайтов
    return gulp.src([`${sourceFolder}/iconsprite/*.svg`])
            .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../icons/icons.svg" // sprite file name
                        // ,example: true //! создаёт примеры
                    }
                }
            }))
            .pipe(dest(path.build.img))
})

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, php, libs, data), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.importFonts = importFonts;
exports.fontsStyle = fontsStyle;
exports.fonts      = fonts;
exports.images     = images;
exports.js         = js;
exports.css        = css;
exports.html       = html;
exports.php        = php;
exports.libs       = libs;
exports.data       = data;
exports.build      = build;
exports.watch      = watch;
exports.default    = watch;