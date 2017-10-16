// module.exports = function(grunt) {
//     // 项目配置
//     grunt.initConfig({
//         pkg: grunt.file.readJSON('package.json'),
//         uglify: {
//             options: {
//                 banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//             },
//             build: {
//                 src: 'src/js/<%=pkg.file %>.js',
//                 dest: 'dest/js/<%= pkg.file %>.min.js'
//             }
//         }
//     });
//     // 加载提供"uglify"任务的插件
//     grunt.loadNpmTasks('grunt-contrib-uglify');
//     // 默认任务
//     grunt.registerTask('default', ['uglify']);
// }

// module.exports = function(grunt) {

//     //项目配置
//     grunt.initConfig({
//         pkg: grunt.file.readJSON("package.json"),
//         concat: {
//             options: {
//                 separator: ";"
//             },
//             dist: {
//                 src: ['src/js/flyer.js', 'src/js/flyer.ui.comboBox.js', 'src/js/flyer.ui.js', 'src/js/flyer.ui.page.js'],
//                 dest: 'dest/js/flyer.all.js'
//             }
//         }
//     });

//     grunt.loadNpmTasks('grunt-contrib-concat');
//     grunt.registerTask('default', ['concat']);
// }

module.exports = function(grunt) {

    //项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: ";"
            },
            dist: {
                src: ['src/js/flyer.js', 'src/js/flyer.ui.comboBox.js', 'src/js/flyer.ui.js', 'src/js/flyer.ui.page.js'],
                dest: 'dest/js/flyer.all.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: "dest/js/flyer.all.js",
                dest: "dest/js/flyer.all.min.js"
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/sass/',
                    src: ['*.scss'],
                    dest: 'src/css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            css: {
                files: "src/sass/*.scss",
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'watch']);
    grunt.registerTask("test", function() {
        console.log("path is :" + grunt.config.get('watch.css.files'));
    });
}

// module.exports = function(grunt) {

//     //项目配置
//     grunt.initConfig({
//         pkg: grunt.file.readJSON("package.json"),
//         concat: {
//             options: {
//                 separator: ";"
//             },
//             dist: {
//                 src: ['src/js/flyer.js', 'src/js/flyer.ui.comboBox.js', 'src/js/flyer.ui.js', 'src/js/flyer.ui.page.js'],
//                 dest: 'dest/js/flyer.all.js'
//             }
//         },
//         uglify: {
//             options: {
//                 banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//             },
//             build: {
//                 src: "dest/js/flyer.all.js",
//                 dest: "dest/js/flyer.all.min.js"
//             }
//         },
//         sass: {
//             dist: {
//                 files: [{
//                     expand: true,
//                     cwd: 'src/sass/',
//                     src: ['*.scss'],
//                     dest: 'src/css/',
//                     ext: '.css'
//                 }]
//             }
//         }
//     });

//     grunt.loadNpmTasks('grunt-contrib-concat');
//     grunt.loadNpmTasks('grunt-contrib-uglify');
//     grunt.loadNpmTasks('grunt-contrib-sass');

//     grunt.registerTask('default', ['concat', 'uglify', 'sass']);
//     grunt.registerTask("test", function() {
//         console.log("path is :" + grunt.config.get('watch.css.files'));
//     });
// }