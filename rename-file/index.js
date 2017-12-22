const fs = require('fs');
const rd = require('rd');
const upath = require('upath');

const param = process.argv[2];
const path = param ? param : '';

let objArr = [];
let count = 0;

let initFiles = () => {
  rd.each(path, (f, s, next) => {
    renameFile(f);
    count++;
    next();
  }, function (err) {
    if (err) throw err;
  });
}

let renameFile = (_file) => {
  if (/(.png$)|(.jpg$)/.test(_file)) {
    let file = getFileInfo(_file);
    let newName = getFileNewName(file.filename);
    
    fs.rename(_file, file.path + '/' + newName + '.jpg', (_err) => {
      if (_err) {
        console.log(_err);
        return;
      } else {
        console.log(file.path + '/' + newName + '.jpg');
      }
    })
  }
}

let getFileNewName = (_name) => {
  let result = '';
  
  objArr.forEach((value) => {
    if (_name.indexOf(value.cname) > -1) {
      result = value.ename;
      return;
    }
  });
  return result;
}

let getFileInfo = (_path) => {
  let arr = upath.normalize(_path).split('/');
  let arrLen = arr.length;
  let filename = arr.pop();
  return {
    path: arr.join('/'),
    filename: filename
  };
}

let initObjArr = () => {
  fs.readFile('herolist.json', (_err, _data) => {
    if (_err) {
      console.log(_err);
      return;
    } else {
      objArr = JSON.parse(_data);
      initFiles();
    }
  })
}

let init = () => {
  initObjArr();
}

init();