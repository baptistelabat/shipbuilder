module HullSlices exposing
    ( HullSlice
    , HullSliceAsXYList
    , HullSliceAsZYList
    , HullSlices
    , area
    , areaTrapezoid
    , calculateSliceArea
    , centroidAbscissa
    , clip
    , denormalizeHullSlice
    , denormalizeHullSlices
    , empty
    , extractHorizontalSliceAtZ
    , fillHullSliceMetrics
    , getHullCentroid
    , hullVolume
    , intersectBelow
    , plotAreaCurve
    , prismaticCoefficient
    , scale
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , trapezoidCentroid
    , volume
    , zGTrapezoid
    , zTrapezoid
    , zminForEachTrapezoid
    )

import Array
import Html exposing (Html, div)
import Html.Attributes exposing (id)
import LineChart
import LineChart.Area as Area
import LineChart.Axis as Axis
import LineChart.Axis.Intersection as Intersection
import LineChart.Colors as Colors
import LineChart.Container as Container
import LineChart.Dots as Dots
import LineChart.Events as Events
import LineChart.Grid as Grid
import LineChart.Interpolation as Interpolation
import LineChart.Junk as Junk
import LineChart.Legends as Legends
import LineChart.Line as Line
import StringValueInput


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , draught : StringValueInput.FloatInput
    , blockCoefficient : Float
    , displacement : Float
    , centreOfBuoyancy : Float
    , metacentre : Float
    , denormalizedSlices : List HullSlice
    , hullSlicesBeneathFreeSurface :
        { xmin : Float
        , xmax : Float
        , hullSlices : List HullSliceAsZYList
        }
    , centroidAreaForEachImmersedSlice : List HullSliceCentroidAndArea
    }


empty : HullSlices
empty =
    fillHullSliceMetrics
        { length = StringValueInput.emptyFloat
        , breadth = StringValueInput.emptyFloat
        , depth = StringValueInput.emptyFloat
        , xmin = 0
        , ymin = 0
        , zmin = 0
        , slices = []
        , draught = StringValueInput.emptyFloat
        , denormalizedSlices = []
        , blockCoefficient = 0
        , centreOfBuoyancy = 0
        , displacement = 0
        , metacentre = 0
        , hullSlicesBeneathFreeSurface = { xmin = 0, xmax = 0, hullSlices = [] }
        , centroidAreaForEachImmersedSlice = []
        }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


type alias HullSliceAsZYList =
    { x : Float
    , zylist : List ( Float, Float )
    }


type alias HullSliceAsXYList =
    { z : Float
    , xy : List ( Float, Float )
    }


type alias HullSliceCentroidAndArea =
    { x : Float
    , centroid : Float
    , area : Float
    }


scale : HullSlices -> HullSlice -> HullSlice
scale json hullSlice =
    let
        scaleY : Float -> Float
        scaleY y =
            y * json.breadth.value + json.ymin

        scaleZ : Float -> Float
        scaleZ z =
            z * json.depth.value + json.zmin
    in
    { x = hullSlice.x
    , zmin = scaleZ hullSlice.zmin
    , zmax = scaleZ hullSlice.zmax
    , y = List.map scaleY hullSlice.y
    }


prismaticCoefficient : { a | xmin : Float, length : StringValueInput.FloatInput, y : List Float } -> Float
prismaticCoefficient areaCurve =
    case List.maximum areaCurve.y of
        Nothing ->
            0

        Just am ->
            let
                n : Int
                n =
                    List.length areaCurve.y

                to01 : Int -> Float
                to01 x =
                    toFloat x / toFloat (n - 1)

                toMinMax : Float -> Float
                toMinMax x =
                    areaCurve.xmin + x * areaCurve.length.value

                xs =
                    List.range 0 (n - 1)
                        |> List.map (to01 >> toMinMax)

                xAreaPairs : List { x : Float, area : Float }
                xAreaPairs =
                    List.map2 (\x a -> { x = x, area = a }) xs areaCurve.y

                v =
                    volume xAreaPairs
            in
            v / (areaCurve.length.value * am)


calculateSliceArea : HullSlices -> HullSlice -> Float
calculateSliceArea json hullSlice =
    -- Multiply by 2 to account for both sides of the hull: otherwise the area is just for the y>0 half-plane
    scale json hullSlice
        |> area (json.zmin + json.depth.value - json.draught.value) (json.zmin + json.depth.value)
        |> (*) 2


type HullSlicesWithoutComputations
    = HullSlicesWithoutComputations HullSlices


type HullSlicesWithDenormalizedSlices
    = HullSlicesWithDenormalizedSlices HullSlices


type HullSlicesWithSlicesBeneathFreeSurface
    = HullSlicesWithSlicesBeneathFreeSurface HullSlices


type HullSlicesWithCentroidAreaForEachImmersedSlice
    = HullSlicesWithCentroidAreaForEachImmersedSlice HullSlices


type HullSlicesWithDisplacement
    = HullSlicesWithDisplacement HullSlices


type HullSlicesWithCentreOfBuoyancy
    = HullSlicesWithCentreOfBuoyancy HullSlices


type HullSlicesWithBlockCoefficient
    = HullSlicesWithBlockCoefficient HullSlices


addDenormalizedSlices : HullSlicesWithoutComputations -> HullSlicesWithDenormalizedSlices
addDenormalizedSlices previousStep =
    case previousStep of
        HullSlicesWithoutComputations hullSlices ->
            let
                denormalizedSlices : List HullSlice
                denormalizedSlices =
                    denormalizeHullSlices
                        { length = hullSlices.length.value, breadth = hullSlices.breadth.value, depth = hullSlices.depth.value, xmin = hullSlices.xmin, ymin = hullSlices.ymin, zmin = hullSlices.zmin }
                        hullSlices.slices
            in
            HullSlicesWithDenormalizedSlices { hullSlices | denormalizedSlices = denormalizedSlices }


addHullSlicesBeneathFreeSurface : HullSlicesWithDenormalizedSlices -> HullSlicesWithSlicesBeneathFreeSurface
addHullSlicesBeneathFreeSurface previousStep =
    case previousStep of
        HullSlicesWithDenormalizedSlices hullSlices ->
            let
                zAtDraught : Float
                zAtDraught =
                    hullSlices.zmin + hullSlices.depth.value - hullSlices.draught.value

                hullSlicesBeneathFreeSurface : { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList }
                hullSlicesBeneathFreeSurface =
                    intersectBelow zAtDraught hullSlices
            in
            HullSlicesWithSlicesBeneathFreeSurface { hullSlices | hullSlicesBeneathFreeSurface = hullSlicesBeneathFreeSurface }


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


addCentroidAreaForEachImmersedSlice : HullSlicesWithSlicesBeneathFreeSurface -> HullSlicesWithCentroidAreaForEachImmersedSlice
addCentroidAreaForEachImmersedSlice previousStep =
    let
        integrateTrapezoidMetricOnSlices : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
        integrateTrapezoidMetricOnSlices trapezoidMetric denormalizedSlices =
            case denormalizedSlices of
                ( z1, y1 ) :: ( z2, y2 ) :: rest ->
                    trapezoidMetric ( z1, y1 ) ( z2, y2 ) + integrateTrapezoidMetricOnSlices trapezoidMetric (( z2, y2 ) :: rest)

                _ ->
                    0

        calculateCentroidArea : HullSliceAsZYList -> HullSliceCentroidAndArea
        calculateCentroidArea hullSliceAsZYList =
            let
                area_ =
                    integrateTrapezoidMetricOnSlices areaTrapezoid hullSliceAsZYList.zylist

                centroid_ =
                    if area_ == 0.0 then
                        0

                    else
                        integrateTrapezoidMetricOnSlices zTrapezoid hullSliceAsZYList.zylist / area_
            in
            { x = hullSliceAsZYList.x, centroid = centroid_, area = area_ }
    in
    case previousStep of
        HullSlicesWithSlicesBeneathFreeSurface hullSlices ->
            HullSlicesWithCentroidAreaForEachImmersedSlice { hullSlices | centroidAreaForEachImmersedSlice = List.map calculateCentroidArea hullSlices.hullSlicesBeneathFreeSurface.hullSlices }


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


addDisplacement : HullSlicesWithCentroidAreaForEachImmersedSlice -> HullSlicesWithDisplacement
addDisplacement previousStep =
    case previousStep of
        HullSlicesWithCentroidAreaForEachImmersedSlice hullSlices ->
            HullSlicesWithDisplacement { hullSlices | displacement = 2 * hullVolume { xmin = hullSlices.hullSlicesBeneathFreeSurface.xmin, xmax = hullSlices.hullSlicesBeneathFreeSurface.xmax } hullSlices.centroidAreaForEachImmersedSlice }


addCentreOfBuoyancy : HullSlicesWithDisplacement -> HullSlicesWithCentreOfBuoyancy
addCentreOfBuoyancy previousStep =
    case previousStep of
        HullSlicesWithDisplacement hullSlices ->
            let
                hullCentroid : Float
                hullCentroid =
                    getHullCentroid hullSlices

                centreOfBuoyancy : Float
                centreOfBuoyancy =
                    if hullSlices.displacement == 0.0 then
                        0.0

                    else
                        hullSlices.zmin + hullSlices.depth.value - (hullCentroid / (hullSlices.displacement / 2))
            in
            HullSlicesWithCentreOfBuoyancy { hullSlices | centreOfBuoyancy = centreOfBuoyancy }


addBlockCoefficient : HullSlicesWithCentreOfBuoyancy -> HullSlicesWithBlockCoefficient
addBlockCoefficient previousStep =
    case previousStep of
        HullSlicesWithCentreOfBuoyancy hullSlices ->
            let
                blockVolume_ : Float
                blockVolume_ =
                    blockVolume hullSlices.hullSlicesBeneathFreeSurface

                -- Block Coefficient = Volume of displacement ÷ blockVolume
                blockCoefficient : Float
                blockCoefficient =
                    if blockVolume_ == 0.0 then
                        0.0

                    else
                        (hullSlices.displacement / 2) / blockVolume_
            in
            HullSlicesWithBlockCoefficient { hullSlices | blockCoefficient = blockCoefficient }


addMetacentre : HullSlicesWithBlockCoefficient -> HullSlices
addMetacentre previousStep =
    case previousStep of
        HullSlicesWithBlockCoefficient hullSlices ->
            let
                zAtDraught : Float
                zAtDraught =
                    hullSlices.zmin + hullSlices.depth.value - hullSlices.draught.value

                horizontalHullSliceAtDraught : HullSliceAsXYList
                horizontalHullSliceAtDraught =
                    extractHorizontalSliceAtZ zAtDraught hullSlices

                inertialMoment_ : Float
                inertialMoment_ =
                    getInertialMoment horizontalHullSliceAtDraught

                bM : Float
                bM =
                    if hullSlices.displacement == 0.0 then
                        0.0

                    else
                        inertialMoment_ / hullSlices.displacement

                metacentre : Float
                metacentre =
                    hullSlices.centreOfBuoyancy + bM
            in
            { hullSlices | metacentre = metacentre }


fillHullSliceMetrics : HullSlices -> HullSlices
fillHullSliceMetrics hullSlices =
    HullSlicesWithoutComputations hullSlices
        |> addDenormalizedSlices
        |> addHullSlicesBeneathFreeSurface
        |> addCentroidAreaForEachImmersedSlice
        |> addDisplacement
        |> addCentreOfBuoyancy
        |> addBlockCoefficient
        |> addMetacentre


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa } |> fillHullSliceMetrics


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }
        |> (\slices -> { slices | ymin = -slices.breadth.value / 2 })
        |> fillHullSliceMetrics


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught } |> fillHullSliceMetrics


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    { hullSlices | depth = hullSlices.depth |> StringValueInput.setString depth } |> fillHullSliceMetrics


plotAreaCurve : HullSlices -> Html msg
plotAreaCurve slices =
    let
        xys : List ( Float, Float )
        xys =
            List.map (\c -> ( c.x, c.area )) slices.centroidAreaForEachImmersedSlice
    in
    div [ id "area-curve-plot-container" ]
        [ LineChart.viewCustom
            { x = Axis.default 231 "x" Tuple.first
            , y = Axis.default 231 "Area" Tuple.second
            , container =
                Container.custom
                    { attributesHtml = [ Html.Attributes.style "font-family" "monospace" ]
                    , attributesSvg = []
                    , size = Container.static
                    , margin = Container.Margin 0 10 20 30
                    , id = "area-curve-plot"
                    }
            , interpolation = Interpolation.monotone
            , intersection = Intersection.default
            , legends = Legends.none
            , events = Events.default
            , junk = Junk.default
            , grid = Grid.lines 1 Colors.gray
            , area = Area.stacked 0.2
            , line = Line.wider 3
            , dots = Dots.custom (Dots.full 10)
            }
            [ LineChart.line Colors.gray Dots.circle "Area curve" xys ]
        ]


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


area : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
area a b curve =
    let
        integrate : List ( Float, Float ) -> Float
        integrate l =
            case l of
                [] ->
                    0

                [ _ ] ->
                    0

                ( x1, y1 ) :: ( x2, y2 ) :: rest ->
                    ((x2 - x1) * (y1 + y2) / 2) + integrate (( x2, y2 ) :: rest)
    in
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


getInertialMoment : HullSliceAsXYList -> Float
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


extractY : HullSliceAsZYList -> List Float
extractY hsXY =
    hsXY
        |> .zylist
        |> List.map Tuple.second


extractHorizontalSliceAtZ : Float -> HullSlices -> HullSliceAsXYList
extractHorizontalSliceAtZ z0 hullSlices =
    let
        hullSlicesBelowZ0 =
            intersectBelow z0 hullSlices

        extractFirstXY : HullSliceAsZYList -> ( Float, Float )
        extractFirstXY hullSliceAsZYList =
            ( hullSliceAsZYList.x, Maybe.withDefault 0 <| List.head <| extractY hullSliceAsZYList )
    in
    { z = z0, xy = List.map extractFirstXY hullSlicesBelowZ0.hullSlices }


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


getHullCentroid : HullSlices -> Float
getHullCentroid hullSlices =
    let
        xmin =
            hullSlices.hullSlicesBeneathFreeSurface.xmin

        xmax =
            hullSlices.hullSlicesBeneathFreeSurface.xmax

        centroidAndAreaWithEndpointsAtZero =
            List.concat [ [ { x = xmin, area = 0.0, centroid = 0 } ], hullSlices.centroidAreaForEachImmersedSlice, [ { x = xmax, area = 0.0, centroid = 0 } ] ]
    in
    calculateCentroid centroidAndAreaWithEndpointsAtZero


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


denormalizeHullSlices : { a | length : Float, breadth : Float, depth : Float, xmin : Float, ymin : Float, zmin : Float } -> List HullSlice -> List HullSlice
denormalizeHullSlices param l =
    List.map (denormalizeHullSlice param) l


denormalizeHullSlice : { a | length : Float, breadth : Float, depth : Float, xmin : Float, ymin : Float, zmin : Float } -> HullSlice -> HullSlice
denormalizeHullSlice param hs =
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


intersectBelow : Float -> HullSlices -> { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList }
intersectBelow z0 hullSlices =
    -- CN List HullSlice supposed denormalized !!!
    let
        -- filter HullSlice with zmax <= z0
        filterHS =
            List.filter (\u -> u.zmax > z0 && not (List.isEmpty u.y)) hullSlices.denormalizedSlices

        toXY_ : HullSlice -> HullSliceAsZYList
        toXY_ hs =
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
            List.map toXY_ filterHS

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
                            if z < z2 && z >= z1 then
                                let
                                    k =
                                        (z - z1) / (z2 - z1)

                                    y =
                                        (1 - k) * y1 + k * y2
                                in
                                ( z, y ) :: ( z2, y2 ) :: rest

                            else
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
                    if z0 > zmax then
                        []

                    else
                        case maybeZmin of
                            Nothing ->
                                []

                            Just zmin ->
                                if z0 < zmin then
                                    list

                                else
                                    getInterpolateValuesAndSubList list

        extractZYAtZ : HullSliceAsZYList -> HullSliceAsZYList
        extractZYAtZ hsXY =
            { x = hsXY.x, zylist = extractZYAtZ_ hsXY.zylist }

        --
        -- extract subSlice at z0
        -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
        -- lhsXY_AtZ : List HullSliceAsZYList (dz is not constant)
        lhsXY_AtZ =
            List.map extractZYAtZ lhsXY

        xMinAtZ : Float -> List HullSlice -> Float
        xMinAtZ xmin_ listHS_ =
            case listHS_ of
                hs :: xs ->
                    if hs.zmax <= z0 then
                        xMinAtZ hs.x xs

                    else
                        xmin_

                _ ->
                    xmin_

        xmin =
            xMinAtZ hullSlices.xmin hullSlices.denormalizedSlices

        xMaxAtZ : Float -> List HullSlice -> Float
        xMaxAtZ xmax_ listHS_ =
            case listHS_ of
                hs :: xs ->
                    if hs.zmax <= z0 then
                        xMaxAtZ hs.x xs

                    else
                        xmax_

                _ ->
                    xmax_

        xmax =
            xMaxAtZ (hullSlices.xmin + hullSlices.length.value) (List.reverse hullSlices.denormalizedSlices)
    in
    { xmin = xmin, xmax = xmax, hullSlices = lhsXY_AtZ }
