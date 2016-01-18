'use strict';

module.exports = function(grunt)
{
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        sass:
        {
            options:
            {
                outputStyle: 'compressed',
                precision: 10,
                sourceMap: false,
            },
            release:
            {
                files:
                {
                    'main.min.css': 'source/scss/main.scss'
                }
            }
        },
        concat:
        {
            release:
            {
                src: ['node_modules/normalize.css/normalize.css', 'main.min.css'],
                dest: 'main.min.css',
            },
        },
        postcss:
        {
            options:
            {
                map: false,
                processors: [
                    require('autoprefixer')(
                    {
                        browsers: ['last 2 versions']
                    })
                ]
            },
            release:
            {
                src: 'main.min.css',
                dest: 'main.min.css'
            }
        },
        csscomb:
        {
            release:
            {
                src: 'main.min.css',
                dest: 'main.min.css'
            },
        },
        cssmin:
        {
            options:
            {
                keepSpecialComments: 1,
                roundingPrecision: -1,
                aggressiveMerging: true,
                advanced: true,
            },
            release:
            {
                src: 'main.min.css',
                dest: 'main.min.css'
            },
        },
        browserify:
        {
            release:
            {
                files:
                {
                    'main.min.js': ['source/js/main.js']
                },
                options:
                {}
            }
        },
        uglify:
        {
            options:
            {
                mangle: false,
            },
            dev:
            {
                options:
                {
                    compress:
                    {
                        drop_console: false
                    },
                },
                files:
                {
                    'main.min.js': ['source/js/lib/colr.min.js','source/js/lib/ngclipboard.min.js', 'main.min.js'],
                },
            },
            release:
            {
                options:
                {
                    compress:
                    {
                        drop_console: true
                    },
                },
                files:
                {
                    'main.min.js': ['source/js/lib/colr.min.js','source/js/lib/ngclipboard.min.js', 'main.min.js'],
                },
            },
        },
        jade:
        {
            dev:
            {
                options:
                {
                    data:
                    {
                        hexcodes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F'],
                        dev: true,
                    },
                },
                files:
                {
                    "index.html": "source/templates/index.jade"
                },
            },
            release:
            {
                options:
                {
                    data:
                    {
                        hexcodes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F'],
                        dev: false,
                    },
                },
                files:
                {
                    "index.html": "source/templates/index.jade"
                },
            },
        },
        htmlmin:
        {
            release:
            {
                options:
                {
                    caseSensitive: true,
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    ignoreCustomComments: [],
                    keepClosingSlash: false,
                    minifyCSS: true,
                    minifyJS: true,
                    minifyURLs: true,
                    removeAttributeQuotes: false,
                    removeCDATASectionsFromCDATA: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeEmptyElements: false,
                    removeIgnored: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                files:
                {
                    'index.html': 'index.html',
                }
            }
        },
        jsonlint:
        {
            themelib:
            {
                src: ['source/json/themelib.json']
            }
        },
        watch:
        {
            options:
            {
                spawn: false,
                interrupt: true,
                event: ['changed'],
                livereload:
                {
                    host: 'localhost',
                    port: 35729,
                },
            },
            css:
            {
                files: ['source/scss/**/*.scss'],
                tasks: ['sass', 'concat', 'postcss', 'cssmin'],
            },
            slim:
            {
                files: ['source/templates/**/*.jade'],
                tasks: ['jade:dev', 'htmlmin'],
            },
            js:
            {
                files: ['source/js/**/*.js'],
                tasks: ['browserify', 'uglify:dev'],
            },
            json:
            {
                files: ['source/json/**/*.json'],
                tasks: ['jsonlint', 'jade:dev', 'htmlmin'],
            },
            gruntfile:
            {
                files: ['gruntfile.js', 'source/json/**/*.json'],
                tasks: [],
                options:
                {
                    reload: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['sass', 'concat', 'postcss', 'cssmin', 'jade:release', 'htmlmin', 'browserify', 'uglify:release']);
};
