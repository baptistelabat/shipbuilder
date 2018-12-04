'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const exportSTL = require('threejs-export-stl');
const TEST = require('./js/test.js');
// const VTK = require('vtk.js');

function readInputFile(name) {
   var contents = fs.readFileSync(name);
   var json = JSON.parse(contents);
   return json;
}

function saveSTL( scene, name ){
  const stlString = exportSTL.fromMesh( scene, false );
  fs.writeFile(name, stlString, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

function main(filename){
	
	const json = readInputFile(filename);
	const mesh = TEST.Hull.buildHull(json);
	const outfilename=filename.split('.')[0] + '.stl';
	saveSTL(mesh, outfilename);
	return 0;
}


//main
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'buildHull example'
});
parser.addArgument(
  [ '-f', '--filename' ],
  {
    help: 'Name of the json file'
  }
);

var args = parser.parseArgs();
const filename=args.filename;
if(filename==null){
  console.log ('usage: nodejs test.js -f input.json');
  return 1;
}

main(filename);


