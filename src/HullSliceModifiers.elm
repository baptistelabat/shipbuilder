module HullSliceModifiers exposing
    ( empty
    , emptyMetrics
    , fillHullSliceMetrics
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    , toHullSlices
    )

import HullSlices exposing (HullSlices)
import HullSlicesMetrics exposing (HullSlicesMetrics)
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


emptyMetrics : HullSlicesMetrics
emptyMetrics =
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
    , denormalizedSlices = []
    , blockCoefficient = 0
    , centreOfBuoyancy = 0
    , displacement = 0
    , metacentre = 0
    , hullSlicesBeneathFreeSurface = { xmin = 0, xmax = 0, hullSlices = [] }
    , centroidAreaForEachImmersedSlice = []
    }


toHullSlicesMetrics : HullSlices -> HullSlicesMetrics
toHullSlicesMetrics hullSlices =
    { length = hullSlices.length
    , breadth = hullSlices.breadth
    , depth = hullSlices.depth
    , prismaticCoefficient = hullSlices.prismaticCoefficient
    , xmin = hullSlices.xmin
    , ymin = hullSlices.ymin
    , zmin = hullSlices.zmin
    , slices = hullSlices.slices
    , originalSlicePositions = hullSlices.originalSlicePositions
    , draught = hullSlices.draught
    , denormalizedSlices = []
    , blockCoefficient = 0
    , centreOfBuoyancy = 0
    , displacement = 0
    , metacentre = 0
    , hullSlicesBeneathFreeSurface = { xmin = 0, xmax = 0, hullSlices = [] }
    , centroidAreaForEachImmersedSlice = []
    }


toHullSlices : HullSlicesMetrics -> HullSlices
toHullSlices hullSlicesMetrics =
    { length = hullSlicesMetrics.length
    , breadth = hullSlicesMetrics.breadth
    , depth = hullSlicesMetrics.depth
    , prismaticCoefficient = hullSlicesMetrics.prismaticCoefficient
    , xmin = hullSlicesMetrics.xmin
    , ymin = hullSlicesMetrics.ymin
    , zmin = hullSlicesMetrics.zmin
    , slices = hullSlicesMetrics.slices
    , originalSlicePositions = hullSlicesMetrics.originalSlicePositions
    , draught = hullSlicesMetrics.draught
    }


fillHullSliceMetrics : HullSlices -> HullSlicesMetrics
fillHullSliceMetrics hullSlices =
    hullSlices
        |> toHullSlicesMetrics
        |> HullSlicesMetrics.addAreaAndDisplacement
        |> HullSlicesMetrics.addCentreOfBuoyancy
        |> HullSlicesMetrics.addBlockCoefficient
        |> HullSlicesMetrics.addMetacentre
        |> Lackenby.initializePrismaticCoefficient


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
    let
        modifyPrismaticCoeff : HullSlicesMetrics -> HullSlicesMetrics
        modifyPrismaticCoeff hs =
            case String.toFloat prismaticCoefficient of
                Nothing ->
                    hs

                Just pc ->
                    Lackenby.setPrismaticCoefficientAndClamp pc hs
    in
    hullSlices
        |> fillHullSliceMetrics
        |> modifyPrismaticCoeff
        |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient
        |> toHullSlices
