module View exposing (view)

import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Message exposing (Msg(..))
import Model exposing (Model, Panel(..))


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
    div [ class "side" ] <|
        List.concat [ [ panelMenu model ], getPanels model ]


getPanels : Model -> List (Html Msg)
getPanels model =
    case model.panel of
        ElementsPanel ->
            [ elementsPanel model
            , secondaryPanel model
            ]

        _ ->
            [ defaultPanel model ]


panelMenu : Model -> Html Msg
panelMenu model =
    div [ class "panel-menu" ]
        [ tabs model
        , build model
        ]


tabs : Model -> Html Msg
tabs model =
    let
        getTab : Tab -> Html Msg
        getTab tabItem =
            tab tabItem.title tabItem.item tabItem.target model
    in
        div [ class "tabs" ] <|
            List.map getTab tabItems


type alias Tab =
    { title : String
    , item : Html Msg
    , target : Panel
    }


type alias Tabs =
    List Tab


tabItems : Tabs
tabItems =
    [ { title = "Eléments", item = FARegular.clone, target = ElementsPanel }
    , { title = "Images", item = FARegular.images, target = ImagesPanel }
    , { title = "Trale", item = FARegular.chart_bar, target = GridPanel }
    ]


tab : String -> Html Msg -> Panel -> Model -> Html Msg
tab title item panel model =
    let
        -- Check if active
        active : Bool
        active =
            panel == model.panel

        classes =
            if active then
                [ "tab-item", "active" ]
            else
                [ "tab-item" ]
    in
        div
            (List.concat
                [ (List.map class classes)
                , [ onClick (SelectPanel panel) ]
                ]
            )
            [ item
            , p [] [ text title ]
            ]


build : Model -> Html Msg
build model =
    p [ class "build-info" ] [ text model.build ]


panel : Model -> Html Msg
panel model =
    case model.panel of
        ElementsPanel ->
            elementsPanel model

        _ ->
            defaultPanel model


elementsPanel : Model -> Html Msg
elementsPanel model =
    div
        [ class "panel"
        , class "elements-panel"
        ]
        [ h2 [] [ text "Elements" ] ]


defaultPanel : Model -> Html Msg
defaultPanel model =
    div
        [ class "panel" ]
        []


secondaryPanel : Model -> Html Msg
secondaryPanel model =
    div [ class "panel__secondary" ] []



-- WORKSPACE


workspace : Model -> Html Msg
workspace model =
    div [ class "workspace" ] []