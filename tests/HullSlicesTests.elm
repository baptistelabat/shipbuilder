module HullSlicesTests exposing (suite)

import Expect exposing (..)
import HullSlices exposing (HullSlices)
import Interpolate.Cubic
import Json.Decode as Decode
import Test exposing (..)
import TestData


s : Interpolate.Cubic.Spline
s =
    Interpolate.Cubic.withRange 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


testSpline : Float -> Float -> (() -> Expect.Expectation)
testSpline x y =
    \_ -> Expect.equal y <| Interpolate.Cubic.valueAt x s


hullSlices : HullSlices
hullSlices =
    Result.withDefault HullSlices.empty (Decode.decodeString HullSlices.decoder TestData.hullSliceJson)


suite : Test
suite =
    describe "Hull slices"
        [ test "Interpolate" <|
            \_ ->
                Expect.equal 12 <| Interpolate.Cubic.valueAt 10 s
        , describe "Should get original values back"
            [ test "11 -> 23" <|
                testSpline 11 23
            , test "12 -> 34" <|
                testSpline 12 34
            , test "13 -> 45" <|
                testSpline 13 45
            , test "14 -> 56" <|
                testSpline 14 56
            , test "15 -> 67" <|
                testSpline 15 67
            , test "16 -> 78" <|
                testSpline 16 78
            ]
        , describe "Integrate"
            [ test "Integrating outside the spline bounds should give 0" <|
                \_ ->
                    Expect.equal 0 <| Interpolate.Cubic.integrate 8 9 s
            , test "Integrating within the bounds" <|
                \_ ->
                    Expect.equal 127.5 <| Interpolate.Cubic.integrate 8 11 s
            , test "Integrating a bit outside, a bit within the bounds" <|
                \_ ->
                    Expect.equal 127.5 <| Interpolate.Cubic.integrate 10 11 s
            ]
        , describe "Setters"
            [ test "Can set length over all" <|
                \_ ->
                    Expect.equal { hullSlices | length = { value = 1.2, string = "1.2", description = "Length over all", unit = "m" } } (HullSlices.setLengthOverAll "1.234" hullSlices)
            , test "Can set breadth" <|
                \_ ->
                    Expect.equal { hullSlices | breadth = { value = 13.4, string = "13.4", description = "Breadth", unit = "m" } } (HullSlices.setBreadth "13.4125" hullSlices)
            , test "Can set draught" <|
                \_ ->
                    Expect.equal { hullSlices | draught = { value = 13.4, string = "13.4", description = "Draught", unit = "m" } } (HullSlices.setDraught "13.4125" hullSlices)
            ]
        ]
