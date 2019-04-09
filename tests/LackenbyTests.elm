module LackenbyTests exposing (suite)

import CustomFuzzers exposing (..)
import Expect exposing (..)
import Fuzz
import HullSlices exposing (HullSlices, integrate)
import HullSlicesMetrics exposing (HullSlicesMetrics, fillHullSliceMetrics)
import Lackenby exposing (..)
import StringValueInput
import Test exposing (..)
import TestData


epsAbsolute : FloatingPointTolerance
epsAbsolute =
    Absolute 1.0e-5


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
                HullSlicesMetrics.getPrismaticCoefficient (TestData.mpov 1 |> fillHullSliceMetrics)
                    |> .value
                    |> Expect.within (Absolute 1.0e-2) (48.96 / (1.0035516256104178 * 69.6 * 2))
        , test "Can get master cross section of Anthineas" <|
            \_ ->
                HullSlicesMetrics.getMasterCrossSection (TestData.anthineas |> fillHullSliceMetrics)
                    |> Maybe.map .x
                    |> Maybe.withDefault 999999
                    |> Expect.within epsAbsolute 9.222826692274515
        , test "Can modify abscicae of area curve to get a given prismatic coefficient" <|
            \_ ->
                lackenby 0.03 69.6 40 [ ( 1, 10 ), ( 3, 30 ), ( 4, 40 ), ( 4.5, 12 ), ( 6, 1 ) ]
                    |> Result.withDefault []
                    |> integrate
                    |> (*) (1 / (69.6 * 40))
                    |> Expect.within (Absolute 1.0e-2) 0.03
        , test "Have same number of slices before and after updating prismatic coefficient at 1.5 on Anthineas" <|
            \_ ->
                modifyHullSlicesToMatchTargetPrismaticCoefficient "1.5" TestData.anthineas
                    |> List.length
                    |> Expect.equal (List.length TestData.anthineas.slices)
        , test "Have same number of slices before and after updating prismatic coefficient at 3 on Anthineas" <|
            \_ ->
                modifyHullSlicesToMatchTargetPrismaticCoefficient "3" TestData.anthineas
                    |> List.length
                    |> Expect.equal (List.length TestData.anthineas.slices)
        , test "Can Clamp prismatic coefficient" <|
            \_ ->
                getPrismaticCoefficientBounds 100 50 [ ( 0, 10 ), ( 25, 20 ), ( 50, 30 ), ( 75, 20 ), ( 100, 10 ) ]
                    |> Tuple.mapBoth (StringValueInput.round_n 3) (StringValueInput.round_n 3)
                    |> Expect.equal ( 0.35, 0.45 )
        , test "Can set prismatic coefficient in clamped values range" <|
            \_ ->
                clampPrismaticCoefficient 0.4 100 50 [ ( 0, 10 ), ( 25, 20 ), ( 50, 30 ), ( 75, 20 ), ( 100, 10 ) ]
                    |> Expect.within epsAbsolute 0.4
        , test "Cannot set prismatic coefficient outside of clamped values" <|
            \_ ->
                clampPrismaticCoefficient 0.5 100 50 [ ( 0, 10 ), ( 25, 20 ), ( 50, 30 ), ( 75, 20 ), ( 100, 10 ) ]
                    |> Expect.notWithin epsAbsolute 0.5
        ]
