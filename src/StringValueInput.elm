module StringValueInput
    exposing
        ( FloatInput
        , IntInput
        , floatInputDecoder
        , numberToNumberInput
        )

import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline


type alias FloatInput =
    { value : Float
    , string : String
    }


type alias IntInput =
    { value : Int
    , string : String
    }


floatInputDecoder : Decode.Decoder FloatInput
floatInputDecoder =
    Decode.map numberToNumberInput Decode.float


decodeFloatInput : Decode.Decoder FloatInput
decodeFloatInput =
    Pipeline.decode FloatInput
        |> Pipeline.required "value" Decode.float
        |> Pipeline.required "string" Decode.string


numberToNumberInput : a -> { value : a, string : String }
numberToNumberInput number =
    { value = number, string = toString number }
