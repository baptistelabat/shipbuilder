module HullSlices
    exposing
        ( decoder
        , empty
        , encoder
        , dictDecoder
        , dictEncoder
        , setLengthOverAll
        , HullSlices
        , HullSlice
        )

import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias HullSlices =
    { length : Float
    , breadth : Float
    , mouldedDepth : Float
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , draught : Float
    }


empty : HullSlices
empty =
    { length = 0
    , breadth = 0
    , mouldedDepth = 0
    , xmin = 0
    , ymin = 0
    , zmin = 0
    , slices = []
    , draught = 0
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
        helper : Float -> Decode.Decoder HullSlices
        helper mouldedDepth =
            Pipeline.decode HullSlices
                |> Pipeline.required "length" Decode.float
                |> Pipeline.required "breadth" Decode.float
                |> Pipeline.hardcoded mouldedDepth
                |> Pipeline.required "xmin" Decode.float
                |> Pipeline.required "ymin" Decode.float
                |> Pipeline.required "zmin" Decode.float
                |> Pipeline.required "slices" (Decode.list hullSliceDecoder)
                |> Pipeline.hardcoded (mouldedDepth / 5)
    in
        Decode.field "mouldedDepth" Decode.float
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
        [ ( "length", Encode.float hullSlices.length )
        , ( "breadth", Encode.float hullSlices.breadth )
        , ( "mouldedDepth", Encode.float hullSlices.mouldedDepth )
        , ( "xmin", Encode.float hullSlices.xmin )
        , ( "ymin", Encode.float hullSlices.ymin )
        , ( "zmin", Encode.float hullSlices.zmin )
        , ( "slices", Encode.list <| List.map hullSliceEncoder hullSlices.slices )
        ]


setLengthOverAll : Float -> HullSlices -> HullSlices
setLengthOverAll loa hullSlices =
    { hullSlices | length = loa }
