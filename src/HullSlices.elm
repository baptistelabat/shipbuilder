module HullSlices exposing
    ( HullSlice
    , HullSlices
    , JsonHullSlices
    , area
    , calculateSliceArea
    , centroidAbscissa
    , changeSliceAreaWhilePreservingSize
    , clip
    , dB
    , decoder
    , demormalizedHullSlice
    , denormalizedHSList
    , dictDecoder
    , dictEncoder
    , empty
    , encodeCSV
    , encodeSubModel
    , encoder
    , exportCSV
    , hullKBz
    , inertialMoment
    , interpolate
    , modifiedBreadth
    , plotAreaCurve
    , prepareToExport
    , prismaticCoefficient
    , scale
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setSliceArea
    , trapezoidCentroid
    , volume
    , zGTrapezoid
    , zminForEachTrapezoid
    )

import Array
import Dict exposing (Dict)
import Html exposing (Html, div)
import Html.Attributes exposing (id)
import HullSliceUtilities
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
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


type alias JsonHullSlices a =
    { a
        | length : StringValueInput.FloatInput
        , breadth : StringValueInput.FloatInput
        , depth : StringValueInput.FloatInput
        , xmin : Float
        , ymin : Float
        , zmin : Float
        , slices : List HullSlice
        , draught : StringValueInput.FloatInput
    }


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , draught : StringValueInput.FloatInput
    , sliceAreas : List Float
    , blockCoefficient : Float
    , volume : Float
    , centreOfBuoyancy : Float
    , metacentre : Float
    , denormalizedslices : List HullSlice
    }


empty : HullSlices
empty =
    interpolate
        { length = StringValueInput.emptyFloat
        , breadth = StringValueInput.emptyFloat
        , depth = StringValueInput.emptyFloat
        , xmin = 0
        , ymin = 0
        , zmin = 0
        , slices = []
        , draught = StringValueInput.emptyFloat
        , denormalizedslices = []
        }


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


hullSliceDecoder : Decode.Decoder HullSlice
hullSliceDecoder =
    Decode.succeed HullSlice
        |> Pipeline.required "x" Decode.float
        |> Pipeline.required "zmin" Decode.float
        |> Pipeline.required "zmax" Decode.float
        |> Pipeline.required "y" (Decode.list Decode.float)


scale : JsonHullSlices a -> HullSlice -> HullSlice
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


volume : { a | xmin : Float, length : StringValueInput.FloatInput } -> List Float -> Float
volume json sliceAreas =
    area json.xmin (json.xmin + json.length.value) { zmin = json.xmin, zmax = json.xmin + json.length.value, y = sliceAreas }


prismaticCoefficient : { a | xmin : Float, length : StringValueInput.FloatInput, y : List Float } -> Float
prismaticCoefficient areaCurve =
    case List.maximum areaCurve.y of
        Nothing ->
            0

        Just am ->
            let
                v =
                    volume areaCurve areaCurve.y
            in
            v / (areaCurve.length.value * am)


calculateSliceArea : JsonHullSlices a -> HullSlice -> Float
calculateSliceArea json hullSlice =
    -- Multiply by 2 to account for both sides of the hull: otherwise the area is just for the y>0 half-plane
    scale json hullSlice
        |> area (json.zmin + json.depth.value - json.draught.value) (json.zmin + json.depth.value)
        |> (*) 2


interpolate : JsonHullSlices a -> HullSlices
interpolate json =
    let
        length_ =
            json.length.value

        breadth_ =
            json.breadth.value

        depth_ =
            json.depth.value

        draught_ =
            json.draught.value

        -- denormalize slices
        denormalizedSlices =
            denormalizedHSList
                { length = length_, breadth = breadth_, depth = depth_, xmin = json.xmin, ymin = json.ymin, zmin = json.zmin }
                json.slices

        -- transform draught to z value
        zAtDraught =
            json.zmin + depth_ - draught_

        -- intersect below draught
        intersectBelowSlicesZY =
            HullSliceUtilities.intersectBelow { xmin = json.xmin, xmax = json.xmin + length_ } zAtDraught denormalizedSlices

        -- calculate kz, ky and area
        lzya =
            List.map HullSliceUtilities.zyaForSlice intersectBelowSlicesZY.lhs

        areas =
            List.map .area lzya

        v_ =
            HullSliceUtilities.volume lzya

        v2_ =
            HullSliceUtilities.hullVolume { xmin = intersectBelowSlicesZY.xmin, xmax = intersectBelowSlicesZY.xmax } lzya

        kbz_ =
            hullKBz { xmin = intersectBelowSlicesZY.xmin, xmax = intersectBelowSlicesZY.xmax } lzya

        centreOfBuoyancy =
            case v2_ == 0.0 of
                True ->
                    0.0

                False ->
                    json.zmin + depth_ - (kbz_ / v2_)

        sliceAreas : List Float
        sliceAreas =
            List.map (calculateSliceArea json) json.slices

        realVolume =
            2 * v2_

        blockVolume_ =
            blockVolume intersectBelowSlicesZY

        -- Block Coefficient = Volume of displacement ÷ blockVolume
        blockCoefficient_ =
            case blockVolume_ == 0.0 of
                True ->
                    0.0

                False ->
                    v2_ / blockVolume_

        prepareToExport_ =
            prepareToExport zAtDraught intersectBelowSlicesZY

        inertialMoment_ =
            inertialMoment prepareToExport_

        bM =
            case realVolume == 0.0 of
                True ->
                    0.0

                False ->
                    inertialMoment_ / realVolume

        kM =
            centreOfBuoyancy + bM
    in
    { length = json.length
    , breadth = json.breadth
    , depth = json.depth
    , xmin = json.xmin
    , ymin = json.ymin
    , zmin = json.zmin
    , slices = json.slices
    , draught = json.draught
    , sliceAreas = sliceAreas
    , blockCoefficient = StringValueInput.round_n 2 <| blockCoefficient_
    , volume = StringValueInput.round_n 2 <| realVolume
    , centreOfBuoyancy = StringValueInput.round_n 2 <| centreOfBuoyancy
    , metacentre = StringValueInput.round_n 2 <| kM
    , denormalizedslices = denormalizedSlices
    }


f : StringValueInput.FloatInput -> StringValueInput.FloatInput -> StringValueInput.FloatInput -> Float -> Float -> Float -> List HullSlice -> StringValueInput.FloatInput -> JsonHullSlices {}
f length breadth depth xmin ymin zmin slices draught =
    { length = length
    , breadth = breadth
    , depth = depth
    , xmin = xmin
    , ymin = ymin
    , zmin = zmin
    , slices = slices
    , draught = draught
    }


decoder : Decode.Decoder HullSlices
decoder =
    let
        helper : ( StringValueInput.FloatInput, Maybe StringValueInput.FloatInput ) -> Decode.Decoder (JsonHullSlices {})
        helper ( depth, maybeDraught ) =
            Decode.succeed f
                |> Pipeline.required "length" (Decode.map (StringValueInput.fromNumber "m" "Length over all") Decode.float)
                |> Pipeline.required "breadth" (Decode.map (StringValueInput.fromNumber "m" "Breadth") Decode.float)
                |> Pipeline.hardcoded depth
                |> Pipeline.required "xmin" Decode.float
                |> Pipeline.required "ymin" Decode.float
                |> Pipeline.required "zmin" Decode.float
                |> Pipeline.required "slices" (Decode.list hullSliceDecoder)
                |> Pipeline.hardcoded
                    (case maybeDraught of
                        Just draught ->
                            draught

                        Nothing ->
                            StringValueInput.fromNumber "m" "Draught" (depth.value / 5)
                    )
    in
    Decode.succeed Tuple.pair
        |> Pipeline.required "depth" (Decode.map (StringValueInput.fromNumber "m" "Depth") Decode.float)
        |> Pipeline.optional "draught" (Decode.map (Just << StringValueInput.fromNumber "m" "Draught") Decode.float) Nothing
        |> Decode.andThen helper
        |> Decode.map interpolate


dictDecoder : Decode.Decoder (Dict String HullSlices)
dictDecoder =
    Decode.dict decoder


dictEncoder : Dict String HullSlices -> Encode.Value
dictEncoder hullDict =
    Encode.object <| List.map (\( key, slices ) -> ( key, encoder slices )) <| Dict.toList hullDict


hullSliceEncoder : HullSlice -> Encode.Value
hullSliceEncoder hullSlice =
    Encode.object
        [ ( "x", Encode.float hullSlice.x )
        , ( "zmin", Encode.float hullSlice.zmin )
        , ( "zmax", Encode.float hullSlice.zmax )
        , ( "y", Encode.list Encode.float hullSlice.y )
        ]


encoder : HullSlices -> Encode.Value
encoder hullSlices =
    Encode.object
        [ ( "length", Encode.float hullSlices.length.value )
        , ( "breadth", Encode.float hullSlices.breadth.value )
        , ( "depth", Encode.float hullSlices.depth.value )
        , ( "draught", Encode.float hullSlices.draught.value )
        , ( "xmin", Encode.float hullSlices.xmin )
        , ( "ymin", Encode.float hullSlices.ymin )
        , ( "zmin", Encode.float hullSlices.zmin )
        , ( "slices", Encode.list hullSliceEncoder hullSlices.slices )
        ]


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa } |> interpolate


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }
        |> (\slices -> { slices | ymin = -slices.breadth.value / 2 })
        |> interpolate


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught } |> interpolate


setDepth : String -> HullSlices -> HullSlices
setDepth depth hullSlices =
    { hullSlices | depth = hullSlices.depth |> StringValueInput.setString depth } |> interpolate


plotAreaCurve : HullSlices -> Html msg
plotAreaCurve slices =
    let
        n : Int
        n =
            List.length slices.sliceAreas

        xs : List Float
        xs =
            List.map (\idx -> slices.xmin + slices.length.value * toFloat idx / (toFloat n - 1.0)) <| List.range 0 (n - 1)

        xys : List ( Float, Float )
        xys =
            List.map2 Tuple.pair xs slices.sliceAreas
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


removeDuplicates : List ( Float, Float ) -> List ( Float, Float )
removeDuplicates l =
    case l of
        [] ->
            []

        [ xy ] ->
            [ xy ]

        ( x1, y1 ) :: ( x2, y2 ) :: rest ->
            if x1 == x2 then
                removeDuplicates (( x2, y2 ) :: rest)

            else
                ( x1, y1 ) :: removeDuplicates (( x2, y2 ) :: rest)


clip : Float -> Float -> List ( Float, Float ) -> List ( Float, Float )
clip a b xys =
    clip_ a b xys
        |> removeDuplicates


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


{-| Dilates a slice while keeping its breadth & depth.
-}
changeSliceAreaWhilePreservingSize : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> { c | zmin : Float, zmax : Float, y : List Float }
changeSliceAreaWhilePreservingSize alpha slice =
    case List.maximum slice.y of
        Nothing ->
            slice

        Just maxSliceBreadth ->
            { slice | y = List.map (modifiedBreadth maxSliceBreadth alpha) slice.y }


dB : Float -> Float -> Float -> Float
dB maxSliceBreadth alpha currentBreadth =
    let
        z =
            ((maxSliceBreadth - currentBreadth) / maxSliceBreadth) * currentBreadth / maxSliceBreadth
    in
    if z == 0 then
        0

    else
        z ^ (1 / alpha)


modifiedBreadth : Float -> Float -> Float -> Float
modifiedBreadth maxSliceBreadth alpha currentBreadth =
    let
        d =
            dB maxSliceBreadth (abs alpha) currentBreadth
    in
    if alpha < 0 then
        (1 - d) * currentBreadth

    else
        (1 - d) * currentBreadth + d * maxSliceBreadth


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


bisectArea : { c | zmin : Float, zmax : Float, y : List Float } -> Float -> Float -> Float -> Int -> Int -> Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float }
bisectArea slice targetArea alphaLow alphaHigh niterMax niter tol draught =
    let
        lowArea =
            area (slice.zmax - draught) slice.zmax lowAreaSlice

        highArea =
            area (slice.zmax - draught) slice.zmax <| changeSliceAreaWhilePreservingSize alphaHigh slice

        alphaMid =
            (alphaLow + alphaHigh) / 2

        lowAreaSlice =
            changeSliceAreaWhilePreservingSize alphaLow slice

        highAreaSlice =
            changeSliceAreaWhilePreservingSize alphaHigh slice

        midAreaSlice =
            changeSliceAreaWhilePreservingSize alphaMid slice

        midArea =
            area (slice.zmax - draught) slice.zmax midAreaSlice

        reachedTolerance a =
            if targetArea == 0 then
                abs (a - targetArea) < tol

            else
                abs (a - targetArea) / targetArea < tol
    in
    if reachedTolerance lowArea then
        lowAreaSlice

    else if reachedTolerance highArea then
        highAreaSlice

    else if (niter > niterMax) || reachedTolerance midArea then
        midAreaSlice

    else if midArea > targetArea then
        bisectArea slice targetArea alphaLow alphaMid niterMax (niter + 1) tol draught

    else
        bisectArea slice targetArea alphaMid alphaHigh niterMax (niter + 1) tol draught


setSliceArea : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Result String { c | zmin : Float, zmax : Float, y : List Float }
setSliceArea targetArea draught slice =
    let
        minArea =
            case slice.y of
                [] ->
                    0

                [ _ ] ->
                    0

                a :: _ ->
                    (slice.zmax - slice.zmin) * a / (toFloat (List.length slice.y) - 1)

        ( alphaMin, alphaMax ) =
            if targetArea < area (slice.zmax - draught) slice.zmax slice then
                ( -100, 0 )

            else
                ( 0, 100 )
    in
    if targetArea < minArea then
        Err "Can't set slice area to such a low value given the discretization: try to increase the area."

    else
        Ok <| bisectArea slice targetArea alphaMin alphaMax 20 0 1.0e-5 draught


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

        c =
            dx

        d =
            sqrt (square dx + square (y2 - y1))
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
        ( x, y ) =
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
                |> List.map (\( x, y, a ) -> a)
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


exportCSV : { a | ldecks : List Float, xmin : Float, xmax : Float, zAtDraught : Float } -> HullSlices -> List { xy : List ( Float, Float ), z : Float }
exportCSV config model =
    let
        ldata =
            List.map
                (\z ->
                    let
                        intersectBelowSlicesZY =
                            HullSliceUtilities.intersectBelow { xmin = config.xmin, xmax = config.xmax } z model.denormalizedslices
                    in
                    prepareToExport z intersectBelowSlicesZY
                )
                config.ldecks
    in
    ldata


tuple2Encoder : (a -> Encode.Value) -> (b -> Encode.Value) -> ( a, b ) -> Encode.Value
tuple2Encoder enc1 enc2 ( val1, val2 ) =
    Encode.list identity [ enc1 val1, enc2 val2 ]


encodeCSVObj : { xy : List ( Float, Float ), z : Float } -> Encode.Value
encodeCSVObj hsXY =
    Encode.object
        [ ( "z", Encode.float hsXY.z )
        , ( "xy", Encode.list (tuple2Encoder Encode.float Encode.float) hsXY.xy )
        ]


encodeCSV : List { xy : List ( Float, Float ), z : Float } -> Encode.Value
encodeCSV list =
    Encode.list encodeCSVObj list


encodeHullSliceXY : HullSliceXY -> Encode.Value
encodeHullSliceXY hsXY =
    Encode.object
        [ ( "x", Encode.float hsXY.x )
        , ( "zylist", Encode.list (tuple2Encoder Encode.float Encode.float) hsXY.zylist )
        ]


encodeSubModel : { xmin : Float, xmax : Float, lhs : List HullSliceXY } -> Encode.Value
encodeSubModel subModel =
    Encode.object
        [ ( "xmin", Encode.float subModel.xmin )
        , ( "xmax", Encode.float subModel.xmax )
        , ( "lhs", Encode.list encodeHullSliceXY subModel.lhs )
        ]


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


inertialMoment : { z : Float, xy : List ( Float, Float ) } -> Float
inertialMoment o =
    let
        xl =
            List.map Tuple.first o.xy

        yl =
            List.map Tuple.second o.xy

        len_ =
            List.length yl

        m_xmin =
            List.minimum xl

        m_xmax =
            List.maximum xl

        im =
            case ( m_xmin, m_xmax ) of
                ( Just xmin, Just xmax ) ->
                    let
                        sum_ =
                            List.foldr (+) 0.0 <| List.map (\u -> u * u * u) yl

                        im1 =
                            if len_ == 0 then
                                0

                            else
                                -- cf architecture navale p307
                                2 / 3 * (xmax - xmin) * sum_ / toFloat len_
                    in
                    im1

                _ ->
                    0
    in
    im


extractY : HullSliceXY -> List Float
extractY hsXY =
    hsXY
        |> .zylist
        |> List.map Tuple.second


prepareToExport : Float -> { xmin : Float, xmax : Float, lhs : List HullSliceXY } -> { z : Float, xy : List ( Float, Float ) }
prepareToExport z0 o =
    let
        f_ : HullSliceXY -> List ( Float, Float ) -> List ( Float, Float )
        f_ hsXY list =
            let
                maybeFirstYValue =
                    List.head <| extractY hsXY
            in
            case maybeFirstYValue of
                Nothing ->
                    list ++ [ ( hsXY.x, 0 ) ]

                Just firstYValue ->
                    list ++ [ ( hsXY.x, firstYValue ) ]

        fl : List HullSliceXY -> List ( Float, Float ) -> List ( Float, Float )
        fl lxy l =
            case lxy of
                [] ->
                    l

                x :: xs ->
                    fl xs (f_ x l)

        l1 =
            fl o.lhs []
    in
    { z = z0, xy = l1 }


blockVolume : { xmin : Float, xmax : Float, lhs : List HullSliceXY } -> Float
blockVolume o =
    -- Volume of the block
    let
        extractZ : HullSliceXY -> List Float
        extractZ hsXY =
            hsXY
                |> .zylist
                |> List.map Tuple.first

        zMinAllSlices : List HullSliceXY -> Maybe Float
        zMinAllSlices list =
            let
                zminHullSlice : HullSliceXY -> Maybe Float
                zminHullSlice hsXY =
                    List.minimum <| extractZ hsXY
            in
            List.map zminHullSlice list
                |> List.filterMap identity
                |> List.minimum

        zMaxAllSlices : List HullSliceXY -> Maybe Float
        zMaxAllSlices list =
            let
                zmaxHullSlice : HullSliceXY -> Maybe Float
                zmaxHullSlice hsXY =
                    List.maximum <| extractZ hsXY
            in
            List.map zmaxHullSlice list
                |> List.filterMap identity
                |> List.maximum

        yMinAllSlices : List HullSliceXY -> Maybe Float
        yMinAllSlices list =
            let
                yminHullSlice : HullSliceXY -> Maybe Float
                yminHullSlice hsXY =
                    List.minimum <| extractY hsXY
            in
            List.map yminHullSlice list
                |> List.filterMap identity
                |> List.minimum

        yMaxAllSlices : List HullSliceXY -> Maybe Float
        yMaxAllSlices list =
            let
                ymaxHullSlice : HullSliceXY -> Maybe Float
                ymaxHullSlice hsXY =
                    List.maximum <| extractY hsXY
            in
            List.map ymaxHullSlice list
                |> List.filterMap identity
                |> List.maximum

        maybeZmin =
            zMinAllSlices o.lhs

        maybeZmax =
            zMaxAllSlices o.lhs

        maybeYmin =
            yMinAllSlices o.lhs

        maybeYmax =
            yMaxAllSlices o.lhs

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
