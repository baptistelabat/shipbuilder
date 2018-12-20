module HullSlicesTests exposing (suite)

import Expect exposing (..)
import Fuzz
import HullSlices exposing (HullSlices)
import Interpolate.Cubic
import Json.Decode as Decode
import Test exposing (..)
import TestData


positiveFloat : Fuzz.Fuzzer Float
positiveFloat =
    Fuzz.floatRange 0.01 1.0e10


twoIncreasingFloats : Fuzz.Fuzzer ( Float, Float )
twoIncreasingFloats =
    let
        f : Float -> Float -> ( Float, Float )
        f a ab =
            ( a, a + ab )
    in
        Fuzz.map2 f Fuzz.float positiveFloat


threeIncreasingFloats : Fuzz.Fuzzer ( Float, Float, Float )
threeIncreasingFloats =
    let
        f : Float -> Float -> Float -> ( Float, Float, Float )
        f a ab bc =
            ( a, a + ab, a + ab + bc )
    in
        Fuzz.map3 f Fuzz.float positiveFloat positiveFloat


fourIncreasingFloats : Fuzz.Fuzzer ( Float, Float, Float, Float )
fourIncreasingFloats =
    let
        f : Float -> Float -> Float -> Float -> ( Float, Float, Float, Float )
        f a ab bx1 x1x2 =
            ( a, a + ab, a + ab + bx1, a + ab + bx1 + x1x2 )
    in
        Fuzz.map4 f Fuzz.float positiveFloat positiveFloat positiveFloat


eps : FloatingPointTolerance
eps =
    Absolute 1.0e-5


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
        , describe "Area"
            [ test "Can calculate slice areas" <|
                \_ ->
                    Expect.equal [ 0, 5.246918004139403 ] (hullSlices |> HullSlices.setBreadth "10" |> .sliceAreas)
            , describe "Clipper" <|
                [ test "Clip one interval a--x1=====x2--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 6, 3 ) ] <| HullSlices.clip 1 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval x1--a=====b--x2" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| HullSlices.clip 4 5 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--x1=====b--x2" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| HullSlices.clip 2 4 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval x1--a=====x2--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 5 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--b--x1----x2" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 1 2 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval x1----x2--a--b" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 7 8 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--x1=====x2--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 1 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals x1--a=====b--x2" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| HullSlices.clip 4 5 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--x1=====b--x2" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| HullSlices.clip 2 4 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals x1--a=====x2--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 5 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--b--x1----x2" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 1 2 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals x1----x2--a--b" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 7 8 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Can clip properly a=x1 and b=x2" <|
                    \_ ->
                        Expect.equal [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ] <| HullSlices.clip 0 2 [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ]
                , fuzz (Fuzz.map2 (,) (Fuzz.constant 2) (Fuzz.constant 3)) "Square" <|
                    \( width, height ) ->
                        Expect.equal (abs (width * height)) (HullSlices.area { xmin = 0, dx = (abs width) / 2, a = 0, b = (abs width), ys = [ abs height, abs height, abs height ] })
                ]
            , describe "Area tests"
                [ describe "Area under straight line"
                    [ fuzz fourIncreasingFloats "Vertical line (case 1)" <|
                        \( a, b, x1, x2 ) ->
                            HullSlices.area { xmin = x1, dx = (x2 - x1) / 2, a = a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz threeIncreasingFloats "Vertical line (case 2)" <|
                        \( a, bx1, x2 ) ->
                            HullSlices.area { xmin = bx1, dx = (x2 - bx1) / 2, a = a, b = bx1, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz fourIncreasingFloats "Vertical line (case 3)" <|
                        \( a, x1, b, x2 ) ->
                            HullSlices.area { xmin = x1, dx = (x2 - x1) / 2, a = a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - x1))
                    , fuzz fourIncreasingFloats "Vertical line (case 4)" <|
                        \( x1, a, b, x2 ) ->
                            HullSlices.area { xmin = x1, dx = (x2 - x1) / 2, a = a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 5)" <|
                        \( x1a, b, x2 ) ->
                            HullSlices.area { xmin = x1a, dx = (x2 - x1a) / 2, a = x1a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - x1a))
                    , fuzz threeIncreasingFloats "Vertical line (case 6)" <|
                        \( x1, a, x2b ) ->
                            HullSlices.area { xmin = x1, dx = (x2b - x1) / 2, a = a, b = x2b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (x2b - a))
                    , fuzz twoIncreasingFloats "Vertical line (case 7)" <|
                        \( x1a, x2b ) ->
                            HullSlices.area { xmin = x1a, dx = (x2b - x1a) / 2, a = x1a, b = x2b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (x2b - x1a))
                    , fuzz fourIncreasingFloats "Vertical line (case 8)" <|
                        \( x1, a, x2, b ) ->
                            HullSlices.area { xmin = x1, dx = (x2 - x1) / 2, a = a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (x2 - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 9)" <|
                        \( x1, x2a, b ) ->
                            HullSlices.area { xmin = x1, dx = (x2a - x1) / 2, a = x2a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz fourIncreasingFloats "Vertical line (case 10)" <|
                        \( x1, x2, a, b ) ->
                            HullSlices.area { xmin = x1, dx = (x2 - x1) / 2, a = a, b = b, ys = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    ]
                ]
            ]
        ]
