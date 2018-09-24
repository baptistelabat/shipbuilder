module ExtraEvents exposing
    ( KeyEvent
    , onKeyDown
    )

import Html exposing (Attribute)
import Html.Events exposing (on)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline


isKeyArrowUp : KeyEvent -> Bool
isKeyArrowUp keyEvent =
    keyEvent.key == 38


isKeyArrowDown : KeyEvent -> Bool
isKeyArrowDown keyEvent =
    keyEvent.key == 40


toIncrement : Int -> KeyEvent -> Maybe Float
toIncrement nbOfDigits keyEvent =
    let
        magnitude : Float
        magnitude =
            if keyEvent.shift && not keyEvent.alt then
                10 ^ toFloat (2 - nbOfDigits)

            else if keyEvent.alt && not keyEvent.shift then
                10 ^ toFloat (0 - nbOfDigits)

            else
                10 ^ toFloat (1 - nbOfDigits)
    in
    if isKeyArrowUp keyEvent then
        Just magnitude

    else if isKeyArrowDown keyEvent then
        Just <| -1 * magnitude

    else
        Nothing


onKeyDown : Int -> String -> (String -> msg) -> Attribute msg
onKeyDown nbOfDigits currentValue onValueChange =
    on "keydown" (Decode.map onValueChange (keyEventDecoder nbOfDigits currentValue))


type alias KeyEvent =
    { key : Int
    , shift : Bool
    , alt : Bool
    , ctrl : Bool
    , targetValue : String
    }


keyEventDecoder : Int -> String -> Decode.Decoder String
keyEventDecoder nbOfDigits currentValue =
    let
        convertToString : KeyEvent -> String
        convertToString keyEvent =
            case toIncrement nbOfDigits keyEvent of
                Nothing ->
                    keyEvent.targetValue

                Just inc ->
                    case String.toFloat currentValue of
                        Nothing ->
                            keyEvent.targetValue

                        Just val ->
                            String.fromFloat (val + inc)
    in
    Decode.succeed KeyEvent
        |> Pipeline.required "keyCode" Decode.int
        |> Pipeline.required "shiftKey" Decode.bool
        |> Pipeline.required "altKey" Decode.bool
        |> Pipeline.required "ctrlKey" Decode.bool
        |> Pipeline.requiredAt [ "target", "value" ] Decode.string
        |> Decode.map convertToString
