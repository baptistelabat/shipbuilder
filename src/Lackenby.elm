module Lackenby exposing
    ( changeSliceAreaWhilePreservingSize
    , dB
    , modifiedBreadth
    , setSliceArea
    )

import HullSlices exposing (HullSlices)


bisectArea : { c | zmin : Float, zmax : Float, y : List Float } -> Float -> Float -> Float -> Int -> Int -> Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float }
bisectArea slice targetArea alphaLow alphaHigh niterMax niter tol draught =
    let
        lowArea =
            HullSlices.area (slice.zmax - draught) slice.zmax lowAreaSlice

        highArea =
            HullSlices.area (slice.zmax - draught) slice.zmax <| changeSliceAreaWhilePreservingSize alphaHigh slice

        alphaMid =
            (alphaLow + alphaHigh) / 2

        lowAreaSlice =
            changeSliceAreaWhilePreservingSize alphaLow slice

        highAreaSlice =
            changeSliceAreaWhilePreservingSize alphaHigh slice

        midAreaSlice =
            changeSliceAreaWhilePreservingSize alphaMid slice

        midArea =
            HullSlices.area (slice.zmax - draught) slice.zmax midAreaSlice

        reachedTolerance a =
            if targetArea == 0 then
                abs (a - targetArea) < tol

            else
                abs (a - targetArea) / targetArea < tol
    in
    if reachedTolerance lowArea then
        lowAreaSlice

    else if reachedTolerance highArea then
        highAreaSlice

    else if (niter > niterMax) || reachedTolerance midArea then
        midAreaSlice

    else if midArea > targetArea then
        bisectArea slice targetArea alphaLow alphaMid niterMax (niter + 1) tol draught

    else
        bisectArea slice targetArea alphaMid alphaHigh niterMax (niter + 1) tol draught


setSliceArea : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Result String { c | zmin : Float, zmax : Float, y : List Float }
setSliceArea targetArea draught slice =
    let
        minArea =
            case slice.y of
                [] ->
                    0

                [ _ ] ->
                    0

                a :: _ ->
                    (slice.zmax - slice.zmin) * a / (toFloat (List.length slice.y) - 1)

        ( alphaMin, alphaMax ) =
            if targetArea < HullSlices.area (slice.zmax - draught) slice.zmax slice then
                ( -100, 0 )

            else
                ( 0, 100 )
    in
    if targetArea < minArea then
        Err "Can't set slice area to such a low value given the discretization: try to increase the area."

    else
        Ok <| bisectArea slice targetArea alphaMin alphaMax 20 0 1.0e-5 draught


{-| Dilates a slice while keeping its breadth & depth.
-}
changeSliceAreaWhilePreservingSize : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> { c | zmin : Float, zmax : Float, y : List Float }
changeSliceAreaWhilePreservingSize alpha slice =
    case List.maximum slice.y of
        Nothing ->
            slice

        Just maxSliceBreadth ->
            { slice | y = List.map (modifiedBreadth maxSliceBreadth alpha) slice.y }


dB : Float -> Float -> Float -> Float
dB maxSliceBreadth alpha currentBreadth =
    let
        z =
            ((maxSliceBreadth - currentBreadth) / maxSliceBreadth) * currentBreadth / maxSliceBreadth
    in
    if z == 0 then
        0

    else
        z ^ (1 / alpha)


modifiedBreadth : Float -> Float -> Float -> Float
modifiedBreadth maxSliceBreadth alpha currentBreadth =
    let
        d =
            dB maxSliceBreadth (abs alpha) currentBreadth
    in
    if alpha < 0 then
        (1 - d) * currentBreadth

    else
        (1 - d) * currentBreadth + d * maxSliceBreadth
