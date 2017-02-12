module.exports = function (grunt) {
    grunt.initConfig({

        pug: {
            html: {
                options: {
                    client: false,
                    pretty: "    ",
                    basedir: "components",
                    data: {
                        debug: false
                    }
                },
                files: [{
                    src: "pages/**/*.pug",
                    dest: "build",
                    expand: true,
                    ext: ".html"
                }]
            }
        },

        /**
         * Concatenate
         */

        concat: {
            sass: {
                src: [
                    'components/modules/**/*.scss'
                ],
                dest: '.temp.scss'
            }
        },

        /**
         * Compile SASS
         */

        sass: {
            css: {
                options: {
                    style: "compact",
                    sourcemap: "none"
                },
                files: {
                    'build/assets/css/style.css': '.temp.scss'
                }
            }
        },

        coffee: {
            compile: {
                files: {
                    'build/assets/js/script.js': [
                        'components/modules/**/*.coffee',
                        'components/coffee/**/*.coffee'
                    ]
                }
            }
        },

        /* Server
         ========================================================================== */

        connect: {
            server: {
                options: {
                    port: 5683,
                    base: "build"
                }
            }
        },

        /* Copy assets to build folder
         ========================================================================== */

        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: 'components/',
                    src: ['assets/**'],
                    dest: 'build/'
                }, {
                    expand: true,
                    cwd: 'node_modules/',
                    src: ['uikit/**', 'jquery/**', 'lodash/**', 'vue/**', 'moment/**'],
                    dest: 'build/lib/'
                }],
            },
        },

        /* Copy assets to build folder
         ========================================================================== */

        clean: {
            reset: ["build"],
            cache: [".sass-cache", ".temp.scss"]
        },

        /* Watcher
         ========================================================================== */

        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            scripts: {
                files: [
                    'pages/**/*.pug',
                    'components/**/*.pug',
                    "components/**/*.coffee",
                    "components/**/*.scss"
                ],
                tasks: ["pug", "concat", "sass:css", "coffee"]
            }
        }
    }); //initConfig

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("default", ['clean', 'pug', 'coffee', 'concat', 'sass', 'copy', 'connect', 'watch']);
    grunt.registerTask("build", ['clean', 'pug', 'coffee', 'concat', 'sass', 'copy', 'clean:cache']);

}; // wrapper