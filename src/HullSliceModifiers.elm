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

        updatedHullSlices =
            { hullSlices | customHullProperties = newCustomHullProperties }
    in
    setLongitudinalPositionOfEachSlice updatedHullSlices updatedHullSlices.customHullProperties.customHullslicesPosition


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customBreadth = oldCustomHullProperties.customBreadth |> StringValueInput.setString breadth }

        updatedHullSlices =
            { hullSlices | customHullProperties = newCustomHullProperties } |> (\slices -> { slices | ymin = -slices.customHullProperties.customBreadth.value / 2 })
    in
    setLongitudinalPositionOfEachSlice updatedHullSlices updatedHullSlices.customHullProperties.customHullslicesPosition


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDraught = oldCustomHullProperties.customDraught |> StringValueInput.setString draught }

        updatedHullSlices =
            { hullSlices | customHullProperties = newCustomHullProperties }
    in
    setLongitudinalPositionOfEachSlice updatedHullSlices updatedHullSlices.customHullProperties.customHullslicesPosition


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDepth = oldCustomHullProperties.customDepth |> StringValueInput.setString depth }

        updatedHullSlices =
            { hullSlices | customHullProperties = newCustomHullProperties }
    in
    setLongitudinalPositionOfEachSlice updatedHullSlices updatedHullSlices.customHullProperties.customHullslicesPosition


setPrismaticCoefficient : String -> HullSlices -> HullSlices
setPrismaticCoefficient prismaticCoefficient hullSlices =
    let
        hullSlicesPosition =
            hullSlices |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient

        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customHullslicesPosition = hullSlicesPosition }

        updatedHullSlices =
            { hullSlices | customHullProperties = newCustomHullProperties }
    in
    setLongitudinalPositionOfEachSlice updatedHullSlices hullSlicesPosition


setLongitudinalPositionOfEachSlice : HullSlices -> List Float -> HullSlices
setLongitudinalPositionOfEachSlice hullSlices hullSlicesPosition =
    let
        shiftSliceLongitudinalPosition : HullSlice -> Float -> HullSlice
        shiftSliceLongitudinalPosition slice newX =
            { slice | x = newX }

        modifiedSlices : List HullSlice
        modifiedSlices =
            List.map2 shiftSliceLongitudinalPosition hullSlices.slices hullSlicesPosition
    in
    { hullSlices | slices = modifiedSlices }
