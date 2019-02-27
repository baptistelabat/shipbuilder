module HullSliceUtilities exposing
    ( areaTrapezoid
    , trapezoidCentroid
    , yTrapezoid
    , zTrapezoid
    )

import Array


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


type alias HullSliceXY =
    { x : Float
    , zylist : List ( Float, Float )
    }


type alias ObjXKzKyArea =
    { x : Float
    , kz : Float
    , ky : Float
    , area : Float
    }


square : Float -> Float
square n =
    n ^ 2


areaTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
areaTrapezoid ( z1, y1 ) ( z2, y2 ) =
    -- http://mathworld.wolfram.com/Trapezoid.html
    let
        a =
            abs y1

        b =
            abs y2

        c =
            abs (z2 - z1)

        area =
            0.5 * (a + b) * c

        -- _ =
        --     Debug.log "areaTrapezoid" area
    in
    area


zTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
zTrapezoid ( z1, y1 ) ( z2, y2 ) =
    -- http://mathworld.wolfram.com/Trapezoid.html
    let
        a =
            abs y1

        b =
            abs y2

        c =
            abs (z2 - z1)

        h =
            c

        d =
            sqrt (square c + square (y2 - y1))
    in
    (b + 2 * a) / (3 * (a + b)) * h


yTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
yTrapezoid ( z1, y1 ) ( z2, y2 ) =
    -- http://mathworld.wolfram.com/Trapezoid.html
    let
        a =
            abs y1

        b =
            abs y2

        c =
            abs (z2 - z1)

        d =
            sqrt (square c + square (y2 - y1))

        dz =
            z2 - z1
    in
    b / 2.0 + (2 * a + b) * (square c - square d) / 6 * (square b - square a)


trapezoidCentroid : ( Float, Float ) -> ( Float, Float ) -> ( Float, Float, Float )
trapezoidCentroid p1 p2 =
    -- calculate centroid z, y, and area
    ( zTrapezoid p1 p2, yTrapezoid p1 p2, areaTrapezoid p1 p2 )


fromNZ : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
fromNZ z curve =
    -- convert z normalized to absolute value
    -- z in [0,1]
    z * (curve.zmax - curve.zmin) + curve.zmin


toNZ : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
toNZ z curve =
    -- convert absolute z to normalized
    (z - curve.zmin) / (curve.zmax - curve.zmin)


trapezoidCentroidForList : List ( Float, Float ) -> List ( Float, Float, Float )
trapezoidCentroidForList list =
    -- calculate (z,y,a) on a list. return a list of 3-uplet
    case list of
        p1 :: p2 :: xs ->
            trapezoidCentroid p1 p2 :: trapezoidCentroidForList (p2 :: xs)

        _ ->
            []


totalArea : List ( Float, Float, Float ) -> Float
totalArea l =
    l
        |> List.map (\( z, y, a ) -> a)
        |> List.sum


totalProductZ : List ( Float, Float, Float ) -> Float
totalProductZ l =
    l
        |> List.map (\( z, y, a ) -> z * a)
        |> List.sum


totalProductY : List ( Float, Float, Float ) -> Float
totalProductY l =
    l
        |> List.map (\( z, y, a ) -> y * a)
        |> List.sum


zyaForSlice_ : List ( Float, Float ) -> { kz : Float, ky : Float, area : Float }
zyaForSlice_ list =
    -- return zcentroid, ycentroid, and area for the HullSlice
    let
        l1 =
            trapezoidCentroidForList list

        ta =
            totalArea l1

        tz =
            totalProductZ l1

        ty =
            totalProductY l1
    in
    -- hull symetry => 2.0 * ta
    { kz = tz / ta, ky = ty / ta, area = 2 * ta }
