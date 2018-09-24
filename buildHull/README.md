This module generates JSON cuts from an STL hull: given an STL file, it
generates a JSON file containing a list of points on that hull. That JSON can
then be used to build splines for interpolation (eg. find all the points lying
on a z = cst plane).

To generate the JSON files from the STL files in this repository, run:

~~~~{.bash}
make
~~~~

Otherwise, if you already have an STL file (or an OBJ, PLY or VTK file), use:

~~~~{.bash}
docker run --rm -it -v $(pwd):/app -w /app -u $(id -u):$(id -g) stl2json -f mystlfile.stl -o output.json -v --nx 10 --ny 10 -d y- --offset 0.1
~~~~
