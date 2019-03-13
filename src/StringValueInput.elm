module StringValueInput exposing
    ( FloatInput
    , IntInput
    , addToFloatInput
    , asFloatIn
    , asStringIn
    , asValueIn
    , decodeSpacingExceptions
    , emptyFloat
    , emptyInt
    , floatInput
    , floatInputDecoder
    , fromInt
    , fromNumber
    , round_n
    , setString
    , syncFloatInput
    , syncIntInput
    , view
    )

import Dict exposing (Dict)
import ExtraEvents
import Html exposing (Html, div, input, label, text)
import Html.Attributes exposing (class, for, id, type_, value)
import Html.Events exposing (onInput)
import Json.Decode as Decode
import String


type alias FloatInput =
    { value : Float
    , string : String
    , unit : String
    , description : String
    , nbOfDigits : Int
    }


emptyFloat : Int -> FloatInput
emptyFloat nbOfDigits =
    { value = 0
    , string = ""
    , unit = ""
    , description = ""
    , nbOfDigits = nbOfDigits
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


syncFloatInput : { a | value : Float, string : String } -> { a | value : Float, string : String }
syncFloatInput input =
    { input | string = String.fromFloat input.value }


syncIntInput : { a | value : Int, string : String } -> { a | value : Int, string : String }
syncIntInput input =
    { input | string = String.fromInt input.value }


floatInputDecoder : Int -> String -> String -> Decode.Decoder FloatInput
floatInputDecoder nbOfDigits unit description =
    Decode.map (fromNumber unit description nbOfDigits) Decode.float


fromNumber : String -> String -> Int -> Float -> FloatInput
fromNumber unit description nbOfDigits value =
    let
        roundedValue =
            round_n nbOfDigits value
    in
    { value = roundedValue, string = String.fromFloat roundedValue, unit = unit, description = description, nbOfDigits = nbOfDigits }


floatInput : Int -> Float -> FloatInput
floatInput nbOfDigits value =
    { value = value, string = "", unit = "", description = "", nbOfDigits = nbOfDigits }


fromInt : String -> Int -> IntInput
fromInt description number =
    { value = number, string = String.fromInt number, description = description }


setString : String -> FloatInput -> FloatInput
setString s floatInput_ =
    case String.toFloat s of
        Just value ->
            let
                roundedValue =
                    round_n floatInput_.nbOfDigits value
            in
            if value == roundedValue then
                { floatInput_ | value = roundedValue, string = s }

            else
                { floatInput_ | value = roundedValue, string = String.fromFloat roundedValue }

        Nothing ->
            { floatInput_ | string = s }


decodeSpacingExceptions : Decode.Decoder (Dict Int FloatInput)
decodeSpacingExceptions =
    let
        makeException : String -> Float -> Dict Int FloatInput -> Dict Int FloatInput
        makeException key value dict =
            case String.toInt key of
                Just intKey ->
                    Dict.insert intKey (fromNumber "" "" 0 value) dict

                Nothing ->
                    dict

        parse : Dict String Float -> Dict Int FloatInput
        parse dict =
            Dict.foldl makeException Dict.empty dict
    in
    Decode.map parse (Decode.dict Decode.float)


addToFloatInput : Float -> FloatInput -> FloatInput
addToFloatInput toAdd floatInput_ =
    let
        newValue : Float
        newValue =
            -- rounded to .2f
            toFloat (round ((floatInput_.value + toAdd) * 100)) / 100
    in
    { floatInput_ | value = newValue, string = String.fromFloat newValue }


asValueIn : { a | value : b, string : String } -> b -> { a | value : b, string : String }
asValueIn numberInput value =
    { numberInput | value = value }


asFloatIn : FloatInput -> Float -> FloatInput
asFloatIn input value =
    { input | value = value, string = String.fromFloat value }


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
        |> (\u ->
                u
                    / factor
           )


view : FloatInput -> (String -> msg) -> Html msg
view floatInput_ onChange =
    let
        generatedID : String
        generatedID =
            makeID floatInput_
    in
    div
        [ class "input-group" ]
        [ label
            [ for generatedID ]
            [ text <| floatInput_.description ++ " (" ++ floatInput_.unit ++ ")" ]
        , input
            [ type_ "text"
            , id generatedID
            , value floatInput_.string
            , ExtraEvents.onKeyDown floatInput_.string onChange
            , onInput onChange
            ]
            []
        ]
