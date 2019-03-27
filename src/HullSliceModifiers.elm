module HullSliceModifiers exposing
    ( empty
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    , toHullSlices
    )

import HullSlices exposing (HullSlices)
import HullSlicesMetrics
    exposing
        ( HullSlicesMetrics
        , getBreadth
        , getCentroidAreaForEachImmersedSlice
        , getDepth
        , getDraught
        , getHullSlicesBeneathFreeSurface
        , getLength
        , getOriginalSlicePosition
        , getPrismaticCoefficient
        , getSlices
        , getXmin
        , getYmin
        , getZmin
        )
import Lackenby
import StringValueInput


empty : HullSlices
empty =
    { length = StringValueInput.emptyFloat 1
    , breadth = StringValueInput.emptyFloat 1
    , depth = StringValueInput.emptyFloat 1
    , prismaticCoefficient = StringValueInput.emptyFloat 1
    , xmin = 0
    , ymin = 0
    , zmin = 0
    , slices = []
    , originalSlicePositions = []
    , draught = StringValueInput.emptyFloat 1
    }


toHullSlices : HullSlicesMetrics -> HullSlices
toHullSlices hullSlicesMetrics =
    { length = getLength hullSlicesMetrics
    , breadth = getBreadth hullSlicesMetrics
    , depth = getDepth hullSlicesMetrics
    , prismaticCoefficient = getPrismaticCoefficient hullSlicesMetrics
    , xmin = getXmin hullSlicesMetrics
    , ymin = getYmin hullSlicesMetrics
    , zmin = getZmin hullSlicesMetrics
    , slices = getSlices hullSlicesMetrics
    , originalSlicePositions = getOriginalSlicePosition hullSlicesMetrics
    , draught = getDraught hullSlicesMetrics
    }


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }
        |> (\slices -> { slices | ymin = -slices.breadth.value / 2 })


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught }


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    { hullSlices | depth = hullSlices.depth |> StringValueInput.setString depth }


setPrismaticCoefficient : String -> HullSlices -> HullSlices
setPrismaticCoefficient prismaticCoefficient hullSlices =
    hullSlices
        |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient
