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
            hullSlices.custom

        customLengthUpdated =
            hullSlices.length |> StringValueInput.setString loa

        newCustomHullProperties =
            case customLengthUpdated == hullSlices.length of
                False ->
                    { oldCustomHullProperties | length = Just customLengthUpdated }

                True ->
                    { oldCustomHullProperties | length = Nothing }
    in
    { hullSlices | custom = newCustomHullProperties }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.custom

        customBreadthUpdated =
            hullSlices.breadth |> StringValueInput.setString breadth

        newCustomHullProperties =
            case customBreadthUpdated == hullSlices.breadth of
                False ->
                    { oldCustomHullProperties | breadth = Just customBreadthUpdated }

                True ->
                    { oldCustomHullProperties | breadth = Nothing }
    in
    { hullSlices | custom = newCustomHullProperties }


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.custom

        customDraughtUpdated =
            hullSlices.draught |> StringValueInput.setString draught

        newCustomHullProperties =
            case customDraughtUpdated == hullSlices.draught of
                False ->
                    { oldCustomHullProperties | draught = Just customDraughtUpdated }

                True ->
                    { oldCustomHullProperties | draught = Nothing }
    in
    { hullSlices | custom = newCustomHullProperties }


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.custom

        customDepthUpdated =
            hullSlices.depth |> StringValueInput.setString depth

        newCustomHullProperties =
            case customDepthUpdated == hullSlices.depth of
                False ->
                    { oldCustomHullProperties | depth = Just customDepthUpdated }

                True ->
                    { oldCustomHullProperties | depth = Nothing }
    in
    { hullSlices | custom = newCustomHullProperties }


setPrismaticCoefficient : String -> HullSlices -> HullSlices
setPrismaticCoefficient prismaticCoefficient hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.custom

        hullSlicesPosition =
            hullSlices |> Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient

        newCustomHullProperties =
            case hullSlicesPosition == List.map .x hullSlices.slices of
                False ->
                    { oldCustomHullProperties | hullslicesPositions = Just hullSlicesPosition }

                True ->
                    { oldCustomHullProperties | hullslicesPositions = Nothing }
    in
    { hullSlices | custom = newCustomHullProperties }


resetSlicesToOriginals : HullSlices -> HullSlices
resetSlicesToOriginals hullSlices =
    let
        originalCustomHullProperties : HullSlices.CustomHullProperties
        originalCustomHullProperties =
            { length = Nothing
            , breadth = Nothing
            , depth = Nothing
            , draught = Nothing
            , hullslicesPositions = Nothing
            }
    in
    { hullSlices | custom = originalCustomHullProperties }
