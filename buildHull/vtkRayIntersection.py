# pylint: disable-msg=C0103
"""
This module takes an STL file(or OBJ, PLY or VTK) and makes "cuts" on x = cst
planes.
"""

import os
import json
import vtk
import numpy as np


def get_filename_extension(filename):
    """
    Returns the extention of the file(without the dot).
    """
    return os.path.splitext(filename)[1][1:]


def createMeshGridAsAMatrix(vx=[0, 1], vy=[2, 3], vz=[4, 5, 6]):
    """
    Returns a numpy array containing 3 columns
    (one for X, one for Y & one for Z).
    """
    x, y, z = np.meshgrid(vx, vy, vz)
    n = np.size(x)
    x = np.array([np.reshape(x, n)]).T
    y = np.array([np.reshape(y, n)]).T
    z = np.array([np.reshape(z, n)]).T
    XYZ = np.concatenate((x, y, z), 1)
    return XYZ


def read_3D_file(filename):
    """
    Read a mesh from an STL, OBJ, PLY or VTK file.
    """
    def _read(filename, reader, getVtkReader):
        reader.SetFileName(filename)
        reader.Update()
        if getVtkReader:
            return reader
        return reader.GetOutput()
    if not os.path.exists(filename):
        raise IOError('Input file "{0}" was not found'.format(filename))
    filenameLower = filename.lower()
    getVtkReader=False
    extension = get_filename_extension(filenameLower)
    if extension == 'stl':
        reader = vtk.vtkSTLReader()
        sm = _read(filename, reader, getVtkReader)
    elif extension == 'obj':
        reader = vtk.vtkOBJReader()
        sm = _read(filename, reader, getVtkReader)
    elif extension == 'ply':
        reader = vtk.vtkPLYReader()
        sm = _read(filename, reader, getVtkReader)
    elif extension == 'vtk':
        reader = vtk.vtkGenericDataObjectReader()
        reader.SetFileName(filename)
        reader.Update()
        if reader.IsFilePolyData():
            sm = reader.GetPolyDataOutput()
        else:
            raise Exception
    else:
        raise Exception('Unknown file format : {0}'.format(extension))
    return sm


class Slicer():
    def __init__(self, mesh, verbose=False):
        self.cpd = vtk.vtkCleanPolyData()
        self.cpd.ConvertLinesToPointsOn()
        self.cpd.ConvertPolysToLinesOn()
        self.cpd.SetInputData(mesh)

        self.surfaceN = vtk.vtkPolyDataNormals()
        self.surfaceN.SetInputConnection(self.cpd.GetOutputPort())

        self.bounds = mesh.GetBounds()
        self.verbose = verbose
        if verbose:
            print("Bounds {0}".format(self.bounds))

    def cut(self):
        # Create a plane to cut
        plane = vtk.vtkPlane()
        plane.SetOrigin(0, 0, 0)
        plane.SetNormal(0, 1, 0)
        # Create cutter
        clipper = vtk.vtkClipPolyData()
        clipper.SetInputConnection(self.surfaceN.GetOutputPort())
        clipper.SetClipFunction(plane)
        clipper.SetValue(0.0)
        clipper.Update()
        self.surfaceN = clipper

    def add(self, origin = 0.0, isOriginRelative=False, color='k', linestyle='-'):
        # Plane used to cut
        plane = vtk.vtkPlane()
        if isOriginRelative:
            xmin, xmax, _, _, _, _ = self.bounds
            origin = origin * (xmax - xmin) + xmin
        if self.verbose:
            print(origin)
        plane.SetOrigin([origin, 0.0, 0.0])
        plane.SetNormal([1.0, 0.0, 0.0])

        # Cut a slice out of the surface and convert it to a PolyData object
        cutEdges = vtk.vtkCutter()
        cutEdges.SetInputConnection(self.surfaceN.GetOutputPort())
        cutEdges.SetCutFunction(plane)
        cutEdges.GenerateTrianglesOff()
        cutEdges.GenerateCutScalarsOff()
        cutEdges.SetValue(0, 0.0)
        cutStrips = vtk.vtkStripper()
        cutStrips.SetInputConnection(cutEdges.GetOutputPort())
        cutStrips.Update()
        points = cutStrips.GetOutput().GetPoints()
        for i in range(points.GetNumberOfPoints()):
            pt = points.GetPoint(i)
            points.SetPoint(i, (0.0, pt[1], pt[2]))
        cutStrips.GetOutput().SetPoints(points)
        lines = cutStrips.GetOutput().GetLines()
        points = cutStrips.GetOutput().GetPoints()

        cutPoly = vtk.vtkPolyData()
        cutPoly.SetPoints(points)
        cutPoly.SetLines(lines)

        resPoly = cutPoly
        cells = resPoly.GetLines()
        cells.InitTraversal()
        idList = vtk.vtkIdList()
        while cells.GetNextCell(idList):
            n = idList.GetNumberOfIds()
            x, y = [0.0] * n, [0.0] * n
            for i in range(n):
                idPoint = idList.GetId(i)
                pt = resPoly.GetPoint(idPoint)
                x[i], y[i] = pt[1], pt[2]
            self.ax1.plot(x, y, color=color, linestyle=linestyle)

    def get_slice_bounds(self, origin = 0.0, isOriginRelative=False):
        # Plane used to cut
        plane = vtk.vtkPlane()
        if isOriginRelative:
            xmin, xmax, _, _, _, _ = self.bounds
            origin = origin * (xmax - xmin) + xmin
        if self.verbose:
            print(origin)
        plane.SetOrigin([origin, 0.0, 0.0])
        plane.SetNormal([1.0, 0.0, 0.0])

        # Cut a slice out of the surface and convert it to a PolyData object
        cutEdges = vtk.vtkCutter()
        cutEdges.SetInputConnection(self.surfaceN.GetOutputPort())
        cutEdges.SetCutFunction(plane)
        cutEdges.GenerateTrianglesOff()
        cutEdges.GenerateCutScalarsOff()
        cutEdges.SetValue(0, 0.0)
        cutStrips = vtk.vtkStripper()
        cutStrips.SetInputConnection(cutEdges.GetOutputPort())
        cutStrips.Update()
        points = cutStrips.GetOutput().GetPoints()
        for i in range(points.GetNumberOfPoints()):
            pt = points.GetPoint(i)
            points.SetPoint(i, (0.0, pt[1], pt[2]))
        cutStrips.GetOutput().SetPoints(points)
        lines = cutStrips.GetOutput().GetLines()
        points = cutStrips.GetOutput().GetPoints()

        cutPoly = vtk.vtkPolyData()
        cutPoly.SetPoints(points)
        cutPoly.SetLines(lines)
        bounds = np.array(cutPoly.GetBounds())
        return bounds


class RayIntersection():
    def __init__(self, mesh, tolerance = .001):
        self.bspTree = vtk.vtkModifiedBSPTree()
        self.bspTree.SetDataSet(mesh)
        self.bspTree.BuildLocator()
        self.tolerance = tolerance

    def see(self, startPoints, endPoints):
        x = [0.0, 0.0, 0.0]   # The coordinate of the intersection
        # Parametric coordinate of intersection (0 (corresponding to p1) to 1
        # (corresponding to p2))
        t = vtk.mutable(0)
        subId = vtk.mutable(0)
        pcoords = [0.0, 0.0, 0.0]
        intersection_points = np.zeros(endPoints.shape)
        intersectionId = []
        for i in range(endPoints.shape[0]):
            startPoint = startPoints[i, :]
            endPoint = endPoints[i, :]
            # print(i, startPoint, endPoint)
            iD = self.bspTree.IntersectWithLine(
                startPoint, endPoint, self.tolerance, t, x, pcoords, subId)
            intersection_points[i, :] = x
            if iD == 1:
                intersectionId.append(i)
        intersection_points = intersection_points[intersectionId, :]
        return intersection_points


def slice2json(points_on_slice, x_coordinate_of_slice):
    """
    Given the list of intersection points(points on slice) and the
    position of the slice on the x-axis, returs a JSON object suitable
    for serialization.
    """
    zs = []
    ys = []
    for xyz in points_on_slice:
        zs.append(xyz[2])
        ys.append(xyz[1])
    if zs:
        zmin = np.min(zs)
        zmax = np.max(zs)
    else:
        zmin = -999
        zmax = 999
    return {"x": x_coordinate_of_slice, "y": ys, "zmin": zmin,
            "zmax": zmax, "z": zs}


def extract_n_points_on_slices_of_a_mesh(filename='carene_fremm.stl', **kwargs):
    intersection_direction = kwargs.get('intersection_direction', 'z-')
    offset = kwargs.get('offset', 1e-5)
    nx = kwargs.get('nx', 10)
    ny = kwargs.get('ny', 20)
    lx = kwargs.get('lx', [])
    print('lx', lx)

    outputJsonFilename = kwargs.get('outputJsonFilename', None)


    mesh = read_3D_file(filename)
    slicer = Slicer(mesh)

    bounds = slicer.bounds

    if lx:
        vx = lx
    else:
        vx = np.linspace(bounds[0], bounds[1], nx)
        vx[0] += offset
        vx[-1] -= offset

    ri = RayIntersection(mesh)
    intersection_points_all = np.zeros((0, 3))

    dx = (bounds[1] - bounds[0])
    dy = (bounds[3] - bounds[2])
    dz = (bounds[5] - bounds[4])

    datas = []

    for i, x in enumerate(vx):
        slice_bounds = slicer.get_slice_bounds(x)
        if intersection_direction == 'z+':
            y_min = slice_bounds[2] + offset
            y_max = slice_bounds[3] - offset
            vy = np.linspace(y_min, y_max, ny)
            vz = [bounds[4] - dz]
            vx = [x]
        elif intersection_direction == 'z-':
            y_min = slice_bounds[2] + offset
            y_max = slice_bounds[3] - offset
            vy = np.linspace(y_min, y_max, ny)
            vz = [bounds[5] + dz]
            vx = [x]
        elif intersection_direction == 'y+':
            # raise NotImplementedError
            z_min = slice_bounds[4] + offset
            z_max = slice_bounds[5] - offset
            vz = np.linspace(z_min, z_max, ny)
            vy = [bounds[3] + dy]
            vx = [x]

        elif intersection_direction == 'y-':
            z_min = slice_bounds[4] + offset
            z_max = slice_bounds[5] - offset
            vz = np.linspace(z_min, z_max, ny)
            vy = [bounds[3] + dz]
            vx = [x]
        else:
            raise Exception('Unknown direction')
        grid = createMeshGridAsAMatrix(vx=vx, vy=vy, vz=vz)
        startPoints = np.copy(grid)
        endPoints = np.copy(grid)
        if intersection_direction == 'z+':
            endPoints[:,2] += 3 * dz
        elif intersection_direction == 'z-':
            endPoints[:,2] -= 3 * dz
        elif intersection_direction == 'y+':
            endPoints[:,1] += 3 * dy
        elif intersection_direction == 'y-':
            endPoints[:,1] -= 3 * dy
        else:
            raise Exception('Unknown direction')
        intersection_points = ri.see(startPoints, endPoints)
        intersection_points_all = np.concatenate((intersection_points_all, intersection_points), axis=0)

        to_json = slice2json(intersection_points, x)
        datas.append (to_json)


    # construction du json
    maxPoints = max ( list(map(lambda x: len(x['y']), datas) ) )
    print('max', maxPoints)
    filter_datas = filter(lambda x: len(x['y']) == maxPoints, datas)

    global_json = {"L": dx, "B": dy, "H": dz, "slices": list(filter_datas)}
    s = json.dumps(global_json, indent=4)

    if outputJsonFilename is not None:
        with open(outputJsonFilename, "w") as out:
            out.write(s)

    return intersection_points_all


def main(cli=None):
    """
    Entrypoint.
    """
    import argparse
    parser = argparse.ArgumentParser(
        description="""
        Sample an STL (or OBJ, PLY or VTK file) surface mesh at
        regular intervals (x=cst planes) by tracing rays parallel
        to the z-axis. Output the result in a JSON file.
        """,
        add_help=True)
    pa = parser.add_argument
    pa("-f", "--filename",
       help="Path to the file (STL, OBJ, PLY or VTK) to use.",
       default=r'')
    pa("-o", "--output",
       help="Name of the output JSON file.",
       default='result.json')
    pa("-v", "--verbose",
       action="store_true",
       default=False,
       help="Display extra information during processing (for debugging).")
    pa("--nx",
       help="Number of slices (on x-axis)", type=int,
       default=30)
    pa("--ny",
       help="Number of points per slice", type=int,
       default=10)
    pa("-d", "--intersection_direction",
       help="We use rays to compute the slices. If you want the rays to come from the \"top\" of the mesh, set this option to z+. Otherwise, the rays will be coming from \"beneath\" the mesh ('z-').", type=str,
       default='z-')
    pa("--offset",
       help="First slice's x-coordinate is xmin+offset. Last slice is at xmax-offset. Setting this to 0 would result in a cut right at the back of the mesh (i.e. singular).", type=float,
       default=1E-5)

    pa('--lx',
        help='Specify the x-coordinate of each cut. If not given (default is an empty list), will sample nx cuts at regular intervals between xmin+offset and xmax-offset',
        nargs='+', type=float,
        default=[])


    args = parser.parse_args(cli)

    lxx = args.lx
    if(args.lx==None):
        lxx = []

    extract_n_points_on_slices_of_a_mesh(filename=args.filename,
        nx=args.nx,
        ny=args.ny,
        intersection_direction=args.intersection_direction,
        outputJsonFilename=args.output,
        lx=lxx
        )


if __name__ == "__main__":
    main()
