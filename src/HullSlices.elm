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
    , dictDecoder
    , dictEncoder
    , empty
    , encoder
    , interpolate
    , modifiedBreadth
    , plotAreaCurve
    , scale
    , setBreadth
    , setDepth
    , setDraught
    , setLengthOverAll
    , setSliceArea
    , trapezoidCentroid
    , volume
    , zminForEachTrapezoid
    )

import Array
import Dict exposing (Dict)
import Html exposing (Html, div)
import Html.Attributes exposing (id)
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
        }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
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


calculateSliceArea : JsonHullSlices a -> HullSlice -> Float
calculateSliceArea json hullSlice =
    -- Multiply by 2 to account for both sides of the hull: otherwise the area is just for the y>0 half-plane
    scale json hullSlice
        |> area (json.zmin + json.depth.value - json.draught.value) (json.zmin + json.depth.value)
        |> (*) 2


interpolate : JsonHullSlices a -> HullSlices
interpolate json =
    let
        sliceAreas : List Float
        sliceAreas =
            List.map (calculateSliceArea json) json.slices
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
    , blockCoefficient = StringValueInput.round_n 2 <| (Maybe.withDefault 0 <| List.maximum sliceAreas) / (json.breadth.value * json.draught.value)
    , volume = StringValueInput.round_n 2 <| volume json sliceAreas
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
            [ LineChart.line Colors.blue Dots.circle "Area curve" xys ]
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


trapezoidCentroid : Float -> Float -> Float -> ( Float, Float )
trapezoidCentroid dx y1 y2 =
    ( (y1 + 2 * y2) / (3 * (y1 + y2)) * dx, 0.5 * (y1 + y2) * dx )


centroidAbscissa : { c | zmin : Float, zmax : Float, y : List Float } -> Float
centroidAbscissa curve =
    (curve.zmin + curve.zmax) / 2


zminForEachTrapezoid : { c | zmin : Float, zmax : Float, y : List Float } -> List Float
zminForEachTrapezoid curve =
    let
        n : Int
        n =
            List.length curve.y
    in
    List.range 0 (n - 2)
        |> List.map (\z -> toFloat z / (toFloat n - 1.0) * (curve.zmax - curve.zmin) + curve.zmin)
