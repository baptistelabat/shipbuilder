port module Main exposing (main, Viewports, Viewport, encodeViewport, encodeViewports)

import Color exposing (Color, hsl)
import Dict exposing (Dict)
import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Encode as Encode
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Math.Vector3 exposing (Vec3, vec3, toRecord)
import Debug


port send : JsData -> Cmd msg


port receive : (JsData -> msg) -> Sub msg


type alias JsData =
    { tag : String
    , data : Encode.Value
    }


sendToJs : String -> Encode.Value -> Cmd msg
sendToJs tag data =
    send
        { tag = tag
        , data = data
        }


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    receive handleJsMessage


newElementDecoder : Decode.Decoder Block
newElementDecoder =
    Pipeline.decode Block
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "label" Decode.string


handleJsMessage : JsData -> Msg
handleJsMessage js =
    case js.tag of
        "new-element" ->
            case Decode.decodeValue newElementDecoder js.data of
                Ok block ->
                    FromJs <| NewElement block

                Err message ->
                    FromJs <| JSError message

        "select" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| Select uuid

                Err message ->
                    FromJs <| JSError message

        "unselect" ->
            FromJs Unselect

        unknownTag ->
            FromJs <| JSError <| "Unknown tag received from JS: " ++ unknownTag


type JsMsg
    = Select String
    | Unselect
    | JSError String
    | NewElement Block



-- MODEL


type alias Model =
    { build : String
    , panel : Panel
    , viewports : Viewports
    , selectedBlock : Maybe Block
    , blocks : Blocks
    }


type alias Block =
    { uuid : String
    , label : String
    }


type alias Blocks =
    Dict String Block


addBlock : Block -> Blocks -> Blocks
addBlock block blocks =
    Dict.insert block.uuid block blocks


init : ( Model, Cmd Msg )
init =
    let
        viewports : Viewports
        viewports =
            [ topHalfViewport (hsl (degrees 210) 0.7 0.98) viewportSide
            , bottomHalfViewport (hsl (degrees 210) 0.7 0.98) viewportTop
            ]
    in
        ( { build = "0.0.1"
          , panel = ElementsPanel
          , viewports = viewports
          , selectedBlock = Nothing
          , blocks = Dict.empty
          }
        , Cmd.batch
            [ encodeViewports viewports |> sendToJs "init-viewports"
            ]
        )


type Panel
    = ElementsPanel
    | GenericPanel


type alias Viewports =
    List Viewport


type alias Viewport =
    { label : String
    , left :
        -- between 0 and 1, left margin of the viewport within the canvas
        Float
    , top :
        -- between 0 and 1, top margin of the viewport within the canvas
        Float
    , width :
        -- between 0 and 1, ratio of the width between the viewport and the canvas
        Float
    , height :
        -- between 0 and 1, ratio of the height between the viewport and the canvas
        Float
    , background : Color
    , eye : Vec3
    , canControl : { x : Bool, y : Bool, z : Bool }
    }


encodeViewports : Viewports -> Encode.Value
encodeViewports viewports =
    Encode.list <| List.map encodeViewport viewports


encodeViewport : Viewport -> Encode.Value
encodeViewport viewport =
    Encode.object
        [ ( "label", Encode.string viewport.label )
        , ( "left", Encode.float viewport.left )
        , ( "top", Encode.float viewport.top )
        , ( "width", Encode.float viewport.width )
        , ( "height", Encode.float viewport.height )
        , ( "background", encodeColor viewport.background )
        , ( "eye", encodeVector3 viewport.eye )
        , ( "canControl", encodeCanControl viewport.canControl )
        ]


encodeColor : Color -> Encode.Value
encodeColor color =
    let
        rgb : { red : Int, green : Int, blue : Int, alpha : Float }
        rgb =
            Color.toRgb color
    in
        Encode.object
            [ ( "red", Encode.int rgb.red )
            , ( "green", Encode.int rgb.green )
            , ( "blue", Encode.int rgb.blue )
            , ( "alpha", Encode.float rgb.alpha )
            ]


encodeVector3 : Vec3 -> Encode.Value
encodeVector3 vector =
    let
        record =
            toRecord vector
    in
        Encode.object
            [ ( "x", Encode.float record.x )
            , ( "y", Encode.float record.y )
            , ( "z", Encode.float record.z )
            ]


encodeCanControl : { x : Bool, y : Bool, z : Bool } -> Encode.Value
encodeCanControl canControl =
    Encode.object
        [ ( "x", Encode.bool canControl.x )
        , ( "y", Encode.bool canControl.y )
        , ( "z", Encode.bool canControl.z )
        ]


viewportSide : Float -> Float -> Float -> Float -> Color -> Viewport
viewportSide left top width height background =
    Viewport "Side" left top width height background (vec3 0 0 1000) { x = True, y = True, z = False }


viewportTop : Float -> Float -> Float -> Float -> Color -> Viewport
viewportTop left top width height background =
    Viewport "Top" left top width height background (vec3 0 1000 0) { x = True, y = False, z = True }


topHalfViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
topHalfViewport background viewport =
    viewport 0 0 1 0.5 background


bottomHalfViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
bottomHalfViewport background viewport =
    viewport 0 0.5 1 0.5 background


leftHalfViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
leftHalfViewport background viewport =
    viewport 0 0 0.5 1 background


rightHalfViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
rightHalfViewport background viewport =
    viewport 0.5 0 0.5 1 background


topLeftCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
topLeftCornerViewport background viewport =
    viewport 0 0 0.5 0.5 background


topRightCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
topRightCornerViewport background viewport =
    viewport 0.5 0 0.5 0.5 background


bottomLeftCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
bottomLeftCornerViewport background viewport =
    viewport 0 0.5 0.5 0.5 background


bottomRightCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
bottomRightCornerViewport background viewport =
    viewport 0.5 0.5 0.5 0.5 background



-- UPDATE


type Msg
    = NoOp
    | SelectPanel Panel
    | AddCube String
    | FromJs JsMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []

        AddCube label ->
            model ! [ sendToJs "add-cube" (Encode.string label) ]

        SelectPanel panel ->
            { model | panel = panel } ! []

        FromJs jsmsg ->
            updateFromJs jsmsg model


updateFromJs : JsMsg -> Model -> ( Model, Cmd Msg )
updateFromJs jsmsg model =
    case jsmsg of
        NewElement block ->
            let
                blocks =
                    addBlock block model.blocks
            in
                { model | blocks = blocks } ! []

        Select uuid ->
            model ! []

        Unselect ->
            model ! []

        JSError message ->
            let
                _ =
                    Debug.log "error" message
            in
                model ! []



-- VIEW


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
        [ div [ class "header-left" ]
            -- groups img and title together for flexbox
            [ img [ src "img/SIREHNA_R.png" ] []
            , h1 [] [ text "ShipBuilder" ]
            ]
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
        [ h2 [] [ text "Elements" ]
        , button [ onClick (AddCube "testLabel") ] [ text "Add Cube" ]
        , elementsList model
        ]


elementsList : { a | blocks : Blocks, selectedBlock : Maybe Block } -> Html Msg
elementsList elementsModel =
    ul [ class "elements" ] <| List.map elementItem <| Dict.values elementsModel.blocks


elementItem : Block -> Html Msg
elementItem block =
    li [ class "element-item" ] [ text block.uuid ]


defaultPanel : Model -> Html Msg
defaultPanel model =
    div
        [ class "panel" ]
        []


secondaryPanel : Model -> Html Msg
secondaryPanel model =
    div [ class "panel panel__secondary" ] []



-- WORKSPACE


workspace : Model -> Html Msg
workspace model =
    div [ class "workspace" ]
        [ div [ id "three-wrapper" ] []
        ]
