module SplineTests exposing (suite)

import Expect exposing (..)
import Spline exposing (Spline)
import Test exposing (..)


s : Spline
s =
    Spline.make 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


suite : Test
suite =
    describe "Splines"
        [ test "Stub" <|
            \_ ->
                Expect.equal 12 <| Spline.evaluate s 10
        ]
