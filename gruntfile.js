module.exports = function (grunt) {
    require('time-grunt')(grunt);
    
    
    // Project configuration.
    grunt.initConfig({
    
        // Metadata.
        meta: {
            version: '0.1.0'
        },
        banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://PROJECT_WEBSITE/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'YOUR_NAME; Licensed MIT */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['lib/FILE_NAME.js'],
                dest: 'dist/FILE_NAME.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/FILE_NAME.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['spec/**/*.js', 'lib/**/*.js', 'test/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        protractor: {
            options: {
                //configFile: "node_modules/protractor/example/conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            rsapp_chrome_sequential: {
                options: {
                    keepAlive: true,
                    configFile: "conf.js",
                    webdriverManagerUpdate: false,
                    args: {
                        
                        specs: [
                            './specs/indexPage.js',
                            './specs/indexPage1.js'
                           ]
                    }
                },
                run: {}
            },
    
            // Chrome - Rails Smoke Test WSS Parallel
            rsapp_chrome_parallel: {
                options: {
                    keepAlive: true,
                    configFile: "parallel_conf.js",
                    webdriverManagerUpdate: false,
                    args: {
                        
                    }
                },
                run: {}
            },
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            }
        }
    });
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.loadNpmTasks('grunt-protractor-runner');
    
    // Default task.
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
    
   
    
    /*
    grunt rsapp_seq_execution --target="chrome"
     */
    grunt.registerTask('rsapp_seq_execution', 'RS App - Sequential Execution', function (n) {
        var target = grunt.option('target');
            grunt.task.run('protractor:rsapp_chrome_sequential');
    });
    
    
    /*
    grunt rsapp_parallel_execution --target="chrome"
     */
    grunt.registerTask('rsapp_parallel_execution', 'RS App - Parallel Execution', function (n) {
        var target = grunt.option('target');
            grunt.task.run('protractor:rsapp_chrome_parallel');
    });
    
    
    
};