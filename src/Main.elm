port module Main
    exposing
        ( main
        , encodeInitThreeCommand
        , init
        , initCmd
        , initModel
        , Msg(..)
        , NoJsMsg(..)
        , ToJsMsg(..)
        , toJs
        , update
          --Blocks
        , Block
        , Blocks
        , addBlockTo
        , removeBlockFrom
        )

import Color exposing (Color)
import SIRColorPicker
import DictList exposing (DictList)
import Dom
import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid
import Http exposing (encodeUri)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Encode as Encode
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Task
import Debug
import Viewports exposing (Viewports, encodeViewports)
import CoordinatesTransform exposing (CoordinatesTransform)
import HullReferences exposing (HullReference, HullReferences)


port toJs : JsData -> Cmd msg


port fromJs : (JsData -> msg) -> Sub msg


type alias JsData =
    { tag : String
    , data : Encode.Value
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


type alias SaveFile =
    { version : Int
    , blocks : List Block
    , coordinatesTransform : List Float
    }


saveFileDecoder : Decode.Decoder SaveFile
saveFileDecoder =
    Pipeline.decode SaveFile
        |> Pipeline.required "version" Decode.int
        |> Pipeline.required "blocks" decodeBlocks
        |> Pipeline.required "coordinatesTransform" (Decode.list Decode.float)


decodeBlocks : Decode.Decoder (List Block)
decodeBlocks =
    Decode.list decodeBlock


decodeBlock : Decode.Decoder Block
decodeBlock =
    Pipeline.decode Block
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "color" decodeColor
        |> Pipeline.required "position" decodePosition
        |> Pipeline.required "size" decodeSize


decodeColor : Decode.Decoder Color
decodeColor =
    Pipeline.decode Color.rgba
        |> Pipeline.required "red" Decode.int
        |> Pipeline.required "green" Decode.int
        |> Pipeline.required "blue" Decode.int
        |> Pipeline.required "alpha" Decode.float


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
        |> Pipeline.required "x" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "y" (Decode.map floatToFloatInput Decode.float)
        |> Pipeline.required "z" (Decode.map floatToFloatInput Decode.float)


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
        "save-data" ->
            case Decode.decodeValue saveFileDecoder js.data of
                Ok fileContents ->
                    FromJs <| RestoreSave fileContents

                Err message ->
                    FromJs <| JSError message

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


type FromJsMsg
    = Select String
    | Unselect
    | JSError String
    | NewBlock Block
    | RestoreSave SaveFile
    | SynchronizePosition String Position
    | SynchronizeSize String Size


restoreSaveInModel : Model -> SaveFile -> Model
restoreSaveInModel model saveFile =
    let
        maybeCoordinatesTransform : Maybe CoordinatesTransform
        maybeCoordinatesTransform =
            CoordinatesTransform.fromList saveFile.coordinatesTransform

        savedBlocks =
            listOfBlocksToBlocks saveFile.blocks
    in
        case maybeCoordinatesTransform of
            Just savedCoordinatesTransform ->
                { initModel
                  -- resets focused block and selections
                    | blocks = savedBlocks
                    , coordinatesTransform = savedCoordinatesTransform
                }

            Nothing ->
                model


listOfBlocksToBlocks : List Block -> Blocks
listOfBlocksToBlocks blockList =
    DictList.fromList <| List.map (\block -> ( block.uuid, block )) blockList


restoreSaveCmd : Model -> JsData
restoreSaveCmd model =
    { tag = "restore-save", data = encodeRestoreSaveCmd model }


encodeRestoreSaveCmd : Model -> Encode.Value
encodeRestoreSaveCmd model =
    Encode.object
        [ ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "blocks", encodeBlocks model.blocks )
        ]



-- MODEL


type alias Model =
    { build : String
    , viewMode : ViewMode
    , viewports : Viewports
    , coordinatesTransform : CoordinatesTransform
    , selectedBlock : Maybe String
    , selectedHullReference : Maybe String
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
    { length : FloatInput, width : FloatInput, height : FloatInput }


type alias Blocks =
    DictList String Block


stringifyEncodeValue : Encode.Value -> String
stringifyEncodeValue value =
    Encode.encode 4 value


encodeBlocks : Blocks -> Encode.Value
encodeBlocks blocks =
    Encode.list <| List.map encodeBlock (toList blocks)


encodeModelForSave : Model -> Encode.Value
encodeModelForSave model =
    Encode.object
        [ ( "version", Encode.int 1 )
        , ( "blocks", encodeBlocks model.blocks )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        ]


encodeBlock : Block -> Encode.Value
encodeBlock block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "label", Encode.string block.label )
        , ( "color", encodeColor block.color )
        , ( "position", encodePosition block.position )
        , ( "size", encodeSize block.size )
        ]


encodePosition : Position -> Encode.Value
encodePosition position =
    Encode.object
        [ ( "x", Encode.float position.x.value )
        , ( "y", Encode.float position.y.value )
        , ( "z", Encode.float position.z.value )
        ]


encodeSize : Size -> Encode.Value
encodeSize size =
    Encode.object
        [ ( "x", Encode.float size.length.value )
        , ( "y", Encode.float size.width.value )
        , ( "z", Encode.float size.height.value )
        ]


addBlockTo : Blocks -> Block -> Blocks
addBlockTo blocks block =
    DictList.insert block.uuid block blocks


updateBlockInBlocks : Block -> Blocks -> Blocks
updateBlockInBlocks block blocks =
    if DictList.member block.uuid blocks then
        addBlockTo blocks block
    else
        blocks


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


getLength : { a | size : Size } -> Float
getLength block =
    block.size.length.value


getBlockByUUID : String -> Blocks -> Maybe Block
getBlockByUUID uuid blocks =
    DictList.get uuid blocks


init : ( Model, Cmd Msg )
init =
    let
        model =
            initModel
    in
        ( initModel, toJs <| initCmd model )


initModel : Model
initModel =
    let
        viewports : Viewports
        viewports =
            Viewports.init

        viewMode : ViewMode
        viewMode =
            SpaceReservation WholeList
    in
        { build = "0.0.1"
        , viewMode = viewMode
        , viewports = viewports
        , coordinatesTransform = CoordinatesTransform.default
        , selectedBlock = Nothing
        , selectedHullReference = Nothing
        , blocks = DictList.empty
        }


initCmd : Model -> JsData
initCmd model =
    { tag = "init-three", data = encodeInitThreeCommand model }


type ViewMode
    = SpaceReservation SpaceReservationView
    | HullStudio


type SpaceReservationView
    = WholeList
    | DetailedBlock String


encodeInitThreeCommand : Model -> Encode.Value
encodeInitThreeCommand model =
    Encode.object
        [ ( "viewports", encodeViewports model.viewports )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "mode", encodeViewMode model.viewMode )
        ]


encodeViewMode : ViewMode -> Encode.Value
encodeViewMode viewMode =
    Encode.string <|
        case viewMode of
            SpaceReservation _ ->
                "block"

            HullStudio ->
                "hull"


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



-- UPDATE


encodeAddBlockCommand : String -> Encode.Value
encodeAddBlockCommand label =
    Encode.object
        [ ( "label", Encode.string label )
        , ( "color", encodeColor SIRColorPicker.indigo )
          -- blue
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


encodeUpdateSizeCommand : { a | uuid : String, size : Size } -> Encode.Value
encodeUpdateSizeCommand block =
    Encode.object
        [ ( "uuid", Encode.string block.uuid )
        , ( "size", encodeSize block.size )
        ]


updateBlockInModel : Block -> { a | blocks : Blocks } -> { a | blocks : Blocks }
updateBlockInModel block model =
    { model | blocks = addBlockTo model.blocks block }


asValueInFloatInput : FloatInput -> Float -> FloatInput
asValueInFloatInput floatInput value =
    { floatInput | value = value }


asStringInFloatInput : FloatInput -> String -> FloatInput
asStringInFloatInput floatInput string =
    { floatInput | string = string }


asAxisInPosition : Axis -> (Position -> FloatInput -> Position)
asAxisInPosition axis =
    case axis of
        X ->
            asXInPosition

        Y ->
            asYInPosition

        Z ->
            asZInPosition


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


asDimensionInSize : Dimension -> Size -> FloatInput -> Size
asDimensionInSize dimension =
    case dimension of
        Length ->
            asLengthInSize

        Width ->
            asWidthInSize

        Height ->
            asHeightInSize


asHeightInSize : Size -> FloatInput -> Size
asHeightInSize size height =
    { size | height = height }


asLengthInSize : Size -> FloatInput -> Size
asLengthInSize size length =
    { size | length = length }


asSizeInBlock : Block -> Size -> Block
asSizeInBlock block size =
    { block | size = size }


syncFloatInput : FloatInput -> FloatInput
syncFloatInput input =
    { input | string = toString input.value }


type Msg
    = FromJs FromJsMsg
    | NoJs NoJsMsg
    | ToJs ToJsMsg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FromJs fromJsMsg ->
            updateFromJs fromJsMsg model

        NoJs noJsMsg ->
            updateNoJs noJsMsg model

        ToJs toJsMsg ->
            updateToJs toJsMsg model


type ToJsMsg
    = AddBlock String
    | ChangeBlockColor Block Color
    | KeyDownOnPositionInput Axis Block KeyEvent
    | KeyDownOnSizeInput Dimension Block KeyEvent
    | OpenSaveFile
    | RemoveBlock Block
    | SelectBlock Block
    | SelectHullReference HullReference
    | SwitchViewMode ViewMode
    | UpdatePosition Axis Block String
    | UpdateDimension Dimension Block String


type NoJsMsg
    = NoOp
    | SyncPositionInput Block
    | SyncSizeInput Block
    | RenameBlock Block String


updateNoJs : NoJsMsg -> Model -> ( Model, Cmd Msg )
updateNoJs msg model =
    case msg of
        NoOp ->
            model ! []

        SyncPositionInput block ->
            (syncFloatInput block.position.x
                |> asXInPosition block.position
                |> flip asYInPosition (syncFloatInput block.position.y)
                |> flip asZInPosition (syncFloatInput block.position.z)
                |> asPositionInBlock block
                |> flip updateBlockInModel model
            )
                ! []

        SyncSizeInput blockToSync ->
            (syncFloatInput blockToSync.size.height
                |> asHeightInSize blockToSync.size
                |> flip asWidthInSize (syncFloatInput blockToSync.size.width)
                |> flip asLengthInSize (syncFloatInput blockToSync.size.length)
                |> asSizeInBlock blockToSync
                |> flip updateBlockInModel model
            )
                ! []

        RenameBlock blockToRename newLabel ->
            updateBlockInModel (renameBlock newLabel blockToRename) model ! []


updateToJs : ToJsMsg -> Model -> ( Model, Cmd Msg )
updateToJs msg model =
    let
        updatedModel =
            updateModelToJs msg model

        toJsCmd : Cmd msg
        toJsCmd =
            sendCmdToJs updatedModel msg
    in
        ( updatedModel, sendCmdToJs model msg )


updateFromJs : FromJsMsg -> Model -> ( Model, Cmd Msg )
updateFromJs jsmsg model =
    case jsmsg of
        NewBlock block ->
            let
                blocks : Blocks
                blocks =
                    addBlockTo model.blocks block
            in
                { model | blocks = blocks } ! [ Task.attempt (\_ -> NoJs NoOp) (Dom.focus block.uuid) ]

        RestoreSave saveFile ->
            let
                newModel : Model
                newModel =
                    restoreSaveInModel model saveFile
            in
                -- TODO: split and move in ToJs ?
                newModel ! [ toJs <| restoreSaveCmd newModel ]

        Select uuid ->
            let
                maybeBlock : Maybe Block
                maybeBlock =
                    getBlockByUUID uuid model.blocks
            in
                { model | selectedBlock = Maybe.map .uuid maybeBlock } ! []

        Unselect ->
            { model | selectedBlock = Nothing }
                ! []

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


updateModelToJs : ToJsMsg -> Model -> Model
updateModelToJs msg model =
    case msg of
        OpenSaveFile ->
            model

        ChangeBlockColor block newColor ->
            case getBlockByUUID block.uuid model.blocks of
                Just recoveredBlock ->
                    let
                        updatedBlock : Block
                        updatedBlock =
                            { block | color = newColor }
                    in
                        updateBlockInModel updatedBlock model

                Nothing ->
                    model

        AddBlock label ->
            model

        KeyDownOnPositionInput axis block keyEvent ->
            case toIncrement keyEvent of
                Just increment ->
                    let
                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (block.position |> axisAccessor axis)

                        updatedBlock : Block
                        updatedBlock =
                            updateBlockPositionOnAxis axis block newFloatInput
                    in
                        updateBlockInModel updatedBlock model

                Nothing ->
                    model

        KeyDownOnSizeInput dimension block keyEvent ->
            case toIncrement keyEvent of
                Just increment ->
                    let
                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (block.size |> dimensionAccessor dimension)

                        updatedBlock : Block
                        updatedBlock =
                            updateBlockSizeForDimension dimension block newFloatInput
                    in
                        updateBlockInModel updatedBlock model

                Nothing ->
                    model

        RemoveBlock block ->
            let
                blocks : Blocks
                blocks =
                    removeBlockFrom model.blocks block
            in
                { model | blocks = blocks }

        SelectBlock block ->
            { model | selectedBlock = Just block.uuid }

        SelectHullReference hullReference ->
            { model | selectedHullReference = Just hullReference.path }

        SwitchViewMode newViewMode ->
            { model | viewMode = newViewMode }

        UpdatePosition axis block input ->
            let
                axisFloatInput : FloatInput
                axisFloatInput =
                    block.position |> axisAccessor axis
            in
                case String.toFloat input of
                    Ok value ->
                        let
                            updatedBlock : Block
                            updatedBlock =
                                value
                                    |> asValueInFloatInput axisFloatInput
                                    |> flip asStringInFloatInput input
                                    |> (asAxisInPosition axis) block.position
                                    |> asPositionInBlock block
                        in
                            updateBlockInModel updatedBlock model

                    Err error ->
                        input
                            |> asStringInFloatInput axisFloatInput
                            |> (asAxisInPosition axis) block.position
                            |> asPositionInBlock block
                            |> flip updateBlockInModel model

        UpdateDimension dimension block input ->
            let
                dimensionFloatInput =
                    block.size |> dimensionAccessor dimension
            in
                case String.toFloat input of
                    Ok value ->
                        let
                            newValue : Float
                            newValue =
                                if value == 0 then
                                    0.1
                                else
                                    (abs value)

                            updatedBlock : Block
                            updatedBlock =
                                newValue
                                    |> asValueInFloatInput dimensionFloatInput
                                    |> flip asStringInFloatInput input
                                    |> (asDimensionInSize dimension) block.size
                                    |> asSizeInBlock block
                        in
                            updateBlockInModel updatedBlock model

                    Err message ->
                        input
                            |> asStringInFloatInput dimensionFloatInput
                            |> (asDimensionInSize dimension) block.size
                            |> asSizeInBlock block
                            |> flip updateBlockInModel model


sendCmdToJs : Model -> ToJsMsg -> Cmd msg
sendCmdToJs model msg =
    case msg2json model msg of
        Just jsCmd ->
            toJs jsCmd

        Nothing ->
            Cmd.none


msg2json : Model -> ToJsMsg -> Maybe JsData
msg2json model action =
    case action of
        ChangeBlockColor block newColor ->
            Maybe.map
                (\recoveredBlock ->
                    let
                        updatedBlock =
                            { block | color = newColor }
                    in
                        { tag = "update-color", data = (encodeChangeColorCommand updatedBlock) }
                )
            <|
                getBlockByUUID block.uuid model.blocks

        AddBlock label ->
            Just { tag = "add-block", data = (encodeAddBlockCommand label) }

        KeyDownOnPositionInput axis block keyEvent ->
            Maybe.map
                (\increment ->
                    let
                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (block.position |> axisAccessor axis)

                        updatedBlock : Block
                        updatedBlock =
                            updateBlockPositionOnAxis axis block newFloatInput
                    in
                        sendPositionUpdate updatedBlock
                )
            <|
                toIncrement keyEvent

        KeyDownOnSizeInput dimension block keyEvent ->
            Maybe.map
                (\increment ->
                    let
                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (block.size |> dimensionAccessor dimension)

                        updatedBlock : Block
                        updatedBlock =
                            updateBlockSizeForDimension dimension block newFloatInput
                    in
                        sendSizeUpdate updatedBlock
                )
            <|
                toIncrement keyEvent

        OpenSaveFile ->
            Just { tag = "read-json-file", data = Encode.string "open-save-file" }

        RemoveBlock block ->
            Just { tag = "remove-block", data = encodeBlock block }

        SelectBlock block ->
            Just { tag = "select-block", data = encodeBlock block }

        SelectHullReference hullReference ->
            Just { tag = "load-hull", data = Encode.string hullReference.path }

        SwitchViewMode newViewMode ->
            Just { tag = "switch-mode", data = encodeViewMode newViewMode }

        UpdatePosition axis block input ->
            Maybe.map
                (\value ->
                    let
                        axisFloatInput : FloatInput
                        axisFloatInput =
                            block.position |> axisAccessor axis

                        updatedBlock : Block
                        updatedBlock =
                            value
                                |> asValueInFloatInput axisFloatInput
                                |> flip asStringInFloatInput input
                                |> (asAxisInPosition axis) block.position
                                |> asPositionInBlock block
                    in
                        { tag = "update-position", data = encodeUpdatePositionCommand updatedBlock }
                )
            <|
                Result.toMaybe <|
                    String.toFloat input

        UpdateDimension dimension block input ->
            Maybe.map
                (\value ->
                    let
                        dimensionFloatInput : FloatInput
                        dimensionFloatInput =
                            block.size |> dimensionAccessor dimension

                        newValue : Float
                        newValue =
                            if value == 0 then
                                0.1
                            else
                                (abs value)

                        updatedBlock : Block
                        updatedBlock =
                            newValue
                                |> asValueInFloatInput dimensionFloatInput
                                |> flip asStringInFloatInput input
                                |> (asDimensionInSize dimension) block.size
                                |> asSizeInBlock block
                    in
                        { tag = "update-size", data = (encodeUpdateSizeCommand updatedBlock) }
                )
            <|
                Result.toMaybe <|
                    String.toFloat input


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



-- VIEW


type alias MenuItem =
    ( String, Html Msg )


type alias MenuItems =
    List MenuItem


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
    , { title = "Hull", icon = FASolid.ship, viewMode = HullStudio }
    ]


type alias HullReference =
    { label : String
    , path : String
    }


hullReferences : HullReferences
hullReferences =
    [ { label = "Anthineas", path = "assets/anthineas.stl" }
    ]


sendSizeUpdate : Block -> JsData
sendSizeUpdate block =
    { tag = "update-size", data = encodeUpdateSizeCommand block }


sendPositionUpdate : Block -> JsData
sendPositionUpdate block =
    { tag = "update-position", data = encodeUpdatePositionCommand block }


onKeyDown : (KeyEvent -> msg) -> Attribute msg
onKeyDown tagger =
    on "keydown" (Decode.map tagger keyEventDecoder)


type alias KeyEvent =
    { key : Int
    , shift : Bool
    , alt : Bool
    , ctrl : Bool
    }


updateBlockSizeForDimension : Dimension -> Block -> FloatInput -> Block
updateBlockSizeForDimension dimension block floatInput =
    let
        validFloatInput =
            if floatInput.value <= 0.1 then
                { value = 0.1, string = "0.1" }
            else
                floatInput
    in
        validFloatInput
            |> (asDimensionInSize dimension) block.size
            |> asSizeInBlock block


updateBlockLength : Block -> FloatInput -> Block
updateBlockLength block floatInput =
    let
        validFloatInput =
            if floatInput.value <= 0.1 then
                { value = 0.1, string = "0.1" }
            else
                floatInput
    in
        validFloatInput
            |> asLengthInSize block.size
            |> asSizeInBlock block


view : Model -> Html Msg
view model =
    div [ id "elm-root" ]
        [ viewHeader model
        , viewContent model
        ]


viewHeader : Model -> Html Msg
viewHeader model =
    Html.header []
        [ div
            [ class "header-left" ]
            -- groups img and title together for flexbox
            [ img
                [ src "assets/SIREHNA_R.png" ]
                []
            , h1
                []
                [ text "ShipBuilder" ]
            ]
        , viewHeaderMenu model
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


viewSaveMenuItem : Model -> Html Msg
viewSaveMenuItem model =
    div
        [ class "header-menu-item"
        , title "Open"
        ]
        [ a
            [ type_ "button"
            , href <|
                "data:application/json;charset=utf-8,"
                    ++ (encodeUri <|
                            stringifyEncodeValue <|
                                encodeModelForSave model
                       )
            , downloadAs "shipbuilder.json"
            ]
            [ FASolid.download ]
        ]


viewHeaderMenu : Model -> Html Msg
viewHeaderMenu model =
    div [ class "header-menu" ]
        [ viewOpenMenuItem
        , viewSaveMenuItem model
        ]


viewOpenMenuItem : Html Msg
viewOpenMenuItem =
    div
        [ class "header-menu-item"
        , title "Open"
        ]
        [ label
            [ for "open-save-file" ]
            [ FASolid.folder_open ]
        , input
            [ type_ "file"
            , accept "application/json, .json"
            , id "open-save-file"
            , name "open-save-file"
            , class "hidden-input"
            , on "change" <| Decode.succeed <| ToJs OpenSaveFile
            ]
            []
        ]



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


viewModesMatch : ViewMode -> ViewMode -> Bool
viewModesMatch left right =
    case left of
        SpaceReservation _ ->
            case right of
                SpaceReservation _ ->
                    True

                _ ->
                    False

        HullStudio ->
            case right of
                HullStudio ->
                    True

                _ ->
                    False


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
            , onClick <| ToJs <| SwitchViewMode tab.viewMode
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

        HullStudio ->
            viewHullStudioPanel model


viewSpaceReservationPanel : SpaceReservationView -> Model -> Html Msg
viewSpaceReservationPanel spaceReservationView model =
    case spaceReservationView of
        DetailedBlock uuid ->
            viewDetailedBlock uuid model

        WholeList ->
            viewWholeList model


viewHullStudioPanel : Model -> Html Msg
viewHullStudioPanel model =
    case model.selectedHullReference of
        Just selectedHullReferencePath ->
            HullReferences.viewHullStudioPanelWithSelection
                hullReferences
                (ToJs << SelectHullReference)
                selectedHullReferencePath

        Nothing ->
            HullReferences.viewHullStudioPanel
                hullReferences
                (ToJs << SelectHullReference)


viewWholeList : Model -> Html Msg
viewWholeList model =
    div
        [ class "panel blocks-panel" ]
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
                [ div
                    [ class "focus-title" ]
                    [ text "Properties of block:" ]
                , div
                    [ class "focus-header" ]
                    [ viewBackToWholeList
                    , div
                        [ class "focus-label" ]
                        [ viewEditableBlockName block ]
                    ]
                , div
                    [ class "focus-sub-header" ]
                    [ div
                        [ class "focus-uuid" ]
                        [ text block.uuid ]
                    ]
                , div
                    [ class "focus-properties" ]
                  <|
                    viewBlockProperties block model
                ]

            Nothing ->
                []


viewBackToWholeList : Html Msg
viewBackToWholeList =
    div
        [ class "focus-back"
        , onClick <| ToJs <| SwitchViewMode <| SpaceReservation WholeList
        ]
        [ FASolid.arrow_left ]


viewBlockProperties : Block -> Model -> List (Html Msg)
viewBlockProperties block model =
    [ SIRColorPicker.view block.color (ToJs << ChangeBlockColor block)
    , div
        [ class "block-position" ]
      <|
        List.map (flip viewPositionInput block) [ X, Y, Z ]
    , div
        [ class "block-size" ]
      <|
        List.map (flip viewSizeInput block) [ Length, Width, Height ]
    ]


type Axis
    = X
    | Y
    | Z


axisAccessor : Axis -> { a | x : b, y : b, z : b } -> b
axisAccessor axis =
    case axis of
        X ->
            .x

        Y ->
            .y

        Z ->
            .z


viewPositionInput : Axis -> Block -> Html Msg
viewPositionInput axis block =
    let
        axisLabel =
            String.toLower <| toString axis
    in
        div [ class "input-group" ]
            [ viewPositionInputLabel axisLabel
            , viewPositionInputInput axis block axisLabel
            ]


viewPositionInputLabel : String -> Html Msg
viewPositionInputLabel axisLabel =
    label [ for <| "position-" ++ axisLabel ]
        [ text axisLabel ]


viewPositionInputInput : Axis -> Block -> String -> Html Msg
viewPositionInputInput axis block axisLabel =
    input
        [ class "block-position-input"
        , id <| "position-" ++ axisLabel
        , type_ "text"
        , value <| .string <| axisAccessor axis <| .position block
        , onInput <| ToJs << UpdatePosition axis block
        , onBlur <| NoJs <| SyncPositionInput block
        , onKeyDown <| ToJs << KeyDownOnPositionInput axis block
        ]
        []


updateBlockPositionOnAxis : Axis -> Block -> FloatInput -> Block
updateBlockPositionOnAxis axis block floatInput =
    floatInput
        |> (asAxisInPosition axis) block.position
        |> asPositionInBlock block


keyEventDecoder : Decode.Decoder KeyEvent
keyEventDecoder =
    Pipeline.decode KeyEvent
        |> Pipeline.required "keyCode" Decode.int
        |> Pipeline.required "shiftKey" Decode.bool
        |> Pipeline.required "altKey" Decode.bool
        |> Pipeline.required "ctrlKey" Decode.bool


type Dimension
    = Length
    | Width
    | Height


dimensionAccessor : Dimension -> { a | length : b, width : b, height : b } -> b
dimensionAccessor dimension =
    case dimension of
        Length ->
            .length

        Width ->
            .width

        Height ->
            .height


viewSizeInput : Dimension -> Block -> Html Msg
viewSizeInput dimension block =
    let
        dimensionLabel =
            String.toLower <| toString dimension
    in
        div [ class "input-group" ]
            [ viewSizeInputLabel dimensionLabel
            , viewSizeInputInput dimension block dimensionLabel
            ]


viewSizeInputLabel : String -> Html Msg
viewSizeInputLabel dimensionLabel =
    label [ for ("size-" ++ dimensionLabel) ]
        [ text dimensionLabel ]


viewSizeInputInput : Dimension -> Block -> String -> Html Msg
viewSizeInputInput dimension block dimensionLabel =
    input
        [ class "block-size-input"
        , id ("size-" ++ dimensionLabel)
        , type_ "text"
        , value <| .string <| (dimensionAccessor dimension) <| .size block
        , onInput <| ToJs << UpdateDimension dimension block
        , onBlur <| NoJs <| SyncSizeInput block
        , onKeyDown <| ToJs << KeyDownOnSizeInput dimension block
        ]
        []


type alias FloatInput =
    { value : Float
    , string : String
    }


viewEditableBlockName : Block -> Html Msg
viewEditableBlockName block =
    input
        [ class "block-label"
        , id block.uuid
        , value block.label
        , onInput <| NoJs << RenameBlock block
        ]
        []


viewBlockList : { a | blocks : Blocks, selectedBlock : Maybe String } -> Html Msg
viewBlockList blocksModel =
    case blocksModel.selectedBlock of
        Just uuid ->
            ul
                [ class "blocks" ]
            <|
                (List.map (viewBlockItemWithSelection uuid) <| toList blocksModel.blocks)
                    ++ [ viewNewBlockItem ]

        Nothing ->
            ul
                [ class "blocks" ]
            <|
                (List.map viewBlockItem <| (toList blocksModel.blocks))
                    ++ [ viewNewBlockItem ]


viewNewBlockItem : Html Msg
viewNewBlockItem =
    li [ class "add-block" ]
        [ input
            [ class "block-label"
            , type_ "text"
            , placeholder "New block"
            , value ""
            , onInput <| ToJs << AddBlock
            ]
            []
        ]


viewBlockItem : Block -> Html Msg
viewBlockItem block =
    li
        [ class "block-item"
        , style [ ( "borderColor", colorToCssRgbString block.color ) ]
        ]
    <|
        viewBlockItemContent block


viewBlockItemContent : Block -> List (Html Msg)
viewBlockItemContent block =
    [ div
        [ class "block-info-wrapper"
        , onClick <| ToJs <| SelectBlock block
        ]
        [ viewEditableBlockName block
        , p
            [ class "block-uuid" ]
            [ text block.uuid ]
        ]
    , div
        [ class "block-actions" ]
        [ viewFocusBlockAction block
        , viewDeleteBlockAction block
        ]
    ]


viewFocusBlockAction : Block -> Html Msg
viewFocusBlockAction block =
    div
        [ class "block-action focus-block"
        , onClick <| ToJs <| SwitchViewMode <| SpaceReservation <| DetailedBlock block.uuid
        ]
        [ FASolid.arrow_right
        ]


viewDeleteBlockAction : Block -> Html Msg
viewDeleteBlockAction block =
    div
        [ class "block-action delete-block"
        , onClick <| ToJs <| RemoveBlock block
        ]
        [ FASolid.trash ]


viewBlockItemWithSelection : String -> Block -> Html Msg
viewBlockItemWithSelection uuid block =
    if uuid == block.uuid then
        li
            [ class "block-item block-item__selected"
            , style [ ( "borderColor", colorToCssRgbString block.color ) ]
            ]
        <|
            viewBlockItemContent block
    else
        viewBlockItem block



-- WORKSPACE


viewWorkspace : Model -> Html Msg
viewWorkspace model =
    div [ class "workspace" ]
        [ div [ id "three-wrapper" ] []
        ]
