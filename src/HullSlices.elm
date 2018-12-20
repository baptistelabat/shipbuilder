module HullSlices
    exposing
        ( area
        , clip
        , decoder
        , empty
        , encoder
        , dictDecoder
        , dictEncoder
        , plotAreaCurve
        , setBreadth
        , setDraught
        , setLengthOverAll
        , setMouldedDepth
        , HullSlices
        , HullSlice
        )

import Array
import Dict exposing (Dict)
import Html exposing (Html, div)
import Html.Attributes exposing (id)
import Interpolate.Cubic as Spline exposing (Spline)
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
import LineChart.Junk as Junk
import LineChart.Legends as Legends
import LineChart.Line as Line
import StringValueInput


type alias JsonHullSlices a =
    { a
        | length : StringValueInput.FloatInput
        , breadth : StringValueInput.FloatInput
        , mouldedDepth : StringValueInput.FloatInput
        , xmin : Float
        , ymin : Float
        , zmin : Float
        , slices : List HullSlice
        , draught : StringValueInput.FloatInput
    }


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , mouldedDepth : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , draught : StringValueInput.FloatInput
    , sliceSplines : List Spline
    , sliceAreas : List Float
    , blockCoefficient : Float
    }


empty : HullSlices
empty =
    interpolate
        { length = StringValueInput.emptyFloat
        , breadth = StringValueInput.emptyFloat
        , mouldedDepth = StringValueInput.emptyFloat
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
    Pipeline.decode HullSlice
        |> Pipeline.required "x" Decode.float
        |> Pipeline.required "zmin" Decode.float
        |> Pipeline.required "zmax" Decode.float
        |> Pipeline.required "y" (Decode.list Decode.float)


makeSliceSpline : (Float -> Float) -> (Float -> Float) -> HullSlice -> Spline
makeSliceSpline scaleY scaleZ slice =
    Spline.withRange (scaleZ slice.zmin) (scaleZ slice.zmax) <| List.map scaleY slice.y


interpolate : JsonHullSlices a -> HullSlices
interpolate json =
    let
        scaleY : Float -> Float
        scaleY y =
            y * json.breadth.value + json.ymin

        scaleZ : Float -> Float
        scaleZ y =
            y * json.mouldedDepth.value + json.zmin

        sliceSplines : List Spline
        sliceSplines =
            List.map (makeSliceSpline scaleY scaleZ) json.slices

        sliceAreas : List Float
        sliceAreas =
            List.map (Spline.integrate json.zmin (json.zmin + json.draught.value)) sliceSplines
    in
        { length = json.length
        , breadth = json.breadth
        , mouldedDepth = json.mouldedDepth
        , xmin = json.xmin
        , ymin = json.ymin
        , zmin = json.zmin
        , slices = json.slices
        , draught = json.draught
        , sliceAreas = sliceAreas
        , sliceSplines = sliceSplines
        , blockCoefficient = (Maybe.withDefault 0 <| List.maximum sliceAreas) / (json.breadth.value * json.draught.value)
        }


f : StringValueInput.FloatInput -> StringValueInput.FloatInput -> StringValueInput.FloatInput -> Float -> Float -> Float -> List HullSlice -> StringValueInput.FloatInput -> JsonHullSlices {}
f length breadth mouldedDepth xmin ymin zmin slices draught =
    { length = length
    , breadth = breadth
    , mouldedDepth = mouldedDepth
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
        helper ( mouldedDepth, maybeDraught ) =
            Pipeline.decode f
                |> Pipeline.required "length" (Decode.map (StringValueInput.fromNumber "m" "Length over all") Decode.float)
                |> Pipeline.required "breadth" (Decode.map (StringValueInput.fromNumber "m" "Breadth") Decode.float)
                |> Pipeline.hardcoded mouldedDepth
                |> Pipeline.required "xmin" Decode.float
                |> Pipeline.required "ymin" Decode.float
                |> Pipeline.required "zmin" Decode.float
                |> Pipeline.required "slices" (Decode.list hullSliceDecoder)
                |> Pipeline.hardcoded
                    (case maybeDraught of
                        Just draught ->
                            draught

                        Nothing ->
                            StringValueInput.fromNumber "m" "Draught" (mouldedDepth.value / 5)
                    )
    in
        Pipeline.decode (,)
            |> Pipeline.required "mouldedDepth" (Decode.map (StringValueInput.fromNumber "m" "Moulded depth") Decode.float)
            |> Pipeline.optional "draught" (Decode.map (Just << StringValueInput.fromNumber "m" "Draught") (Decode.float)) Nothing
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
        , ( "y", Encode.list <| List.map Encode.float hullSlice.y )
        ]


encoder : HullSlices -> Encode.Value
encoder hullSlices =
    Encode.object
        [ ( "length", Encode.float hullSlices.length.value )
        , ( "breadth", Encode.float hullSlices.breadth.value )
        , ( "mouldedDepth", Encode.float hullSlices.mouldedDepth.value )
        , ( "draught", Encode.float hullSlices.draught.value )
        , ( "xmin", Encode.float hullSlices.xmin )
        , ( "ymin", Encode.float hullSlices.ymin )
        , ( "zmin", Encode.float hullSlices.zmin )
        , ( "slices", Encode.list <| List.map hullSliceEncoder hullSlices.slices )
        ]


setLengthOverAll : String -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = hullSlices.length |> StringValueInput.setString loa }


setBreadth : String -> HullSlices -> HullSlices
setBreadth breadth hullSlices =
    { hullSlices | breadth = hullSlices.breadth |> StringValueInput.setString breadth }


setDraught : String -> HullSlices -> HullSlices
setDraught draught hullSlices =
    { hullSlices | draught = hullSlices.draught |> StringValueInput.setString draught }


setMouldedDepth : String -> HullSlices -> HullSlices
setMouldedDepth mouldedDepth hullSlices =
    { hullSlices | mouldedDepth = hullSlices.mouldedDepth |> StringValueInput.setString mouldedDepth }


plotAreaCurve : HullSlices -> Html msg
plotAreaCurve slices =
    let
        n : Int
        n =
            List.length slices.sliceAreas

        xs : List Float
        xs =
            List.map (\idx -> slices.xmin + slices.length.value * (toFloat idx) / ((toFloat n) - 1.0)) <| List.range 0 (n - 1)

        xys : List ( Float, Float )
        xys =
            List.map2 (,) xs slices.sliceAreas
    in
        div [ id "area-curve-plot-container" ]
            [ LineChart.viewCustom
                { x = Axis.default 231 "x" Tuple.first
                , y = Axis.default 231 "Area" Tuple.second
                , container =
                    Container.custom
                        { attributesHtml = [ Html.Attributes.style [ ( "font-family", "monospace" ) ] ]
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
            ( zmin + (toFloat idx) * dz, y_ )
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
                [ ( x1, y1 ) ] ++ (removeDuplicates (( x2, y2 ) :: rest))


clip : Float -> Float -> List ( Float, Float ) -> List ( Float, Float )
clip a b xys =
    clip_ a b xys
        |> removeDuplicates


clip_ : Float -> Float -> List ( Float, Float ) -> List ( Float, Float )
clip_ a b xys =
    case xys of
        [] ->
            []

        [ ( x, y ) ] ->
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
                            [ ( left, (left - x1) / (x2 - x1) * (y2 - y1) + y1 ), ( right, (right - x1) / (x2 - x1) * (y2 - y1) + y1 ) ] ++ (clip a b rest)
                        else
                            [ ( left, (left - x1) / (x2 - x1) * (y2 - y1) + y1 ), ( right, (right - x1) / (x2 - x1) * (y2 - y1) + y1 ) ] ++ (clip a b (( x2, y2 ) :: rest))


area : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Float
area a b curve =
    let
        integrate : List ( Float, Float ) -> Float
        integrate l =
            case l of
                [] ->
                    0

                [ xy ] ->
                    0

                ( x1, y1 ) :: ( x2, y2 ) :: rest ->
                    ((x2 - x1) * (y1 + y2) / 2) + (integrate (( x2, y2 ) :: rest))
    in
        curve
            |> toXY
            |> clip a b
            |> integrate
