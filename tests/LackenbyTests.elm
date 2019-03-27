module LackenbyTests exposing (suite)

import CustomFuzzers exposing (..)
import Expect exposing (..)
import Fuzz
import HullSliceModifiers exposing (empty)
import HullSlices exposing (HullSlices)
import HullSlicesMetrics exposing (HullSlicesMetrics, fillHullSliceMetrics)
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
                HullSlicesMetrics.computePrismaticCoefficient (TestData.mpov 1 |> fillHullSliceMetrics |> HullSlicesMetrics.addAreaAndDisplacement)
                    |> Maybe.withDefault 999999
                    |> Expect.within (Absolute 1.0e-2) (48.96 / (1.0035516256104178 * 69.6 * 2))
        , test "Can get master cross section of Anthineas" <|
            \_ ->
                Lackenby.getMasterCrossSection (TestData.anthineas |> fillHullSliceMetrics |> HullSlicesMetrics.addAreaAndDisplacement)
                    |> Maybe.map .x
                    |> Maybe.withDefault 999999
                    |> Expect.within epsAbsolute 9.133333333
        , test "Can modify abscicae of area curve to get a given prismatic coefficient" <|
            \_ ->
                Lackenby.lackenby 0.03 69.6 40 [ ( 1, 10 ), ( 3, 30 ), ( 4, 40 ), ( 4.5, 12 ), ( 6, 1 ) ]
                    |> Result.withDefault []
                    |> HullSlicesMetrics.integrate
                    |> (*) (1 / (69.6 * 40))
                    |> Expect.within (Absolute 1.0e-2) 0.03
        , test "Have same amount of slices before and after updating prismatic coefficient on MPOV" <|
            \_ ->
                Lackenby.modifyHullSlicesToMatchTargetPrismaticCoefficient "1.5" TestData.anthineas
                    |> .slices
                    |> List.length
                    |> Expect.equal 10
        ]
