module SplineTests exposing (suite)

import Expect exposing (..)
import Test exposing (..)
import Interpolate.Cubic


s : Interpolate.Cubic.Spline
s =
    Interpolate.Cubic.withRange 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


testSpline : Float -> Float -> (() -> Expect.Expectation)
testSpline x y =
    \_ -> Expect.equal y <| Interpolate.Cubic.valueAt x s


suite : Test
suite =
    describe "Splines"
        [ test "Stub" <|
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
                    Expect.equal 0 <| Interpolate.Cubic.integrate s 8 9
            , test "Integrating within the bounds" <|
                \_ ->
                    Expect.equal 127.5 <| Interpolate.Cubic.integrate s 8 11
            , test "Integrating a bit outside, a bit within the bounds" <|
                \_ ->
                    Expect.equal 127.5 <| Interpolate.Cubic.integrate s 10 11
            ]
        ]
