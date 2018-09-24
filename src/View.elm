module View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Message exposing (Msg)
import Model exposing (Model)


-- import FontAwesome.Regular as FARegular

import FontAwesome.Solid as FASolid


view : Model -> Html Msg
view model =
    div []
        [ header
        ]



-- HEADER


header : Html Msg
header =
    Html.header []
        [ h1 [] [ text "ShipBuilder" ]
        , headerMenu
        ]


headerMenuItems : List ( String, Html Msg )
headerMenuItems =
    [ ( "Ouvrir", FASolid.folder_open )
    , ( "Télécharger", FASolid.download )
    , ( "Imprimer", FASolid.print )
    ]


headerMenu : Html Msg
headerMenu =
    let
        getHeaderMenuItem : ( String, Html Msg ) -> Html Msg
        getHeaderMenuItem ( title, item ) =
            headerMenuItem title item
    in
        div [ class "header-menu" ] <|
            List.map getHeaderMenuItem headerMenuItems


headerMenuItem : String -> Html Msg -> Html Msg
headerMenuItem itemTitle item =
    div
        [ class "header-menu-item"
        , title itemTitle
        ]
        [ item ]
