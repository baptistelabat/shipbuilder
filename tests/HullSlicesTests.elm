module HullSlicesTests exposing (suite)

import CustomFuzzers exposing (..)
import EncodersDecoders exposing (normalizeSlicesPosition)
import Expect exposing (..)
import Fuzz
import HullSliceModifiers
import HullSlices
    exposing
        ( HullSlices
        , applyCustomPropertiesToHullSlices
        , area
        , areaTrapezoid
        , calculateCentroid
        , calculateSliceArea
        , centroidAbscissa
        , clip
        , denormalizeHullSlice
        , denormalizeHullSlices
        , emptyHullSlices
        , extractXYZ
        , integrate
        , isHullCustomized
        , scale
        , toHullSliceAsZYList
        , trapezoidCentroid
        , volume
        , zGTrapezoid
        , zTrapezoid
        , zminForEachTrapezoid
        )
import HullSlicesMetrics exposing (HullSlicesMetrics, emptyHullSlicesMetrics, fillHullSliceMetrics, getCentroidAreaForEachImmersedSlice)
import Interpolate.Cubic
import Json.Decode as Decode
import StringValueInput
import Test exposing (..)
import TestData


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


s : Interpolate.Cubic.Spline
s =
    Interpolate.Cubic.withRange 10 16 [ 12, 23, 34, 45, 56, 67, 78 ]


testSpline : Float -> Float -> (() -> Expect.Expectation)
testSpline x y =
    \_ -> Expect.equal y <| Interpolate.Cubic.valueAt x s


hullSlices : HullSlices
hullSlices =
    Result.withDefault emptyHullSlices (Decode.decodeString EncodersDecoders.decoder TestData.hullSliceJson)


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


expectAll : List Expectation -> Expectation
expectAll expectations =
    Expect.all (List.map (\expectation -> \_ -> expectation) expectations) ()


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
                    Expect.equal (Just { value = 1.2, string = "1.2", description = "Length over all", unit = "m", nbOfDigits = 1 })
                        (HullSliceModifiers.setLengthOverAll "1.234" hullSlices
                            |> .custom
                            |> .length
                        )
            , test "Set nothing if new length equals original length" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setLengthOverAll "22.8" hullSlices
                            |> .custom
                            |> .length
                        )
            , test "Can set breadth" <|
                \_ ->
                    Expect.equal (Just { value = 13.4, string = "13.4", description = "Breadth", unit = "m", nbOfDigits = 1 })
                        (HullSliceModifiers.setBreadth "13.4125" hullSlices
                            |> .custom
                            |> .breadth
                        )
            , test "Set nothing if new breadth equals original breadth" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setBreadth "6.9" hullSlices
                            |> .custom
                            |> .breadth
                        )
            , test "Can set draught" <|
                \_ ->
                    Expect.equal (Just { value = 13.4, string = "13.4", description = "Draught", unit = "m", nbOfDigits = 1 })
                        (HullSliceModifiers.setDraught "13.4125" hullSlices
                            |> .custom
                            |> .draught
                        )
            , test "Set nothing if new draught equals original draught" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setDraught "1.4" hullSlices
                            |> .custom
                            |> .draught
                        )
            , test "Can set depth" <|
                \_ ->
                    Expect.equal (Just { value = 13.4, string = "13.4", description = "Depth", unit = "m", nbOfDigits = 1 })
                        (HullSliceModifiers.setDepth "13.4125" hullSlices
                            |> .custom
                            |> .depth
                        )
            , test "Set nothing if new depth equals original depth" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setDepth "6.8" hullSlices
                            |> .custom
                            |> .depth
                        )
            ]
        , describe "Reset"
            [ test "Can reset length over all" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setLengthOverAll "1" hullSlices
                            |> HullSliceModifiers.resetSlicesToOriginals
                            |> .custom
                            |> .length
                        )
            , test "Can reset breadth" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setLengthOverAll "1" hullSlices
                            |> HullSliceModifiers.resetSlicesToOriginals
                            |> .custom
                            |> .breadth
                        )
            , test "Can reset depth" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setLengthOverAll "1" hullSlices
                            |> HullSliceModifiers.resetSlicesToOriginals
                            |> .custom
                            |> .depth
                        )
            , test "Can reset draught" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setLengthOverAll "1" hullSlices
                            |> HullSliceModifiers.resetSlicesToOriginals
                            |> .custom
                            |> .draught
                        )
            , test "Can reset slices position" <|
                \_ ->
                    Expect.equal Nothing
                        (HullSliceModifiers.setPrismaticCoefficient "0.5" hullSlices
                            |> HullSliceModifiers.resetSlicesToOriginals
                            |> .custom
                            |> .hullslicesPositions
                        )
            ]
        , describe "Area"
            [ test "Can calculate slice areas" <|
                \_ ->
                    Expect.equal [ 0, 0.12366816963835184, 0 ] (hullSlices |> HullSliceModifiers.setBreadth "10" |> fillHullSliceMetrics |> getCentroidAreaForEachImmersedSlice |> List.map (.area >> (*) 2))
            , describe "Clipper" <|
                [ test "Clip one interval a--zmin=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 6, 3 ) ] <| clip 1 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin--a=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| clip 4 5 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--zmin=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| clip 2 4 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin--a=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| clip 5 7 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval a--b--zmin----zmax" <|
                    \_ ->
                        Expect.equal [] <| clip 1 2 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip one interval zmin----zmax--a--b" <|
                    \_ ->
                        Expect.equal [] <| clip 7 8 [ ( 3, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--zmin=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ] <| clip 1 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin--a=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 4, 3 ), ( 5, 3 ) ] <| clip 4 5 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--zmin=====b--zmax" <|
                    \_ ->
                        Expect.equal [ ( 3, 3 ), ( 4, 3 ) ] <| clip 2 4 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin--a=====zmax--b" <|
                    \_ ->
                        Expect.equal [ ( 5, 3 ), ( 6, 3 ) ] <| clip 5 7 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals a--b--zmin----zmax" <|
                    \_ ->
                        Expect.equal [] <| clip 1 2 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Clip several intervals zmin----zmax--a--b" <|
                    \_ ->
                        Expect.equal [] <| clip 7 8 [ ( 3, 3 ), ( 4, 3 ), ( 5, 3 ), ( 6, 3 ) ]
                , test "Can clip properly a=zmin and b=zmax" <|
                    \_ ->
                        Expect.equal [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ] <| clip 0 2 [ ( 0, 3 ), ( 1, 3 ), ( 2, 3 ) ]
                , fuzz (Fuzz.map2 Tuple.pair (Fuzz.constant 2) (Fuzz.constant 3)) "Square" <|
                    \( width, height ) ->
                        Expect.equal (abs (width * height)) (area 0 (abs width) { zmin = 0, zmax = width, y = [ abs height, abs height, abs height ] })
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz threeIncreasingFloats "Vertical line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 3, 3 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (b - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (b - zmina))
                    , fuzz threeIncreasingFloats "Vertical line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (zmaxb - a))
                    , fuzz twoIncreasingFloats "Vertical line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 3, 3 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
                                |> Expect.within epsAbsolute (3 * (zmax - a))
                    , fuzz threeIncreasingFloats "Vertical line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 3, 3 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 3, 3 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute 0
                    , fuzz threeIncreasingFloats "Oblique line (case 2)" <|
                        \( a, bzmin, zmax ) ->
                            area a bzmin { zmin = bzmin, zmax = zmax, y = [ 3, 2, 1 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
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
                            area a b { zmin = zmin, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a - b) * (a + b + zmin - 3 * zmax)) / (zmin - zmax))

                    -- Computed by Wolfram: https://www.wolframalpha.com/input/?i=integrate+3-2*(x-zmin)%2F(zmax-zmin)+from+x+%3D+a+to+b
                    , fuzz threeIncreasingFloats "Oblique line (case 5)" <|
                        \( zmina, b, zmax ) ->
                            area zmina b { zmin = zmina, zmax = zmax, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((zmina - b) * (zmina + b + zmina - 3 * zmax)) / (zmina - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 6)" <|
                        \( zmin, a, zmaxb ) ->
                            area a zmaxb { zmin = zmin, zmax = zmaxb, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a - zmaxb) * (a + zmaxb + zmin - 3 * zmaxb)) / (zmin - zmaxb))
                    , fuzz twoIncreasingFloats "Oblique line (case 7)" <|
                        \( zmina, zmaxb ) ->
                            area zmina zmaxb { zmin = zmina, zmax = zmaxb, y = [ 3, 2, 1 ] }
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
                            area a b { zmin = x1, zmax = x3, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    (-((a + zmin - 2 * zmax) * (a - zmax)) / (zmin - zmax))
                    , fuzz threeIncreasingFloats "Oblique line (case 9)" <|
                        \( zmin, zmaxa, b ) ->
                            area zmaxa b { zmin = zmin, zmax = zmaxa, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    0
                    , fuzz fourIncreasingFloats "Oblique line (case 10)" <|
                        \{ x1, x2, x3, x4 } ->
                            area x3 x4 { zmin = x1, zmax = x2, y = [ 3, 2, 1 ] }
                                |> Expect.within epsAbsolute
                                    0
                    , test "Bug detected when calculating toblerone area" <|
                        \_ ->
                            area 3.0100000959552076 3.010000694363696 { x = 0, zmin = 3, zmax = 3.010000694363696, y = [ -9.99, -9.9925, -9.995 ] }
                                |> Expect.within (Absolute 1.0e-14)
                                    -0.00000598109275204103
                    ]
                , describe "Real slice"
                    [ test "Anthineas" <|
                        \_ ->
                            area 0.31587930659489755 0.5298349579969897 { zmin = 0.31587930659489755, zmax = 0.5298349579969897, y = [ 0.964899527258786, 0.9648943694688346, 0.9629765202249831, 0.9592250480632435, 0.955473575901504, 0.9502377948034448, 0.9394176761317832, 0.9282437133662546, 0.9102579602794127, 0.742320749879794 ] }
                                |> Expect.within epsAbsolute
                                    0.20027049633242555
                    , test "Cube" <|
                        \_ ->
                            List.map (calculateSliceArea TestData.cube) TestData.cube.slices
                                |> Expect.equal
                                    [ TestData.cube.breadth.value * TestData.cube.draught.value, TestData.cube.breadth.value * TestData.cube.draught.value, TestData.cube.breadth.value * TestData.cube.draught.value ]
                    , test "Cube after changing breadth" <|
                        \_ ->
                            List.map (calculateSliceArea <| HullSliceModifiers.setBreadth "10" TestData.cube) TestData.cube.slices
                                |> Expect.equal
                                    [ 10 * TestData.cube.draught.value, 10 * TestData.cube.draught.value, 10 * TestData.cube.draught.value ]
                    , fuzz (Fuzz.map3 makeTriplet positiveFloat positiveFloat (Fuzz.floatRange 0 1)) "Toblerone" <|
                        \( breadth, depth, draughtDividedByDepth ) ->
                            let
                                t =
                                    TestData.toblerone breadth depth (draughtDividedByDepth * depth)

                                expectedArea =
                                    draughtDividedByDepth * draughtDividedByDepth * depth * breadth / 2

                                setDraught : Float -> { a | draught : StringValueInput.FloatInput } -> { a | draught : StringValueInput.FloatInput }
                                setDraught val slice =
                                    { slice | draught = val |> StringValueInput.asValueIn slice.draught }
                            in
                            Expect.all
                                (List.map
                                    (calculateSliceArea t)
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

                                draught =
                                    draughtDividedByDepth * depth

                                t =
                                    TestData.toblerone breadth depth draught

                                expectedArea =
                                    draughtDividedByDepth * draughtDividedByDepth * depth * breadth / 2
                            in
                            Expect.all
                                (List.map
                                    (calculateSliceArea t)
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
                    scale
                        TestData.cube
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmin
                        |> Expect.within epsAbsolute
                            (TestData.cube.zmin + 0.5 * TestData.cube.depth.value)
            , test "zmax should be scaled properly" <|
                \_ ->
                    scale
                        TestData.cube
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .zmax
                        |> Expect.within epsAbsolute
                            (TestData.cube.zmin + 0.9 * TestData.cube.depth.value)
            , test "y should be scaled properly" <|
                \_ ->
                    let
                        ymin =
                            -TestData.cube.breadth.value / 2
                    in
                    scale
                        TestData.cube
                        { x = 1, zmin = 0.5, zmax = 0.9, y = [ 0.1, 0.2, 0.5 ] }
                        |> .y
                        |> Expect.equal
                            [ ymin + TestData.cube.breadth.value * 0.1, ymin + TestData.cube.breadth.value * 0.2, ymin + TestData.cube.breadth.value * 0.5 ]
            ]
        , describe "Volume"
            [ test
                "Triangular area curve"
              <|
                \_ ->
                    volume
                        (List.map2 (\x area -> { x = x, area = area }) [ -1, 0, 1, 2, 3, 4, 5 ] [ 0, 1, 2, 3, 2, 1, 0 ])
                        |> Expect.within epsAbsolute
                            9
            , fuzz
                (Fuzz.map3 (\length_ a b -> { length_ = length_, a = a, b = b }) positiveFloat positiveFloat positiveFloat)
                "Four-part area curve"
              <|
                \{ length_, a, b } ->
                    volume
                        (List.map2 (\x area -> { x = x, area = area }) [ 0, length_ / 4, length_ / 2, 0.75 * length_, length_ ] [ 0, a, a + b, a, 0 ])
                        |> Expect.within epsRelative
                            (3 * a * length_ / 4 + b * length_ / 4)
            ]
        , describe "Longitudinal position of the centroid of an area curve"
            [ fuzz (Fuzz.map2 Tuple.pair positiveFloat positiveFloat) "Centroid of a cube" <|
                \( breadth, height ) ->
                    { zmin = 0, zmax = breadth, y = [ height, height, height, height, height, height ] }
                        |> centroidAbscissa
                        |> Expect.within epsRelative (breadth / 2)
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid with offset" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ height, height, height, height ] }
                        |> centroidAbscissa
                        |> Expect.within epsRelative (zmin + (breadth / 2))
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid of a triangle" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ 0, height / 2, height, height / 2, 0 ] }
                        |> centroidAbscissa
                        |> Expect.within epsRelative (zmin + (breadth / 2))
            , test "Can calculate the centroid of a trapeze" <|
                \_ ->
                    trapezoidCentroid 30 20 40
                        |> Expect.all
                            [ Tuple.first >> Expect.within epsRelative (50 / 3), Tuple.second >> Expect.within epsRelative 900 ]
            , test "Can calculate the centroid of a trapeze with y1 > y2" <|
                \_ ->
                    trapezoidCentroid 30 40 20
                        |> Expect.all
                            [ Tuple.first >> Expect.within CustomFuzzers.epsRelative (40 / 3), Tuple.second >> Expect.within CustomFuzzers.epsRelative 900 ]
            , test "Can calculate zmin for each trapezoid" <|
                \_ ->
                    { zmin = -12, zmax = 3, y = [ 123, 654, 789, 951 ] }
                        |> zminForEachTrapezoid
                        |> Expect.equalLists [ -12, -7, -2 ]
            , test "Can calculate the centroid of a square" <|
                \_ ->
                    trapezoidCentroid 1.0e-6 1.0e-6 1.0e-6
                        |> Expect.all
                            [ Tuple.first >> Expect.within CustomFuzzers.epsRelative 5.0e-7, Tuple.second >> Expect.within CustomFuzzers.epsRelative 1.0e-12 ]
            , fuzz (Fuzz.map3 (\x y z -> ( x, y, z )) Fuzz.float positiveFloat positiveFloat) "Centroid of a non-symmetrical shape" <|
                \( zmin, breadth, height ) ->
                    { zmin = zmin, zmax = zmin + breadth, y = [ 0, height ] }
                        |> centroidAbscissa
                        |> Expect.within CustomFuzzers.epsRelative (zmin + (2 * breadth / 3))
            ]
        , describe "HullSliceAsZYList test"
            [ describe "Can transform Slice in HullSliceAsZYList"
                [ test "Transformation keep the same x" <|
                    \_ ->
                        Expect.equal (Just 0)
                            (List.head TestData.anthineas.slices
                                |> Maybe.map toHullSliceAsZYList
                                |> Maybe.map .x
                            )
                , test "Transformation keep the same y" <|
                    \_ ->
                        let
                            y2Test =
                                [ 1
                                , 0.9
                                , 0.8
                                , 0.5
                                ]
                        in
                        List.drop 1 TestData.simpleHull.slices
                            |> List.head
                            |> Maybe.map toHullSliceAsZYList
                            |> Maybe.map .zylist
                            |> Maybe.map (List.map Tuple.second)
                            |> Maybe.withDefault []
                            |> List.map2 (\f1 f2 -> Expect.within epsAbsolute f1 f2) y2Test
                            |> expectAll
                , test "Transformation compute z" <|
                    \_ ->
                        let
                            z2Test =
                                [ 0
                                , 0.26666666666666666
                                , 0.5333333333333333
                                , 0.8
                                ]
                        in
                        List.drop 1 TestData.simpleHull.slices
                            |> List.head
                            |> Maybe.map toHullSliceAsZYList
                            |> Maybe.map .zylist
                            |> Maybe.map (List.map Tuple.first)
                            |> Maybe.withDefault []
                            |> List.map2 (\f1 f2 -> Expect.within epsAbsolute f1 f2) z2Test
                            |> expectAll
                ]
            , test "Can transform HullSliceAsZYList in HullSlice  " <|
                \_ ->
                    (Just <|
                        HullSlices.fromHullSliceAsZYList
                            { x = 0.25
                            , zylist =
                                [ ( 0, 1 )
                                , ( 0.26666666666666666, 0.9 )
                                , ( 0.5333333333333333, 0.8 )
                                , ( 0.8, 0.5 )
                                ]
                            }
                    )
                        |> Expect.equal
                            (List.head <| List.drop 1 TestData.simpleHull.slices)
            ]
        , describe "Coordinates test"
            [ test "Can extract X position of each point of a slice" <|
                \_ ->
                    let
                        x2Test =
                            [ 0.25, 0.25, 0.25, 0.25 ]
                    in
                    List.drop 1 TestData.simpleHull.slices
                        |> List.head
                        |> Maybe.map toHullSliceAsZYList
                        |> Maybe.map extractXYZ
                        |> Maybe.map (List.map .x)
                        |> Maybe.withDefault []
                        |> List.map2 (\f1 f2 -> Expect.within epsAbsolute f1 f2) x2Test
                        |> expectAll
            , test "Can extract Y position of each point of a slice" <|
                \_ ->
                    let
                        y2Test =
                            [ 1, 0.9, 0.8, 0.5 ]
                    in
                    List.drop 1 TestData.simpleHull.slices
                        |> List.head
                        |> Maybe.map toHullSliceAsZYList
                        |> Maybe.map extractXYZ
                        |> Maybe.map (List.map .y)
                        |> Maybe.withDefault []
                        |> List.map2 (\f1 f2 -> Expect.within epsAbsolute f1 f2) y2Test
                        |> expectAll
            , test "Can extract Z position of each point of a slice" <|
                \_ ->
                    let
                        z2Test =
                            [ 0, 0.26666666666666666, 0.5333333333333333, 0.8 ]
                    in
                    List.drop 1 TestData.simpleHull.slices
                        |> List.head
                        |> Maybe.map toHullSliceAsZYList
                        |> Maybe.map extractXYZ
                        |> Maybe.map (List.map .z)
                        |> Maybe.withDefault []
                        |> List.map2 (\f1 f2 -> Expect.within epsAbsolute f1 f2) z2Test
                        |> expectAll
            ]
        , test "Can construct HullSliceAsZYList with coordinates" <|
            \_ ->
                HullSlices.coordinatesToHullSliceAsZYList
                    [ { x = 0.25, y = 1, z = 0 }
                    , { x = 0.25, y = 0.9, z = 0.26666666666666666 }
                    , { x = 0.25, y = 0.8, z = 0.5333333333333333 }
                    , { x = 0.25, y = 0.5, z = 0.8 }
                    ]
                    |> Expect.equal
                        (List.drop 1 TestData.simpleHull.slices
                            |> List.head
                            |> Maybe.map toHullSliceAsZYList
                        )
        , test "Can construct slice with coordinates" <|
            \_ ->
                HullSlices.fromCoordinates
                    [ { x = 0.25, y = 1, z = 0 }
                    , { x = 0.25, y = 0.9, z = 0.26666666666666666 }
                    , { x = 0.25, y = 0.8, z = 0.5333333333333333 }
                    , { x = 0.25, y = 0.5, z = 0.8 }
                    ]
                    |> Expect.equal
                        (List.drop 1 TestData.simpleHull.slices
                            |> List.take 1
                        )
        , describe "HullSlices denormalization/normalization"
            [ describe "denormalization"
                [ test "denormalizeHullSlice" <|
                    \_ ->
                        compareHs
                            { x = 0, zmin = -4.8, zmax = -0.6, y = [ 2, 1, 0 ] }
                            (denormalizeHullSlice hs_param hs0)
                , test "denormalizedSlicesT3" <|
                    \_ ->
                        denormalizeHullSlices { breadth = 10, depth = 10, length = 100, xmin = 0, zmin = -10 }
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
                        denormalizeHullSlices { breadth = 10, depth = 10, length = 100, xmin = 0, zmin = -10 }
                            [ { x = 0, y = [ 1, 1, 0.5 ], zmax = 1, zmin = 0 }
                            , { x = 1, y = [ 1, 1, 0.5 ], zmax = 1, zmin = 0 }
                            ]
                            |> Expect.equal
                                [ { x = 0, y = [ 5, 5, 0 ], zmax = 0, zmin = -10 }
                                , { x = 100, y = [ 5, 5, 0 ], zmax = 0, zmin = -10 }
                                ]
                , test "denormalizedSlicesT4" <|
                    \_ ->
                        denormalizeHullSlices { breadth = 10, depth = 10, length = 100, xmin = 0, zmin = -10 }
                            [ { x = 0, y = [ 1, 1, 0.5 ], zmax = 0.8, zmin = 0.4 }
                            ]
                            |> Expect.equal
                                [ { x = 0, y = [ 5, 5, 0 ], zmax = -2, zmin = -6 }
                                ]
                , test "Get dimension parameters from list of slices" <|
                    \_ ->
                        HullSlices.getParamFromDenormalizedSlices
                            [ { x = 0
                              , zmin = 0
                              , zmax = 0
                              , y = [ 0, 0, 0, 0 ]
                              }
                            , { x = 50
                              , zmin = 0
                              , zmax = 10
                              , y = [ 10, 8, 6, 0 ]
                              }
                            , { x = 100
                              , zmin = 0
                              , zmax = 0
                              , y = [ 0, 0, 0, 0 ]
                              }
                            ]
                            |> Expect.equal
                                (Just { length = 100, breadth = 20, depth = 10, xmin = 0, zmin = 0 })
                ]
            , describe "normalization"
                [ test "Can normalize Slices position between 0 and 1" <|
                    \_ ->
                        normalizeSlicesPosition
                            [ { x = 0.01, y = [], zmax = 0, zmin = 0 }
                            , { x = 5, y = [], zmax = 0, zmin = 0 }
                            , { x = 9.8, y = [], zmax = 0, zmin = 0 }
                            ]
                            |> Expect.equal
                                [ { x = 0, y = [], zmax = 0, zmin = 0 }
                                , { x = 5 / (9.8 - 0.01), y = [], zmax = 0, zmin = 0 }
                                , { x = 1, y = [], zmax = 0, zmin = 0 }
                                ]
                , test "Can normalize a slice with dimension parameters" <|
                    \_ ->
                        HullSlices.normalizeHullSlice
                            { length = 100, breadth = 20, depth = 10, xmin = 0, zmin = 0 }
                            { x = 50, zmin = 0, zmax = 5, y = [ 10, 8, 6, 0 ] }
                            |> Expect.equal
                                { x = 0.5, zmin = 0, zmax = 0.5, y = [ 1, 0.9, 0.8, 0.5 ] }
                , test "Can normalize slices with dimension parameters" <|
                    \_ ->
                        HullSlices.normalizeHullSlices
                            [ { x = 0, zmin = 0, zmax = 0, y = [ 0, 0, 0, 0 ] }
                            , { x = 25, zmin = 0, zmax = 5, y = [ 10, 8, 6, 0 ] }
                            , { x = 50, zmin = 0, zmax = 10, y = [ 10, 8, 6, 0 ] }
                            , { x = 75, zmin = 0, zmax = 5, y = [ 10, 8, 6, 0 ] }
                            , { x = 100, zmin = 0, zmax = 0, y = [ 0, 0, 0, 0 ] }
                            ]
                            { length = 100, breadth = 20, depth = 10, xmin = 0, zmin = 0 }
                            |> Expect.equal
                                [ { x = 0, zmin = 0, zmax = 0, y = [ 0.5, 0.5, 0.5, 0.5 ] }
                                , { x = 0.25, zmin = 0, zmax = 0.5, y = [ 1, 0.9, 0.8, 0.5 ] }
                                , { x = 0.5, zmin = 0, zmax = 1, y = [ 1, 0.9, 0.8, 0.5 ] }
                                , { x = 0.75, zmin = 0, zmax = 0.5, y = [ 1, 0.9, 0.8, 0.5 ] }
                                , { x = 1, zmin = 0, zmax = 0, y = [ 0.5, 0.5, 0.5, 0.5 ] }
                                ]
                ]
            , describe "Normalization reversibility"
                [ test "Normalize and then denormalize a slice keep identity " <|
                    \_ ->
                        let
                            param =
                                { length = 100, breadth = 20, depth = 10, xmin = 0, zmin = 0 }
                        in
                        { x = 50, zmin = 0, zmax = 5, y = [ 10, 8, 6, 0 ] }
                            |> HullSlices.normalizeHullSlice param
                            |> HullSlices.denormalizeHullSlice param
                            |> Expect.equal
                                { x = 50, zmin = 0, zmax = 5, y = [ 10, 8, 6, 0 ] }
                ]
            ]
        , describe "HullSlices custom properties"
            [ test "Should store original slice positions" <|
                \_ ->
                    TestData.anthineas.originalSlicePositions
                        |> Expect.equal
                            (List.map .x TestData.anthineas.slices)
            , test "Apply custom properties to hullSlices" <|
                \_ ->
                    (HullSlices.applyCustomPropertiesToHullSlices <| TestData.cubeCustomized)
                        |> Expect.equal
                            { emptyHullSlices
                                | length = StringValueInput.floatInput 1 400
                                , breadth = StringValueInput.floatInput 1 30
                                , depth = StringValueInput.floatInput 1 20
                                , xmin = -1
                                , zmin = 3
                                , slices =
                                    [ { x = 0
                                      , zmin = 0
                                      , zmax = 1
                                      , y = [ 1, 1, 1, 1 ]
                                      }
                                    , { x = 0.6
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
                                , originalSlicePositions = [ 0, 0.6, 1 ]
                                , draught = StringValueInput.floatInput 1 1.5
                                , custom =
                                    { length = Nothing
                                    , breadth = Nothing
                                    , depth = Nothing
                                    , draught = Nothing
                                    , hullslicesPositions = Nothing
                                    }
                            }
            , test "Can know if a hull isn't customized" <|
                \_ ->
                    TestData.anthineas
                        |> isHullCustomized
                        |> Expect.false "Expected hull to not be customized"
            , test "Can know if a hull is customized" <|
                \_ ->
                    HullSliceModifiers.setLengthOverAll "10" TestData.anthineas
                        |> isHullCustomized
                        |> Expect.true "Expected hull to be customized"
            ]
        , describe "HullSliceUtilities"
            [ test "areaTrapezoid" <|
                \_ ->
                    areaTrapezoid ( 0, 0 ) ( 1, 1 )
                        |> Expect.within epsAbsolute 0.5
            , test "zGTrapezoid" <|
                \_ ->
                    zGTrapezoid ( 0, 0 ) ( 1, 1 )
                        |> Expect.within epsAbsolute 0.33333333337
            , test "zTrapezoid" <|
                \_ ->
                    zTrapezoid ( 0, 0 ) ( 1, 1 )
                        -- |> Expect.within epsAbsolute 0.16666666667
                        |> Expect.within epsAbsolute 0.25
            ]
        , test "zGTrapezoid" <|
            \_ ->
                zGTrapezoid ( -2.5, 5.111831578947369 ) ( -2.181777777777777, 5.0440000000000005 )
                    |> Expect.within epsAbsolute 0.15875687266820834
        , test "areaTrapezoid" <|
            \_ ->
                areaTrapezoid ( -2.5, 5.111831578947369 ) ( -2.181777777777777, 5.0440000000000005 )
                    |> Expect.within epsAbsolute 1.615905646783629
        , test "zTrapezoid2" <|
            \_ ->
                zTrapezoid ( -3.0, 5 ) ( -2.5, 5.0 )
                    |> Expect.within epsAbsolute -6.875
        , test "zTrapezoid3" <|
            \_ ->
                zTrapezoid ( -3.0, 5 ) ( 0.0, 5.0 )
                    |> Expect.within epsAbsolute -22.5
        , test "struct" <|
            \_ ->
                { a = 3, b = 2 }
                    |> Expect.equal { a = 3, b = 2 }
        , test "intersectBelowSlicesZY" <|
            \_ ->
                let
                    hull =
                        TestData.cube |> fillHullSliceMetrics
                in
                HullSlicesMetrics.intersectBelow -3 hull
                    |> Expect.equal
                        { hullSlices =
                            [ { x = -1, zylist = [ ( 3, 10 ), ( 6.333333333333334, 10 ), ( 9.666666666666668, 10 ), ( 13, 10 ) ] }
                            , { x = 99, zylist = [ ( 3, 10 ), ( 6.333333333333334, 10 ), ( 9.666666666666668, 10 ), ( 13, 10 ) ] }
                            , { x = 199, zylist = [ ( 3, 10 ), ( 6.333333333333334, 10 ), ( 9.666666666666668, 10 ), ( 13, 10 ) ] }
                            ]
                        , xmax = 199
                        , xmin = -1
                        }
        , test "hullVolume" <|
            \_ ->
                volume [ { x = 0, area = 0 }, { x = 50, area = 2 }, { x = 100, area = 0 } ]
                    |> Expect.within epsAbsolute 100.0
        , test "hullVolume2" <|
            \_ ->
                volume [ { x = 0, area = 0 }, { x = 25, area = 5 }, { x = 50, area = 30 }, { x = 75, area = 5 }, { x = 100, area = 0 } ]
                    |> Expect.within epsAbsolute 1000.0
        , test "centroidAreaForEachImmersedSlice" <|
            \_ ->
                let
                    centroidAreaForEachImmersedSlice =
                        TestData.cube |> fillHullSliceMetrics |> getCentroidAreaForEachImmersedSlice
                in
                calculateCentroid centroidAreaForEachImmersedSlice
                    |> Expect.within epsAbsolute 48000
        ]
