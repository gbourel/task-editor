var fs = require('fs');
var path = require('path');
var generator = require('../libs/task/generator')
var config = require('../config')


function taskDataFile(task_subpath) {
    return path.join(config.path, task_subpath, config.task.data_file);
}


function loadSchema(task_type, callback) {
    var file = 'schema.json';
    var json_path = path.resolve('../tasks/', task_type, file);
    fs.readFile(
        json_path,
        { encoding: 'utf-8' },
        (err, content) => {
            if(err) callback(err);
            try {
                var schema = JSON.parse(content);
            } catch(e) {
                return callback(
                    new Error('Error reading schema ' + task_type + '/' + file + '. ' + e.message)
                );
            }
            callback(null, schema)
        }
    )
}


function loadTaskData(task_subpath, callback) {
    fs.readFile(
        taskDataFile(task_subpath),
        { encoding: 'utf-8' },
        (err, task_data) => {
            if(err) return callback(err);
            try {
                task_data = JSON.parse(task_data);
            } catch(e) {
                return callback(new Error('Error reading task data. ' + e.message));
            }
            callback(null, task_data);
        }
    )
}


function saveTaskData(task_subpath, task_data, callback) {
    fs.writeFile(
        taskDataFile(task_subpath),
        JSON.stringify(task_data, null, 2),
        callback
    );
}


module.exports = {

    create: (req, res) => {
        loadSchema(
            req.body.task_type,
            (err, schema) => {
                if(err) return res.status(400).send(err.message);
                var task_data = {
                    type: req.body.task_type,
                    data: null,
                    files: []
                }
                saveTaskData(
                    req.body.path,
                    task_data,
                    err => {
                        if(err) return res.status(400).send(err.message);
                        res.json({
                            schema,
                            data: null
                        });
                    }
                );
            }
        )
    },


    load: (req, res) => {
        loadTaskData(
            req.body.path,
            (err, task_data) => {
                if(err) return res.status(400).send(err.message);
                loadSchema(
                    task_data.type,
                    (err, schema) => {
                        if(err) return res.status(400).send(err.message);
                        res.json({
                            schema,
                            data: task_data.data
                        })
                    }
                )
            }
        )
    },


    save: (req, res) => {
        loadTaskData(
            req.body.path,
            (err, task_data) => {
                if(err) return res.status(400).send(err.message);
                var params = {
                    path: path.join(config.path, req.body.path),
                    data: req.body.data,
                    type: task_data.type,
                    files: task_data.files
                }
                generator.output(
                    params,
                    (err, task_data) => {
                        if(err) return res.status(400).send(err.message);
                        saveTaskData(
                            req.body.path,
                            task_data,
                            err => {
                                if(err) return res.status(400).send(err.message);
                                res.json({});
                            }
                        );
                    }
                )
            }
        )
    }

}