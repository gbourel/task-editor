var path = require('path')
var fs = require('fs')

module.exports = function(tpl_path, task_path) {


    var dafaults = {
        template: 'index.html'
    }

    var handlers = {
        '.html': require('./html'),
        '.js': require('./js')
    }

    var templates = {};

    function create(ext, content) {
        if(ext in handlers) {
            return handlers[ext](content)
        }
        throw new Error('Template handler not found for extension ' + ext);
    }


    function get(file) {
        file = file || dafaults.template;
        var ext = path.extname(file);
        if(!templates[file]) {
            var content = fs.readFileSync(
                path.resolve(tpl_path, file),
                { encoding: 'utf-8' }
            )
            templates[file] = create(ext, content);
        }
        return templates[file];
    }


    function parseSelector(full_selector) {
        var file = full_selector.trim().match(/^\[.+\]/);
        if(file) {
            file = file.toString();

            var selector = full_selector.substr(file.length);
            file = file.replace(/\[|\]/g, '');
        } else {
            var selector = full_selector;
        }

        var variable = null;
        var tmp = selector.split('$');
        if(tmp.length > 2) {
            throw new Error('Multiple variables in selector: '.full_selector);
        } if(tmp.length == 2) {
            html = tmp[0];
            variable = tmp[1];
        } else {
            var html = selector;
        }

        return {
            file,
            selector: {
                html,
                variable
            }
        }
    }


    return {

        inject: function(full_selector, value) {
            var p = parseSelector(full_selector);
            get(p.file).inject(p.selector, value);
        },


        save: function() {
            Object.keys(templates).map(filename => {
                fs.writeFileSync(
                    path.resolve(task_path, filename),
                    templates[filename].content()
                );
            })
        }
    }

}