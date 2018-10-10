module SIRColorPicker
    exposing
        ( view
        , palette
        , red
        , pink
        , purple
        , deepPurple
        , indigo
        , blue
        , lightBlue
        , cyan
        , teal
        , green
        , lightGreen
        , lime
        , yellow
        , amber
        , orange
        , deepOrange
        , brown
        , black
        )

import Color exposing (Color, hsl)
import Html.Events exposing (onClick)
import Html.Attributes exposing (class, style)
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


viewColorItem : aBlock -> (aBlock -> Color -> msg) -> Color -> Color -> Html msg
viewColorItem block msg selectedColor color =
    let
        cssColor : String
        cssColor =
            toCssColor color
    in
        div
            (if selectedColor == color then
                [ class "sir-color-item sir-color-item__selected"
                , style [ ( "background-color", cssColor ) ]
                ]
             else
                [ class "sir-color-item"
                , style [ ( "background-color", cssColor ) ]
                , onClick (msg block color)
                ]
            )
            []


view : Color -> aBlock -> (aBlock -> Color -> msg) -> Html msg
view selectedColor block msg =
    div
        [ class "sir-color-picker" ]
        (List.map (viewColorItem block msg selectedColor)
            palette
        )


palette : List Color
palette =
    [ red
    , pink
    , purple
    , deepPurple
    , indigo
    , blue
    , lightBlue
    , cyan
    , teal
    , green
    , lightGreen
    , lime
    , yellow
    , amber
    , orange
    , deepOrange
    , brown
    , black
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
