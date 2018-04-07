grunt-nunjucks-alt ...but why?
====

The grunt-nunjucks task is only for precompiled frontend JS nunjucks templates and I can't find any good, flexible nunjucks grunt tasks at the moment.

This task can compile your nunjucks templates into static files, or precompile (with the precompile option). I've done some *pretty* complicated things with the file system paths, but not too many weird things with nunjucks itself, so if I've forgotten something important, or if there's an option that would make it worlds easier to use, let me know. (via raising an issue or pull request)


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nunjucks-alt --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nunjucks-alt');
```

The "nunjucks-alt" task
======

### Overview
In your project's Gruntfile, add a section named `nunjucks-alt` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'nunjucks-alt': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```


## Usage

    "nunjucks-alt": {
        "html": {
            options: {
                name: new RegExp("src/pages/(.+?).html"),
                searchPaths: "src/pages/**/*.html"
            },
            expand: true,
            src: "src/pages/**/*.html",
            dest: "target/",
        },
        "js": {
            options: {
                precompile: true,
                name: function (filepath) {
                    filepath = filepath.replace("src/", "");
                    var filePathParts = filepath.split("/");

                    var moduleName = filePathParts.shift();
                    filePathParts.splice(0, 2); // to get rid of the "js/templates"
                    
                    var rest = filePathParts.join("/")
                        .replace(".html", "");
                    
                    // return something like "login/views/SuperView" for the template name
                    return moduleName + "/" + rest;
                },
                searchPaths: ['src/!(shared)/js/templates', 'target/**/templates']
            },
            expand: true,
            src: "src/!(shared)/js/templates/**/*.html",
            dest: "target/",

            rename: function (dest, filepath) {
                return path.join(dest, filepath.replace("src/", ""));
            }
        }
    }

## Options

### searchPaths (String|Array) Default: all directories from your current directory, except node_modules
This is parsed the same way as "src" or "dest". If not specified, it'll use the current directory.

### baseDir: (String) Default: (none)
This will effectively strip off the this string from the beginning of a filename before trying to
figure out the name.

#### Example:

  - filepath: `media/js/buttons/application.js`
  - baseDir: `media/js/`
  - template name: `buttons/application.js`

This is the same as making a name Regex like `/media\/js\/(.*)/`
EXCEPT that if you don't add a "/" to the end of the baseDir, it's auto appended.

### name: (Regex|Function) Default: `/.*/`
As a regex, name will take all of the patterns you give it and squash it into one
Remember a non capturing group is `(?:whatever)`

As a function, it will get passed the filepath of the file that's being processed, and whatever you return will
become the name of the template

### data: (Object|Function) Default: {}
This is the data that goes into each template. It's useless for precompiling, but probably the only reason you'd use
something like this otherwise.

### concat: (Boolean) Default: false, unless precompile is set to true, then it defaults to true too.
This will write all of your outputted template files into one file at "dest", instead of multiple files.

It does not have really cool concat features...for that, you may want to just write it to different files
and then use a concat task to put them together.

### precompile: (Boolean) Default: false
Also, you can precompile, which is the sole purpose of the grunt-nunjucks plugin. Precompiling is for using
nunjucks templates on the server side with a nunjucks library that doesn't have the compiler included.

To this end, the precompiler will convert all your templates into JS and output them in the given directory.

### env: (nunjucks.Environment) Default: null
This is only for precompiling, and is not normally used. It is the only way to get custom extensions into browser side
nunjucks if you precompile. (http://mozilla.github.io/nunjucks/api.html#environment)

This object must be a nunjucks.Environment object. I don't know what loader you'd use, though...
