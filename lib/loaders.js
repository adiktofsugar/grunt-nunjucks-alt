/*
 A pretty heavily modified FileSystemLoader
*/


var fs = require('fs');
var path = require('path');

var nunjucks = require("nunjucks");
var lib = require('nunjucks/src/lib');
var Loader = require('nunjucks/src/loader');

// Node <0.7.1 compatibility
var existsSync = fs.existsSync || path.existsSync;



var FileSystemLoader = Loader.extend({
    init: function(searchPaths, name, options) {
        this.pathsToNames = {};
        this.name = name;

        options = options || {};
        if (options.baseDir && !options.baseDir.match(/\/$/)) {
            options.baseDir += '/';
        }
        this.options = options;

        if (!name) {
            throw new Error("Must provide name");
        }

        if(searchPaths) {
            if (!lib.isArray(searchPaths)) {
                searchPaths = [searchPaths];
            }
            // For windows, convert to forward slashes
            this.searchPaths = searchPaths.map(path.normalize);
        }
        else {
            this.searchPaths = ['.'];
        }
    },

    // This is a bit complicated because of all the different ways of resolving a name...
    resolveFilepathToName: function (filepath) {
        var name = this.name;

        var resolvedName;

        // remove the baseDir part from the name resolution
        var baseDir = this.options.baseDir;
        if (baseDir) {
            if (filepath.substring(0, baseDir.length) == baseDir) {
                var oldfilepath = filepath;
                filepath = filepath.substring(baseDir.length);
            }
        }

        if (name instanceof RegExp) {
            var nameParts = filepath.match(name);
            if (!nameParts) {
                return false;
            }

            resolvedName = nameParts.slice(1).join("");

        } else if (name instanceof Function) {
            resolvedName = name(filepath);

        } else {
            throw new Error('"name" must be a RegExp or a Function.');
        }

        return resolvedName;
    },

    getSource: function(name) {
        //console.log("Custom file loader getSource ---");

        var fullpath = null;
        var searchPaths = this.searchPaths;

        searchPathsLoop:
        for(var i=0; i<searchPaths.length; i++) {
            var stats = fs.statSync(searchPaths[i]);
            if (!stats.isDirectory()) {
                continue;
            }

            var allPaths = fs.readdirSync(searchPaths[i]);
            
            for (var j =0; j<allPaths.length; j++) {
                var resolvedAllPath = path.join(searchPaths[i], allPaths[j]);
                //console.log("... resolving " + resolvedAllPath + " and checking for " + name);
                
                if (this.resolveFilepathToName(resolvedAllPath) == name) {
                    fullpath = resolvedAllPath;
                    break searchPathsLoop;
                }
            }
        }

        if(!fullpath) {
            return null;
        }

        this.pathsToNames[fullpath] = name;

        return { src: fs.readFileSync(fullpath, 'utf-8'),
                 path: fullpath };
    }
});


module.exports = {
    FileSystemLoader: FileSystemLoader
};
