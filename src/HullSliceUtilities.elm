module HullSliceUtilities exposing
    ( areaTrapezoid
    , demormalizedHullSlice
    , denormalizedHSList
    , hullVolume
    , intersectBelow
    , kBx
    ,  kBz

    , volume
    , yTrapezoid
    , zTrapezoid
    , zyaForSlice
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
    let
        a =
            abs y1

        b =
            abs y2

        c =
            abs (z2 - z1)

        area =
            0.5 * (a + b) * c
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


actionForHullSliceXY : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
actionForHullSliceXY function list =
    case list of
        ( z1, y1 ) :: ( z2, y2 ) :: rest ->
            function ( z1, y1 ) ( z2, y2 ) + actionForHullSliceXY function (( z2, y2 ) :: rest)

        _ ->
            0


zyaForSlice : HullSliceXY -> ObjXKzKyArea
zyaForSlice hsXY =
    let
        -- obj =
        --     zyaForSlice_ hsXY.zylist
        area_ =
            actionForHullSliceXY areaTrapezoid hsXY.zylist

        kz_ =
            actionForHullSliceXY zTrapezoid hsXY.zylist

        ky_ =
            actionForHullSliceXY yTrapezoid hsXY.zylist
    in
    { x = hsXY.x, kz = kz_, ky = ky_, area = area_ }


getInterpolateValuesAndSubList : Float -> List ( Float, Float ) -> List ( Float, Float )
getInterpolateValuesAndSubList z0 list =
    -- find z(i), z(i+1) / z0 >= z(i) && z0 < z(i+1)
    -- k = (z0-z(i)) / (z(i+1) - z(i))
    -- y0 = k*y(i) + (1-k)*y(i+1)
    -- subList = (z0,y0)::(z(i+1),y(i+1))::rest
    let
        filterL : Float -> List ( Float, Float ) -> List ( Float, Float )
        filterL z lst =
            case lst of
                ( z1, y1 ) :: ( z2, y2 ) :: rest ->
                    case z < z2 && z >= z1 of
                        True ->
                            let
                                k =
                                    (z - z1) / (z2 - z1)

                                y =
                                    k * y1 + (1 - k) * y2
                            in
                            ( z, y ) :: ( z2, y2 ) :: rest

                        False ->
                            filterL z (( z2, y2 ) :: rest)

                _ ->
                    []

        subList =
            filterL z0 list
    in
    subList


denormalizedHSList : { a | length : Float, breadth : Float, depth : Float, xmin : Float, ymin : Float, zmin : Float } -> List HullSlice -> List HullSlice
denormalizedHSList param l =
    List.map (demormalizedHullSlice param) l


demormalizedHullSlice : { a | length : Float, breadth : Float, depth : Float, xmin : Float, ymin : Float, zmin : Float } -> HullSlice -> HullSlice
demormalizedHullSlice param hs =
    -- y denormalisé dans intervalle [0,breadth/2]
    let
        denormalizedY : Float -> Float -> Float -> Float
        denormalizedY ymin br y =
            y * br + ymin

        denormalizedZ : Float -> Float -> Float -> Float
        denormalizedZ zmin depth z =
            z * depth + zmin

        x =
            hs.x * param.length + param.xmin

        hs_zmin =
            denormalizedZ param.zmin param.depth hs.zmin

        hs_zmax =
            denormalizedZ param.zmin param.depth hs.zmax

        hs_y =
            List.map (denormalizedY param.ymin param.breadth) hs.y

        res =
            { x = x, zmin = hs_zmin, zmax = hs_zmax, y = hs_y }
    in
    res


toXY : HullSlice -> HullSliceXY
toXY hs =
    let
        zmax =
            hs.zmax

        zmin =
            hs.zmin

        y =
            hs.y

        dz : Float
        dz =
            (zmax - zmin) / (toFloat <| max 1 <| List.length y - 1)

        acc : ( Int, Float ) -> ( Float, Float )
        acc ( idx, y_ ) =
            ( zmin + toFloat idx * dz, y_ )

        lst =
            y
                |> Array.fromList
                |> Array.toIndexedList
                |> List.map acc
    in
    { x = hs.x, zylist = lst }


hullVolume : { xmin : Float, xmax : Float } -> List { a | x : Float, area : Float } -> Float
hullVolume config list =
    let
        xmin =
            config.xmin

        xmax =
            config.xmax

        toXA : List { a | x : Float, area : Float } -> List { x : Float, area : Float }
        toXA =
            List.map (\u -> { x = u.x, area = u.area })

        newList =
            List.concat [ [ { x = xmin, area = 0.0 } ], toXA list, [ { x = xmax, area = 0.0 } ] ]
    in
    volume newList


volume : List { a | x : Float, area : Float } -> Float
volume lo =
    case lo of
        o1 :: o2 :: rest ->
            let
                x1 =
                    o1.x

                a1 =
                    o1.area

                x2 =
                    o2.x

                a2 =
                    o2.area

                value =
                    abs (((a1 + a2) / 2.0) * (x2 - x1))
            in
            value + volume (o2 :: rest)

        _ ->
            0


kBx : List ObjXKzKyArea -> Float
kBx lo =
    case lo of
        o1 :: o2 :: rest ->
            let
                x1 =
                    o1.x

                a1 =
                    o1.area

                x2 =
                    o2.x

                a2 =
                    o2.area

                value =
                    ((a1 * x1 + a2 * x2) / 2.0) * (x2 - x1)
            in
            value + kBx (o2 :: rest)

        _ ->
            0


kBz : List ObjXKzKyArea -> Float
kBz lo =
    case lo of
        o1 :: o2 :: rest ->
            let
                x1 =
                    o1.x

                x2 =
                    o2.x

                a1 =
                    o1.area

                a2 =
                    o2.area

                z1 =
                    o1.kz

                z2 =
                    o2.kz

                value =
                    ((a1 * z1 + a2 * z2) / 2.0) * (x2 - x1)
            in
            value + kBz (o2 :: rest)

        _ ->
            0
extractZYAtZ_ : Float -> List ( Float, Float ) -> List ( Float, Float )
extractZYAtZ_ z0 list =
    -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
    -- list order with z up
    let
        m_zmin =
            List.minimum (List.map Tuple.first list)

        m_zmax =
            List.maximum (List.map Tuple.first list)
    in
    case m_zmax of
        Nothing ->
            []

        Just zmax ->
            case z0 > zmax of
                True ->
                    []

                False ->
                    case m_zmin of
                        Nothing ->
                            []

                        Just zmin ->
                            case z0 < zmin of
                                True ->
                                    list

                                False ->
                                    getInterpolateValuesAndSubList z0 list


extractZYAtZ : Float -> HullSliceXY -> HullSliceXY
extractZYAtZ z0 hsXY =
    { x = hsXY.x, zylist = extractZYAtZ_ z0 hsXY.zylist }


intersectBelow : { xmin : Float, xmax : Float } -> Float -> List HullSlice -> { xmin : Float, xmax : Float, lhs : List HullSliceXY }
intersectBelow config z0 listHS =
    -- CN List HullSlice supposed denormalized !!!
    let
        -- filter HullSlice with zmax <= z0
        filterHS =
            List.filter (\u -> u.zmax > z0 || not (List.isEmpty u.y)) listHS

        lhsXY =
            List.map toXY filterHS

        --
        -- extract subSlice at z0
        -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
        -- lhsXY_AtZ : List HullSliceXY (dz is not constant)
        lhsXY_AtZ =
            List.map (extractZYAtZ z0) lhsXY

        xmin =
            config.xmin

        xmax =
            config.xmax
    in
    { xmin = xmin, xmax = xmax, lhs = lhsXY_AtZ }
