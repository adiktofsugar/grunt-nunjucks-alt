var fs = require("fs");
var path = require("path");


var resolveTemplateData = function (data) {
	if (!data) {
		return {};
	
	} else if (data instanceof Function) {
		return data();
	}
	return data;
};

var nunjucks = require("nunjucks");
var taskLoaders = require('../lib/loaders');


module.exports = function (grunt) {

	grunt.registerMultiTask("nunjucks-alt", "Compile all kinds of files through nunjucks", function () {

		var start = (new Date()).getTime();
		var time = function () {
			var now = (new Date()).getTime();
			var diff = now - start;
			return diff + "ms elapsed";
		};

		var options = this.options({
			baseDir: undefined,
			name: /(.*)/,
			data: {},
			precompile: false,
			env: null, // Special Environment for precompiled templates to run under
			concat: undefined
		});

		// optional default for concat.
		if (!options.concat) {
			options.concat = (options.precompile) ? true : false;
		}

		// set up search paths
		var searchPaths = [];
		if (!options.searchPaths) {
			grunt.log.warn("!!! Using auto search paths. Task will take much longer. !!!");
			
			searchPaths = grunt.file.expand({filter: 'isDirectory'}, ['**', '!node_modules/**']);
			grunt.log.debug("auto generated search paths", searchPaths);
		} else {
			searchPaths = grunt.file.expand(options.searchPaths);
		}

		grunt.log.debug("started task", time());

		// actually set up the nunjucks stuff
		var fileLoader = new taskLoaders.FileSystemLoader( searchPaths, options.name, {baseDir: options.baseDir} );
		var environment = new nunjucks.Environment([fileLoader]);

		grunt.log.debug("made environment", time());

		this.files.forEach(function (filePair) {
			// Only used with the concat option
			var concatContent = "";

			filePair.src.forEach(function (filepath) {

				grunt.log.debug("started file", filepath, time());

				// This should be a nunjucks template
				// I need to use the environment to render it by name

				var templateName = fileLoader.resolveFilepathToName(filepath);
				
				if (!templateName) {
					grunt.log.debug("file path can not be resolved to a name - " + filepath);
				} else {

					grunt.log.debug("templateName for " + filepath + " is " + templateName);

					var templateData = resolveTemplateData(options.data);
					grunt.log.debug("templateData", templateData);

					var templateContents;
					if (options.precompile) {
						templateContents = nunjucks.precompile(filepath, { 
							name: templateName,
							env: options.env });
					} else {
						templateContents = environment.render(templateName, templateData);
					}

					grunt.log.debug("rendered", time());

					if (options.concat) {
						concatContent += grunt.util.linefeed + templateContents;
					} else {
						// And now write it to a file
						grunt.file.write(filePair.dest, templateContents);
						grunt.log.ok("Wrote " + templateName + " as " + filePair.dest);
					}
				}
			});

			if (options.concat) {
				grunt.file.write(filePair.dest, concatContent);
				grunt.log.ok("Wrote "+ filePair.dest);
			}

		});


	});

};