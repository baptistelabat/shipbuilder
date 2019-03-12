module LackenbyTests exposing (suite)

import CustomFuzzers exposing (..)
import Expect exposing (..)
import Fuzz
import HullSliceModifiers exposing (empty)
import HullSlices exposing (HullSlices)
import Lackenby
import StringValueInput
import Test exposing (..)
import TestData


type alias WidthHeightAlpha =
    { width : Float, height : Float, alpha : Float }


widthHeightAlpha : Fuzz.Fuzzer Float -> Fuzz.Fuzzer WidthHeightAlpha
widthHeightAlpha alphaFuzzer =
    Fuzz.map3 WidthHeightAlpha positiveFloat positiveFloat alphaFuzzer


type alias WidthHeightArea =
    { width : Float, height : Float, area : Float }


widthHeightArea : Fuzz.Fuzzer Float -> Fuzz.Fuzzer WidthHeightArea
widthHeightArea areaFuzzer =
    Fuzz.map3 WidthHeightArea positiveFloat positiveFloat areaFuzzer


type alias DBInput =
    { maxSliceBreadth : Float, alpha : Float, currentBreadth : Float }


dbInput : Fuzz.Fuzzer Float -> Fuzz.Fuzzer DBInput
dbInput alphaFuzzer =
    let
        f : Float -> Float -> Float -> DBInput
        f currentBreadth delta alpha =
            { maxSliceBreadth = currentBreadth + delta, alpha = alpha, currentBreadth = currentBreadth }
    in
    Fuzz.map3 f positiveFloat positiveFloat alphaFuzzer


suite : Test
suite =
    describe "Lackenby"
        [ test "Can calculate prismatic coefficient" <|
            \_ ->
                Lackenby.prismaticCoefficient (TestData.mpov 1)
                    |> Maybe.withDefault 999999
                    |> Expect.within (Absolute 1.0e-2) (48.96 / (1.0035516256104178 * 69.6))
        , describe "Can change slice area"
            [ fuzz (widthHeightAlpha (Fuzz.constant 0)) "Can find original area by setting parameter to 0" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.within epsRelative (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.floatRange -100 -0.1)) "Can reduce slice area using a negative parameter value" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.atMost (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.floatRange 0.1 100)) "Can increase slice area using a positive parameter value" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.atLeast (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.constant -1.0e15)) "Can reduce slice area to almost zero" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.within epsRelative (width * height / 10 / 2)
            ]
        , describe "Auxiliary function dB"
            [ fuzz (dbInput negativeFloat) "dB > 1 for alpha < 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.greaterThan 1
            , fuzz (dbInput <| Fuzz.constant 0) "dB -> 0 for alpha -> 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative 0
            , fuzz (dbInput positiveFloat) "dB <= 1 for alpha >= 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.lessThan 1
            , fuzz (dbInput nonZero) "dB = 0 for z = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.dB maxSliceBreadth alpha 0
                        |> Expect.within epsRelative 0
            , fuzz (dbInput (Fuzz.constant 1.0e15)) "dB -> 1 for alpha -> infinity" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative 1
            , test "dB should not be NaN" <|
                \_ ->
                    Lackenby.dB
                        0.000002
                        -512.0000000102057
                        0.000001
                        |> isNaN
                        |> Expect.false "should not be NaN"
            ]
        , describe "modifiedBreadth"
            [ fuzz (dbInput <| Fuzz.constant 0) "modifiedBreadth = currentBreadth for alpha = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative currentBreadth
            , fuzz (dbInput negativeFloat) "modifiedBreadth < currentBreadth for alpha < 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.atMost currentBreadth
            , fuzz (dbInput positiveFloat) "modifiedBreadth > currentBreadth for alpha > 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.atLeast currentBreadth
            , fuzz (dbInput (Fuzz.constant 1.0e15)) "modifiedBreadth -> maxSliceBreadth when alpha >> 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative maxSliceBreadth
            , fuzz (dbInput (Fuzz.constant -1.0e15)) "modifiedBreadth -> 0 when alpha << 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsAbsolute 0
            , fuzz (dbInput Fuzz.float) "modifiedBreadth = 0 when currentBreadth = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    Lackenby.modifiedBreadth maxSliceBreadth alpha 0
                        |> Expect.within epsRelative 0
            ]
        , describe "Can set slice area to a particular value"
            [ fuzz (widthHeightArea (Fuzz.constant 0)) "Should get an error if area is too low" <|
                \{ width, height, area } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.setSliceArea area height
                        |> Expect.equal (Err "Can't set slice area to such a low value given the discretization: try to increase the area.")
            , fuzz (widthHeightArea (Fuzz.constant 0)) "Should get original slice if setting to same area" <|
                \{ width, height, area } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.setSliceArea (width * height / 2) height
                        |> Result.withDefault { zmin = 0, zmax = height, y = [] }
                        |> .y
                        |> List.map2 (-) [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ]
                        |> List.map abs
                        |> List.maximum
                        |> Maybe.withDefault 1.0e200
                        |> Expect.within epsAbsolute 0
            , fuzz (widthHeightArea (Fuzz.floatRange 0.2 0.9)) "Can set slice area to a lower value" <|
                \{ width, height, area } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> Lackenby.setSliceArea (width * height / 2 * area) height
                        |> Result.map (HullSlices.area 0 height)
                        |> Result.withDefault -1
                        |> Expect.within epsRelative (width * height / 2 * area)
            ]
        , test "Can get master cross section of Anthineas" <|
            \_ ->
                Lackenby.getMasterCrossSection TestData.anthineas
                    |> Maybe.map .x
                    |> Maybe.withDefault 999999
                    |> Expect.within epsAbsolute 11.666666
        , test "Can modify abscicae of area curve to get a given prismatic coefficient" <|
            \_ ->
                Lackenby.lackenby 0.03 69.6 40 [ ( 1, 10 ), ( 3, 30 ), ( 4, 40 ), ( 4.5, 12 ), ( 6, 1 ) ]
                    |> Result.withDefault []
                    |> HullSlices.integrate
                    |> (*) (1 / (69.6 * 40))
                    |> Expect.within (Absolute 1.0e-2) 0.03
        ]
