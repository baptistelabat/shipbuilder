module HullSliceModifiers exposing
    ( empty
    , fillHullSliceMetrics
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    )

import HullSlices exposing (HullSlices)
import HullSlicesMetrics exposing (HullSlicesMetrics)
import Lackenby
import StringValueInput


empty : HullSlices
empty =
    fillHullSliceMetrics
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


fillHullSliceMetrics : HullSlices -> HullSlicesMetrics
fillHullSliceMetrics hullSlices =
    hullSlices
        |> HullSlicesMetrics.addAreaAndDisplacement
        |> HullSlicesMetrics.addCentreOfBuoyancy
        |> HullSlicesMetrics.addBlockCoefficient
        |> HullSlicesMetrics.addMetacentre
        |> Lackenby.initializePrismaticCoefficient


setLengthOverAll : String -> HullSlices -> HullSlicesMetrics
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa } |> fillHullSliceMetrics


setBreadth : String -> HullSlices -> HullSlicesMetrics
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }
        |> (\slices -> { slices | ymin = -slices.breadth.value / 2 })
        |> fillHullSliceMetrics


setDraught : String -> HullSlices -> HullSlicesMetrics
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught } |> fillHullSliceMetrics


setDepth : String -> HullSlices -> HullSlicesMetrics
setDepth depth hullSlices =
    { hullSlices | depth = hullSlices.depth |> StringValueInput.setString depth } |> fillHullSliceMetrics


setPrismaticCoefficient : String -> HullSlices -> HullSlicesMetrics
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
        |> fillHullSliceMetrics
