module.exports = grunt => {
  grunt.loadTasks("../../tasks");
  grunt.initConfig({
    "nunjucks-alt": {
      test: {
        options: {
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
        dest: 'out/'
      }
    }
  });
  grunt.registerTask('default', 'nunjucks-alt');
}
