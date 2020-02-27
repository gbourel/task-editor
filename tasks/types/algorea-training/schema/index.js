module.exports = {
    title: 'Task',
    type: 'object',
    description: 'This editor allows you to edit the various aspects of a task. All the data in this editor is organized as a JSON object, whose properties represent each task part. Some properties are optional, and are hidden by default in the editor; to display them, click "Object properties" on each tree item to add these optional properties.',
    definitions: {
        fileDescr: {
            type: 'string',
            format: 'url',
            options: {
                upload: true
            }
        },
        compilationDescr: require('./compilationDescr.js'),
        executionParams: require('./executionParams'),
        compileAndRunParams: {
            type: 'object',
            description: 'Parameters for a compilation and an execution.',
            properties: {
                compilationDescr: {
                    $ref: '#/definitions/compilationDescr'
                },
                compilationExecution: {
                    $ref: '#/definitions/executionParams'
                },
                runExecution: {
                    $ref: '#/definitions/executionParams'
                }
            },
            required: ['compilationDescr', 'compilationExecution', 'runExecution']
        },
        filename: {
            type: 'string',
            description: 'A valid file name.',
            pattern: '^\\w[\\w.~/-]+$'
        }
    },
    properties: {
        test: {
            type: 'grid',
            watch: {
                sceneContext: 'root.gridInfos.contextType'
            }
        },
        title: {
            type: 'string',
            title: 'Title of the window',
            generator: [
                {
                    output: {
                        inject: {
                            template: 'index.html',
                            selector: 'title'
                        }
                    }
                }
            ]
        },
        icon: {
            type: "string",
            description: 'PNG image file.',
            title: 'Icon',
            format: "url",
            options: {
                upload: true,
                editor: true
            },
            generator: [
                {
                    output: {
                        copy: "icon.png"
                    }
                }
            ]
        },
        windowLanguage: {
            type: 'string',
            description: 'Language for the window.',
            enum: ['fr', 'en', 'de'],
            generator: [
                {
                    output: {
                        inject: {
                            template: 'index.html',
                            selector: '$stringsLanguage'
                        }
                    }
                }
            ]
        },
        AlgoreaTrainingTaskMetaData: require('./AlgoreaTrainingTaskMetaData.js'),
        PEMTaskMetaData: require('./PEMTaskMetaData.js'),
        task: require('./task.js'),
        gridInfos: require('./gridInfos.js'),
        difficulties: require('./difficulties.js'),
        displayHelper: require('./displayHelper.js')
    },
    required: ['test', 'title', 'icon', 'windowLanguage', 'AlgoreaTrainingTaskMetaData', 'PEMTaskMetaData', 'task', 'gridInfos', 'difficulties', 'displayHelper'],
    generator: [
        {
            input: {
                collector: 'collectors/subTask.gridInfos.js'
            },
            output: {
                inject: {
                    template: 'task.js',
                    selector: '$subTask.gridInfos'
                }
            }
        },
        {
            input: {
                collector: 'collectors/subTask.data.js'
            },
            output: {
                inject: {
                    template: 'task.js',
                    selector: '$subTaskData'
                }
            }
        },
        {
            input: {
                collector: 'collectors/image_files.js',
                keepArray: true
            },
            output: {
                render: {
                    template: 'images.html'
                },
                inject: {
                    template: 'index.html',
                    selector: '#images-preload'
                }
            }
        }
    ]
};