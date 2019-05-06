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
            if customLengthUpdated /= hullSlices.length then
                { oldCustomHullProperties | length = Just customLengthUpdated }

            else
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
            if customBreadthUpdated /= hullSlices.breadth then
                { oldCustomHullProperties | breadth = Just customBreadthUpdated }

            else
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
            if customDraughtUpdated /= hullSlices.draught then
                { oldCustomHullProperties | draught = Just customDraughtUpdated }

            else
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
            if customDepthUpdated /= hullSlices.depth then
                { oldCustomHullProperties | depth = Just customDepthUpdated }

            else
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
            if hullSlicesPosition /= List.map .x hullSlices.slices then
                { oldCustomHullProperties | hullslicesPositions = Just hullSlicesPosition }

            else
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
