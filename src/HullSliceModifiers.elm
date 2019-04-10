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

        customLengthUpdated =
            hullSlices.length |> StringValueInput.setString loa

        newCustomHullProperties =
            case customLengthUpdated == hullSlices.length of
                False ->
                    { oldCustomHullProperties | customLength = Just customLengthUpdated }

                True ->
                    { oldCustomHullProperties | customLength = Nothing }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        customBreadthUpdated =
            hullSlices.breadth |> StringValueInput.setString breadth

        newCustomHullProperties =
            case customBreadthUpdated == hullSlices.breadth of
                False ->
                    { oldCustomHullProperties | customBreadth = Just customBreadthUpdated }

                True ->
                    { oldCustomHullProperties | customBreadth = Nothing }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        customDraughtUpdated =
            hullSlices.draught |> StringValueInput.setString draught

        newCustomHullProperties =
            case customDraughtUpdated == hullSlices.draught of
                False ->
                    { oldCustomHullProperties | customDraught = Just customDraughtUpdated }

                True ->
                    { oldCustomHullProperties | customDraught = Nothing }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        customDepthUpdated =
            hullSlices.depth |> StringValueInput.setString depth

        newCustomHullProperties =
            case customDepthUpdated == hullSlices.depth of
                False ->
                    { oldCustomHullProperties | customDepth = Just customDepthUpdated }

                True ->
                    { oldCustomHullProperties | customDepth = Nothing }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


setPrismaticCoefficient : String -> HullSlices -> HullSlices
setPrismaticCoefficient prismaticCoefficient hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        hullSlicesPosition =
            hullSlices |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient

        newCustomHullProperties =
            case hullSlicesPosition == List.map .x hullSlices.slices of
                False ->
                    { oldCustomHullProperties | customHullslicesPosition = Just hullSlicesPosition }

                True ->
                    { oldCustomHullProperties | customHullslicesPosition = Nothing }
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
