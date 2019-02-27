module HullSliceUtilities exposing
    ( areaTrapezoid
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


fromNZ : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
fromNZ z curve =
    -- convert z normalized to absolute value
    -- z in [0,1]
    z * (curve.zmax - curve.zmin) + curve.zmin


toNZ : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
toNZ z curve =
    -- convert absolute z to normalized
    (z - curve.zmin) / (curve.zmax - curve.zmin)
