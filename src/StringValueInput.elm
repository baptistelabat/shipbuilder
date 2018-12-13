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
        , fromInt
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
    , unit : String
    , description : String
    }


emptyFloat : FloatInput
emptyFloat =
    { value = 0
    , string = ""
    , unit = ""
    , description = ""
    }


emptyInt : IntInput
emptyInt =
    { value = 0
    , string = ""
    , description = ""
    }


type alias IntInput =
    { value : Int
    , string : String
    , description : String
    }


syncNumberInput : { a | value : b, string : String } -> { a | value : b, string : String }
syncNumberInput input =
    { input | string = toString input.value }


floatInputDecoder : String -> String -> Decode.Decoder FloatInput
floatInputDecoder unit description =
    Decode.map (fromNumber unit description) Decode.float


decodeFloatInput : Decode.Decoder FloatInput
decodeFloatInput =
    Pipeline.decode FloatInput
        |> Pipeline.required "value" Decode.float
        |> Pipeline.required "string" Decode.string
        |> Pipeline.optional "unit" Decode.string ""
        |> Pipeline.optional "description" Decode.string ""


fromNumber : String -> String -> Float -> FloatInput
fromNumber unit description number =
    { value = number, string = toString number, unit = unit, description = description }


fromInt : String -> Int -> IntInput
fromInt description number =
    { value = number, string = toString number, description = description }


setString : String -> FloatInput -> FloatInput
setString s floatInput =
    case String.toFloat s of
        Ok value ->
            { floatInput | value = value, string = s }

        Err e ->
            { floatInput | string = s }


decodeSpacingExceptions : Decode.Decoder (Dict Int FloatInput)
decodeSpacingExceptions =
    let
        makeException : String -> Float -> Dict Int FloatInput -> Dict Int FloatInput
        makeException key value dict =
            case String.toInt key of
                Ok intKey ->
                    Dict.insert intKey (fromNumber "" "" value) dict

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
