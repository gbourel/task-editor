var path = require('path');

module.exports = function(tpl_path) {


    var filename = 'substitution.json';
    var tree = require(path.resolve(tpl_path, filename));
    var res = [];

    /*
        res: [
            {
                json_path: [],
                // selector of file are optional
                selector: '...',
                file: '...'
            }
        ]

    */

    function walk(node, json_path, selector) {
        node.map(item => {
            var res_item = {
                json_path: json_path.slice(),
                selector
            }

            var push = false;

            if(item.jsonSubPath) {
                res_item.json_path = res_item.json_path.concat(item.jsonSubPath.split('.'));
            }

            if(item.selector) {
                push = true;
                res_item.selector += (res_item.selector == '' ? '' : ' ') + item.selector;
            }

            if(item.file) {
                push = true;
                res_item.file = item.file;
            }

            if('children' in item) {
                walk(item.children, res_item.json_path, res_item.selector);
                push = false;
            } else {
                push = true;
            }

            if(push) {
                res.push(res_item);
            }
        })
    }

    walk(tree, [], '');

    return res;

}