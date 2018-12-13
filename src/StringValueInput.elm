module StringValueInput
    exposing
        ( FloatInput
        , IntInput
        , addToFloatInput
        , asStringIn
        , asValueIn
        , decodeSpacingExceptions
        , emptyFloat
        , emptyInt
        , floatInputDecoder
        , fromNumber
        , setString
        , syncNumberInput
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


emptyInt : IntInput
emptyInt =
    { value = 0
    , string = ""
    }


type alias IntInput =
    { value : Int
    , string : String
    }


syncNumberInput : { a | value : b, string : String } -> { a | value : b, string : String }
syncNumberInput input =
    { input | string = toString input.value }


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
        { floatInput | value = newValue, string = toString newValue }


asValueIn : { a | value : b, string : String } -> b -> { a | value : b, string : String }
asValueIn numberInput value =
    { numberInput | value = value }


asStringIn : { a | value : b, string : String } -> String -> { a | value : b, string : String }
asStringIn numberInput string =
    { numberInput | string = string }
