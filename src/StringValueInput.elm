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
        , view
        )

import Dict exposing (Dict)
import ExtraEvents
import Html exposing (Html, div, input, label, text)
import Html.Attributes exposing (class, for, id, type_, value)
import Html.Events exposing (onInput)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import String


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
fromNumber unit description value =
    let
        roundedValue =
            round_n 1 value
    in
        { value = roundedValue, string = toString roundedValue, unit = unit, description = description }


fromInt : String -> Int -> IntInput
fromInt description number =
    { value = number, string = toString number, description = description }


setString : String -> FloatInput -> FloatInput
setString s floatInput =
    case String.toFloat s of
        Ok value ->
            let
                roundedValue =
                    round_n 1 value
            in
                if value == roundedValue then
                    { floatInput | value = roundedValue, string = s }
                else
                    { floatInput | value = roundedValue, string = toString roundedValue }

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


makeID : FloatInput -> String
makeID var =
    let
        isAlphanumeric : Char -> Bool
        isAlphanumeric char =
            String.contains (String.fromChar char) alphanumeric

        alphanumeric : String
        alphanumeric =
            "abcdefghijklmnopqrstuvxwyz0123456789-_"

        dummy : String
        dummy =
            var.string ++ var.unit

        default : String
        default =
            if dummy == "" then
                "empty-float-input"
            else
                dummy

        replaceByDefaultIfEmpty : String -> String
        replaceByDefaultIfEmpty s =
            if s == "" then
                default
            else
                s
    in
        var.description
            |> String.toLower
            |> String.split " "
            |> String.join "-"
            |> String.filter isAlphanumeric


{-| Only keep a certain number of significant digits after coma
-}
round_n : Int -> Float -> Float
round_n nb_of_digits x =
    let
        factor =
            10 ^ toFloat nb_of_digits
    in
        factor
            * x
            + 0.5
            |> floor
            |> toFloat
            |> \u ->
                u
                    / factor


view : FloatInput -> (String -> msg) -> Html msg
view floatInput onChange =
    let
        generatedID : String
        generatedID =
            makeID floatInput
    in
        div
            [ class "input-group" ]
            [ label
                [ for generatedID ]
                [ text <| floatInput.description ++ " (" ++ floatInput.unit ++ ")" ]
            , input
                [ type_ "text"
                , id generatedID
                , value floatInput.string
                , ExtraEvents.onKeyDown floatInput.string onChange
                , onInput onChange
                ]
                []
            ]
