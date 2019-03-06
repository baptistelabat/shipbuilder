module HullSlicesTests exposing (suite)

import Expect exposing (..)
import Fuzz
import HullSliceUtilities
import HullSlices exposing (HullSlices)
import Interpolate.Cubic
import Json.Decode as Decode
import StringValueInput
import Test exposing (..)
import TestData


positiveFloat : Fuzz.Fuzzer Float
positiveFloat =
    Fuzz.floatRange 1.0e-6 1.0e8


negativeFloat : Fuzz.Fuzzer Float
negativeFloat =
    Fuzz.map (\x -> -x) positiveFloat


nonZero : Fuzz.Fuzzer Float
nonZero =
    let
        chooseFuzzer : Bool -> Float -> Float -> Float
        chooseFuzzer choosePositive positive negative =
            if choosePositive then
                positive

            else
                negative
    in
    Fuzz.map3 chooseFuzzer Fuzz.bool positiveFloat negativeFloat


type alias DBInput =
    { maxSliceBreadth : Float, alpha : Float, currentBreadth : Float }


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


dbInput : Fuzz.Fuzzer Float -> Fuzz.Fuzzer DBInput
dbInput alphaFuzzer =
    let
        f : Float -> Float -> Float -> DBInput
        f currentBreadth delta alpha =
            { maxSliceBreadth = currentBreadth + delta, alpha = alpha, currentBreadth = currentBreadth }
    in
    Fuzz.map3 f positiveFloat positiveFloat alphaFuzzer


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


fourIncreasingFloats : Fuzz.Fuzzer { x1 : Float, x2 : Float, x3 : Float, x4 : Float }
fourIncreasingFloats =
    let
        f : Float -> Float -> Float -> Float -> { x1 : Float, x2 : Float, x3 : Float, x4 : Float }
        f a_ ab bzmin zminzmax =
            { x1 = a_, x2 = a_ + ab, x3 = a_ + ab + bzmin, x4 = a_ + ab + bzmin + zminzmax }
    in
    Fuzz.map4 f Fuzz.float positiveFloat positiveFloat positiveFloat


epsAbsolute : FloatingPointTolerance
epsAbsolute =
    Absolute 1.0e-5


epsRelative : FloatingPointTolerance
epsRelative =
    Relative 1.0e-5


s : Interpolate.Cubic.Spline
s =
    Interpolate.Cubic.withRange 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


testSpline : Float -> Float -> (() -> Expect.Expectation)
testSpline x y =
    \_ -> Expect.equal y <| Interpolate.Cubic.valueAt x s


hullSlices : HullSlices
hullSlices =
    Result.withDefault HullSlices.empty (Decode.decodeString HullSlices.decoder TestData.hullSliceJson)


cube : HullSlices.JsonHullSlices {}
cube =
    { length = StringValueInput.floatInput 200
    , breadth = StringValueInput.floatInput 20
    , depth = StringValueInput.floatInput 10
    , xmin = -1
    , ymin = -10
    , zmin = 3
    , slices =
        [ { x = 0
          , zmin = 0
          , zmax = 1
          , y = [ 1, 1, 1, 1 ]
          }
        , { x = 0.5
          , zmin = 0
          , zmax = 1
          , y = [ 1, 1, 1, 1 ]
          }
        , { x = 1
          , zmin = 0
          , zmax = 1
          , y = [ 1, 1, 1, 1 ]
          }
        ]
    , draught = StringValueInput.floatInput 2
    }


toblerone : Float -> Float -> HullSlices.JsonHullSlices {}
toblerone breadth depth =
    { length = StringValueInput.floatInput 200
    , breadth = StringValueInput.floatInput breadth
    , depth = StringValueInput.floatInput depth
    , xmin = -1
    , ymin = -breadth / 2
    , zmin = 3
    , slices =
        [ { x = 0
          , zmin = 0
          , zmax = 1
          , y = [ 1, 0.75, 0.5 ]
          }
        , { x = 0.5
          , zmin = 0
          , zmax = 1
          , y = [ 1, 0.75, 0.5 ]
          }
        , { x = 1
          , zmin = 0
          , zmax = 1
          , y = [ 1, 0.75, 0.5 ]
          }
        ]
    , draught = StringValueInput.floatInput 2
    }


makeTriplet : a -> b -> c -> ( a, b, c )
makeTriplet x y z =
    ( x, y, z )


hs0 =
    { x = 0, zmin = 0.2, zmax = 0.9, y = [ 1, 0.75, 0.5 ] }


hs_param =
    { length = 20
    , breadth = 4
    , depth = 6
    , xmin = 0
    , ymin = -2.0
    , zmin = -6.0
    }


compare : (a -> Float) -> a -> a -> Expect.Expectation
compare accessor left right =
    accessor left
        |> Expect.within epsAbsolute
            (accessor right)


compareList : (a -> List Float) -> a -> a -> Expect.Expectation
compareList accessor left right =
    List.map2 (-) (accessor left) (accessor right)
        |> List.map abs
        |> List.sum
        |> Expect.within epsAbsolute 0


compareHs : { a | x : Float, zmin : Float, zmax : Float, y : List Float } -> { a | x : Float, zmin : Float, zmax : Float, y : List Float } -> Expect.Expectation
compareHs left right =
    Expect.all
        [ compare .x left
        , compare .zmin left
        , compare .zmax left
        , compareList .y left
        ]
        right


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
                    Interpolate.Cubic.integrate 8 9 s
                        |> Expect.within epsAbsolute 0
            , test "Integrating within the bounds" <|
                \_ ->
                    Interpolate.Cubic.integrate 8 11 s
                        |> Expect.within epsAbsolute 127.5
            , test "Integrating a bit outside, a bit within the bounds" <|
                \_ ->
                    Interpolate.Cubic.integrate 10 11 s
                        |> Expect.within epsAbsolute 127.5
            ]
        , describe "Setters"
            [ test "Can set length over all" <|
                \_ ->
                    Expect.equal { value = 1.2, string = "1.2", description = "Length over all", unit = "m" } (HullSlices.setLengthOverAll "1.234" hullSlices |> .length)
            , test "Can set breadth" <|
                \_ ->
                    Expect.equal { value = 13.4, string = "13.4", description = "Breadth", unit = "m" } (HullSlices.setBreadth "13.4125" hullSlices |> .breadth)
            , test "Can set draught" <|
                \_ ->
                    Expect.equal { value = 13.4, string = "13.4", description = "Draught", unit = "m" } (HullSlices.setDraught "13.4125" hullSlices |> .draught)
            , test "Resizing should not change centering: changing breadth should also change ymin" <|
                \_ ->
                    (HullSlices.setBreadth "7" hullSlices |> .ymin)
                        |> Expect.within epsAbsolute -3.5
            ]
        , describe "Area"
            [ test "Can calculate slice areas" <|
                \_ ->
                    Expect.equal [ 0, 0.06183408481917592 ] (hullSlices |> HullSlices.setBreadth "10" |> .sliceAreas)
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
                , fuzz (Fuzz.map2 Tuple.pair (Fuzz.constant 2) (Fuzz.constant 3)) "Square" <|
                    \( width, height ) ->
                        Expect.equal (abs (width * height)) (HullSlices.area 0 (abs width) { zmin = 0, zmax = width, y = [ abs height, abs height, abs height ] })
                ]
            , describe "Area tests"
                [ describe "Area under straight line"
                    [ fuzz fourIncreasingFloats "Vertical line (case 1)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x1

                                b =
                                    x2

                                zmin =
                                    x3

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz threeIncreasingFloats "Vertical line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            HullSlices.area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz fourIncreasingFloats "Vertical line (case 3)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x1

                                b =
                                    x3

                                zmin =
                                    x2

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (b - zmin))
                    , fuzz fourIncreasingFloats "Vertical line (case 4)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x2

                                b =
                                    x3

                                zmin =
                                    x1

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (b - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            HullSlices.area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (b - zmina))
                    , fuzz threeIncreasingFloats "Vertical line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            HullSlices.area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (zmaxb - a))
                    , fuzz twoIncreasingFloats "Vertical line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            HullSlices.area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (zmaxb - zmina))
                    , fuzz fourIncreasingFloats "Vertical line (case 8)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x2

                                b =
                                    x4

                                zmin =
                                    x1

                                zmax =
                                    x3
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (zmax - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            HullSlices.area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz fourIncreasingFloats "Vertical line (case 10)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x3

                                b =
                                    x4

                                zmin =
                                    x1

                                zmax =
                                    x2
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute 0
                    ]
                , describe "Area under oblique line"
                    [ fuzz fourIncreasingFloats "Oblique line (case 1)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x1

                                b =
                                    x2

                                zmin =
                                    x3

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz threeIncreasingFloats "Oblique line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            HullSlices.area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz fourIncreasingFloats "Oblique line (case 3)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x1

                                b =
                                    x3

                                zmin =
                                    x2

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (((b - zmin) * (b + 2 * zmin - 3 * zmax)) / (zmin - zmax))

                    -- Computed by Wolfram: https://www.wolframalpha.com/input/?i=integrate+3-2*(x-zmin)%2F(zmax-zmin)+from+x+%3D+zmin+to+b
                    , fuzz fourIncreasingFloats "Oblique line (case 4)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x2

                                b =
                                    x3

                                zmin =
                                    x1

                                zmax =
                                    x4
                            in
                            HullSlices.area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a - b) * (a + b + zmin - 3 * zmax)) / (zmin - zmax))

                    -- Computed by Wolfram: https://www.wolframalpha.com/input/?i=integrate+3-2*(x-zmin)%2F(zmax-zmin)+from+x+%3D+a+to+b
                    , fuzz threeIncreasingFloats "Oblique line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            HullSlices.area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((zmina - b) * (zmina + b + zmina - 3 * zmax)) / (zmina - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            HullSlices.area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a - zmaxb) * (a + zmaxb + zmin - 3 * zmaxb)) / (zmin - zmaxb))
                    , fuzz twoIncreasingFloats "Oblique line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            HullSlices.area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (2 * (zmaxb - zmina))
                    , fuzz fourIncreasingFloats "Oblique line (case 8)" <|
                        \{ x1, x2, x3, x4 } ->
                            let
                                a =
                                    x2

                                b =
                                    x4

                                zmin =
                                    x1

                                zmax =
                                    x3
                            in
                            HullSlices.area a b { zmin = x1, zmax = x3, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a + zmin - 2 * zmax) * (a - zmax)) / (zmin - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            HullSlices.area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    0
                    , fuzz fourIncreasingFloats "Oblique line (case 10)" <|
                        \{ x1, x2, x3, x4 } ->
                            HullSlices.area x3 x4 { zmin = x1, zmax = x2, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    0
                    , test "Bug detected when calculating toblerone area" <|
                        \_ ->
                            HullSlices.area 3.0100000959552076 3.010000694363696 { x = 0, zmin = 3, zmax = 3.010000694363696, y = [ -9.99, -9.9925, -9.995 ] }
                                |> Expect.within (Absolute 1.0e-14)
                                    -0.00000598109275204103
                    ]
                , describe "Real slice"
                    [ test "Anthineas" <|
                        \_ ->
                            HullSlices.area 0.31587930659489755 0.5298349579969897 { zmin = 0.31587930659489755, zmax = 0.5298349579969897, y = [ 0.964899527258786, 0.9648943694688346, 0.9629765202249831, 0.9592250480632435, 0.955473575901504, 0.9502377948034448, 0.9394176761317832, 0.9282437133662546, 0.9102579602794127, 0.742320749879794 ] }
                                |> Expect.within epsAbsolute
                                    0.20027049633242555
                    , test "Cube" <|
                        \_ ->
                            List.map (HullSlices.calculateSliceArea cube) cube.slices
                                |> Expect.equal
                                    [ cube.breadth.value * cube.draught.value, cube.breadth.value * cube.draught.value, cube.breadth.value * cube.draught.value ]
                    , test "Cube after changing breadth" <|
                        \_ ->
                            List.map (HullSlices.calculateSliceArea <| HullSlices.setBreadth "10" <| HullSlices.interpolate cube) cube.slices
                                |> Expect.equal
                                    [ 10 * cube.draught.value, 10 * cube.draught.value, 10 * cube.draught.value ]
                    , fuzz (Fuzz.map3 makeTriplet positiveFloat positiveFloat (Fuzz.floatRange 0 1)) "Toblerone" <|
                        \( breadth, depth, draughtDividedByDepth ) ->
                            let
                                t =
                                    toblerone breadth depth
                                        |> setDraught (draughtDividedByDepth * depth)

                                expectedArea =
                                    draughtDividedByDepth * draughtDividedByDepth * depth * breadth / 2

                                setDraught : Float -> { a | draught : StringValueInput.FloatInput } -> { a | draught : StringValueInput.FloatInput }
                                setDraught val slice =
                                    { slice | draught = val |> StringValueInput.asValueIn slice.draught }
                            in
                            Expect.all
                                (List.map
                                    (HullSlices.calculateSliceArea t)
                                    t.slices
                                    |> List.map (\area -> \e -> Expect.within e expectedArea area)
                                )
                                (Relative 1.0e-2)
                    , test "Toblerone bug" <|
                        \_ ->
                            let
                                breadth =
                                    0.01

                                depth =
                                    0.010000694363696206

                                draughtDividedByDepth =
                                    0.00005983669402257387

                                t =
                                    toblerone breadth depth
                                        |> setDraught (draughtDividedByDepth * depth)

                                expectedArea =
                                    draughtDividedByDepth * draughtDividedByDepth * depth * breadth / 2

                                setDraught : Float -> { a | draught : StringValueInput.FloatInput } -> { a | draught : StringValueInput.FloatInput }
                                setDraught val slice =
                                    { slice | draught = val |> StringValueInput.asValueIn slice.draught }
                            in
                            Expect.all
                                (List.map
                                    (HullSlices.calculateSliceArea t)
                                    t.slices
                                    |> List.map (\area -> \e -> Expect.within e expectedArea area)
                                )
                                epsAbsolute
                    ]
                ]
            ]
        , describe "Scale the slices"
            [ test "zmin should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.floatInput
                        , depth = 5 |> StringValueInput.floatInput
                        , draught = 4 |> StringValueInput.floatInput
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.floatInput
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmin
                        |> Expect.within epsAbsolute
                            (88 + 0.5 * 5)
            , test "zmax should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.floatInput
                        , depth = 5 |> StringValueInput.floatInput
                        , draught = 4 |> StringValueInput.floatInput
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.floatInput
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmax
                        |> Expect.within epsAbsolute
                            (88 + 0.9 * 5)
            , test "y should be scaled properly" <|
                \_ ->
                    HullSlices.scale
                        { breadth = 10 |> StringValueInput.floatInput
                        , depth = 5 |> StringValueInput.floatInput
                        , draught = 4 |> StringValueInput.floatInput
                        , xmin = -5
                        , ymin = -89
                        , zmin = 88
                        , length = 456 |> StringValueInput.floatInput
                        , slices = []
                        }
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .y
                        |> Expect.equal
                            [ -89 + 10 * 0.1, -89 + 10 * 0.2, -89 + 10 * 0.5 ]
            ]
        , describe "Volume"
            [ fuzz
                (Fuzz.map2 Tuple.pair Fuzz.float Fuzz.float)
                "Triangular area curve"
              <|
                \( xmin_, length_ ) ->
                    HullSlices.volume
                        { xmin = xmin_, length = StringValueInput.floatInput length_ }
                        [ 0, 1, 2, 3, 2, 1, 0 ]
                        |> Expect.within epsAbsolute
                            (max 0 (3 * length_ / 2))
            , fuzz
                (Fuzz.map3 (\length_ a b -> { length_ = length_, a = a, b = b }) positiveFloat positiveFloat positiveFloat)
                "Four-part area curve"
              <|
                \{ length_, a, b } ->
                    HullSlices.volume
                        { xmin = 0, length = StringValueInput.floatInput length_ }
                        [ 0, a, a + b, a, 0 ]
                        |> Expect.within epsRelative
                            (3 * a * length_ / 4 + b * length_ / 4)
            ]
        , describe "Can change slice area"
            [ fuzz (widthHeightAlpha (Fuzz.constant 0)) "Can find original area by setting parameter to 0" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.within epsRelative (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.floatRange -100 -0.1)) "Can reduce slice area using a negative parameter value" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.atMost (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.floatRange 0.1 100)) "Can increase slice area using a positive parameter value" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.atLeast (width * height / 2)
            , fuzz (widthHeightAlpha (Fuzz.constant -1.0e15)) "Can reduce slice area to almost zero" <|
                \{ width, height, alpha } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.changeSliceAreaWhilePreservingSize alpha
                        |> HullSlices.area 0 height
                        |> Expect.within epsRelative (width * height / 10 / 2)
            ]
        , describe "Auxiliary function dB"
            [ fuzz (dbInput negativeFloat) "dB > 1 for alpha < 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.greaterThan 1
            , fuzz (dbInput <| Fuzz.constant 0) "dB -> 0 for alpha -> 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative 0
            , fuzz (dbInput positiveFloat) "dB <= 1 for alpha >= 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.lessThan 1
            , fuzz (dbInput nonZero) "dB = 0 for z = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.dB maxSliceBreadth alpha 0
                        |> Expect.within epsRelative 0
            , fuzz (dbInput (Fuzz.constant 1.0e15)) "dB -> 1 for alpha -> infinity" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.dB maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative 1
            , test "dB should not be NaN" <|
                \_ ->
                    HullSlices.dB
                        0.000002
                        -512.0000000102057
                        0.000001
                        |> isNaN
                        |> Expect.false "should not be NaN"
            ]
        , describe "modifiedBreadth"
            [ fuzz (dbInput <| Fuzz.constant 0) "modifiedBreadth = currentBreadth for alpha = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative currentBreadth
            , fuzz (dbInput negativeFloat) "modifiedBreadth < currentBreadth for alpha < 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.atMost currentBreadth
            , fuzz (dbInput positiveFloat) "modifiedBreadth > currentBreadth for alpha > 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.atLeast currentBreadth
            , fuzz (dbInput (Fuzz.constant 1.0e15)) "modifiedBreadth -> maxSliceBreadth when alpha >> 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsRelative maxSliceBreadth
            , fuzz (dbInput (Fuzz.constant -1.0e15)) "modifiedBreadth -> 0 when alpha << 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha currentBreadth
                        |> Expect.within epsAbsolute 0
            , fuzz (dbInput Fuzz.float) "modifiedBreadth = 0 when currentBreadth = 0" <|
                \{ maxSliceBreadth, alpha, currentBreadth } ->
                    HullSlices.modifiedBreadth maxSliceBreadth alpha 0
                        |> Expect.within epsRelative 0
            ]
        , describe "Can set slice area to a particular value"
            [ fuzz (widthHeightArea (Fuzz.constant 0)) "Should get an error if area is too low" <|
                \{ width, height, area } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.setSliceArea area height
                        |> Expect.equal (Err "Can't set slice area to such a low value given the discretization: try to increase the area.")
            , fuzz (widthHeightArea (Fuzz.constant 0)) "Should get original slice if setting to same area" <|
                \{ width, height, area } ->
                    { zmin = 0, zmax = height, y = [ width, 0.9 * width, 0.8 * width, 0.7 * width, 0.6 * width, 0.5 * width, 0.4 * width, 0.3 * width, 0.2 * width, 0.1 * width, 0 ] }
                        |> HullSlices.setSliceArea (width * height / 2) height
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
                        |> HullSlices.setSliceArea (width * height / 2 * area) height
                        |> Result.map (HullSlices.area 0 height)
                        |> Result.withDefault -1
                        |> Expect.within epsRelative (width * height / 2 * area)
            ]
        , describe "Longitudinal position of the centroid of an area curve"
            [ fuzz (Fuzz.map2 Tuple.pair positiveFloat positiveFloat) "Centroid of a cube" <|
                \( breadth, height ) ->
                    { zmin = 0, zmax = breadth, y = [ height, height, height, height, height, height ] }
                        |> HullSlices.centroidAbscissa
                        |> Expect.within epsRelative (breadth / 2)
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid with offset" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ height, height, height, height ] }
                        |> HullSlices.centroidAbscissa
                        |> Expect.within epsRelative (zmin + (breadth / 2))
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid of a triangle" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ 0, height / 2, height, height / 2, 0 ] }
                        |> HullSlices.centroidAbscissa
                        |> Expect.within epsRelative (zmin + (breadth / 2))
            , test "Can calculate the centroid of a trapeze" <|
                \_ ->
                    HullSlices.trapezoidCentroid 30 20 40
                        |> Expect.all
                            [ Tuple.first >> Expect.within epsRelative (50 / 3), Tuple.second >> Expect.within epsRelative 900 ]
            , test "Can calculate the centroid of a trapeze with y1 > y2" <|
                \_ ->
                    HullSlices.trapezoidCentroid 30 40 20
                        |> Expect.all
                            [ Tuple.first >> Expect.within epsRelative (40 / 3), Tuple.second >> Expect.within epsRelative 900 ]
            , test "Can calculate zmin for each trapezoid" <|
                \_ ->
                    { zmin = -12, zmax = 3, y = [ 123, 654, 789, 951 ] }
                        |> HullSlices.zminForEachTrapezoid
                        |> Expect.equalLists [ -12, -7, -2 ]
            , test "Can calculate the centroid of a square" <|
                \_ ->
                    HullSlices.trapezoidCentroid 1.0e-6 1.0e-6 1.0e-6
                        |> Expect.all
                            [ Tuple.first >> Expect.within epsRelative 5.0e-7, Tuple.second >> Expect.within epsRelative 1.0e-12 ]
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid of a non-symmetrical shape" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ 0, height ] }
                        |> HullSlices.centroidAbscissa
                        |> Expect.within epsRelative (zmin + (2 * breadth / 3))
            ]
        , describe "Lackenby"
            [ fuzz (Fuzz.map2 Tuple.pair positiveFloat positiveFloat) "Can calculate prismatic blockCoefficient" <|
                \( length, am ) ->
                    HullSlices.prismaticCoefficient { xmin = length - am, length = StringValueInput.floatInput length, y = [ 0, am / 4, am / 2, am * 0.75, am, 0.75 * am, 0.5 * am, 0.25 * am, 0 ] }
                        |> Expect.within (Absolute 1.0e-2) 0.5
            ]
        , describe "HullSliceUtilities"
            [ test "demormalizedHullSlice" <|
                \_ ->
                    compareHs
                        { x = 0, zmin = -4.8, zmax = -0.6, y = [ 2, 1, 0 ] }
                        (HullSlices.demormalizedHullSlice hs_param hs0)
            , test "areaTrapezoid" <|
                \_ ->
                    HullSliceUtilities.areaTrapezoid ( 0, 0 ) ( 1, 1 )
                        |> Expect.within epsAbsolute 0.5
            , test "zGTrapezoid" <|
                \_ ->
                    HullSlices.zGTrapezoid ( 0, 0 ) ( 1, 1 )
                        |> Expect.within epsAbsolute 0.33333333337
            , test "zTrapezoid" <|
                \_ ->
                    HullSliceUtilities.zTrapezoid ( 0, 0 ) ( 1, 1 )
                        -- |> Expect.within epsAbsolute 0.16666666667
                        |> Expect.within epsAbsolute 0.25
            ]
        , test "yGTrapezoid" <|
            \_ ->
                HullSliceUtilities.yGTrapezoid ( 0, 0 ) ( 1, 1 )
                    |> Expect.within epsAbsolute 0.33333333337
        , test "zGTrapezoid" <|
            \_ ->
                HullSlices.zGTrapezoid ( -2.5, 5.111831578947369 ) ( -2.181777777777777, 5.0440000000000005 )
                    |> Expect.within epsAbsolute 0.15875687266820834
        , test "areaTrapezoid" <|
            \_ ->
                HullSliceUtilities.areaTrapezoid ( -2.5, 5.111831578947369 ) ( -2.181777777777777, 5.0440000000000005 )
                    |> Expect.within epsAbsolute 1.615905646783629
        , test "zTrapezoid2" <|
            \_ ->
                HullSliceUtilities.zTrapezoid ( -3.0, 5 ) ( -2.5, 5.0 )
                    |> Expect.within epsAbsolute -6.875
        , test "zTrapezoid3" <|
            \_ ->
                HullSliceUtilities.zTrapezoid ( -3.0, 5 ) ( 0.0, 5.0 )
                    |> Expect.within epsAbsolute -22.5
        , test "struct" <|
            \_ ->
                { a = 3, b = 2 }
                    |> Expect.equal { a = 3, b = 2 }

        -- , test "zyaForSlice" <|
        --     \_ ->
        --         HullSliceUtilities.zyaForSlice { x = 25.0, zylist = [ ( -3.0, 5.0 ), ( -2.5, 5.0 ) ] }
        --             |> Expect.equal { x = 25.0, kz = -0.5, ky = 0.0, area = 2.5 }
        , test "denormalizedSlicesT3" <|
            \_ ->
                HullSlices.denormalizedHSList { breadth = 10, depth = 10, length = 100, xmin = 0, ymin = -5, zmin = -10 }
                    [ { x = 0, y = [ 1, 1 ], zmax = 0.5, zmin = 0 }
                    , { x = 0.25, y = [ 1, 1 ], zmax = 0.75, zmin = 0 }
                    , { x = 0.5, y = [ 1, 1 ], zmax = 1, zmin = 0 }
                    , { x = 0.75, y = [ 1, 1 ], zmax = 0.75, zmin = 0 }
                    , { x = 1, y = [ 1, 1 ], zmax = 0.5, zmin = 0 }
                    ]
                    |> Expect.equal
                        [ { x = 0, y = [ 5, 5 ], zmax = -5, zmin = -10 }
                        , { x = 25, y = [ 5, 5 ], zmax = -2.5, zmin = -10 }
                        , { x = 50, y = [ 5, 5 ], zmax = 0, zmin = -10 }
                        , { x = 75, y = [ 5, 5 ], zmax = -2.5, zmin = -10 }
                        , { x = 100, y = [ 5, 5 ], zmax = -5, zmin = -10 }
                        ]
        , test "denormalizedSlicesT1" <|
            \_ ->
                HullSlices.denormalizedHSList { breadth = 10, depth = 10, length = 100, xmin = 0, ymin = -5, zmin = -10 }
                    [ { x = 0, y = [ 1, 1, 0.5 ], zmax = 1, zmin = 0 }
                    , { x = 1, y = [ 1, 1, 0.5 ], zmax = 1, zmin = 0 }
                    ]
                    |> Expect.equal
                        [ { x = 0, y = [ 5, 5, 0 ], zmax = 0, zmin = -10 }
                        , { x = 100, y = [ 5, 5, 0 ], zmax = 0, zmin = -10 }
                        ]
        , test "denormalizedSlicesT4" <|
            \_ ->
                HullSlices.denormalizedHSList { breadth = 10, depth = 10, length = 100, xmin = 0, ymin = -5, zmin = -10 }
                    [ { x = 0, y = [ 1, 1, 0.5 ], zmax = 0.8, zmin = 0.4 }
                    ]
                    |> Expect.equal
                        [ { x = 0, y = [ 5, 5, 0 ], zmax = -2, zmin = -6 }
                        ]
        , test "intersectBelowSlicesZY" <|
            \_ ->
                HullSliceUtilities.intersectBelow { xmin = 0, xmax = 100 }
                    -3
                    [ { x = 0, y = [ 5, 5 ], zmax = -5, zmin = -10 }
                    , { x = 25, y = [ 5, 5 ], zmax = -2.5, zmin = -10 }
                    , { x = 50, y = [ 5, 5 ], zmax = 0, zmin = -10 }
                    , { x = 75, y = [ 5, 5 ], zmax = -2.5, zmin = -10 }
                    , { x = 100, y = [ 5, 5 ], zmax = -5, zmin = -10 }
                    ]
                    |> Expect.equal
                        { lhs =
                            [ { x = 25, zylist = [ ( -3, 5 ), ( -2.5, 5 ) ] }
                            , { x = 50, zylist = [ ( -3, 5 ), ( 0, 5 ) ] }
                            , { x = 75, zylist = [ ( -3, 5 ), ( -2.5, 5 ) ] }
                            ]
                        , xmax = 100
                        , xmin = 0
                        }
        , test "hullVolume" <|
            \_ ->
                HullSliceUtilities.hullVolume { xmin = 0, xmax = 100 } [ { x = 50, area = 2 } ]
                    |> Expect.within epsAbsolute 100.0
        , test "hullVolume2" <|
            \_ ->
                HullSliceUtilities.hullVolume { xmin = 0, xmax = 100 } [ { x = 25, area = 5 }, { x = 50, area = 30 }, { x = 75, area = 5 } ]
                    |> Expect.within epsAbsolute 1000.0
        , test "hullKBz" <|
            \_ ->
                HullSlices.hullKBz { xmin = 0, xmax = 100 } [ { x = 50, area = 2, kz = 1, ky = 0 } ]
                    |> Expect.within epsAbsolute 100.0
        ]
