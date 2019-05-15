module HullSlices exposing
    ( CustomHullProperties
    , HullSlice
    , HullSliceAsAreaXYList
    , HullSliceAsZYList
    , HullSliceCentroidAndArea
    , HullSlices
    , XYZ
    , applyCustomPropertiesToHullSlices
    , area
    , areaTrapezoid
    , blockVolume
    , calculateCentroid
    , calculateSliceArea
    , centroidAbscissa
    , clip
    , denormalizeHullSlice
    , denormalizeHullSlices
    , emptyHullSlices
    , extractXYZ
    , extractY
    , fromCoordinates
    , getBreadth
    , getDepth
    , getDraught
    , getInertialMoment
    , getLength
    , getSpaceParametersFromHullSlices
    , integrate
    , isHullCustomized
    , normalizeHullSlices
    , scale
    , setLongitudinalPositionOfEachSlice
    , toHullSliceAsZYList
    , trapezoidCentroid
    , volume
    , zGTrapezoid
    , zTrapezoid
    , zminForEachTrapezoid
    )

import Array
import StringValueInput


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , xmin : Float
    , zmin : Float
    , slices : List HullSlice
    , originalSlicePositions : List Float
    , draught : StringValueInput.FloatInput
    , custom : CustomHullProperties
    }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


type alias CustomHullProperties =
    { length : Maybe StringValueInput.FloatInput
    , breadth : Maybe StringValueInput.FloatInput
    , depth : Maybe StringValueInput.FloatInput
    , draught : Maybe StringValueInput.FloatInput
    , hullslicesPositions : Maybe (List Float)
    }


type alias HullSliceAsZYList =
    { x : Float
    , zylist : List ( Float, Float )
    }


type alias HullSliceAsAreaXYList =
    { z : Float
    , xy : List ( Float, Float )
    , area : Float
    }


type alias HullSliceCentroidAndArea =
    { x : Float
    , centroid : Float
    , area : Float
    }


type alias XYZ =
    { x : Float
    , y : Float
    , z : Float
    }


getLength : HullSlices -> StringValueInput.FloatInput
getLength hullSlices =
    Maybe.withDefault hullSlices.length hullSlices.custom.length


getBreadth : HullSlices -> StringValueInput.FloatInput
getBreadth hullSlices =
    Maybe.withDefault hullSlices.breadth hullSlices.custom.breadth


getDepth : HullSlices -> StringValueInput.FloatInput
getDepth hullSlices =
    Maybe.withDefault hullSlices.depth hullSlices.custom.depth


getDraught : HullSlices -> StringValueInput.FloatInput
getDraught hullSlices =
    Maybe.withDefault hullSlices.draught hullSlices.custom.draught


type alias SpaceParameters =
    { length : Float
    , breadth : Float
    , depth : Float
    , xmin : Float
    , zmin : Float
    }


emptyHullSlices : HullSlices
emptyHullSlices =
    { length = StringValueInput.emptyFloat 1
    , breadth = StringValueInput.emptyFloat 1
    , depth = StringValueInput.emptyFloat 1
    , xmin = 0
    , zmin = 0
    , slices = []
    , originalSlicePositions = []
    , draught = StringValueInput.emptyFloat 1
    , custom =
        { length = Nothing
        , breadth = Nothing
        , depth = Nothing
        , draught = Nothing
        , hullslicesPositions = Nothing
        }
    }


areaTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
areaTrapezoid ( z1, y1 ) ( z2, y2 ) =
    let
        a =
            abs y1

        b =
            abs y2

        c =
            abs (z2 - z1)
    in
    0.5 * (a + b) * c


zTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
zTrapezoid ( z1, y1 ) ( z2, y2 ) =
    let
        z =
            (z1 + z2) / 2.0

        -- z1 + zGTrapezoid ( z1, y1 ) ( z2, y2 )
        area_ =
            areaTrapezoid ( z1, y1 ) ( z2, y2 )
    in
    z * area_


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


toXY : { a | zmin : Float, zmax : Float, y : List Float } -> List ( Float, Float )
toXY { zmin, zmax, y } =
    let
        dz : Float
        dz =
            (zmax - zmin) / (toFloat <| max 1 <| List.length y - 1)

        acc : ( Int, Float ) -> ( Float, Float )
        acc ( idx, y_ ) =
            ( zmin + toFloat idx * dz, y_ )
    in
    y
        |> Array.fromList
        |> Array.toIndexedList
        |> List.map acc


removeIdenticalConsecutiveXYPairs : List ( Float, Float ) -> List ( Float, Float )
removeIdenticalConsecutiveXYPairs l =
    case l of
        [] ->
            []

        [ xy ] ->
            [ xy ]

        ( x1, y1 ) :: ( x2, y2 ) :: rest ->
            if x1 == x2 then
                removeIdenticalConsecutiveXYPairs (( x2, y2 ) :: rest)

            else
                ( x1, y1 ) :: removeIdenticalConsecutiveXYPairs (( x2, y2 ) :: rest)


clip : Float -> Float -> List ( Float, Float ) -> List ( Float, Float )
clip a b xys =
    clip_ a b xys
        |> removeIdenticalConsecutiveXYPairs


clip_ : Float -> Float -> List ( Float, Float ) -> List ( Float, Float )
clip_ a b xys =
    case xys of
        [] ->
            []

        [ ( _, _ ) ] ->
            []

        ( x1, y1 ) :: ( x2, y2 ) :: rest ->
            let
                _ =
                    ( x1, x2 )
            in
            if x1 >= b then
                -- a--b--x1----x2
                []

            else if x2 <= a then
                -- x1----x2--a--b
                clip a b (( x2, y2 ) :: rest)

            else
                let
                    left : Float
                    left =
                        min b <| max a x1

                    right : Float
                    right =
                        max a <| min b x2
                in
                if left == right then
                    [ ( left, (left - x1) / (x2 - x1) * (y2 - y1) + y1 ), ( right, (right - x1) / (x2 - x1) * (y2 - y1) + y1 ) ] ++ clip a b rest

                else
                    [ ( left, (left - x1) / (x2 - x1) * (y2 - y1) + y1 ), ( right, (right - x1) / (x2 - x1) * (y2 - y1) + y1 ) ] ++ clip a b (( x2, y2 ) :: rest)


integrate : List ( Float, Float ) -> Float
integrate l =
    case l of
        [] ->
            0

        [ _ ] ->
            0

        ( x1, y1 ) :: ( x2, y2 ) :: rest ->
            ((x2 - x1) * (y1 + y2) / 2) + integrate (( x2, y2 ) :: rest)


area : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
area a b curve =
    curve
        |> toXY
        |> clip a b
        |> integrate


square : Float -> Float
square n =
    n ^ 2


trapezoidCentroid : Float -> Float -> Float -> ( Float, Float )
trapezoidCentroid dx y1 y2 =
    let
        a =
            y1

        b =
            y2
    in
    -- http://mathworld.wolfram.com/Trapezoid.html
    ( (a + 2 * b) / (3 * (a + b)) * dx
    , 0.5 * (y1 + y2) * dx
    )


trapezoidCentroid3 : Float -> Float -> Float -> ( Float, Float, Float )
trapezoidCentroid3 dx y1 y2 =
    let
        a =
            y1

        b =
            y2

        c =
            dx

        d =
            sqrt (square dx + square (y2 - y1))
    in
    -- http://mathworld.wolfram.com/Trapezoid.html
    ( (a + 2 * b) / (3 * (a + b)) * dx
    , b / 2.0 + (2 * a + b) * (square c - square d) / 6 * (square b - square a)
    , 0.5 * (y1 + y2) * dx
    )


sum2List : List ( Float, Float ) -> ( Float, Float )
sum2List l =
    case l of
        [] ->
            ( 0, 0 )

        ( x, y ) :: xs ->
            let
                ( u, v ) =
                    sum2List xs
            in
            ( x + u, y + v )


centroidAbscissa : { c | zmin : Float, zmax : Float, y : List Float } -> Float
centroidAbscissa curve =
    let
        ( x, _ ) =
            xyCentroidAbscissa curve
    in
    x


xyCentroidAbscissa : { c | zmin : Float, zmax : Float, y : List Float } -> ( Float, Float )
xyCentroidAbscissa curve =
    let
        n : Int
        n =
            List.length curve.y

        dz : Float
        dz =
            (curve.zmax - curve.zmin) / toFloat (n - 1)

        getTrapezoidCentroids : List Float -> List ( Float, Float, Float )
        getTrapezoidCentroids ys =
            case ys of
                [] ->
                    []

                [ _ ] ->
                    []

                y1 :: y2 :: rest ->
                    trapezoidCentroid3 dz y1 y2 :: getTrapezoidCentroids (y2 :: rest)

        trapezoidCentroids : List ( Float, Float, Float )
        trapezoidCentroids =
            getTrapezoidCentroids curve.y

        shiftedTrapezoidCentroids : List ( Float, Float, Float )
        shiftedTrapezoidCentroids =
            List.map2 (\shift ( c, u, a ) -> ( c + shift, u, a )) (zminForEachTrapezoid curve) trapezoidCentroids

        totalArea : Float
        totalArea =
            shiftedTrapezoidCentroids
                |> List.map (\( _, _, a ) -> a)
                |> List.sum

        sumOfCentroids : ( Float, Float )
        sumOfCentroids =
            shiftedTrapezoidCentroids
                |> List.map (\( x, u, a ) -> ( x * a, u * a ))
                |> sum2List

        divTotalArea : ( Float, Float )
        divTotalArea =
            let
                ( x, y ) =
                    sumOfCentroids
            in
            ( x / totalArea, y / totalArea )
    in
    divTotalArea


zminForEachTrapezoid : { c | zmin : Float, zmax : Float, y : List Float } -> List Float
zminForEachTrapezoid curve =
    let
        n : Int
        n =
            List.length curve.y
    in
    List.range 0 (n - 2)
        |> List.map (\z -> toFloat z / (toFloat n - 1.0) * (curve.zmax - curve.zmin) + curve.zmin)


zGTrapezoid : ( Float, Float ) -> ( Float, Float ) -> Float
zGTrapezoid ( z1, y1 ) ( z2, y2 ) =
    -- if b>a
    -- zG = (a*h*h/2.0 + (b-a)*h/2.0*h/3.0) / (a+b)*h/2
    -- zG = ((2*a+b)*h) / 3*(a+b)
    -- if a>b
    -- zG = ((2*b+a)*h) / 3*(a+b)
    let
        a =
            min y1 y2

        b =
            max y1 y2

        c =
            abs (z2 - z1)

        h =
            c
    in
    ((b + 2 * a) * h) / (3 * (a + b))


getInertialMoment : HullSliceAsAreaXYList -> Float
getInertialMoment o =
    let
        xs =
            List.map Tuple.first o.xy

        ys =
            List.map Tuple.second o.xy

        listLength =
            List.length ys

        maybeXmin =
            List.minimum xs

        maybeXmax =
            List.maximum xs

        inertialMoment =
            case ( maybeXmin, maybeXmax ) of
                ( Just xmin, Just xmax ) ->
                    let
                        sumOfCubes =
                            List.foldr (+) 0.0 <| List.map (\u -> u * u * u) ys
                    in
                    if listLength == 0 then
                        0

                    else
                        -- cf architecture navale p307
                        2 / 3 * (xmax - xmin) * sumOfCubes / toFloat listLength

                _ ->
                    0
    in
    inertialMoment


fromHullSliceAsZYList : HullSliceAsZYList -> HullSlice
fromHullSliceAsZYList hsZYs =
    { x = hsZYs.x
    , zmin = Maybe.withDefault 0 <| List.minimum <| List.map Tuple.first hsZYs.zylist
    , zmax = Maybe.withDefault 1 <| List.maximum <| List.map Tuple.first hsZYs.zylist
    , y = List.map Tuple.second hsZYs.zylist
    }


coordinatesToHullSliceAsZYList : List XYZ -> Maybe HullSliceAsZYList
coordinatesToHullSliceAsZYList coordinates =
    case List.head coordinates of
        Nothing ->
            Nothing

        Just coordinate ->
            Just
                { x = .x coordinate
                , zylist = List.map (\c -> Tuple.pair c.z c.y) coordinates
                }


fromCoordinates : List XYZ -> List HullSlice
fromCoordinates coordinates =
    let
        nextX : Float -> Maybe Float
        nextX xPos =
            if (List.filter (\x -> x > xPos) <| List.map .x coordinates) /= [] then
                List.minimum <| List.filter (\x -> x > xPos) <| List.map .x coordinates

            else
                Nothing

        splitByX : Maybe Float -> List (List XYZ) -> List (List XYZ)
        splitByX maybeX list =
            case maybeX of
                Nothing ->
                    list

                Just xPos ->
                    List.filter (\c -> c.x == xPos) coordinates
                        :: list
                        |> splitByX (nextX xPos)
    in
    splitByX (List.minimum <| List.map .x coordinates) []
        |> List.reverse
        |> List.filterMap coordinatesToHullSliceAsZYList
        |> List.map fromHullSliceAsZYList


toHullSliceAsZYList : HullSlice -> HullSliceAsZYList
toHullSliceAsZYList hs =
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


extractY : HullSliceAsZYList -> List Float
extractY hs =
    hs
        |> .zylist
        |> List.map Tuple.second


extractXYZ : HullSliceAsZYList -> List XYZ
extractXYZ hs =
    let
        extract : ( Float, Float ) -> XYZ
        extract zy =
            { x = hs.x, y = Tuple.second zy, z = Tuple.first zy }
    in
    List.map extract hs.zylist


blockVolume : { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList } -> Float
blockVolume o =
    -- Volume of the block
    let
        extractZ : HullSliceAsZYList -> List Float
        extractZ hsXY =
            hsXY
                |> .zylist
                |> List.map Tuple.first

        zMinAllSlices : List HullSliceAsZYList -> Maybe Float
        zMinAllSlices list =
            let
                zminHullSlice : HullSliceAsZYList -> Maybe Float
                zminHullSlice hsXY =
                    List.minimum <| extractZ hsXY
            in
            List.map zminHullSlice list
                |> List.filterMap identity
                |> List.minimum

        zMaxAllSlices : List HullSliceAsZYList -> Maybe Float
        zMaxAllSlices list =
            let
                zmaxHullSlice : HullSliceAsZYList -> Maybe Float
                zmaxHullSlice hsXY =
                    List.maximum <| extractZ hsXY
            in
            List.map zmaxHullSlice list
                |> List.filterMap identity
                |> List.maximum

        yMinAllSlices : List HullSliceAsZYList -> Maybe Float
        yMinAllSlices list =
            let
                yminHullSlice : HullSliceAsZYList -> Maybe Float
                yminHullSlice hsXY =
                    List.minimum <| extractY hsXY
            in
            List.map yminHullSlice list
                |> List.filterMap identity
                |> List.minimum

        yMaxAllSlices : List HullSliceAsZYList -> Maybe Float
        yMaxAllSlices list =
            let
                ymaxHullSlice : HullSliceAsZYList -> Maybe Float
                ymaxHullSlice hsXY =
                    List.maximum <| extractY hsXY
            in
            List.map ymaxHullSlice list
                |> List.filterMap identity
                |> List.maximum

        maybeZmin =
            zMinAllSlices o.hullSlices

        maybeZmax =
            zMaxAllSlices o.hullSlices

        maybeYmin =
            yMinAllSlices o.hullSlices

        maybeYmax =
            yMaxAllSlices o.hullSlices

        res =
            case ( maybeZmin, maybeZmax ) of
                ( Just zm, Just zM ) ->
                    case ( maybeYmin, maybeYmax ) of
                        ( Just ym, Just yM ) ->
                            (o.xmax - o.xmin) * (yM - ym) * (zM - zm)

                        _ ->
                            0

                _ ->
                    0
    in
    res


calculateCentroid : List HullSliceCentroidAndArea -> Float
calculateCentroid lo =
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
                    o1.centroid

                z2 =
                    o2.centroid

                value =
                    ((a1 * z1 + a2 * z2) / 2.0) * (x2 - x1)
            in
            value + calculateCentroid (o2 :: rest)

        _ ->
            0


getSpaceParametersFromHullSlices : List HullSlice -> Maybe SpaceParameters
getSpaceParametersFromHullSlices hullSliceList =
    let
        maybeXmin =
            List.minimum <| List.map .x hullSliceList

        maybeXmax =
            List.maximum <| List.map .x hullSliceList

        maybeZmin =
            List.minimum <| List.map .zmin hullSliceList

        maybeZmax =
            List.maximum <| List.map .zmax hullSliceList

        maybeYmin =
            List.minimum <| List.concat <| List.map .y hullSliceList

        maybeYmax =
            List.maximum <| List.concat <| List.map .y hullSliceList

        maybeLength =
            Maybe.map2 (-) maybeXmax maybeXmin

        maybeBreadth =
            Maybe.map2 (*) (Just 2) (Maybe.map2 (-) maybeYmax maybeYmin)

        maybeDepth =
            Maybe.map2 (-) maybeZmax maybeZmin

        addSpaceParameters length breadth draught xmin zmin =
            { length = length
            , breadth = breadth
            , depth = draught
            , xmin = xmin
            , zmin = zmin
            }
    in
    Maybe.map5 addSpaceParameters maybeLength maybeBreadth maybeDepth maybeXmin maybeZmin


normalizeHullSlices : List HullSlice -> SpaceParameters -> List HullSlice
normalizeHullSlices hullSliceList param =
    List.map (normalizeHullSlice param) hullSliceList


normalizeHullSlice : SpaceParameters -> HullSlice -> HullSlice
normalizeHullSlice param hs =
    let
        normalizedY : Float -> Float -> Float
        normalizedY br y =
            (y / (br / 2)) / 2 + 0.5

        normalizedZ : Float -> Float -> Float -> Float
        normalizedZ zmin depth z =
            z / depth - zmin

        x =
            hs.x / param.length - param.xmin

        hs_zmin =
            normalizedZ param.zmin param.depth hs.zmin

        hs_zmax =
            normalizedZ param.zmin param.depth hs.zmax

        hs_y =
            List.map (normalizedY param.breadth) hs.y

        res =
            { x = x, zmin = hs_zmin, zmax = hs_zmax, y = hs_y }
    in
    res


denormalizeHullSlices : SpaceParameters -> List HullSlice -> List HullSlice
denormalizeHullSlices param l =
    List.map (denormalizeHullSlice param) l


denormalizeHullSlice : SpaceParameters -> HullSlice -> HullSlice
denormalizeHullSlice param hs =
    -- y denormalisé dans intervalle [0,breadth/2]
    let
        denormalizedY : Float -> Float -> Float
        denormalizedY br y =
            y * br + (-br / 2)

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
            List.map (denormalizedY param.breadth) hs.y

        res =
            { x = x, zmin = hs_zmin, zmax = hs_zmax, y = hs_y }
    in
    res


setLongitudinalPositionOfEachSlice : HullSlices -> List HullSlice
setLongitudinalPositionOfEachSlice hullSlices =
    let
        shiftSliceLongitudinalPosition : HullSlice -> Float -> HullSlice
        shiftSliceLongitudinalPosition slice newX =
            { slice | x = newX }
    in
    case hullSlices.custom.hullslicesPositions of
        Just customPosition ->
            List.map2 shiftSliceLongitudinalPosition hullSlices.slices customPosition

        Nothing ->
            hullSlices.slices


applyCustomPropertiesToHullSlices : HullSlices -> HullSlices
applyCustomPropertiesToHullSlices hullSlices =
    { length = getLength hullSlices
    , breadth = getBreadth hullSlices
    , depth = getDepth hullSlices
    , xmin = hullSlices.xmin
    , zmin = hullSlices.zmin
    , slices = setLongitudinalPositionOfEachSlice hullSlices
    , originalSlicePositions = List.map .x <| setLongitudinalPositionOfEachSlice hullSlices
    , draught = getDraught hullSlices
    , custom =
        { length = Nothing
        , breadth = Nothing
        , depth = Nothing
        , draught = Nothing
        , hullslicesPositions = Nothing
        }
    }


isHullCustomized : HullSlices -> Bool
isHullCustomized hullSlices =
    if
        Nothing
            == hullSlices.custom.length
            && Nothing
            == hullSlices.custom.breadth
            && Nothing
            == hullSlices.custom.depth
            && Nothing
            == hullSlices.custom.draught
            && Nothing
            == hullSlices.custom.hullslicesPositions
    then
        False

    else
        True


calculateSliceArea : HullSlices -> HullSlice -> Float
calculateSliceArea json hullSlice =
    -- Multiply by 2 to account for both sides of the hull: otherwise the area is just for the y>0 half-plane
    scale json hullSlice
        |> area (json.zmin + (.value <| getDepth json) - (.value <| getDraught json)) (json.zmin + (.value <| getDepth json))
        |> (*) 2


scale : HullSlices -> HullSlice -> HullSlice
scale json hullSlice =
    let
        depth : StringValueInput.FloatInput
        depth =
            Maybe.withDefault json.depth json.custom.depth

        breadth : StringValueInput.FloatInput
        breadth =
            Maybe.withDefault json.breadth json.custom.breadth

        scaleY : Float -> Float
        scaleY y =
            y * (.value <| getBreadth json) + ((negate <| .value <| getBreadth json) / 2)

        scaleZ : Float -> Float
        scaleZ z =
            z * (.value <| getDepth json) + json.zmin
    in
    { x = hullSlice.x
    , zmin = scaleZ hullSlice.zmin
    , zmax = scaleZ hullSlice.zmax
    , y = List.map scaleY hullSlice.y
    }
