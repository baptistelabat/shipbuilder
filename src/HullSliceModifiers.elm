module HullSliceModifiers exposing
    ( empty
    , fillHullSliceMetrics
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    )

import HullSlices exposing (HullSlices)
import StringValueInput


empty : HullSlices
empty =
    fillHullSliceMetrics
        { length = StringValueInput.emptyFloat 1
        , breadth = StringValueInput.emptyFloat 1
        , depth = StringValueInput.emptyFloat 1
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


fillHullSliceMetrics : HullSlices -> HullSlices
fillHullSliceMetrics hullSlices =
    let
        extract : HullSlices.HullSlicesWithMetacentre -> HullSlices
        extract hs =
            case hs of
                HullSlices.HullSlicesWithMetacentre hs_ ->
                    hs_
    in
    hullSlices
        |> HullSlices.addAreaAndDisplacement
        |> HullSlices.addCentreOfBuoyancy
        |> HullSlices.addBlockCoefficient
        |> HullSlices.addMetacentre
        |> extract


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa } |> fillHullSliceMetrics


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }
        |> (\slices -> { slices | ymin = -slices.breadth.value / 2 })
        |> fillHullSliceMetrics


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught } |> fillHullSliceMetrics


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    { hullSlices | depth = hullSlices.depth |> StringValueInput.setString depth } |> fillHullSliceMetrics
