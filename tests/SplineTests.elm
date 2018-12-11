module SplineTests exposing (suite)

import Expect exposing (..)
import Spline exposing (Spline)
import Test exposing (..)


s : Spline
s =
    Spline.make 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


testSpline : Float -> Float -> (() -> Expect.Expectation)
testSpline x y =
    \_ -> Expect.equal y <| Spline.evaluate s x


suite : Test
suite =
    describe "Splines"
        [ test "Stub" <|
            \_ ->
                Expect.equal 12 <| Spline.evaluate s 10
        , describe "Should get original values back"
            [ test "11 -> 23" <|
                testSpline 11 23
            ]
        ]
