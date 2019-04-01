module HullSliceModifiers exposing
    ( setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    )

import HullSlices exposing (HullSlice, HullSlices)
import Lackenby
import StringValueInput


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customLength = oldCustomHullProperties.customLength |> StringValueInput.setString loa }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customBreadth = oldCustomHullProperties.customBreadth |> StringValueInput.setString breadth }
    in
    { hullSlices | customHullProperties = newCustomHullProperties } |> (\slices -> { slices | ymin = -slices.customHullProperties.customBreadth.value / 2 })


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDraught = oldCustomHullProperties.customDraught |> StringValueInput.setString draught }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDepth = oldCustomHullProperties.customDepth |> StringValueInput.setString depth }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setPrismaticCoefficient : String -> HullSlices -> HullSlices
setPrismaticCoefficient prismaticCoefficient hullSlices =
    hullSlices
        |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient
        |> setLongitudinalPositionOfEachSlice hullSlices


setLongitudinalPositionOfEachSlice : HullSlices -> List Float -> HullSlices
setLongitudinalPositionOfEachSlice hullSlices hullSlicesPosition =
    let
        normalize : Float -> Float
        normalize x =
            (x - hullSlices.xmin) / hullSlices.length.value

        shiftSliceLongitudinalPosition : HullSlice -> Float -> HullSlice
        shiftSliceLongitudinalPosition slice x =
            { slice | x = normalize x }

        modifiedSlices : List HullSlice
        modifiedSlices =
            List.map2 shiftSliceLongitudinalPosition hullSlices.slices hullSlicesPosition
    in
    { hullSlices | slices = modifiedSlices }
