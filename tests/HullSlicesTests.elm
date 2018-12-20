module HullSlicesTests exposing (suite)

import Expect exposing (..)
import Fuzz
import HullSlices exposing (HullSlices)
import Interpolate.Cubic
import Json.Decode as Decode
import StringValueInput
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
        f a ab bzmin zminzmax =
            ( a, a + ab, a + ab + bzmin, a + ab + bzmin + zminzmax )
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
                [ test "Clip one interval a--zmin=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 6, 3 ) ] <| HullSlices.clip 1 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin--a=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| HullSlices.clip 4 5 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--zmin=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| HullSlices.clip 2 4 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin--a=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 5 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--b--zmin----zmax" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 1 2 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin----zmax--a--b" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 7 8 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--zmin=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 1 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin--a=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| HullSlices.clip 4 5 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--zmin=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| HullSlices.clip 2 4 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin--a=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| HullSlices.clip 5 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--b--zmin----zmax" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 1 2 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin----zmax--a--b" <|
                    \_ ->
                        Expect.equal [] <| HullSlices.clip 7 8 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Can clip properly a=zmin and b=zmax" <|
                    \_ ->
                        Expect.equal [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ] <| HullSlices.clip 0 2 [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ]
                , fuzz (Fuzz.map2 (,) (Fuzz.constant 2) (Fuzz.constant 3)) "Square" <|
                    \( width, height ) ->
                        Expect.equal (abs (width * height)) (HullSlices.area 0 (abs width) { zmin = 0, zmax = width, y = [ abs height, abs height, abs height ] })
                ]
            , describe "Area tests"
                [ describe "Area under straight line"
                    [ fuzz fourIncreasingFloats "Vertical line (case 1)" <|
                        \( a, b, zmin, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz threeIncreasingFloats "Vertical line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            HullSlices.area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz fourIncreasingFloats "Vertical line (case 3)" <|
                        \( a, zmin, b, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - zmin))
                    , fuzz fourIncreasingFloats "Vertical line (case 4)" <|
                        \( zmin, a, b, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            HullSlices.area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (b - zmina))
                    , fuzz threeIncreasingFloats "Vertical line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            HullSlices.area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (zmaxb - a))
                    , fuzz twoIncreasingFloats "Vertical line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            HullSlices.area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (zmaxb - zmina))
                    , fuzz fourIncreasingFloats "Vertical line (case 8)" <|
                        \( zmin, a, zmax, b ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps (3 * (zmax - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            HullSlices.area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    , fuzz fourIncreasingFloats "Vertical line (case 10)" <|
                        \( zmin, zmax, a, b ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within eps 0
                    ]
                , describe "Area under oblique line"
                    [ fuzz fourIncreasingFloats "Oblique line (case 1)" <|
                        \( a, b, zmin, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps 0
                    , fuzz threeIncreasingFloats "Oblique line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            HullSlices.area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps 0
                    , fuzz fourIncreasingFloats "Oblique line (case 3)" <|
                        \( a, zmin, b, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (((b - zmin) * (b + 2 * zmin - 3 * zmax)) / (zmin - zmax))

                    -- Computed by Wolfram: https://www.wolframalpha.com/input/?i=integrate+3-2*(x-zmin)%2F(zmax-zmin)+from+x+%3D+zmin+to+b
                    , fuzz fourIncreasingFloats "Oblique line (case 4)" <|
                        \( zmin, a, b, zmax ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (-((a - b) * (a + b + zmin - 3 * zmax)) / (zmin - zmax))

                    -- Computed by Wolfram: https://www.wolframalpha.com/input/?i=integrate+3-2*(x-zmin)%2F(zmax-zmin)+from+x+%3D+a+to+b
                    , fuzz threeIncreasingFloats "Oblique line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            HullSlices.area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (-((zmina - b) * (zmina + b + zmina - 3 * zmax)) / (zmina - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            HullSlices.area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (-((a - zmaxb) * (a + zmaxb + zmin - 3 * zmaxb)) / (zmin - zmaxb))
                    , fuzz twoIncreasingFloats "Oblique line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            HullSlices.area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (2 * (zmaxb - zmina))
                    , fuzz fourIncreasingFloats "Oblique line (case 8)" <|
                        \( zmin, a, zmax, b ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    (-((a + zmin - 2 * zmax) * (a - zmax)) / (zmin - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            HullSlices.area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    0
                    , fuzz fourIncreasingFloats "Oblique line (case 10)" <|
                        \( zmin, zmax, a, b ) ->
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within eps
                                    0
                    ]
                , describe "Real slice"
                    [ test "Anthineas" <|
                        \_ ->
                            HullSlices.area 0.31587930659489755 0.5298349579969897 { zmin = 0.31587930659489755, zmax = 0.5298349579969897, y = [ 0.964899527258786, 0.9648943694688346, 0.9629765202249831, 0.9592250480632435, 0.955473575901504, 0.9502377948034448, 0.9394176761317832, 0.9282437133662546, 0.9102579602794127, 0.742320749879794 ] }
                                |> Expect.within eps
                                    0.20027049633242555
                    ]
                ]
            ]
        , describe "Scale the slices"
            [ test "zmin should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.fromNumber "" ""
                        , depth = 5 |> StringValueInput.fromNumber "" ""
                        , draught = 4 |> StringValueInput.fromNumber "" ""
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.fromNumber "" ""
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmin
                        |> Expect.within eps
                            (88 + 0.5 * 5)
            , test "zmax should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.fromNumber "" ""
                        , depth = 5 |> StringValueInput.fromNumber "" ""
                        , draught = 4 |> StringValueInput.fromNumber "" ""
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.fromNumber "" ""
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmax
                        |> Expect.within eps
                            (88 + 0.9 * 5)
            , test "y should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.fromNumber "" ""
                        , depth = 5 |> StringValueInput.fromNumber "" ""
                        , draught = 4 |> StringValueInput.fromNumber "" ""
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.fromNumber "" ""
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .y
                        |> Expect.equal
                            ([ -89 + 10 * 0.1, -89 + 10 * 0.2, -89 + 10 * 0.5 ])
            ]
        ]
