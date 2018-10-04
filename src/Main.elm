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


port toJs : JsData -> Cmd msg


port fromJs : (JsData -> msg) -> Sub msg


type alias JsData =
    { tag : String
    , data : Encode.Value
    }


sendToJs : String -> Encode.Value -> Cmd msg
sendToJs tag data =
    toJs
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
    fromJs jsMsgToMsg


newBlockDecoder : Decode.Decoder Block
newBlockDecoder =
    Pipeline.decode Block
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "color" decodeRgbRecord
        |> Pipeline.required "position" decodePosition
        |> Pipeline.required "size" decodeSize


type alias SyncPosition =
    { uuid : String, position : Position }


syncPositionDecoder : Decode.Decoder SyncPosition
syncPositionDecoder =
    Pipeline.decode SyncPosition
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "position" decodePosition


type alias SyncSize =
    { uuid : String, size : Size }


syncSizeDecoder : Decode.Decoder SyncSize
syncSizeDecoder =
    Pipeline.decode SyncSize
        |> Pipeline.required "uuid" Decode.string
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


jsMsgToMsg : JsData -> Msg
jsMsgToMsg js =
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

        "sync-position" ->
            case Decode.decodeValue syncPositionDecoder js.data of
                Ok syncPosition ->
                    FromJs <| SynchronizePosition syncPosition.uuid syncPosition.position

                Err message ->
                    FromJs <| JSError message

        "sync-size" ->
            case Decode.decodeValue syncSizeDecoder js.data of
                Ok syncSize ->
                    FromJs <| SynchronizeSize syncSize.uuid syncSize.size

                Err message ->
                    FromJs <| JSError message

        "unselect" ->
            FromJs Unselect

        unknownTag ->
            FromJs <| JSError <| "Unknown tag received from JS: " ++ unknownTag


addToFloatInput : Float -> FloatInput -> FloatInput
addToFloatInput toAdd floatInput =
    let
        newValue : Float
        newValue =
            -- rounded to .2f
            (toFloat (round ((floatInput.value + toAdd) * 100))) / 100
    in
        { value = newValue, string = toString newValue }


type JsMsg
    = Select String
    | Unselect
    | JSError String
    | NewBlock Block
    | SynchronizePosition String Position
    | SynchronizeSize String Size



-- MODEL


type alias Model =
    { build : String
    , colorPicker : ColorPicker.State
    , viewMode : ViewMode
    , viewports : Viewports
    , selectedBlock : Maybe String
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


addBlockTo : Blocks -> Block -> Blocks
addBlockTo blocks block =
    DictList.insert block.uuid block blocks


toList : Blocks -> List Block
toList blocks =
    DictList.values blocks


removeBlockFrom : Blocks -> Block -> Blocks
removeBlockFrom blocks block =
    DictList.remove block.uuid blocks


renameBlock : String -> Block -> Block
renameBlock label block =
    { block | label = label }


getHeight : { a | size : Size } -> Float
getHeight block =
    block.size.height.value


getWidth : { a | size : Size } -> Float
getWidth block =
    block.size.width.value


getDepth : { a | size : Size } -> Float
getDepth block =
    block.size.depth.value


getBlockByUUID : String -> Blocks -> Maybe Block
getBlockByUUID uuid blocks =
    DictList.get uuid blocks


init : ( Model, Cmd Msg )
init =
    let
        viewports : Viewports
        viewports =
            [ topHalfViewport (hsl (degrees 222) 0.7 0.98) viewportSide
            , bottomHalfViewport (hsl (degrees 222) 0.53 0.95) viewportTop
            ]
    in
        ( { build = "0.0.1"
          , colorPicker = ColorPicker.empty
          , viewMode = SpaceReservation WholeList
          , viewports = viewports
          , selectedBlock = Nothing
          , blocks = DictList.empty
          }
        , Cmd.batch
            [ encodeViewports viewports |> sendToJs "init-viewports"
            ]
        )


type ViewMode
    = SpaceReservation SpaceReservationView


type SpaceReservationView
    = WholeList
    | DetailedBlock String


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
    | SwitchViewMode ViewMode
    | AddBlock String
    | FromJs JsMsg
    | KeyDown (FloatInput -> Block) FloatInput (Block -> Cmd Msg) KeyEvent
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


encodeUpdateWidthCommand : { a | uuid : String, size : Size } -> Encode.Value
encodeUpdateWidthCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "width", Encode.float (getWidth block) )
        ]


encodeUpdateDepthCommand : { a | uuid : String, size : Size } -> Encode.Value
encodeUpdateDepthCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "depth", Encode.float (getDepth block) )
        ]


updateBlockInModel : Block -> { a | blocks : Blocks } -> { a | blocks : Blocks }
updateBlockInModel block model =
    { model | blocks = addBlockTo model.blocks block }


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


getSelectedBlock : Model -> Maybe Block
getSelectedBlock model =
    case model.selectedBlock of
        Just uuid ->
            getBlockByUUID uuid model.blocks

        Nothing ->
            Nothing


selectBlock : Block -> Model -> Model
selectBlock block model =
    { model | selectedBlock = Just block.uuid }


unselectBlockIfSelected : Block -> Model -> Model
unselectBlockIfSelected block model =
    { model
        | selectedBlock =
            if model.selectedBlock == Just block.uuid then
                Nothing
            else
                model.selectedBlock
    }


unselectBlock : Model -> Model
unselectBlock model =
    { model | selectedBlock = Nothing }


changeBlockColor : Block -> ColorPicker.Msg -> Model -> ( Model, Cmd Msg )
changeBlockColor block colorPickerMsg model =
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


addBlock : String -> Model -> ( Model, Cmd Msg )
addBlock label model =
    model ! [ sendToJs "add-block" (encodeAddBlockCommand label) ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []

        ChangeBlockColor block colorPickerMsg ->
            changeBlockColor block colorPickerMsg model

        AddBlock label ->
            addBlock label model

        KeyDown updateFloatInput floatInput command keyEvent ->
            let
                increment =
                    if keyEvent.shift && not keyEvent.alt then
                        10
                    else if keyEvent.alt && not keyEvent.shift then
                        0.1
                    else
                        1
            in
                case keyEvent.key of
                    38 ->
                        -- Arrow up
                        let
                            newFloatInput : FloatInput
                            newFloatInput =
                                addToFloatInput increment floatInput

                            updatedBlock =
                                updateFloatInput newFloatInput
                        in
                            (updateBlockInModel updatedBlock model) ! [ command updatedBlock ]

                    40 ->
                        -- Arrow downlet
                        let
                            newFloatInput : FloatInput
                            newFloatInput =
                                addToFloatInput (-increment) floatInput

                            updatedBlock =
                                updateFloatInput newFloatInput
                        in
                            (updateBlockInModel updatedBlock model) ! [ command updatedBlock ]

                    _ ->
                        model ! []

        RemoveBlock block ->
            let
                blocks =
                    removeBlockFrom model.blocks block
            in
                ({ model | blocks = blocks } |> unselectBlockIfSelected block) ! [ sendToJs "remove-block" (encodeBlock block) ]

        RenameBlock blockToRename label ->
            let
                renamed =
                    renameBlock label blockToRename
            in
                updateBlockInModel renamed model
                    ! []

        SelectBlock block ->
            (selectBlock block model) ! [ sendToJs "select-block" (encodeBlock block) ]

        SwitchViewMode newViewMode ->
            { model | viewMode = newViewMode } ! []

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
            let
                updatedBlock =
                    updateWidth block input
            in
                (updateBlockInModel updatedBlock model)
                    ! [ sendToJs "update-width" (encodeUpdateWidthCommand updatedBlock) ]

        UpdateHeight block input ->
            let
                updatedBlock =
                    updateHeight block input
            in
                (updateBlockInModel updatedBlock model)
                    ! [ sendToJs "update-height" (encodeUpdateHeightCommand updatedBlock) ]

        UpdateDepth block input ->
            let
                updatedBlock =
                    updateDepth block input
            in
                (updateBlockInModel updatedBlock model)
                    ! [ sendToJs "update-depth" (encodeUpdateDepthCommand updatedBlock) ]

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
            let
                newValue =
                    if value == 0 then
                        0.1
                    else
                        (abs value)
            in
                newValue
                    |> asValueInFloatValue block.size.height
                    |> flip asStringInFloatValue input
                    |> asHeightInSize block.size
                    |> asSizeInBlock block

        Err message ->
            input
                |> asStringInFloatValue block.size.height
                |> asHeightInSize block.size
                |> asSizeInBlock block


updateWidth : Block -> String -> Block
updateWidth block input =
    case String.toFloat input of
        Ok value ->
            let
                newValue =
                    if value == 0 then
                        0.1
                    else
                        (abs value)
            in
                newValue
                    |> asValueInFloatValue block.size.width
                    |> flip asStringInFloatValue input
                    |> asWidthInSize block.size
                    |> asSizeInBlock block

        Err message ->
            input
                |> asStringInFloatValue block.size.width
                |> asWidthInSize block.size
                |> asSizeInBlock block


updateDepth : Block -> String -> Block
updateDepth block input =
    case String.toFloat input of
        Ok value ->
            let
                newValue =
                    if value == 0 then
                        0.1
                    else
                        (abs value)
            in
                newValue
                    |> asValueInFloatValue block.size.depth
                    |> flip asStringInFloatValue input
                    |> asDepthInSize block.size
                    |> asSizeInBlock block

        Err message ->
            input
                |> asStringInFloatValue block.size.depth
                |> asDepthInSize block.size
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
                    addBlockTo model.blocks block
            in
                { model | blocks = blocks } ! [ Task.attempt (\_ -> NoOp) (Dom.focus block.uuid) ]

        Select uuid ->
            let
                maybeBlock : Maybe Block
                maybeBlock =
                    getBlockByUUID uuid model.blocks
            in
                { model | selectedBlock = Maybe.map .uuid maybeBlock } ! []

        Unselect ->
            (unselectBlock model) ! []

        SynchronizePosition uuid position ->
            (case getBlockByUUID uuid model.blocks of
                Just block ->
                    position
                        |> asPositionInBlock block
                        |> flip updateBlockInModel model

                Nothing ->
                    model
            )
                ! []

        SynchronizeSize uuid size ->
            (case getBlockByUUID uuid model.blocks of
                Just block ->
                    size
                        |> asSizeInBlock block
                        |> flip updateBlockInModel model

                Nothing ->
                    model
            )
                ! []

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
        [ viewHeader
        , viewContent model
        ]


viewHeader : Html Msg
viewHeader =
    Html.header []
        [ div [ class "header-left" ]
            -- groups img and title together for flexbox
            [ img [ src "img/SIREHNA_R.png" ] []
            , h1 [] [ text "ShipBuilder" ]
            ]
        , viewHeaderMenu
        ]


viewContent : Model -> Html Msg
viewContent model =
    div [ class "content-wrapper" ]
        [ viewSideMenu model
        , viewWorkspace model
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


viewHeaderMenu : Html Msg
viewHeaderMenu =
    div [ class "header-menu" ] <|
        List.map viewHeaderMenuItem headerMenuItems


viewHeaderMenuItem : MenuItem -> Html Msg
viewHeaderMenuItem ( itemTitle, icon ) =
    div
        [ class "header-menu-item"
        , title itemTitle
        ]
        [ icon ]



-- SIDE


viewSideMenu : Model -> Html Msg
viewSideMenu model =
    div [ class "side" ]
        [ viewPanelMenu model
        , viewPanel model
        ]


viewPanelMenu : Model -> Html Msg
viewPanelMenu model =
    div [ class "panel-menu" ]
        [ viewTabs model
        , viewBuild model
        ]


viewTabs : Model -> Html Msg
viewTabs model =
    div [ class "tabs" ] <|
        List.map (viewTab model) tabItems


type alias Tab =
    { title : String
    , icon : Html Msg
    , viewMode : ViewMode
    }


type alias Tabs =
    List Tab


tabItems : Tabs
tabItems =
    [ { title = "Blocks", icon = FARegular.clone, viewMode = SpaceReservation WholeList }
    ]


viewModesMatch : ViewMode -> ViewMode -> Bool
viewModesMatch left right =
    case left of
        SpaceReservation _ ->
            case right of
                SpaceReservation _ ->
                    True


viewTab : Model -> Tab -> Html Msg
viewTab model tab =
    let
        classes =
            if viewModesMatch tab.viewMode model.viewMode then
                "tab-item active"
            else
                "tab-item"
    in
        div
            [ class classes
            , onClick (SwitchViewMode tab.viewMode)
            ]
            [ tab.icon
            , p [] [ text tab.title ]
            ]


viewBuild : Model -> Html Msg
viewBuild model =
    p [ class "build-info" ] [ text model.build ]


viewPanel : Model -> Html Msg
viewPanel model =
    case model.viewMode of
        SpaceReservation spaceReservationView ->
            viewSpaceReservationPanel spaceReservationView model


viewSpaceReservationPanel : SpaceReservationView -> Model -> Html Msg
viewSpaceReservationPanel spaceReservationView model =
    case spaceReservationView of
        DetailedBlock uuid ->
            viewDetailedBlock uuid model

        WholeList ->
            viewWholeList model


viewWholeList : Model -> Html Msg
viewWholeList model =
    div
        [ class "panel blocks-panel"
        ]
        [ h2 [] [ text "Blocks" ]
        , viewBlockList model
        ]


viewDetailedBlock : String -> Model -> Html Msg
viewDetailedBlock uuid model =
    div
        [ class "panel blocks-panel blocks-panel__focus" ]
    <|
        case getBlockByUUID uuid model.blocks of
            Just block ->
                [ div [ class "focus-title" ]
                    [ text "Properties of block:" ]
                , div
                    [ class "focus-header" ]
                    [ viewBackToWholeList
                    , div [ class "focus-label" ] [ viewEditableBlockName block ]
                    ]
                , div [ class "focus-sub-header" ]
                    [ div [ class "focus-uuid" ] [ text block.uuid ]
                    ]
                , div [ class "focus-properties" ] <|
                    viewBlockProperties block model
                ]

            Nothing ->
                []


viewBackToWholeList : Html Msg
viewBackToWholeList =
    div [ class "focus-back", onClick (SwitchViewMode (SpaceReservation WholeList)) ] [ FASolid.arrow_left ]


viewBlockProperties : Block -> Model -> List (Html Msg)
viewBlockProperties block model =
    [ ColorPicker.view block.color model.colorPicker
        |> Html.map (ChangeBlockColor block)
    , div [ class "block-position" ]
        [ viewPositionInput "x" block.position.x (UpdatePositionX block) block (updateBlockPositionXInModel block)
        , viewPositionInput "y" block.position.y (UpdatePositionY block) block (updateBlockPositionYInModel block)
        , viewPositionInput "z" block.position.z (UpdatePositionZ block) block (updateBlockPositionZInModel block)
        ]
    , div [ class "block-size" ]
        [ viewSizeInput "width" block.size.width (UpdateWidth block) block (updateBlockWidthInModel block) sendWidthUpdate
        , viewSizeInput "height" block.size.height (UpdateHeight block) block (updateBlockHeightInModel block) sendHeightUpdate
        , viewSizeInput "depth" block.size.depth (UpdateDepth block) block (updateBlockDepthInModel block) sendDepthUpdate
        ]
    ]


sendHeightUpdate : Block -> Cmd Msg
sendHeightUpdate block =
    sendToJs "update-height" (encodeUpdateHeightCommand block)


sendWidthUpdate : Block -> Cmd Msg
sendWidthUpdate block =
    sendToJs "update-width" (encodeUpdateWidthCommand block)


sendDepthUpdate : Block -> Cmd Msg
sendDepthUpdate block =
    sendToJs "update-depth" (encodeUpdateDepthCommand block)


updateBlockPositionXInModel : Block -> FloatInput -> Block
updateBlockPositionXInModel block floatInput =
    floatInput
        |> asXInPosition block.position
        |> asPositionInBlock block


updateBlockPositionYInModel : Block -> FloatInput -> Block
updateBlockPositionYInModel block floatInput =
    floatInput
        |> asYInPosition block.position
        |> asPositionInBlock block


updateBlockPositionZInModel : Block -> FloatInput -> Block
updateBlockPositionZInModel block floatInput =
    floatInput
        |> asZInPosition block.position
        |> asPositionInBlock block


updateBlockHeightInModel : Block -> FloatInput -> Block
updateBlockHeightInModel block floatInput =
    let
        validFloatInput =
            if floatInput.value <= 0.1 then
                { value = 0.1, string = "0.1" }
            else
                floatInput
    in
        validFloatInput
            |> asHeightInSize block.size
            |> asSizeInBlock block


updateBlockWidthInModel : Block -> FloatInput -> Block
updateBlockWidthInModel block floatInput =
    let
        validFloatInput =
            if floatInput.value <= 0.1 then
                { value = 0.1, string = "0.1" }
            else
                floatInput
    in
        validFloatInput
            |> asWidthInSize block.size
            |> asSizeInBlock block


updateBlockDepthInModel : Block -> FloatInput -> Block
updateBlockDepthInModel block floatInput =
    let
        validFloatInput =
            if floatInput.value <= 0.1 then
                { value = 0.1, string = "0.1" }
            else
                floatInput
    in
        validFloatInput
            |> asDepthInSize block.size
            |> asSizeInBlock block


viewPositionInput : String -> FloatInput -> (String -> Msg) -> Block -> (FloatInput -> Block) -> Html Msg
viewPositionInput inputLabel position inputMsg block updatePosition =
    div [ class "input-group" ]
        [ label [ for ("position-" ++ inputLabel) ]
            [ text inputLabel ]
        , input
            [ class "block-position-input"
            , name ("position-" ++ inputLabel)
            , id ("position-" ++ inputLabel)
            , type_ "text"
            , value (.string position)
            , onInput inputMsg
            , onBlur (SyncPositionInput block)
            , onKeyDown (KeyDown updatePosition position sendPositionUpdate)
            ]
            []
        ]


sendPositionUpdate : Block -> Cmd Msg
sendPositionUpdate block =
    sendToJs "update-position" <| encodeUpdatePositionCommand block


onKeyDown : (KeyEvent -> msg) -> Attribute msg
onKeyDown tagger =
    on "keydown" (Decode.map tagger keyEventDecoder)


type alias KeyEvent =
    { key : Int
    , shift : Bool
    , alt : Bool
    , ctrl : Bool
    }


keyEventDecoder : Decode.Decoder KeyEvent
keyEventDecoder =
    Pipeline.decode KeyEvent
        |> Pipeline.required "keyCode" Decode.int
        |> Pipeline.required "shiftKey" Decode.bool
        |> Pipeline.required "altKey" Decode.bool
        |> Pipeline.required "ctrlKey" Decode.bool


viewSizeInput : String -> FloatInput -> (String -> Msg) -> Block -> (FloatInput -> Block) -> (Block -> Cmd Msg) -> Html Msg
viewSizeInput inputLabel size inputMsg block updateSize sendSizeUpdate =
    div [ class "input-group" ]
        [ label [ for ("size-" ++ inputLabel) ]
            [ text inputLabel ]
        , input
            [ class "block-size-input"
            , name ("size-" ++ inputLabel)
            , id ("size-" ++ inputLabel)
            , type_ "text"
            , value (.string size)
            , onInput inputMsg
            , onBlur (SyncSizeInput block)
            , onKeyDown (KeyDown updateSize size sendSizeUpdate)
            ]
            []
        ]


type alias FloatInput =
    { value : Float
    , string : String
    }


viewEditableBlockName : Block -> Html Msg
viewEditableBlockName block =
    input [ class "block-label", id block.uuid, value block.label, onInput (RenameBlock block) ]
        []


viewBlockList : { a | blocks : Blocks, selectedBlock : Maybe String } -> Html Msg
viewBlockList blocksModel =
    case blocksModel.selectedBlock of
        Just uuid ->
            ul [ class "blocks" ] <| (List.map (viewBlockItemWithSelection uuid) <| (toList blocksModel.blocks)) ++ [ viewNewBlockItem ]

        Nothing ->
            ul [ class "blocks" ] <| (List.map viewBlockItem <| (toList blocksModel.blocks)) ++ [ viewNewBlockItem ]


viewNewBlockItem : Html Msg
viewNewBlockItem =
    li [ class "add-block" ]
        [ input [ class "block-label", type_ "text", placeholder "New block", value "", onInput AddBlock ]
            []
        ]


viewBlockItem : Block -> Html Msg
viewBlockItem block =
    li [ class "block-item", style [ ( "borderColor", colorToCssRgbString block.color ) ] ] <|
        viewBlockItemContent block


viewBlockItemContent : Block -> List (Html Msg)
viewBlockItemContent block =
    [ div [ class "block-info-wrapper", onClick (SelectBlock block) ]
        [ viewEditableBlockName block
        , p
            [ class "block-uuid" ]
            [ text block.uuid ]
        ]
    , div [ class "block-actions" ]
        [ div [ class "block-action focus-block", onClick (SwitchViewMode (SpaceReservation (DetailedBlock block.uuid))) ]
            [ FASolid.arrow_right
            ]
        , div
            [ class "block-action delete-block"
            , onClick (RemoveBlock block)
            ]
            [ FASolid.trash ]
        ]
    ]


viewBlockItemWithSelection : String -> Block -> Html Msg
viewBlockItemWithSelection uuid block =
    if uuid == block.uuid then
        li [ class "block-item block-item__selected", style [ ( "borderColor", colorToCssRgbString block.color ) ] ] <|
            viewBlockItemContent block
    else
        viewBlockItem block



-- WORKSPACE


viewWorkspace : Model -> Html Msg
viewWorkspace model =
    div [ class "workspace" ]
        [ div [ id "three-wrapper" ] []
        ]
