module EncodersDecoders exposing
    ( decoder
    , dictDecoder
    , dictEncoder
    , encodeSubModel
    , encoder
    , exportHullSlicesAsAreaXYList
    , hullSliceAsAreaXYListEncoder
    , normalizeSlicesPosition
    )

import Dict exposing (Dict)
import HullSlices exposing (CustomHullProperties, HullSlice, HullSliceAsAreaXYList, HullSliceAsZYList, HullSlices, emptyHullSlices)
import HullSlicesMetrics exposing (fillHullSliceMetrics)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Lackenby
import StringValueInput exposing (FloatInput)


exportHullSlicesAsAreaXYList : { a | ldecks : List Float, xmin : Float, xmax : Float, zAtDraught : Float } -> HullSlices -> List HullSliceAsAreaXYList
exportHullSlicesAsAreaXYList config hullSlices =
    let
        horizontalSlices =
            List.map
                (\z ->
                    HullSlicesMetrics.extractHorizontalSliceAtZ z <| fillHullSliceMetrics hullSlices
                )
                config.ldecks
    in
    horizontalSlices


hullSliceDecoder : Decode.Decoder HullSlice
hullSliceDecoder =
    Decode.succeed HullSlice
        |> Pipeline.required "x" Decode.float
        |> Pipeline.required "zmin" Decode.float
        |> Pipeline.required "zmax" Decode.float
        |> Pipeline.required "y" (Decode.list Decode.float)


decodeCustomHullProperties : Decode.Decoder CustomHullProperties
decodeCustomHullProperties =
    Decode.succeed CustomHullProperties
        |> Pipeline.optional "customLength" (Decode.map (StringValueInput.fromNumberToMaybe "m" "Length over all" 1) Decode.float) Nothing
        |> Pipeline.optional "customBreadth" (Decode.map (StringValueInput.fromNumberToMaybe "m" "Breadth" 1) Decode.float) Nothing
        |> Pipeline.optional "customDepth" (Decode.map (StringValueInput.fromNumberToMaybe "m" "Depth" 1) Decode.float) Nothing
        |> Pipeline.optional "customDraught" (Decode.map (StringValueInput.fromNumberToMaybe "m" "Draught" 1) Decode.float) Nothing
        |> Pipeline.optional "customHullslicesPosition" (Decode.map Just (Decode.list Decode.float)) Nothing


type alias PreloadedHullSlicesData =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , draught : Maybe StringValueInput.FloatInput
    , slices : List HullSlice
    , customHullProperties : Maybe CustomHullProperties
    }


normalizeSlicesPosition : List HullSlice -> List HullSlice
normalizeSlicesPosition slices =
    let
        xPositions : List Float
        xPositions =
            List.map .x slices

        xFirst : Float
        xFirst =
            xPositions |> List.head |> Maybe.withDefault 0

        xLast : Float
        xLast =
            List.reverse xPositions |> List.head |> Maybe.withDefault 0

        xLength : Float
        xLength =
            xLast - xFirst

        xPositionsBetweenFirstAndLast : List Float
        xPositionsBetweenFirstAndLast =
            xPositions |> List.tail |> Maybe.withDefault [] |> List.reverse |> List.tail |> Maybe.withDefault [] |> List.reverse

        normalize : Float -> Float
        normalize x =
            x / xLength

        normalizedSlicesPosition : List Float
        normalizedSlicesPosition =
            [ 0 ] ++ List.map normalize xPositionsBetweenFirstAndLast ++ [ 1 ]

        setSlicesPosition : Float -> HullSlice -> HullSlice
        setSlicesPosition newX slice =
            { slice | x = newX }
    in
    List.map2 setSlicesPosition normalizedSlicesPosition slices


decoder : Decode.Decoder HullSlices
decoder =
    let
        hullSlicesConstructor : StringValueInput.FloatInput -> StringValueInput.FloatInput -> StringValueInput.FloatInput -> Float -> Float -> List HullSlice -> StringValueInput.FloatInput -> CustomHullProperties -> HullSlices
        hullSlicesConstructor length breadth depth xmin zmin slices draught customHullProperties =
            { emptyHullSlices
                | length = length
                , breadth = breadth
                , depth = depth
                , xmin = xmin
                , zmin = zmin
                , slices = slices
                , originalSlicePositions = List.map .x slices
                , draught = draught
                , customHullProperties = customHullProperties
            }

        helper : PreloadedHullSlicesData -> Decode.Decoder HullSlices
        helper loadedData =
            let
                normalizedSlices =
                    normalizeSlicesPosition loadedData.slices

                draughtDecoded =
                    case loadedData.draught of
                        Just justDraught ->
                            justDraught

                        Nothing ->
                            StringValueInput.fromNumber "m" "Draught" 1 (loadedData.depth.value / 5)

                customHullPropertiesDecoded =
                    case loadedData.customHullProperties of
                        Just customHullProperties ->
                            customHullProperties

                        Nothing ->
                            { customLength = Nothing
                            , customBreadth = Nothing
                            , customDepth = Nothing
                            , customDraught = Nothing
                            , customHullslicesPosition = Nothing
                            }
            in
            Decode.succeed hullSlicesConstructor
                |> Pipeline.hardcoded loadedData.length
                |> Pipeline.hardcoded loadedData.breadth
                |> Pipeline.hardcoded loadedData.depth
                |> Pipeline.required "xmin" Decode.float
                |> Pipeline.required "zmin" Decode.float
                |> Pipeline.hardcoded normalizedSlices
                |> Pipeline.hardcoded draughtDecoded
                |> Pipeline.hardcoded customHullPropertiesDecoded
    in
    Decode.succeed PreloadedHullSlicesData
        |> Pipeline.required "length" (Decode.map (StringValueInput.fromNumber "m" "Length over all" 1) Decode.float)
        |> Pipeline.required "breadth" (Decode.map (StringValueInput.fromNumber "m" "Breadth" 1) Decode.float)
        |> Pipeline.required "depth" (Decode.map (StringValueInput.fromNumber "m" "Depth" 1) Decode.float)
        |> Pipeline.optional "draught" (Decode.map (Just << StringValueInput.fromNumber "m" "Draught" 1) Decode.float) Nothing
        |> Pipeline.required "slices" (Decode.list hullSliceDecoder)
        |> Pipeline.optional "customHullProperties" (Decode.map Just decodeCustomHullProperties) Nothing
        |> Decode.andThen helper


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


type CustomProperties
    = CustomPropertiesFloat FloatInput
    | CustomPropertiesList (List Float)


type MaybeCustomProperties
    = MaybeCustomPropertiesFloat (Maybe FloatInput)
    | MaybeCustomPropertiesList (Maybe (List Float))


encoder : HullSlices -> Encode.Value
encoder hullSlices =
    let
        customHullPropertiesList : List ( String, MaybeCustomProperties )
        customHullPropertiesList =
            [ ( "customLength", MaybeCustomPropertiesFloat hullSlices.customHullProperties.customLength )
            , ( "customBreadth", MaybeCustomPropertiesFloat hullSlices.customHullProperties.customBreadth )
            , ( "customDepth", MaybeCustomPropertiesFloat hullSlices.customHullProperties.customDepth )
            , ( "customDraught", MaybeCustomPropertiesFloat hullSlices.customHullProperties.customDraught )
            , ( "customHullslicesPosition", MaybeCustomPropertiesList hullSlices.customHullProperties.customHullslicesPosition )
            ]

        filterCustomHullProperties : ( String, MaybeCustomProperties ) -> Maybe ( String, CustomProperties )
        filterCustomHullProperties ( nameProperties, maybeProperties ) =
            case maybeProperties of
                MaybeCustomPropertiesList maybePropertiesList ->
                    case maybePropertiesList of
                        Just value ->
                            Just ( nameProperties, CustomPropertiesList value )

                        Nothing ->
                            Nothing

                MaybeCustomPropertiesFloat maybePropertiesFloat ->
                    case maybePropertiesFloat of
                        Just value ->
                            Just ( nameProperties, CustomPropertiesFloat value )

                        Nothing ->
                            Nothing

        extractCustomHullProperties : List ( String, MaybeCustomProperties ) -> List ( String, CustomProperties )
        extractCustomHullProperties list =
            list
                |> List.map filterCustomHullProperties
                |> List.filterMap (\x -> x)

        encodeCustomHullProperties : ( String, CustomProperties ) -> ( String, Encode.Value )
        encodeCustomHullProperties ( nameProperties, properties ) =
            case properties of
                CustomPropertiesList propertiesList ->
                    ( nameProperties, Encode.list Encode.float propertiesList )

                CustomPropertiesFloat propertiesFloat ->
                    ( nameProperties, Encode.float propertiesFloat.value )

        encodedHullProperties : List ( String, Encode.Value )
        encodedHullProperties =
            List.map encodeCustomHullProperties <| extractCustomHullProperties customHullPropertiesList
    in
    Encode.object
        [ ( "length", Encode.float hullSlices.length.value )
        , ( "breadth", Encode.float hullSlices.breadth.value )
        , ( "depth", Encode.float hullSlices.depth.value )
        , ( "draught", Encode.float hullSlices.draught.value )
        , ( "xmin", Encode.float hullSlices.xmin )
        , ( "zmin", Encode.float hullSlices.zmin )
        , ( "slices", Encode.list hullSliceEncoder hullSlices.slices )
        , ( "customHullProperties", Encode.object encodedHullProperties )
        ]


tuple2Encoder : (a -> Encode.Value) -> (b -> Encode.Value) -> ( a, b ) -> Encode.Value
tuple2Encoder enc1 enc2 ( val1, val2 ) =
    Encode.list identity [ enc1 val1, enc2 val2 ]


hullSliceAsAreaXYListEncoder : HullSliceAsAreaXYList -> Encode.Value
hullSliceAsAreaXYListEncoder hsXY =
    Encode.object
        [ ( "z", Encode.float hsXY.z )
        , ( "xy", Encode.list (tuple2Encoder Encode.float Encode.float) hsXY.xy )
        , ( "area", Encode.float hsXY.area )
        ]


encodeHullSliceAsZYList : HullSliceAsZYList -> Encode.Value
encodeHullSliceAsZYList hsXY =
    Encode.object
        [ ( "x", Encode.float hsXY.x )
        , ( "zylist", Encode.list (tuple2Encoder Encode.float Encode.float) hsXY.zylist )
        ]


encodeSubModel : { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList } -> Encode.Value
encodeSubModel subModel =
    Encode.object
        [ ( "xmin", Encode.float subModel.xmin )
        , ( "xmax", Encode.float subModel.xmax )
        , ( "hullSlices", Encode.list encodeHullSliceAsZYList subModel.hullSlices )
        ]
