module.exports = grunt => {
  grunt.loadTasks("../../tasks");
  grunt.initConfig({
    "nunjucks-alt": {
      test: {
        options: {
          searchPaths: '../templates',
          baseDir: '../templates/',
          name: /(.+?)\.html/,
          data: {
            title: "awesome title",
            username: "supercoolguy"
          },
          beforeEnv: env => {
            env.addFilter('shorten', (str, count=10) => str.slice(0, count))
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
