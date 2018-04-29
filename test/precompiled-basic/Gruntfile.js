const path = require('path');
module.exports = grunt => {
  grunt.loadTasks("../../tasks");
  grunt.initConfig({
    "nunjucks-alt": {
      test: {
        options: {
          precompile: true,
          name: /(.+?)\.html/,
          searchPaths: '../templates/',
          baseDir: '../templates/',
          data: {
          title: "awesome title",
          username: "supercoolguy"
          }
        },
        expand: true,
        cwd: '../templates',
        src: '**/*.html',
        dest: 'out/',
        rename: (dest, filepath) => path.join(dest, filepath.replace(/\.html$/, '.js'))
      }
    }
  });
  grunt.registerTask('default', 'nunjucks-alt');
}
