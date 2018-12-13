module ExtraEvents
    exposing
        ( onKeyDown
        , KeyEvent
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


toIncrement : KeyEvent -> Maybe Float
toIncrement keyEvent =
    let
        magnitude : Float
        magnitude =
            if keyEvent.shift && not keyEvent.alt then
                10
            else if keyEvent.alt && not keyEvent.shift then
                0.1
            else
                1
    in
        if isKeyArrowUp keyEvent then
            Just magnitude
        else if isKeyArrowDown keyEvent then
            Just <| -1 * magnitude
        else
            Nothing


onKeyDown : String -> (String -> msg) -> Attribute msg
onKeyDown currentValue onValueChange =
    on "keydown" (Decode.map onValueChange (keyEventDecoder currentValue))


type alias KeyEvent =
    { key : Int
    , shift : Bool
    , alt : Bool
    , ctrl : Bool
    , targetValue : String
    }


keyEventDecoder : String -> Decode.Decoder String
keyEventDecoder currentValue =
    let
        convertToString : KeyEvent -> String
        convertToString keyEvent =
            case toIncrement keyEvent of
                Nothing ->
                    keyEvent.targetValue

                Just inc ->
                    case String.toFloat currentValue of
                        Err _ ->
                            keyEvent.targetValue

                        Ok val ->
                            toString (val + inc)
    in
        Pipeline.decode KeyEvent
            |> Pipeline.required "keyCode" Decode.int
            |> Pipeline.required "shiftKey" Decode.bool
            |> Pipeline.required "altKey" Decode.bool
            |> Pipeline.required "ctrlKey" Decode.bool
            |> Pipeline.requiredAt [ "target", "value" ] Decode.string
            |> Decode.map convertToString
