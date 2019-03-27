module HullSliceModifiers exposing
    ( setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    )

import HullSlices exposing (HullSlices)
import Lackenby
import StringValueInput


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
