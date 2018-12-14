module HullSlices
    exposing
        ( decoder
        , empty
        , encoder
        , dictDecoder
        , dictEncoder
        , setBreadth
        , setDraught
        , setLengthOverAll
        , setMouldedDepth
        , HullSlices
        , HullSlice
        )

import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import StringValueInput


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , mouldedDepth : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , draught : StringValueInput.FloatInput
    }


empty : HullSlices
empty =
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


decoder : Decode.Decoder HullSlices
decoder =
    let
        helper : ( StringValueInput.FloatInput, Maybe StringValueInput.FloatInput ) -> Decode.Decoder HullSlices
        helper ( mouldedDepth, maybeDraught ) =
            Pipeline.decode HullSlices
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
