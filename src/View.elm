module View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Message exposing (Msg)
import Model exposing (Model)
import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid


type alias MenuItem =
    ( String, Html Msg )


type alias MenuItems =
    List MenuItem


view : Model -> Html Msg
view model =
    div [ id "elm-root" ]
        [ header
        , content model
        ]


header : Html Msg
header =
    Html.header []
        [ h1 [] [ text "ShipBuilder" ]
        , headerMenu
        ]


content : Model -> Html Msg
content model =
    div [ class "content-wrapper" ]
        [ sideMenu model
        , workspace model
        ]



-- HEADER MENU


headerMenuItems : MenuItems
headerMenuItems =
    [ ( "Ouvrir", FASolid.folder_open )
    , ( "Télécharger", FASolid.download )
    , ( "Imprimer", FASolid.print )
    ]


headerMenu : Html Msg
headerMenu =
    let
        getHeaderMenuItem : MenuItem -> Html Msg
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



-- SIDE


sideMenu : Model -> Html Msg
sideMenu model =
    div [ class "side" ]
        [ panelMenu model
        ]


panelMenu : Model -> Html Msg
panelMenu model =
    div [ class "panel-menu" ]
        [ tabs model
        , build model
        ]


tabs : Model -> Html Msg
tabs model =
    let
        getTab : MenuItem -> Html Msg
        getTab ( title, item ) =
            tab title item model
    in
        div [ class "tabs" ] <|
            List.map getTab tabItems


tabItems : MenuItems
tabItems =
    [ ( "Eléments", FARegular.clone )
    , ( "Images", FARegular.images )
    , ( "Trame", FARegular.chart_bar )
    ]


tab : String -> Html Msg -> Model -> Html Msg
tab title item model =
    div [ class "tab-item" ]
        [ item
        , p [] [ text title ]
        ]


build : Model -> Html Msg
build model =
    p [ class "build-info" ] [ text model.build ]



-- WORKSPACE


workspace : Model -> Html Msg
workspace model =
    div [ class "workspace" ] []
