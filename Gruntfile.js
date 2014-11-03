module.exports = function(grunt) {
  // Loads each task referenced in the packages.json file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  // Initiate grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Tasks
    less: {
      standard: {
        options: {

        },
        files: [{
          expand: true,
          cwd: 'app/assets/less/',
          src: ['*.less'],
          dest: 'build/',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
          //diff: 'build/config/*.diff'
      },
      prefix: {
        expand: true,
        //flatten: true,
        src: 'build/*.css'
          //dest: 'tmp/css/prefixed/'
      }
    },
    cssmin: {
      main: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %> */'
        },
        expand: true,
        cwd: 'build',
        src: ['*.css', '!*.min.css'],
        dest: 'build/',
        ext: '.min.css'
      }
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'build/',
        src: '**',
        dest: 'dist',
        filter: 'isFile'
      }
    },
    clean: {
      before: ['build/assets', 'build/css', 'build/js', 'build/config'],
      after: ['tmp/**/*'],
      dist: ['dist/**/*'],
      deploy: ['deploy/**/*'],
      build: ['build/**/*']
    },

    jshint: {
      options: {
        ignores: ['app/assets/js/templates/templates.js']
      },
      files: ['app/assets/js/**/*.js', 'Gruntfile.js', 'bower.json', 'package.json']
    },
    handlebars: {
      options: {
        namespace: 'Hiof.Templates',
        processName: function(filePath) {
          return filePath.replace(/^vendor\/hiof-frontend\/app\/templates\//, '').replace(/\.hbs$/, '');
        }
      },
      all: {
        files: {
          "build/templates.js": ["vendor/hiof-frontend/app/templates/**/*.hbs"]
        }
      }
    },
    concat: {
      scripts: {
        src: [
          'vendor/pathjs/path.js',
          'vendor/handlebars/handlebars.js',
          'vendor/jquery.scrollTo/jquery.scrollTo.js',
          'build/templates.js',
          'vendor/hiof-frontend/app/assets/js/components/_component_articles.js',
        ],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        //compress: true,
        preserveComments: false,
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %> */'
      },
      main: {
        files: {
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.min.js']
        }
      }
    },
    versioning: {
      options: {
        cwd: 'build/',
        outputConfigDir: 'build/',
        namespace: 'hiof'
      },
      build: {
        files: [{
          assets: [{
            src: ['build/<%= pkg.name %>.min.js'],
            dest: 'build/<%= pkg.name %>.min.js'
          }],
          key: 'assets',
          dest: '',
          type: 'js',
          ext: '.min.js'
        }, {
          assets: [{
            src: 'build/<%= pkg.name %>.min.css',
            dest: 'build/<%= pkg.name %>.min.css'
          }],
          key: 'assets',
          dest: '',
          type: 'css',
          ext: '.min.css'
        }]
      },
      deploy: {
        options: {
          output: 'php',
          outputConfigDir: 'build/',
        },
        files: [{
            assets: [{
              src: ['build/<%= pkg.name %>.min.js'],
              dest: 'build/<%= pkg.name %>.min.js'
            }],
            key: 'assets',
            dest: '',
            type: 'js',
            ext: '.min.js'
          },

          {
            assets: [{
              src: 'build/<%= pkg.name %>.min.css',
              dest: 'build/<%= pkg.name %>.css'
            }],
            key: 'assets',
            dest: '',
            type: 'css',
            ext: '.min.css'
          }
        ]
      }
    },
    secret: grunt.file.readJSON('secret.json'),
    sftp: {
      stage: {
        files: {
          "./": "dist/**"
        },
        options: {
          path: '<%= secret.stage.path %>',
          srcBasePath: "dist/",
          host: '<%= secret.stage.host %>',
          username: '<%= secret.stage.username %>',
          password: '<%= secret.stage.password %>',
          //privateKey: grunt.file.read('id_rsa'),
          //passphrase: '<%= secret.passphrase %>',
          showProgress: true,
          createDirectories: true,
          directoryPermissions: parseInt(755, 8)
        }
      },
      prod: {
        files: {
          "./": "dist/**"
        },
        options: {
          path: '<%= secret.prod.path %>',
          srcBasePath: "dist/",
          host: '<%= secret.prod.host %>',
          username: '<%= secret.prod.username %>',
          password: '<%= secret.prod.password %>',
          //privateKey: grunt.file.read('id_rsa'),
          //passphrase: '<%= secret.passphrase %>',
          showProgress: true,
          createDirectories: true,
          directoryPermissions: parseInt(755, 8)
        }
      }
    }
    //watch: {
    //  hbs: {
    //    files: ['app/templates/**/*.hbs'],
    //    tasks: ['handlebars', 'copy:jstemplates'],
    //    options: {
    //      livereload: true,
    //    },
    //  },
    //  js: {
    //    files: ['app/assets/js/**/*.js', 'app/assets/js/**/*.json'],
    //    tasks: ['jshint', 'concat:scripts', 'versioning:build'],
    //    options: {
    //      livereload: true,
    //    },
    //  },
    //}

  });

  grunt.registerTask('subtaskJs', ['jshint', 'concat:scripts', 'uglify']);
  grunt.registerTask('subtaskCss', ['less', 'autoprefixer', 'cssmin']);

  grunt.registerTask('build', ['clean:build', 'clean:dist', 'subtaskJs', 'subtaskCss', 'versioning:build']);
  grunt.registerTask('deploy', ['clean:build', 'clean:dist', 'subtaskJs', 'subtaskCss', 'versioning:deploy', 'copy:dist']);



  grunt.registerTask('deploy-staging2', ['deploy', 'sftp:stage']);
  grunt.registerTask('deploy-www2', ['deploy', 'sftp:prod']);

};