module EncodersDecoders exposing
    ( decoder
    , dictDecoder
    , dictEncoder
    , encodeSubModel
    , encoder
    , exportHullSlicesAsAreaXYList
    , hullSliceAsAreaXYListEncoder
    )

import Dict exposing (Dict)
import HullSlices exposing (CustomHullProperties, HullSlice, HullSliceAsAreaXYList, HullSliceAsZYList, HullSlices, emptyHullSlices)
import HullSlicesMetrics exposing (fillHullSliceMetrics)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Lackenby
import StringValueInput


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
        |> Pipeline.required "customLength" (Decode.map (StringValueInput.fromNumber "m" "Length over all" 1) Decode.float)
        |> Pipeline.required "customBreadth" (Decode.map (StringValueInput.fromNumber "m" "Breadth" 1) Decode.float)
        |> Pipeline.required "customDepth" (Decode.map (StringValueInput.fromNumber "m" "Depth" 1) Decode.float)
        |> Pipeline.required "customDraught" (Decode.map (StringValueInput.fromNumber "m" "Draught" 1) Decode.float)


type alias PreloadedHullSlicesData =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , draught : Maybe StringValueInput.FloatInput
    , customHullProperties : Maybe CustomHullProperties
    }


decoder : Decode.Decoder HullSlices
decoder =
    let
        hullSlicesConstructor : StringValueInput.FloatInput -> StringValueInput.FloatInput -> StringValueInput.FloatInput -> Float -> Float -> Float -> List HullSlice -> StringValueInput.FloatInput -> CustomHullProperties -> HullSlices
        hullSlicesConstructor length breadth depth xmin ymin zmin slices draught customHullProperties =
            { emptyHullSlices
                | length = length
                , breadth = breadth
                , depth = depth
                , xmin = xmin
                , ymin = ymin
                , zmin = zmin
                , slices = slices
                , originalSlicePositions = List.map .x slices
                , draught = draught
                , customHullProperties = customHullProperties
            }

        helper : PreloadedHullSlicesData -> Decode.Decoder HullSlices
        helper temp =
            let
                draughtDecoded =
                    case temp.draught of
                        Just justDraught ->
                            justDraught

                        Nothing ->
                            StringValueInput.fromNumber "m" "Draught" 1 (temp.depth.value / 5)

                customHullPropertiesDecoded =
                    case temp.customHullProperties of
                        Just customHullProperties ->
                            customHullProperties

                        Nothing ->
                            { customLength = temp.length
                            , customBreadth = temp.breadth
                            , customDepth = temp.depth
                            , customDraught = draughtDecoded
                            }
            in
            Decode.succeed hullSlicesConstructor
                |> Pipeline.hardcoded temp.length
                |> Pipeline.hardcoded temp.breadth
                |> Pipeline.hardcoded temp.depth
                |> Pipeline.required "xmin" Decode.float
                |> Pipeline.required "ymin" Decode.float
                |> Pipeline.required "zmin" Decode.float
                |> Pipeline.required "slices" (Decode.list hullSliceDecoder)
                |> Pipeline.hardcoded draughtDecoded
                |> Pipeline.hardcoded customHullPropertiesDecoded
    in
    Decode.succeed PreloadedHullSlicesData
        |> Pipeline.required "length" (Decode.map (StringValueInput.fromNumber "m" "Length over all" 1) Decode.float)
        |> Pipeline.required "breadth" (Decode.map (StringValueInput.fromNumber "m" "Breadth" 1) Decode.float)
        |> Pipeline.required "depth" (Decode.map (StringValueInput.fromNumber "m" "Depth" 1) Decode.float)
        |> Pipeline.optional "draught" (Decode.map (Just << StringValueInput.fromNumber "m" "Draught" 1) Decode.float) Nothing
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
        , ( "customHullProperties"
          , Encode.object
                [ ( "customLength", Encode.float hullSlices.customHullProperties.customLength.value )
                , ( "customBreadth", Encode.float hullSlices.customHullProperties.customBreadth.value )
                , ( "customDepth", Encode.float hullSlices.customHullProperties.customDepth.value )
                , ( "customDraught", Encode.float hullSlices.customHullProperties.customDraught.value )
                ]
          )
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
