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
                    dest: "docs",
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
                    'docs/assets/css/style.css': '.temp.scss'
                }
            }
        },

        coffee: {
            compile: {
                files: {
                    'docs/assets/js/script.js': [
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
                    open: true,
                    port: 5683,
                    base: "docs"
                }
            }
        },

        /* Copy assets to docs folder
         ========================================================================== */

        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: 'components/',
                    src: ['assets/**'],
                    dest: 'docs/'
                }, {
                    expand: true,
                    cwd: 'node_modules/uikit/dist/',
                    src: ['**'],
                    dest: 'docs/lib/uikit/'
                }],
            },
        },

        /* Copy assets to docs folder
         ========================================================================== */

        clean: {
            reset: ["docs"],
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