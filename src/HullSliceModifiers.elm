module HullSliceModifiers exposing
    ( resetSlicesToOriginals
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setPrismaticCoefficient
    )

import HullSlices exposing (HullSlice, HullSlices)
import HullSlicesMetrics exposing (HullSlicesMetrics, fillHullSliceMetrics, getSlices)
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
    let
        hullSlicesPosition =
            hullSlices |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient

        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customHullslicesPosition = hullSlicesPosition }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


resetSlicesToOriginals : HullSlices -> HullSlices
resetSlicesToOriginals hullSlices =
    let
        originalCustomHullProperties : HullSlices.CustomHullProperties
        originalCustomHullProperties =
            { customLength = hullSlices.length
            , customBreadth = hullSlices.breadth
            , customDepth = hullSlices.depth
            , customDraught = hullSlices.draught
            , customHullslicesPosition = hullSlices.originalSlicePositions
            }
    in
    { hullSlices | customHullProperties = originalCustomHullProperties } |> (\slices -> { slices | ymin = -slices.customHullProperties.customBreadth.value / 2 })
