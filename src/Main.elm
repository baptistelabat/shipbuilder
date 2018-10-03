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
        |> Pipeline.required "position" decodePosition
        |> Pipeline.required "size" decodeSize


decodePosition : Decode.Decoder Position
decodePosition =
    Pipeline.decode Position
        |> Pipeline.required "x" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "y" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "z" (Decode.map floatToFloatInput Decode.float)


decodeSize : Decode.Decoder Size
decodeSize =
    Pipeline.decode Size
        |> Pipeline.required "width" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "height" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "depth" (Decode.map floatToFloatInput Decode.float)


decodeFloatInput : Decode.Decoder FloatInput
decodeFloatInput =
    Pipeline.decode FloatInput
        |> Pipeline.required "value" Decode.float
        |> Pipeline.required "string" Decode.string


floatToFloatInput : Float -> FloatInput
floatToFloatInput float =
    { value = float, string = toString float }


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
    , position : Position
    , size : Size
    }


type alias Position =
    { x : FloatInput, y : FloatInput, z : FloatInput }


type alias Size =
    { width : FloatInput, height : FloatInput, depth : FloatInput }


type alias Blocks =
    DictList String Block


encodeBlock : Block -> Encode.Value
encodeBlock block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "label", Encode.string block.label )
        ]


encodePosition : Position -> Encode.Value
encodePosition position =
    Encode.object
        [ ( "x", Encode.float position.x.value )
        , ( "y", Encode.float position.y.value )
        , ( "z", Encode.float position.z.value )
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


getHeight : { a | size : Size } -> Float
getHeight block =
    block.size.height.value


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
    | UpdatePositionX Block String
    | UpdatePositionY Block String
    | UpdatePositionZ Block String
    | UpdateWidth Block String
    | UpdateHeight Block String
    | UpdateDepth Block String
    | RemoveBlock Block
    | SelectBlock Block
    | SyncPositionInput Block
    | SyncSizeInput Block
    | RenameBlock Block String


encodeAddBlockCommand : String -> Encode.Value
encodeAddBlockCommand label =
    Encode.object
        [ ( "label", Encode.string label )
        , ( "color", encodeColor Color.blue )
        ]


encodeChangeColorCommand : Block -> Encode.Value
encodeChangeColorCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "color", encodeColor block.color )
        ]


encodeUpdatePositionCommand : { a | uuid : String, position : Position } -> Encode.Value
encodeUpdatePositionCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "position", encodePosition block.position )
        ]


encodeUpdateHeightCommand : { a | uuid : String, size : Size } -> Encode.Value
encodeUpdateHeightCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "height", Encode.float (getHeight block) )
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


asValueInFloatValue : FloatInput -> Float -> FloatInput
asValueInFloatValue floatInput value =
    { floatInput | value = value }


asStringInFloatValue : FloatInput -> String -> FloatInput
asStringInFloatValue floatInput string =
    { floatInput | string = string }


asXInPosition : Position -> FloatInput -> Position
asXInPosition position x =
    { position | x = x }


asYInPosition : Position -> FloatInput -> Position
asYInPosition position y =
    { position | y = y }


asZInPosition : Position -> FloatInput -> Position
asZInPosition position z =
    { position | z = z }


asPositionInBlock : Block -> Position -> Block
asPositionInBlock block position =
    { block | position = position }


asWidthInSize : Size -> FloatInput -> Size
asWidthInSize size width =
    { size | width = width }


asHeightInSize : Size -> FloatInput -> Size
asHeightInSize size height =
    { size | height = height }


asDepthInSize : Size -> FloatInput -> Size
asDepthInSize size depth =
    { size | depth = depth }


asSizeInBlock : Block -> Size -> Block
asSizeInBlock block size =
    { block | size = size }


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
            in
                case color of
                    Just col ->
                        let
                            updatedBlock =
                                { block | color = col }

                            updatedModel =
                                updateBlockInModel updatedBlock model
                        in
                            { updatedModel
                                | colorPicker = state
                            }
                                ! [ sendToJs "update-color" (encodeChangeColorCommand updatedBlock) ]

                    Nothing ->
                        model ! []

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
            let
                renamed =
                    renameBlock label blockToRename
            in
                updateBlockInModel renamed model
                    ! []

        SelectBlock block ->
            { model | selectedBlock = Just block } ! [ sendToJs "select-block" (encodeBlock block) ]

        SelectPanel panel ->
            { model | panel = panel } ! []

        SyncPositionInput block ->
            let
                updatedModel : Model
                updatedModel =
                    syncFloatInput block.position.x
                        |> asXInPosition block.position
                        |> flip asYInPosition (syncFloatInput block.position.y)
                        |> flip asZInPosition (syncFloatInput block.position.z)
                        |> asPositionInBlock block
                        |> flip updateBlockInModel model
            in
                updatedModel ! []

        SyncSizeInput block ->
            let
                updatedModel : Model
                updatedModel =
                    syncFloatInput block.size.height
                        |> asHeightInSize block.size
                        |> flip asWidthInSize (syncFloatInput block.size.width)
                        |> flip asDepthInSize (syncFloatInput block.size.depth)
                        |> asSizeInBlock block
                        |> flip updateBlockInModel model
            in
                updatedModel ! []

        UpdatePositionX block input ->
            updateOnePosition block input .x asXInPosition model

        UpdatePositionY block input ->
            updateOnePosition block input .y asYInPosition model

        UpdatePositionZ block input ->
            updateOnePosition block input .z asZInPosition model

        UpdateWidth block input ->
            model ! []

        UpdateHeight block input ->
            let
                updatedBlock =
                    updateHeight block input
            in
                (updateBlockInModel updatedBlock model)
                    ! [ sendToJs "update-height" (encodeUpdateHeightCommand updatedBlock) ]

        UpdateDepth block input ->
            model ! []

        FromJs jsmsg ->
            updateFromJs jsmsg model


updateOnePosition : Block -> String -> (Position -> FloatInput) -> (Position -> FloatInput -> Position) -> Model -> ( Model, Cmd msg )
updateOnePosition block input accessor updateFunction model =
    case String.toFloat input of
        Ok value ->
            let
                updatedBlock : Block
                updatedBlock =
                    value
                        |> asValueInFloatValue (accessor block.position)
                        |> flip asStringInFloatValue input
                        |> updateFunction block.position
                        |> asPositionInBlock block
            in
                updateBlockInModel updatedBlock model
                    ! [ sendToJs "update-position" (encodeUpdatePositionCommand updatedBlock) ]

        Err error ->
            (input
                |> asStringInFloatValue (accessor block.position)
                |> updateFunction block.position
                |> asPositionInBlock block
                |> flip updateBlockInModel model
            )
                ! []


updateHeight : Block -> String -> Block
updateHeight block input =
    case String.toFloat input of
        Ok value ->
            (abs value)
                |> asValueInFloatValue block.size.height
                |> flip asStringInFloatValue input
                |> asHeightInSize block.size
                |> asSizeInBlock block

        Err message ->
            input
                |> asStringInFloatValue block.size.height
                |> asHeightInSize block.size
                |> asSizeInBlock block


syncFloatInput : FloatInput -> FloatInput
syncFloatInput input =
    { input | string = toString input.value }


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
        , div [ class "focus-properties" ] <|
            blockProperties block model
        ]


blockProperties : Block -> Model -> List (Html Msg)
blockProperties block model =
    [ ColorPicker.view block.color model.colorPicker
        |> Html.map (ChangeBlockColor block)
    , div [ class "block-position" ]
        [ positionInput "x" .x UpdatePositionX block
        , positionInput "y" .y UpdatePositionY block
        , positionInput "z" .z UpdatePositionZ block
        ]
    , div [ class "block-size" ]
        [ sizeInput "width" .width UpdateWidth block
        , sizeInput "height" .height UpdateHeight block
        , sizeInput "depth" .depth UpdateDepth block
        ]
    ]


positionInput : String -> (Position -> FloatInput) -> (Block -> String -> Msg) -> Block -> Html Msg
positionInput inputLabel getPosition msg block =
    div [ class "input-group" ]
        [ label [ for ("position-" ++ inputLabel) ]
            [ text inputLabel ]
        , input
            [ class "block-position-input"
            , name ("position-" ++ inputLabel)
            , id ("position-" ++ inputLabel)
            , type_ "text"
            , value (.string (getPosition block.position))
            , onInput (msg block)
            , onBlur (SyncPositionInput block)
            ]
            []
        ]


sizeInput : String -> (Size -> FloatInput) -> (Block -> String -> Msg) -> Block -> Html Msg
sizeInput inputLabel getSize msg block =
    div [ class "input-group" ]
        [ label [ for ("size-" ++ inputLabel) ]
            [ text inputLabel ]
        , input
            [ class "block-size-input"
            , name ("size-" ++ inputLabel)
            , id ("size-" ++ inputLabel)
            , type_ "text"
            , value (.string (getSize block.size))
            , onInput (msg block)
            , onBlur (SyncSizeInput block)
            ]
            []
        ]


type alias FloatInput =
    { value : Float
    , string : String
    }


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
