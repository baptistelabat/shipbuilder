module SIRColorPicker exposing (..)

import Color exposing (Color, hsl)
import Html.Events exposing (onClick)
import Html.Attributes exposing (class, style, title)
import Html exposing (Html, div)


toCssColor : Color -> String
toCssColor color =
    let
        rgb =
            Color.toRgb color
    in
        "rgba("
            ++ (toString rgb.red)
            ++ ","
            ++ (toString rgb.green)
            ++ ","
            ++ (toString rgb.blue)
            ++ ","
            ++ (toString rgb.alpha)
            ++ ")"


viewColorItem : (Color -> msg) -> Color -> SirColor -> Html msg
viewColorItem msg selectedColor sirColor =
    let
        cssColor : String
        cssColor =
            toCssColor <| getColor sirColor
    in
        div
            (if selectedColor == (getColor sirColor) then
                [ class "sir-color-item sir-color-item__selected"
                , style [ ( "background-color", cssColor ) ]
                , title <| getName sirColor
                ]
             else
                [ class "sir-color-item"
                , style [ ( "background-color", cssColor ) ]
                , onClick (msg <| getColor sirColor)
                , title <| getName sirColor
                ]
            )
            []


view : Color -> (Color -> msg) -> Html msg
view selectedColor msg =
    div
        [ class "sir-color-picker" ]
        (List.map (viewColorItem msg selectedColor)
            palette
        )


type SirColor
    = Red
    | Pink
    | Purple
    | DeepPurple
    | Indigo
    | Blue
    | LightBlue
    | Cyan
    | Teal
    | Green
    | LightGreen
    | Lime
    | Yellow
    | Amber
    | Orange
    | DeepOrange
    | Brown
    | Black


getColor : SirColor -> Color
getColor sirColor =
    case sirColor of
        Red ->
            red

        Pink ->
            pink

        Purple ->
            purple

        DeepPurple ->
            deepPurple

        Indigo ->
            indigo

        Blue ->
            blue

        LightBlue ->
            lightBlue

        Cyan ->
            cyan

        Teal ->
            teal

        Green ->
            green

        LightGreen ->
            lightGreen

        Lime ->
            lime

        Yellow ->
            yellow

        Amber ->
            amber

        Orange ->
            orange

        DeepOrange ->
            deepOrange

        Brown ->
            brown

        Black ->
            black


fromColor : Color -> Maybe SirColor
fromColor color =
    List.head <| List.filter ((==) color << getColor) palette


getName : SirColor -> String
getName sirColor =
    toString sirColor


fromName : String -> Maybe SirColor
fromName name =
    List.head <| List.filter ((==) name << getName) palette


palette : List SirColor
palette =
    [ Red
    , Pink
    , Purple
    , DeepPurple
    , Indigo
    , Blue
    , LightBlue
    , Cyan
    , Teal
    , Green
    , LightGreen
    , Lime
    , Yellow
    , Amber
    , Orange
    , DeepOrange
    , Brown
    , Black
    ]


red : Color
red =
    Color.rgb 244 67 54


pink : Color
pink =
    Color.rgb 233 30 99


purple : Color
purple =
    Color.rgb 156 39 176


deepPurple : Color
deepPurple =
    Color.rgb 103 58 183


indigo : Color
indigo =
    Color.rgb 63 81 181


blue : Color
blue =
    Color.rgb 33 150 243


lightBlue : Color
lightBlue =
    Color.rgb 3 169 244


cyan : Color
cyan =
    Color.rgb 0 188 212


teal : Color
teal =
    Color.rgb 0 150 136


green : Color
green =
    Color.rgb 76 175 80


lightGreen : Color
lightGreen =
    Color.rgb 139 195 74


lime : Color
lime =
    Color.rgb 205 220 57


yellow : Color
yellow =
    Color.rgb 255 235 59


amber : Color
amber =
    Color.rgb 255 193 7


orange : Color
orange =
    Color.rgb 255 152 0


deepOrange : Color
deepOrange =
    Color.rgb 255 87 34


brown : Color
brown =
    Color.rgb 121 85 72


black : Color
black =
    Color.rgb 0 0 0
