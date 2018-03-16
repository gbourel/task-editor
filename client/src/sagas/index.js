import { fork } from 'redux-saga/effects'
import task from './task';
import files from './files';
import explorer from './explorer';
import svn from './svn';
import files_manager from './files_manager';

export default function* () {
    yield [
        fork(task),
        fork(files),
        fork(explorer),
        fork(svn),
        fork(files_manager)
    ]
}