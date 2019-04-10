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
            { oldCustomHullProperties | customLength = Just (hullSlices.length |> StringValueInput.setString loa) }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customBreadth = Just (hullSlices.breadth |> StringValueInput.setString breadth) }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDraught = Just (hullSlices.draught |> StringValueInput.setString draught) }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customDepth = Just (hullSlices.depth |> StringValueInput.setString depth) }
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
            { oldCustomHullProperties | customHullslicesPosition = Just hullSlicesPosition }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


resetSlicesToOriginals : HullSlices -> HullSlices
resetSlicesToOriginals hullSlices =
    let
        originalCustomHullProperties : HullSlices.CustomHullProperties
        originalCustomHullProperties =
            { customLength = Nothing
            , customBreadth = Nothing
            , customDepth = Nothing
            , customDraught = Nothing
            , customHullslicesPosition = Nothing
            }
    in
    { hullSlices | customHullProperties = originalCustomHullProperties }
