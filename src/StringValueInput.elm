module StringValueInput
    exposing
        ( FloatInput
        , IntInput
        , addToFloatInput
        , decodeSpacingExceptions
        , floatInputDecoder
        , numberToNumberInput
        )

import Dict exposing (Dict)
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


decodeSpacingExceptions : Decode.Decoder (Dict Int FloatInput)
decodeSpacingExceptions =
    let
        makeException : String -> Float -> Dict Int FloatInput -> Dict Int FloatInput
        makeException key value dict =
            case String.toInt key of
                Ok intKey ->
                    Dict.insert intKey (numberToNumberInput value) dict

                Err message ->
                    -- TODO: handle failure or only ignore ?
                    dict

        parse : Dict String Float -> Dict Int FloatInput
        parse dict =
            Dict.foldl makeException Dict.empty dict
    in
        Decode.map parse (Decode.dict Decode.float)


addToFloatInput : Float -> FloatInput -> FloatInput
addToFloatInput toAdd floatInput =
    let
        newValue : Float
        newValue =
            -- rounded to .2f
            (toFloat (round ((floatInput.value + toAdd) * 100))) / 100
    in
        { value = newValue, string = toString newValue }
