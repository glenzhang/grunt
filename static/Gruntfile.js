// grunt.initConfig   // 定义模块的参数配置
// grunt.loadNpmTasks // 引用声明，完成任务所需的模块加载
// grunt.registerTask // 定义具体的任务

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*\n Minified by Uglify <%=grunt.template.today("yyyy-MM-dd-HH:mm:ss")%>*/\n'
            },

            minify: {
                expand: true,
                cwd: '<%=pkg.client.root%>/js/', //待压缩目录
                src: ['**/*.js', '!**/*.min.js'], //过滤待压缩文件
                dest: '<%=pkg.client.root%>/js/',
                ext: '.build.min.js'
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%=pkg.client.root%>/css',
                    dest: '<%=pkg.client.root%>/css',
                    src: ['*.tosprite.scss'],
                    ext: '.sprite.sass.css'
                }, {
                    expand: true,
                    cwd: '<%=pkg.client.root%>/css',
                    dest: '<%=pkg.client.root%>/css',
                    src: ['*.scss', '!*.tosprite.scss'],
                    ext: '.sass.css'
                }]
            }
        },

        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: ['publish/**/*.min.js', '!publish/**/full.min.js'],
                dest: 'publish/js/full.min.js'
            },
            css: {
                src: ['publish/**/*.min.css', '!publish/**/full.min.css'],
                dest: 'publish/css/full.min.css'
            }
        },

        sprite: {
            options: {
                // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
                imagepath: '<%=pkg.client.root%>/images/slice/',
                // 映射CSS中背景路径，支持函数和数组，默认为 null
                imagepath_map: null,
                // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
                spritedest: '<%=pkg.client.root%>/images/sprited/',
                // 替换后的背景路径，默认 ../images/
                spritepath: '../images/sprited/',
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 2,
                // 是否使用 image-set 作为2x图片实现，默认不使用
                useimageset: false,
                // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
                newsprite: false,
                // 给雪碧图追加时间戳，默认不追加
                spritestamp: true,
                // 在CSS文件末尾追加时间戳，默认不追加
                cssstamp: true,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree',
                // 默认使用`pngsmith`图像处理引擎
                engine: 'pngsmith'
            },

            autoSprite: {
                files: [{
                    expand: true,
                    cwd: '<%=pkg.client.root%>/css/',
                    src: ['*.sprite.css','*.sprite.sass.css'],
                    dest: '<%=pkg.client.root%>/css/',
                    ext: '.sprited.build.css'
                }]
            }
        },

        clean: {
            build: {
                src: ['.sass-cache/',
                    '<%=pkg.client.root%>/css/*.{sass,build}.css',
                    '<%=pkg.client.root%>/images/sprited',
                    '<%=pkg.client.root%>/js/*.build.min.js'
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-css-sprite');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // task(s)
    // 压缩js
    grunt.registerTask('jsminify', ['uglify']);
    // sass编译css
    grunt.registerTask('sassc', ['sass']);
    // css sprite
    grunt.registerTask('isprite', ['sprite']);
    // 清除编译目录
    grunt.registerTask('cleanup', ['clean']);

    grunt.registerTask('cssop', ['sass', 'sprite']);
};