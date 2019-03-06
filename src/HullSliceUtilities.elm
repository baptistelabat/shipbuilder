module HullSliceUtilities exposing
    ( areaTrapezoid
    , blockVolume
    , demormalizedHullSlice
    , denormalizedHSList
    , hullKBz
    , hullVolume
    , intersectBelow
    , kBz
    , prismaticCoefficient
    , volume
    , yGTrapezoid
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
    let
        z =
            (z1 + z2) / 2.0

        -- z1 + zGTrapezoid ( z1, y1 ) ( z2, y2 )
        area =
            areaTrapezoid ( z1, y1 ) ( z2, y2 )
    in
    z * area


yGTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
yGTrapezoid ( z1, y1 ) ( z2, y2 ) =
    -- yG =
    --     (a / 2 * a * h + (a + (abs (b - a) / 3)) * abs (b - a) * h / 2) / (a + b) * h / 2
    --
    -- yG =
    --     (a * a + b * b + ab) / 3 * (a + b)
    let
        a =
            abs y1

        b =
            abs y2
    in
    (square a + square b + a * b) / 3 * (a + b)


calculateTrapezoidMetricOnSlice : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
calculateTrapezoidMetricOnSlice trapezoidMetric denormalizedSlice =
    case denormalizedSlice of
        ( z1, y1 ) :: ( z2, y2 ) :: rest ->
            trapezoidMetric ( z1, y1 ) ( z2, y2 ) + calculateTrapezoidMetricOnSlice trapezoidMetric (( z2, y2 ) :: rest)

        _ ->
            0


zyaForSlice : HullSliceXY -> ObjXKzKyArea
zyaForSlice hsXY =
    let
        area_ =
            calculateTrapezoidMetricOnSlice areaTrapezoid hsXY.zylist

        kz_ =
            case area_ == 0.0 of
                True ->
                    0

                _ ->
                    calculateTrapezoidMetricOnSlice zTrapezoid hsXY.zylist / area_

        yTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
        yTrapezoid ( z1, y1 ) ( z2, y2 ) =
            let
                y =
                    -- (z1 + z2) / 2.0
                    yGTrapezoid ( z1, y1 ) ( z2, y2 )

                area =
                    areaTrapezoid ( z1, y1 ) ( z2, y2 )
            in
            y * area

        ky_ =
            case area_ == 0.0 of
                True ->
                    0

                _ ->
                    calculateTrapezoidMetricOnSlice yTrapezoid hsXY.zylist / area_
    in
    { x = hsXY.x, kz = kz_, ky = ky_, area = area_ }


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


hullKBz : { xmin : Float, xmax : Float } -> List ObjXKzKyArea -> Float
hullKBz config list =
    let
        xmin =
            config.xmin

        xmax =
            config.xmax

        newList =
            List.concat [ [ { x = xmin, area = 0.0, kz = 0, ky = 0 } ], list, [ { x = xmax, area = 0.0, kz = 0, ky = 0 } ] ]
    in
    kBz newList


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


xMinAtZ : Float -> Float -> List HullSlice -> Float
xMinAtZ xmin z0 listHS =
    case listHS of
        hs :: xs ->
            if hs.zmax <= z0 then
                xMinAtZ hs.x z0 xs

            else
                xmin

        _ ->
            xmin


xMaxAtZ : Float -> Float -> List HullSlice -> Float
xMaxAtZ xmax z0 listHS =
    case listHS of
        hs :: xs ->
            if hs.zmax <= z0 then
                xMaxAtZ hs.x z0 xs

            else
                xmax

        _ ->
            xmax


intersectBelow : { xmin : Float, xmax : Float } -> Float -> List HullSlice -> { xmin : Float, xmax : Float, lhs : List HullSliceXY }
intersectBelow config z0 listHS =
    -- CN List HullSlice supposed denormalized !!!
    let
        -- filter HullSlice with zmax <= z0
        filterHS =
            List.filter (\u -> u.zmax > z0 && not (List.isEmpty u.y)) listHS

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

        lhsXY =
            List.map toXY filterHS

        getInterpolateValuesAndSubList : List ( Float, Float ) -> List ( Float, Float )
        getInterpolateValuesAndSubList list =
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
                                            (1 - k) * y1 + k * y2
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

        extractZYAtZ_ : List ( Float, Float ) -> List ( Float, Float )
        extractZYAtZ_ list =
            -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
            -- list order with z up
            let
                maybeZmin =
                    List.minimum (List.map Tuple.first list)

                maybeZmax =
                    List.maximum (List.map Tuple.first list)
            in
            case maybeZmax of
                Nothing ->
                    []

                Just zmax ->
                    case z0 > zmax of
                        True ->
                            []

                        False ->
                            case maybeZmin of
                                Nothing ->
                                    []

                                Just zmin ->
                                    case z0 < zmin of
                                        True ->
                                            list

                                        False ->
                                            getInterpolateValuesAndSubList list

        extractZYAtZ : HullSliceXY -> HullSliceXY
        extractZYAtZ hsXY =
            { x = hsXY.x, zylist = extractZYAtZ_ hsXY.zylist }

        --
        -- extract subSlice at z0
        -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
        -- lhsXY_AtZ : List HullSliceXY (dz is not constant)
        lhsXY_AtZ =
            List.map extractZYAtZ lhsXY

        xmin =
            xMinAtZ config.xmin z0 listHS

        xmax =
            xMaxAtZ config.xmax z0 (List.reverse listHS)
    in
    { xmin = xmin, xmax = xmax, lhs = lhsXY_AtZ }


extractZ : HullSliceXY -> List Float
extractZ hsXY =
    hsXY
        |> .zylist
        |> List.map Tuple.first


extractY : HullSliceXY -> List Float
extractY hsXY =
    hsXY
        |> .zylist
        |> List.map Tuple.second


zMinHullSliceXYList : List HullSliceXY -> Maybe Float -> Maybe Float
zMinHullSliceXYList list m_zm =
    let
        zminHS : HullSliceXY -> Maybe Float
        zminHS hsXY =
            List.minimum <| extractZ hsXY
    in
    case list of
        [] ->
            m_zm

        el :: xs ->
            let
                m_x =
                    zminHS el
            in
            case m_x of
                Just x ->
                    case m_zm of
                        Nothing ->
                            zMinHullSliceXYList xs (Just x)

                        Just zm ->
                            if x < zm then
                                zMinHullSliceXYList xs (Just x)

                            else
                                zMinHullSliceXYList xs (Just zm)

                Nothing ->
                    zMinHullSliceXYList xs m_zm


zMaxHullSliceXYList : List HullSliceXY -> Maybe Float -> Maybe Float
zMaxHullSliceXYList list m_zm =
    let
        zmaxHS : HullSliceXY -> Maybe Float
        zmaxHS hsXY =
            List.maximum <| extractZ hsXY
    in
    case list of
        [] ->
            m_zm

        el :: xs ->
            let
                m_x =
                    zmaxHS el
            in
            case m_x of
                Just x ->
                    case m_zm of
                        Nothing ->
                            zMaxHullSliceXYList xs (Just x)

                        Just zm ->
                            if x > zm then
                                zMaxHullSliceXYList xs (Just x)

                            else
                                zMaxHullSliceXYList xs (Just zm)

                Nothing ->
                    zMaxHullSliceXYList xs m_zm


yMinHullSliceXYList : List HullSliceXY -> Maybe Float -> Maybe Float
yMinHullSliceXYList list m_ym =
    let
        yminHS : HullSliceXY -> Maybe Float
        yminHS hsXY =
            List.minimum <| extractY hsXY
    in
    case list of
        [] ->
            m_ym

        el :: xs ->
            let
                m_x =
                    yminHS el
            in
            case m_x of
                Just x ->
                    case m_ym of
                        Nothing ->
                            yMinHullSliceXYList xs (Just x)

                        Just ym ->
                            if x < ym then
                                yMinHullSliceXYList xs (Just x)

                            else
                                yMinHullSliceXYList xs (Just ym)

                Nothing ->
                    yMinHullSliceXYList xs m_ym


yMaxHullSliceXYList : List HullSliceXY -> Maybe Float -> Maybe Float
yMaxHullSliceXYList list m_ym =
    let
        ymaxHS : HullSliceXY -> Maybe Float
        ymaxHS hsXY =
            List.maximum <| extractY hsXY
    in
    case list of
        [] ->
            m_ym

        el :: xs ->
            let
                m_x =
                    ymaxHS el
            in
            case m_x of
                Just x ->
                    case m_ym of
                        Nothing ->
                            yMaxHullSliceXYList xs (Just x)

                        Just ym ->
                            if x > ym then
                                yMaxHullSliceXYList xs (Just x)

                            else
                                yMaxHullSliceXYList xs (Just ym)

                Nothing ->
                    yMaxHullSliceXYList xs m_ym


blockVolume : { xmin : Float, xmax : Float, lhs : List HullSliceXY } -> Float
blockVolume o =
    -- Volume of the block
    let
        m_zmin =
            zMinHullSliceXYList o.lhs Nothing

        m_zmax =
            zMaxHullSliceXYList o.lhs Nothing

        m_ymin =
            yMinHullSliceXYList o.lhs Nothing

        m_ymax =
            yMaxHullSliceXYList o.lhs Nothing

        _ =
            Debug.log "blockVolume" [ Just o.xmin, Just o.xmax, m_zmin, m_zmax, m_ymin, m_ymax ]

        res =
            case ( m_zmin, m_zmax ) of
                ( Just zm, Just zM ) ->
                    case ( m_ymin, m_ymax ) of
                        ( Just ym, Just yM ) ->
                            (o.xmax - o.xmin) * (yM - ym) * (zM - zm)

                        _ ->
                            0

                _ ->
                    0
    in
    res


prismaticCoefficient : { xmin : Float, xmax : Float } -> Float -> List Float -> Float
prismaticCoefficient config vol_ areas =
    case List.maximum areas of
        Nothing ->
            0

        Just am ->
            let
                v1 =
                    am * (config.xmax - config.xmin)

                res =
                    case v1 == 0.0 of
                        True ->
                            0

                        False ->
                            vol_ / v1
            in
            res
