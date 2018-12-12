module StringValueInput
    exposing
        ( FloatInput
        , IntInput
        , addToFloatInput
        , decodeSpacingExceptions
        , emptyFloat
        , floatInputDecoder
        , fromNumber
        , setString
        )

import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline


type alias FloatInput =
    { value : Float
    , string : String
    }


emptyFloat : FloatInput
emptyFloat =
    { value = 0
    , string = ""
    }


type alias IntInput =
    { value : Int
    , string : String
    }


floatInputDecoder : Decode.Decoder FloatInput
floatInputDecoder =
    Decode.map fromNumber Decode.float


decodeFloatInput : Decode.Decoder FloatInput
decodeFloatInput =
    Pipeline.decode FloatInput
        |> Pipeline.required "value" Decode.float
        |> Pipeline.required "string" Decode.string


fromNumber : a -> { value : a, string : String }
fromNumber number =
    { value = number, string = toString number }


setString : String -> FloatInput -> FloatInput
setString s floatInput =
    case String.toFloat s of
        Ok value ->
            { value = value, string = s }

        Err e ->
            { floatInput | string = s }


decodeSpacingExceptions : Decode.Decoder (Dict Int FloatInput)
decodeSpacingExceptions =
    let
        makeException : String -> Float -> Dict Int FloatInput -> Dict Int FloatInput
        makeException key value dict =
            case String.toInt key of
                Ok intKey ->
                    Dict.insert intKey (fromNumber value) dict

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
