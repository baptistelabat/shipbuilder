port module Main exposing (main, Viewports, Viewport, encodeViewport, encodeViewports)

import Color exposing (Color, hsl)
import ColorPicker
import DictList exposing (DictList)
import Dom
import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Encode as Encode
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Math.Vector3 exposing (Vec3, vec3, toRecord)
import Task
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


newBlockDecoder : Decode.Decoder Block
newBlockDecoder =
    Pipeline.decode Block
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "color" decodeRgbRecord


decodeRgbRecord : Decode.Decoder Color
decodeRgbRecord =
    Pipeline.decode Color.rgb
        |> Pipeline.required "red" Decode.int
        |> Pipeline.required "green" Decode.int
        |> Pipeline.required "blue" Decode.int


handleJsMessage : JsData -> Msg
handleJsMessage js =
    case js.tag of
        "new-block" ->
            case Decode.decodeValue newBlockDecoder js.data of
                Ok block ->
                    FromJs <| NewBlock block

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
    | NewBlock Block



-- MODEL


type alias Model =
    { build : String
    , colorPicker : ColorPicker.State
    , panel : Panel
    , viewports : Viewports
    , selectedBlock : Maybe Block
    , blocks : Blocks
    }


type alias Block =
    { uuid : String
    , label : String
    , color : Color
    }


type alias Blocks =
    DictList String Block


encodeBlock : Block -> Encode.Value
encodeBlock block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "label", Encode.string block.label )
        ]


addBlock : Block -> Blocks -> Blocks
addBlock block blocks =
    DictList.insert block.uuid block blocks


removeBlock : Block -> Blocks -> Blocks
removeBlock block blocks =
    DictList.remove block.uuid blocks


renameBlock : String -> Block -> Block
renameBlock label block =
    { block | label = label }


getBlockByUUID : String -> Blocks -> Maybe Block
getBlockByUUID uuid blocks =
    DictList.get uuid blocks


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
          , colorPicker = ColorPicker.empty
          , panel = BlocksPanel Nothing
          , viewports = viewports
          , selectedBlock = Nothing
          , blocks = DictList.empty
          }
        , Cmd.batch
            [ encodeViewports viewports |> sendToJs "init-viewports"
            ]
        )


type Panel
    = BlocksPanel (Maybe Block)
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
    | ChangeBlockColor Block ColorPicker.Msg
    | SelectPanel Panel
    | AddBlock String
    | FromJs JsMsg
    | RemoveBlock Block
    | SelectBlock Block
    | RenameBlock Block String


encodeAddBlockCommand : String -> Encode.Value
encodeAddBlockCommand label =
    Encode.object
        [ ( "label", Encode.string label )
        , ( "color", encodeColor Color.blue )
        ]


updateBlockInModel : Block -> Model -> Model
updateBlockInModel block model =
    model
        |> updateBlockInBlocks block
        |> updateBlockInSelection block
        |> updateBlockInPanel block


updateBlockInBlocks : Block -> { a | blocks : Blocks } -> { a | blocks : Blocks }
updateBlockInBlocks block model =
    { model | blocks = DictList.insert block.uuid block model.blocks }


updateBlockInSelection : Block -> { a | selectedBlock : Maybe Block } -> { a | selectedBlock : Maybe Block }
updateBlockInSelection block model =
    { model
        | selectedBlock =
            case model.selectedBlock of
                Just selected ->
                    if (selected.uuid == block.uuid) then
                        Just block
                    else
                        model.selectedBlock

                Nothing ->
                    Nothing
    }


updateBlockInPanel : Block -> { a | panel : Panel } -> { a | panel : Panel }
updateBlockInPanel block model =
    { model
        | panel =
            case model.panel of
                BlocksPanel maybeBlock ->
                    case maybeBlock of
                        Just focus ->
                            if focus.uuid == block.uuid then
                                BlocksPanel (Just block)
                            else
                                BlocksPanel maybeBlock

                        Nothing ->
                            model.panel

                GenericPanel ->
                    model.panel
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []

        ChangeBlockColor block colorPickerMsg ->
            let
                ( state, color ) =
                    ColorPicker.update colorPickerMsg block.color model.colorPicker

                updatedModel : Model
                updatedModel =
                    case color of
                        Just col ->
                            updateBlockInModel { block | color = col } model

                        Nothing ->
                            model
            in
                { updatedModel
                    | colorPicker = state
                }
                    ! []

        AddBlock label ->
            model ! [ sendToJs "add-block" (encodeAddBlockCommand label) ]

        RemoveBlock block ->
            let
                blocks =
                    removeBlock block model.blocks

                selectedBlock =
                    case model.selectedBlock of
                        Just selected ->
                            if selected.uuid == block.uuid then
                                Nothing
                            else
                                model.selectedBlock

                        Nothing ->
                            model.selectedBlock
            in
                { model | blocks = blocks, selectedBlock = selectedBlock } ! [ sendToJs "remove-block" (encodeBlock block) ]

        RenameBlock blockToRename label ->
            case getBlockByUUID blockToRename.uuid model.blocks of
                Just block ->
                    let
                        renamed =
                            renameBlock label block

                        blocks =
                            addBlock renamed model.blocks

                        selected =
                            case model.selectedBlock of
                                Just currentSelected ->
                                    if currentSelected.uuid == renamed.uuid then
                                        Just renamed
                                    else
                                        model.selectedBlock

                                Nothing ->
                                    model.selectedBlock

                        panel =
                            case model.panel of
                                BlocksPanel (Just block) ->
                                    if block.uuid == renamed.uuid then
                                        BlocksPanel (Just renamed)
                                    else
                                        model.panel

                                _ ->
                                    model.panel
                    in
                        { model | blocks = blocks, selectedBlock = selected, panel = panel } ! []

                Nothing ->
                    model ! []

        SelectBlock block ->
            { model | selectedBlock = Just block } ! [ sendToJs "select-block" (encodeBlock block) ]

        SelectPanel panel ->
            { model | panel = panel } ! []

        FromJs jsmsg ->
            updateFromJs jsmsg model


updateFromJs : JsMsg -> Model -> ( Model, Cmd Msg )
updateFromJs jsmsg model =
    case jsmsg of
        NewBlock block ->
            let
                blocks =
                    addBlock block model.blocks
            in
                { model | blocks = blocks } ! [ Task.attempt (\_ -> NoOp) (Dom.focus block.uuid) ]

        Select uuid ->
            let
                maybeBlock : Maybe Block
                maybeBlock =
                    getBlockByUUID uuid model.blocks
            in
                { model | selectedBlock = maybeBlock } ! []

        Unselect ->
            { model | selectedBlock = Nothing } ! []

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


colorToCssRgbString : Color -> String
colorToCssRgbString color =
    let
        rgb =
            Color.toRgb color
    in
        "rgba(" ++ (toString rgb.red) ++ "," ++ (toString rgb.green) ++ "," ++ (toString rgb.blue) ++ ")"



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
        List.concat [ [ panelMenu model ], [ panel model ] ]


getPanels : Model -> List (Html Msg)
getPanels model =
    case model.panel of
        BlocksPanel maybeBlock ->
            [ blocksPanel model
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
    [ { title = "Eléments", item = FARegular.clone, target = BlocksPanel Nothing }
    ]


tab : String -> Html Msg -> Panel -> Model -> Html Msg
tab title item panel model =
    let
        -- Check if active
        active : Bool
        active =
            case panel of
                BlocksPanel _ ->
                    case model.panel of
                        BlocksPanel _ ->
                            True

                        _ ->
                            False

                GenericPanel ->
                    model.panel == GenericPanel

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
        BlocksPanel maybeBlock ->
            case maybeBlock of
                Just block ->
                    blocksPanelFocusOn block model

                Nothing ->
                    blocksPanel model

        _ ->
            defaultPanel model


blocksPanel : Model -> Html Msg
blocksPanel model =
    div
        [ class "panel blocks-panel"
        ]
        [ h2 [] [ text "Blocks" ]
        , blocksList model
        ]


blocksPanelFocusOn : Block -> Model -> Html Msg
blocksPanelFocusOn block model =
    div
        [ class "panel blocks-panel blocks-panel__focus" ]
        [ div [ class "focus-title" ]
            [ text "Properties of block:" ]
        , div
            [ class "focus-header" ]
            [ div [ class "focus-back", onClick (SelectPanel (BlocksPanel Nothing)) ] [ FASolid.arrow_left ]
            , div [ class "focus-label" ] [ editableBlockName block ]
            ]
        , div [ class "focus-sub-header" ]
            [ div [ class "focus-uuid" ] [ text block.uuid ]
            ]
        , div [ class "focus-properties" ]
            [ ColorPicker.view block.color model.colorPicker
                |> Html.map (ChangeBlockColor block)
            ]
        ]


editableBlockName : Block -> Html Msg
editableBlockName block =
    input [ class "block-label", id block.uuid, value block.label, onInput (RenameBlock block) ]
        []


blocksList : { a | blocks : Blocks, selectedBlock : Maybe Block } -> Html Msg
blocksList blocksModel =
    case blocksModel.selectedBlock of
        Just selected ->
            ul [ class "blocks" ] <| (List.map (blockItemWithSelection selected) <| DictList.values blocksModel.blocks) ++ [ newBlockItem ]

        Nothing ->
            ul [ class "blocks" ] <| (List.map blockItem <| DictList.values blocksModel.blocks) ++ [ newBlockItem ]


newBlockItem : Html Msg
newBlockItem =
    li [ class "add-block" ]
        [ input [ class "block-label", type_ "text", placeholder "New block", value "", onInput AddBlock ]
            []
        ]


blockItem : Block -> Html Msg
blockItem block =
    li [ class "block-item", style [ ( "borderColor", colorToCssRgbString block.color ) ] ] <|
        blockItemContent block


blockItemContent : Block -> List (Html Msg)
blockItemContent block =
    [ div [ class "block-info-wrapper", onClick (SelectBlock block) ]
        [ editableBlockName block
        , p
            [ class "block-uuid" ]
            [ text block.uuid ]
        ]
    , div [ class "block-actions" ]
        [ div [ class "block-action focus-block", onClick (SelectPanel (BlocksPanel (Just block))) ]
            [ FASolid.arrow_right
            ]
        , div
            [ class "block-action delete-block"
            , onClick (RemoveBlock block)
            ]
            [ FASolid.trash ]
        ]
    ]


blockItemWithSelection : Block -> Block -> Html Msg
blockItemWithSelection selected block =
    if selected.uuid == block.uuid then
        li [ class "block-item block-item__selected", style [ ( "borderColor", colorToCssRgbString block.color ) ] ] <|
            blockItemContent block
    else
        blockItem block


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
