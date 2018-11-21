port module Main
    exposing
        ( main
        , encodeInitThreeCommand
        , init
        , initCmd
        , initModel
        , initBlock
        , Model
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
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_fr_fr exposing (config)
import SIRColorPicker
import Dict exposing (Dict)
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
import Keyboard exposing (KeyCode)
import Task
import Time
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


type alias Flag =
    String


main : Program Flag Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ fromJs jsMsgToMsg
        , Keyboard.downs keydownToMsg
        , Keyboard.ups keyupToMsg
        , Time.every (20 * Time.second) (NoJs << SetCurrentDate << Date.fromTime)
        ]


newBlockDecoder : Decode.Decoder Block
newBlockDecoder =
    Pipeline.decode Block
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "color" decodeRgbRecord
        |> Pipeline.required "position" decodePosition
        |> Pipeline.required "size" decodeSize
        |> Pipeline.hardcoded None
        |> Pipeline.hardcoded { value = 0, string = "0" }
        |> Pipeline.hardcoded { value = 0, string = "0" }
        |> Pipeline.hardcoded True
        |> Pipeline.hardcoded initPosition


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
    { blocks : List Block
    , coordinatesTransform : List Float
    , partitions : PartitionsData
    , tags : Tags
    , customProperties : List CustomProperty
    }


saveFileDecoderV1 : Decode.Decoder SaveFile
saveFileDecoderV1 =
    Pipeline.decode SaveFile
        |> Pipeline.required "blocks" decodeBlocks
        |> Pipeline.required "coordinatesTransform" (Decode.list Decode.float)
        |> Pipeline.hardcoded initPartitions
        |> Pipeline.hardcoded []
        |> Pipeline.hardcoded []


saveFileDecoderV2 : Decode.Decoder SaveFile
saveFileDecoderV2 =
    Pipeline.decode SaveFile
        |> Pipeline.required "blocks" decodeBlocks
        |> Pipeline.required "coordinatesTransform" (Decode.list Decode.float)
        |> Pipeline.required "partitions" decodePartitions
        |> Pipeline.optional "tags" decodeTags []
        |> Pipeline.optional "customProperties" decodeCustomProperties []


decodeSaveFile : Int -> Decode.Decoder SaveFile
decodeSaveFile version =
    case version of
        1 ->
            saveFileDecoderV1

        2 ->
            saveFileDecoderV2

        _ ->
            Decode.fail <| "Unknown version " ++ toString version


decodeVersion : Decode.Decoder Int
decodeVersion =
    Decode.field "version" Decode.int


decodeCustomProperties : Decode.Decoder (List CustomProperty)
decodeCustomProperties =
    Decode.list decodeCustomProperty


decodeCustomProperty : Decode.Decoder CustomProperty
decodeCustomProperty =
    Pipeline.decode CustomProperty
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "values" decodeCustomPropertyValues


decodeCustomPropertyValues : Decode.Decoder (Dict String String)
decodeCustomPropertyValues =
    Decode.dict Decode.string


type alias SelectPartitionData =
    { partitionType : PartitionType
    , partitionIndex : Int
    , partitionPosition : Float
    }


selectPartitionDecoder : Decode.Decoder SelectPartitionData
selectPartitionDecoder =
    Pipeline.decode SelectPartitionData
        |> Pipeline.required "partitionType" (Decode.string |> Decode.andThen partitionTypeFromString)
        |> Pipeline.required "partitionIndex" Decode.int
        |> Pipeline.required "partitionPosition" Decode.float


partitionTypeFromString : String -> Decode.Decoder PartitionType
partitionTypeFromString str =
    case str of
        "deck" ->
            Decode.succeed Deck

        "bulkhead" ->
            Decode.succeed Bulkhead

        _ ->
            Decode.fail <|
                "Trying to decode partitionType, but "
                    ++ str
                    ++ " is not supported."


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
        |> Pipeline.optional "referenceForMass" decodeReferenceForMass None
        |> Pipeline.optional "mass" floatInputDecoder { value = 0, string = "0" }
        |> Pipeline.optional "density" floatInputDecoder { value = 0, string = "0" }
        |> Pipeline.optional "visible" Decode.bool True
        |> Pipeline.optional "centerOfGravity" decodePosition initPosition


decodeReferenceForMass : Decode.Decoder ReferenceForMass
decodeReferenceForMass =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "None" ->
                        Decode.succeed None

                    "Mass" ->
                        Decode.succeed Mass

                    "Density" ->
                        Decode.succeed Density

                    somethingElse ->
                        Decode.fail <| "Unknown referenceForMass : " ++ somethingElse
            )


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


floatInputDecoder : Decode.Decoder FloatInput
floatInputDecoder =
    Decode.map numberToNumberInput Decode.float


decodePosition : Decode.Decoder Position
decodePosition =
    Pipeline.decode Position
        |> Pipeline.required "x" floatInputDecoder
        |> Pipeline.required "y" floatInputDecoder
        |> Pipeline.required "z" floatInputDecoder


decodeSize : Decode.Decoder Size
decodeSize =
    Pipeline.decode Size
        |> Pipeline.required "x" floatInputDecoder
        |> Pipeline.required "y" floatInputDecoder
        |> Pipeline.required "z" floatInputDecoder


decodeFloatInput : Decode.Decoder FloatInput
decodeFloatInput =
    Pipeline.decode FloatInput
        |> Pipeline.required "value" Decode.float
        |> Pipeline.required "string" Decode.string


numberToNumberInput : a -> { value : a, string : String }
numberToNumberInput number =
    { value = number, string = toString number }


decodeRgbRecord : Decode.Decoder Color
decodeRgbRecord =
    Pipeline.decode Color.rgb
        |> Pipeline.required "red" Decode.int
        |> Pipeline.required "green" Decode.int
        |> Pipeline.required "blue" Decode.int


decodePartitions : Decode.Decoder PartitionsData
decodePartitions =
    Pipeline.decode PartitionsData
        |> Pipeline.required "decks" decodeDecks
        |> Pipeline.required "bulkheads" decodeBulkheads
        |> Pipeline.hardcoded True


decodeDecks : Decode.Decoder Decks
decodeDecks =
    Pipeline.decode Decks
        |> Pipeline.required "number" (Decode.map numberToNumberInput Decode.int)
        |> Pipeline.required "spacing" floatInputDecoder
        |> Pipeline.required "zero" decodePartitionZero
        |> Pipeline.optional "spacingExceptions" decodeSpacingExceptions Dict.empty


decodeSpacingExceptions : Decode.Decoder (Dict Int FloatInput)
decodeSpacingExceptions =
    let
        makeException : String -> Float -> Dict Int FloatInput -> Dict Int FloatInput
        makeException key value dict =
            case String.toInt key of
                Ok intKey ->
                    Dict.insert intKey (numberToNumberInput value) dict

                Err message ->
                    -- TODO: handle failure or only ignore ?
                    dict

        parse : Dict String Float -> Dict Int FloatInput
        parse dict =
            Dict.foldl makeException Dict.empty dict
    in
        Decode.map parse (Decode.dict Decode.float)


decodeBulkheads : Decode.Decoder Bulkheads
decodeBulkheads =
    Pipeline.decode Bulkheads
        |> Pipeline.required "number" (Decode.map numberToNumberInput Decode.int)
        |> Pipeline.required "spacing" floatInputDecoder
        |> Pipeline.required "zero" decodePartitionZero
        |> Pipeline.optional "spacingExceptions" decodeSpacingExceptions Dict.empty


decodePartitionZero : Decode.Decoder PartitionZero
decodePartitionZero =
    Pipeline.decode PartitionZero
        |> Pipeline.required "index" Decode.int
        |> Pipeline.required "position" floatInputDecoder


type alias Toasts =
    DictList String Toast


emptyToasts : Toasts
emptyToasts =
    DictList.empty


addToast : Toast -> Toasts -> Toasts
addToast newToast toasts =
    DictList.insert newToast.key newToast toasts


removeToast : String -> Toasts -> Toasts
removeToast keyToRemove toasts =
    DictList.remove keyToRemove toasts


type alias Toast =
    { key : String
    , message : String
    , type_ : ToastType
    }


type ToastType
    = Error
    | Info
    | Processing
    | Success


toastTypeDecoder : Decode.Decoder ToastType
toastTypeDecoder =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "info" ->
                        Decode.succeed Info

                    "error" ->
                        Decode.succeed Error

                    "success" ->
                        Decode.succeed Success

                    "processing" ->
                        Decode.succeed Processing

                    somethingElse ->
                        Decode.fail <| "Unknown toast type : " ++ somethingElse
            )


toastDecoder : Decode.Decoder Toast
toastDecoder =
    Pipeline.decode Toast
        |> Pipeline.required "key" Decode.string
        |> Pipeline.required "message" Decode.string
        |> Pipeline.required "type" toastTypeDecoder


keydownToMsg : KeyCode -> Msg
keydownToMsg keyCode =
    case keyCode of
        17 ->
            -- Control
            NoJs <| SetMultipleSelect True

        _ ->
            NoJs NoOp


keyupToMsg : KeyCode -> Msg
keyupToMsg keyCode =
    case keyCode of
        17 ->
            -- Control
            NoJs <| SetMultipleSelect False

        _ ->
            NoJs NoOp


jsMsgToMsg : JsData -> Msg
jsMsgToMsg js =
    case js.tag of
        "add-to-selection" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| AddToSelection uuid

                Err message ->
                    FromJs <| JSError message

        "dismiss-toast" ->
            case Decode.decodeValue Decode.string js.data of
                Ok key ->
                    NoJs <| DismissToast key

                Err message ->
                    FromJs <| JSError message

        "display-toast" ->
            case Decode.decodeValue toastDecoder js.data of
                Ok toast ->
                    NoJs <| DisplayToast toast

                Err message ->
                    FromJs <| JSError message

        "save-data" ->
            case Decode.decodeValue (decodeVersion |> Decode.andThen decodeSaveFile) js.data of
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

        "remove-from-selection" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| RemoveFromSelection uuid

                Err message ->
                    FromJs <| JSError message

        "select" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| Select uuid

                Err message ->
                    FromJs <| JSError message

        "select-partition" ->
            case Decode.decodeValue selectPartitionDecoder js.data of
                Ok selectionData ->
                    FromJs <| SelectPartition selectionData.partitionType selectionData.partitionIndex selectionData.partitionPosition

                Err message ->
                    FromJs <| JSError message

        "sync-position" ->
            case Decode.decodeValue syncPositionDecoder js.data of
                Ok syncPosition ->
                    FromJs <| SynchronizePosition syncPosition.uuid syncPosition.position

                Err message ->
                    FromJs <| JSError message

        "sync-positions" ->
            case Decode.decodeValue (Decode.list syncPositionDecoder) js.data of
                Ok syncPositions ->
                    FromJs <|
                        SynchronizePositions <|
                            Dict.fromList <|
                                List.map (\syncPos -> ( syncPos.uuid, syncPos )) syncPositions

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
    = AddToSelection String
    | RemoveFromSelection String
    | Select String
    | SelectPartition PartitionType Int Float
    | Unselect
    | JSError String
    | NewBlock Block
    | RestoreSave SaveFile
    | SynchronizePosition String Position
    | SynchronizePositions (Dict String SyncPosition)
    | SynchronizeSize String Size


restoreSaveInModel : Model -> SaveFile -> Model
restoreSaveInModel model saveFile =
    let
        maybeCoordinatesTransform : Maybe CoordinatesTransform
        maybeCoordinatesTransform =
            CoordinatesTransform.fromList saveFile.coordinatesTransform

        savedBlocks =
            listOfBlocksToBlocks saveFile.blocks

        partitions =
            saveFile.partitions

        tags =
            saveFile.tags

        customProperties =
            saveFile.customProperties

        cleanModel : Model
        cleanModel =
            initModel model.build
    in
        case maybeCoordinatesTransform of
            Just savedCoordinatesTransform ->
                { cleanModel
                  -- resets focused block and selections
                    | currentDate = model.currentDate
                    , blocks = savedBlocks
                    , coordinatesTransform = savedCoordinatesTransform
                    , partitions = partitions
                    , tags = tags
                    , customProperties = customProperties
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
        [ ( "viewMode", encodeViewMode model.viewMode )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "blocks", encodeBlocks model.blocks )
        , ( "showingPartitions", Encode.bool model.partitions.showing )
        , ( "decks", encodeComputedPartitions <| computeDecks model.partitions.decks )
        , ( "bulkheads", encodeComputedPartitions <| computeBulkheads model.partitions.bulkheads )
        ]


encodeToggleBlocksVisibilityCmd : List Block -> Bool -> Encode.Value
encodeToggleBlocksVisibilityCmd blocks visible =
    Encode.object
        [ ( "visible", Encode.bool visible )
        , ( "uuids", Encode.list <| List.map (Encode.string << .uuid) blocks )
        ]



-- MODEL


type alias Model =
    { build : String
    , currentDate : Date.Date
    , viewMode : ViewMode
    , viewports : Viewports
    , coordinatesTransform : CoordinatesTransform
    , selectedBlocks : List String
    , multipleSelect : Bool
    , selectedHullReference : Maybe String
    , blocks : Blocks
    , toasts : Toasts
    , partitions : PartitionsData
    , uiState : UiState
    , tags : Tags
    , customProperties : List CustomProperty
    }


type alias Frames =
    Dict Int Frame


initFrames : Frames
initFrames =
    Dict.fromList [ ( 0, initFrame ), ( 1, initFrame ), ( 2, initFrame ) ]


type alias Frame =
    { x : FloatInput
    , points : Dict Int FramePoint
    }


initFrame : Frame
initFrame =
    { x = numberToNumberInput 0.0
    , points = Dict.fromList [ ( 0, initFramePoint ), ( 1, initFramePoint ), ( 2, initFramePoint ), ( 3, initFramePoint ), ( 4, initFramePoint ) ]
    }


type alias FramePoint =
    { y : FloatInput
    , z : FloatInput
    }


initFramePoint : FramePoint
initFramePoint =
    { y = numberToNumberInput 0.0
    , z = numberToNumberInput 0.0
    }


type alias CustomProperty =
    { label : String
    , values : Dict String String
    }


type alias Tags =
    List Tag


type alias Tag =
    { label : String
    , color : SIRColorPicker.SirColor
    }


decodeTags : Decode.Decoder Tags
decodeTags =
    Decode.list decodeTag


decodeTag : Decode.Decoder Tag
decodeTag =
    let
        getColorFromName : String -> SIRColorPicker.SirColor
        getColorFromName name =
            Maybe.withDefault SIRColorPicker.Black <| SIRColorPicker.fromName name
    in
        Pipeline.decode Tag
            |> Pipeline.required "label" Decode.string
            |> Pipeline.required "color" (Decode.map getColorFromName Decode.string)


type alias UiState =
    { accordions : Dict String Bool
    , blockContextualMenu : Maybe String
    }


type alias Block =
    { uuid : String
    , label : String
    , color : Color
    , position : Position
    , size : Size
    , referenceForMass : ReferenceForMass
    , mass : FloatInput
    , density : FloatInput
    , visible : Bool
    , centerOfGravity : CenterOfGravity
    }


initBlock : String -> String -> Color -> Position -> Size -> Block
initBlock uuid label color position size =
    { uuid = uuid
    , label = label
    , color = color
    , position = position
    , size = size
    , referenceForMass = None
    , mass = numberToNumberInput 0.0
    , density = numberToNumberInput 0.0
    , visible = True
    , centerOfGravity = initPosition
    }


type alias CenterOfGravity =
    Position


cogToPoint : CenterOfGravity -> Point
cogToPoint p =
    { x = p.x.value
    , y = p.y.value
    , z = p.z.value
    }


getCenterOfVolume : Block -> Point
getCenterOfVolume block =
    { x = roundToNearestHundredth <| block.position.x.value + 0.5 * block.size.length.value
    , y = roundToNearestHundredth <| block.position.y.value + 0.5 * block.size.width.value
    , z = roundToNearestHundredth <| block.position.z.value - 0.5 * block.size.height.value
    }


getCenterOfGravity : Block -> Point
getCenterOfGravity block =
    cogToPoint block.centerOfGravity


getAbsoluteCenterOfGravity : Block -> Point
getAbsoluteCenterOfGravity block =
    let
        p1 =
            getCenterOfVolume block
    in
        { x = p1.x + block.centerOfGravity.x.value
        , y = p1.y + block.centerOfGravity.y.value
        , z = p1.z + block.centerOfGravity.z.value
        }


getCentroidOfBlocks : Blocks -> Point
getCentroidOfBlocks blocks =
    let
        sumOfMasses : Float
        sumOfMasses =
            getSumOfMasses blocks

        weightedCenterOfGravity : Block -> Point
        weightedCenterOfGravity block =
            let
                cog : Point
                cog =
                    getAbsoluteCenterOfGravity block
            in
                { x = block.mass.value * cog.x
                , y = block.mass.value * cog.y
                , z = block.mass.value * cog.z
                }

        addWeightedCentersOfGravity : Point -> Point -> Point
        addWeightedCentersOfGravity centerA centerB =
            { x = centerA.x + centerB.x
            , y = centerA.y + centerB.y
            , z = centerA.z + centerB.z
            }

        divideBySumOfMasses : Point -> Point
        divideBySumOfMasses point =
            if sumOfMasses /= 0 then
                { x = point.x / sumOfMasses
                , y = point.y / sumOfMasses
                , z = point.z / sumOfMasses
                }
            else
                { x = 0, y = 0, z = 0 }
    in
        toList blocks
            |> List.map weightedCenterOfGravity
            |> List.foldl addWeightedCentersOfGravity { x = 0, y = 0, z = 0 }
            |> divideBySumOfMasses


type ReferenceForMass
    = None
    | Mass
    | Density


type alias Position =
    { x : FloatInput, y : FloatInput, z : FloatInput }


initPosition : Position
initPosition =
    { x = numberToNumberInput 0, y = numberToNumberInput 0, z = numberToNumberInput 0 }


type alias Size =
    { length : FloatInput, width : FloatInput, height : FloatInput }


type alias Blocks =
    DictList String Block


type alias KpiSummary =
    { target : KpiTarget
    , volume : Float
    , mass : Float
    }


computeKpisForBlock : Block -> KpiSummary
computeKpisForBlock block =
    { target = SingleBlock block.uuid
    , volume = computeVolume block
    , mass = block.mass.value
    }


computeKpisForColor : Blocks -> SIRColorPicker.SirColor -> KpiSummary
computeKpisForColor blocks color =
    { target = ColorGroup color
    , volume = getSumOfVolumesForColor blocks <| SIRColorPicker.getColor color
    , mass = getSumOfMassesForColor blocks <| SIRColorPicker.getColor color
    }


computeKpisForAll : Blocks -> KpiSummary
computeKpisForAll blocks =
    { target = WholeShip
    , volume = getSumOfVolumes blocks
    , mass = getSumOfMasses blocks
    }


type KpiTarget
    = WholeShip
    | SingleBlock String
    | ColorGroup SIRColorPicker.SirColor


type alias PartitionsData =
    { decks : Decks
    , bulkheads : Bulkheads
    , showing : Bool
    }


type PartitionType
    = Bulkhead
    | Deck


type alias Decks =
    { number : IntInput
    , spacing : FloatInput
    , zero : PartitionZero
    , spacingExceptions : Dict Int FloatInput
    }


type alias PartitionZero =
    { -- the index of the partition n° 0
      index : Int
    , position : FloatInput
    }


type alias Bulkheads =
    { number : IntInput
    , spacing : FloatInput
    , zero : PartitionZero
    , spacingExceptions : Dict Int FloatInput
    }


asSpacingExceptionsInPartition : { a | spacingExceptions : Dict Int FloatInput } -> Dict Int FloatInput -> { a | spacingExceptions : Dict Int FloatInput }
asSpacingExceptionsInPartition partition newSpacingExceptions =
    { partition | spacingExceptions = newSpacingExceptions }


asNumberInPartition : { a | number : IntInput } -> IntInput -> { a | number : IntInput }
asNumberInPartition partition newNumber =
    { partition | number = newNumber }


asSpacingInPartition : { a | spacing : FloatInput } -> FloatInput -> { a | spacing : FloatInput }
asSpacingInPartition partition newSpacing =
    { partition | spacing = newSpacing }


asIndexInPartitionZero : { a | index : Int } -> Int -> { a | index : Int }
asIndexInPartitionZero zero newIndex =
    { zero | index = newIndex }


asPositionInPartitionZero : { a | position : FloatInput } -> FloatInput -> { a | position : FloatInput }
asPositionInPartitionZero zero newPosition =
    { zero | position = newPosition }


asZeroInPartition : { a | zero : PartitionZero } -> PartitionZero -> { a | zero : PartitionZero }
asZeroInPartition partition newZero =
    { partition | zero = newZero }


asDecksInPartitions : PartitionsData -> Decks -> PartitionsData
asDecksInPartitions partitions newDecks =
    { partitions | decks = newDecks }


asBulkheadsInPartitions : PartitionsData -> Bulkheads -> PartitionsData
asBulkheadsInPartitions partitions newBulkheads =
    { partitions | bulkheads = newBulkheads }


asPartitionsInModel : Model -> PartitionsData -> Model
asPartitionsInModel model newPartitions =
    { model | partitions = newPartitions }


stringifyEncodeValue : Encode.Value -> String
stringifyEncodeValue value =
    Encode.encode 4 value


encodeListBlocks : List Block -> Encode.Value
encodeListBlocks blocks =
    Encode.list <| List.map encodeBlock blocks


encodeBlocks : Blocks -> Encode.Value
encodeBlocks blocks =
    encodeListBlocks (toList blocks)


encodeModelForSave : Model -> Encode.Value
encodeModelForSave model =
    Encode.object
        [ ( "version", Encode.int 2 )
        , ( "blocks", encodeBlocks model.blocks )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "partitions", encodePartitions model.partitions )
        , ( "tags", encodeTags model.tags )
        , ( "customProperties", encodeCustomProperties model.customProperties )
        ]


encodeCustomProperties : List CustomProperty -> Encode.Value
encodeCustomProperties customProperties =
    Encode.list <| List.map encodeCustomProperty customProperties


encodeCustomProperty : CustomProperty -> Encode.Value
encodeCustomProperty customProperty =
    Encode.object
        [ ( "label", Encode.string customProperty.label )
        , ( "values"
          , Dict.toList customProperty.values
                |> List.map (\( uuid, value ) -> ( uuid, Encode.string value ))
                |> Encode.object
          )
        ]


encodeBlock : Block -> Encode.Value
encodeBlock block =
    Encode.object <|
        [ ( "uuid", Encode.string block.uuid )
        , ( "label", Encode.string block.label )
        , ( "color", encodeColor block.color )
        , ( "position", encodePosition block.position )
        , ( "size", encodeSize block.size )
        , ( "referenceForMass", Encode.string <| toString block.referenceForMass )
        , ( "mass", Encode.float block.mass.value )
        , ( "density", Encode.float block.density.value )
        , ( "visible", Encode.bool block.visible )
        , ( "centerOfGravity", encodePosition block.centerOfGravity )
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


encodeDecks : Decks -> Encode.Value
encodeDecks decks =
    Encode.object
        [ ( "number", Encode.int decks.number.value )
        , ( "spacing", Encode.float decks.spacing.value )
        , ( "zero"
          , Encode.object
                [ ( "index", Encode.int decks.zero.index )
                , ( "position", Encode.float decks.zero.position.value )
                ]
          )
        , ( "spacingExceptions"
          , Dict.toList decks.spacingExceptions
                |> List.map (\( index, input ) -> ( toString index, Encode.float input.value ))
                |> Encode.object
          )
        ]


encodeBulkheads : Bulkheads -> Encode.Value
encodeBulkheads bulkheads =
    Encode.object
        [ ( "number", Encode.int bulkheads.number.value )
        , ( "spacing", Encode.float bulkheads.spacing.value )
        , ( "zero"
          , Encode.object
                [ ( "index", Encode.int bulkheads.zero.index )
                , ( "position", Encode.float bulkheads.zero.position.value )
                ]
          )
        , ( "spacingExceptions"
          , Dict.toList bulkheads.spacingExceptions
                |> List.map (\( index, input ) -> ( toString index, Encode.float input.value ))
                |> Encode.object
          )
        ]


encodePartitions : PartitionsData -> Encode.Value
encodePartitions partitions =
    Encode.object
        [ ( "decks", encodeDecks partitions.decks )
        , ( "bulkheads", encodeBulkheads partitions.bulkheads )
        ]


encodeTag : Tag -> Encode.Value
encodeTag tag =
    Encode.object
        [ ( "color", Encode.string <| SIRColorPicker.getName tag.color )
        , ( "label", Encode.string tag.label )
        ]


encodeTags : Tags -> Encode.Value
encodeTags tags =
    Encode.list <| List.map encodeTag tags


type alias ComputedPartition =
    { index : Int
    , position : Float
    , number : Int
    }


encodeComputedPartition : ComputedPartition -> Encode.Value
encodeComputedPartition computedDeck =
    Encode.object
        [ ( "index", Encode.int computedDeck.index )
        , ( "position", Encode.float computedDeck.position )
        , ( "number", Encode.int computedDeck.number )
        ]


encodeComputedPartitions : List ComputedPartition -> Encode.Value
encodeComputedPartitions computedPartitions =
    Encode.list <| List.map encodeComputedPartition computedPartitions


computeDecks : Decks -> List ComputedPartition
computeDecks decks =
    let
        initialDeckList : List ComputedPartition
        initialDeckList =
            List.repeat decks.number.value ({ index = 0, position = 0.0, number = 0 })

        computeDeck : Int -> ComputedPartition -> ComputedPartition
        computeDeck index element =
            let
                number : Int
                number =
                    index - decks.zero.index
            in
                { index = index, position = decks.zero.position.value - 1 * (getPartitionOffset decks index), number = number }
    in
        List.indexedMap computeDeck initialDeckList


getPartitionOffset : { a | number : IntInput, spacing : FloatInput, zero : PartitionZero, spacingExceptions : Dict Int FloatInput } -> Int -> Float
getPartitionOffset partitionSummary index =
    let
        number : Int
        number =
            index - partitionSummary.zero.index

        exceptionsToAccountFor : Int -> Int -> Dict Int FloatInput
        exceptionsToAccountFor minKey maxKey =
            Dict.filter (\key value -> key < (maxKey + partitionSummary.zero.index) && key >= (minKey + partitionSummary.zero.index)) partitionSummary.spacingExceptions

        total : Dict Int FloatInput -> Float
        total exceptions =
            Dict.foldl (\key value currentTotal -> currentTotal + value.value) 0.0 exceptions

        exceptions : Dict Int FloatInput
        exceptions =
            if number > 0 then
                exceptionsToAccountFor 0 number
            else
                exceptionsToAccountFor number 0
    in
        if number > 0 then
            exceptions
                |> Dict.size
                |> (-) number
                |> toFloat
                |> (*) partitionSummary.spacing.value
                |> (+) (total exceptions)
        else if number < 0 then
            exceptions
                |> Dict.size
                |> (-) (-1 * number)
                |> toFloat
                |> (*) partitionSummary.spacing.value
                |> (+) (total exceptions)
                |> (*) -1
        else
            0


computeBulkheads : Bulkheads -> List ComputedPartition
computeBulkheads bulkheads =
    let
        initialBulkheadList : List ComputedPartition
        initialBulkheadList =
            List.repeat bulkheads.number.value { index = 0, position = 0.0, number = 0 }

        computeBulkhead : Int -> ComputedPartition -> ComputedPartition
        computeBulkhead index element =
            let
                number : Int
                number =
                    index - bulkheads.zero.index
            in
                { index = index, position = bulkheads.zero.position.value + (getPartitionOffset bulkheads index), number = number }
    in
        List.indexedMap computeBulkhead initialBulkheadList


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


filterBlocksByColor : Color -> Blocks -> Blocks
filterBlocksByColor color blocks =
    DictList.filter (\uuid block -> block.color == color) blocks


toMassList : Blocks -> List Float
toMassList blocks =
    List.map (.value << .mass) <| toList blocks


toVolumeList : Blocks -> List Float
toVolumeList blocks =
    List.map computeVolume <| toList blocks


getSumOfMasses : Blocks -> Float
getSumOfMasses blocks =
    toMassList blocks
        |> List.sum


getSumOfMassesForColor : Blocks -> Color -> Float
getSumOfMassesForColor blocks color =
    filterBlocksByColor color blocks
        |> getSumOfMasses


getSumOfVolumes : Blocks -> Float
getSumOfVolumes blocks =
    toVolumeList blocks
        |> List.sum


getSumOfVolumesForColor : Blocks -> Color -> Float
getSumOfVolumesForColor blocks color =
    filterBlocksByColor color blocks
        |> getSumOfVolumes


removeBlockFrom : Blocks -> Block -> Blocks
removeBlockFrom blocks block =
    DictList.remove block.uuid blocks


removeListBlocksFrom : Blocks -> List Block -> Blocks
removeListBlocksFrom blocks list =
    case list of
        [] ->
            blocks

        x :: xs ->
            removeListBlocksFrom (removeBlockFrom blocks x) xs


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


init : Flag -> ( Model, Cmd Msg )
init flag =
    let
        model =
            initModel flag
    in
        ( model
        , Cmd.batch
            [ toJs <| initCmd model
            , Task.perform (NoJs << SetCurrentDate) Date.now
            ]
        )


initModel : Flag -> Model
initModel flag =
    let
        viewports : Viewports
        viewports =
            Viewports.init

        viewMode : ViewMode
        viewMode =
            HullStudio
    in
        { build = flag
        , currentDate = Date.fromTime 0
        , viewMode = viewMode
        , viewports = viewports
        , coordinatesTransform = CoordinatesTransform.default
        , selectedBlocks = []
        , multipleSelect = False
        , selectedHullReference = Nothing
        , blocks = DictList.empty
        , toasts = emptyToasts
        , partitions = initPartitions
        , uiState =
            { accordions = Dict.empty
            , blockContextualMenu = Nothing
            }
        , tags = []
        , customProperties = []
        }


initPartitions : PartitionsData
initPartitions =
    { decks =
        { number = numberToNumberInput 0
        , spacing = numberToNumberInput 3.0
        , zero =
            { index = 0
            , position = numberToNumberInput 0.0
            }
        , spacingExceptions = Dict.empty
        }
    , bulkheads =
        { number = numberToNumberInput 0
        , spacing = numberToNumberInput 5.0
        , zero =
            { index = 0
            , position = numberToNumberInput 0.0
            }
        , spacingExceptions = Dict.empty
        }
    , showing = True
    }


initCmd : Model -> JsData
initCmd model =
    { tag = "init-three", data = encodeInitThreeCommand model }


type ViewMode
    = SpaceReservation SpaceReservationView
    | HullStudio
    | Partitioning PartitioningView
    | KpiStudio
    | Modeller


type SpaceReservationView
    = WholeList
    | DetailedBlock String


type PartitioningView
    = PropertiesEdition
    | OriginDefinition PartitionType


encodeInitThreeCommand : Model -> Encode.Value
encodeInitThreeCommand model =
    Encode.object
        [ ( "viewports", encodeViewports model.viewports )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "mode", encodeViewMode model.viewMode )
        , ( "showingPartitions", Encode.bool model.partitions.showing )
        , ( "decks", encodeComputedPartitions <| computeDecks model.partitions.decks )
        , ( "bulkheads", encodeComputedPartitions <| computeBulkheads model.partitions.bulkheads )
        ]


encodeViewMode : ViewMode -> Encode.Value
encodeViewMode viewMode =
    Encode.string <|
        case viewMode of
            SpaceReservation _ ->
                "block"

            HullStudio ->
                "hull"

            Partitioning _ ->
                "partition"

            KpiStudio ->
                "kpi"

            Modeller ->
                "modeller"


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
    { model | blocks = updateBlockInBlocks block model.blocks }


asValueInNumberInput : { value : a, string : String } -> a -> { value : a, string : String }
asValueInNumberInput numberInput value =
    { numberInput | value = value }


asStringInNumberInput : { value : a, string : String } -> String -> { value : a, string : String }
asStringInNumberInput numberInput string =
    { numberInput | string = string }


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


syncNumberInput : { value : a, string : String } -> { value : a, string : String }
syncNumberInput input =
    { input | string = toString input.value }


computeVolume : Block -> Float
computeVolume block =
    let
        size : Size
        size =
            block.size
    in
        size.height.value * size.width.value * size.length.value


updateBlockMassAndDensity : Block -> Block
updateBlockMassAndDensity block =
    case block.referenceForMass of
        None ->
            block

        Mass ->
            { block | density = numberToNumberInput <| block.mass.value / (computeVolume block) }

        Density ->
            { block | mass = numberToNumberInput <| block.density.value * (computeVolume block) }


type alias BoundingBox =
    { min : Point
    , max : Point
    }


type alias Point =
    { x : Float
    , y : Float
    , z : Float
    }


getBlockBoundingBox : Block -> BoundingBox
getBlockBoundingBox block =
    { min =
        { x = block.position.x.value
        , y = block.position.y.value
        , z = block.position.z.value
        }
    , max =
        { x = (block.position.x.value + block.size.length.value)
        , y = (block.position.y.value + block.size.width.value)
        , z = block.position.z.value - block.size.height.value
        }
    }


getBlocksBoundingBox : Blocks -> BoundingBox
getBlocksBoundingBox blocks =
    let
        boundingBoxList : List BoundingBox
        boundingBoxList =
            List.map getBlockBoundingBox (toList blocks)
    in
        List.foldl
            (\a b ->
                { min =
                    { x =
                        (if a.min.x < b.min.x then
                            a.min.x
                         else
                            b.min.x
                        )
                    , y =
                        (if a.min.y < b.min.y then
                            a.min.y
                         else
                            b.min.y
                        )
                    , z =
                        (if a.min.z > b.min.z then
                            a.min.z
                         else
                            b.min.z
                        )
                    }
                , max =
                    { x =
                        (if a.max.x > b.max.x then
                            a.max.x
                         else
                            b.max.x
                        )
                    , y =
                        (if a.max.y > b.max.y then
                            a.max.y
                         else
                            b.max.y
                        )
                    , z =
                        (if a.max.z < b.max.z then
                            a.max.z
                         else
                            b.max.z
                        )
                    }
                }
            )
            (Maybe.withDefault { min = { x = 0.0, y = 0.0, z = 0.0 }, max = { x = 0.0, y = 0.0, z = 0.0 } } <| List.head boundingBoxList)
            boundingBoxList


getBoundingBoxSize : BoundingBox -> { length : Float, height : Float, width : Float }
getBoundingBoxSize bBox =
    { length = abs <| bBox.max.x - bBox.min.x
    , width = abs <| bBox.max.y - bBox.min.y
    , height = abs <| bBox.max.z - bBox.min.z
    }


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
    | KeyDownOnPartitionPositionInput PartitionType KeyEvent
    | KeyDownOnPartitionSpacingInput PartitionType KeyEvent
    | OpenSaveFile
    | RemoveBlock Block
    | RemoveBlocks (List Block)
    | SelectBlock Block
    | SelectHullReference HullReference
    | SetSpacingException PartitionType Int String
    | SwitchViewMode ViewMode
    | ToggleBlocksVisibility (List Block) Bool
    | TogglePartitions
    | UnselectHullReference
    | UpdatePartitionNumber PartitionType String
    | UpdatePartitionSpacing PartitionType String
    | UpdatePartitionZeroPosition PartitionType String
    | UpdatePosition Axis Block String
    | UpdateDimension Dimension Block String


type NoJsMsg
    = AddCustomProperty String
    | CleanTags
    | DeleteCustomProperty CustomProperty
    | DismissToast String
    | DisplayToast Toast
    | FreeCenterOfGravity Block
    | LockCenterOfGravityToCenterOfVolume Block
    | MoveBlockDown Block
    | MoveBlockUp Block
    | NoOp
    | RenameBlock Block String
    | SetBlockContextualMenu String
    | UnsetBlockContextualMenu
    | SetCurrentDate Date.Date
    | SetMultipleSelect Bool
    | SetTagForColor Color String
    | SetValueForCustomProperty CustomProperty Block String
    | SyncBlockInputs Block
    | SyncPartitions
    | ToggleAccordion Bool String
    | UpdateCenterOfGravity Axis Block String
    | UpdateCustomPropertyLabel CustomProperty String
    | UpdateDensity Block String
    | UpdateMass Block String


updateNoJs : NoJsMsg -> Model -> ( Model, Cmd Msg )
updateNoJs msg model =
    case msg of
        AddCustomProperty label ->
            let
                updatedCustomProperties : List CustomProperty
                updatedCustomProperties =
                    model.customProperties ++ [ { label = label, values = Dict.empty } ]

                newCustomPropertyId : String
                newCustomPropertyId =
                    "custom-property-" ++ (toString <| List.length updatedCustomProperties)
            in
                { model | customProperties = updatedCustomProperties } ! [ Task.attempt (\_ -> NoJs NoOp) (Dom.focus newCustomPropertyId) ]

        CleanTags ->
            { model | tags = List.filter ((/=) 0 << String.length << .label) model.tags } ! []

        DeleteCustomProperty property ->
            { model | customProperties = List.filter ((/=) property) model.customProperties } ! []

        DismissToast keyToDismiss ->
            { model | toasts = removeToast keyToDismiss model.toasts } ! []

        DisplayToast toast ->
            { model | toasts = addToast toast model.toasts } ! []

        FreeCenterOfGravity block ->
            let
                centerOfVolume : Point
                centerOfVolume =
                    getCenterOfVolume block

                updatedBlock : Block
                updatedBlock =
                    { block
                        | centerOfGravity =
                            { x = numberToNumberInput centerOfVolume.x
                            , y = numberToNumberInput centerOfVolume.y
                            , z = numberToNumberInput centerOfVolume.z
                            }
                    }
            in
                { model | blocks = updateBlockInBlocks updatedBlock model.blocks } ! []

        LockCenterOfGravityToCenterOfVolume block ->
            let
                updatedBlock : Block
                updatedBlock =
                    { block
                        | centerOfGravity = initPosition
                    }
            in
                { model | blocks = updateBlockInBlocks updatedBlock model.blocks } ! []

        MoveBlockDown block ->
            let
                maybeNext : Maybe ( String, Block )
                maybeNext =
                    DictList.next block.uuid model.blocks

                updatedBlocks : Blocks
                updatedBlocks =
                    Maybe.withDefault model.blocks <| Maybe.map (\next -> DictList.insertAfter (Tuple.first next) block.uuid block model.blocks) maybeNext
            in
                { model | blocks = updatedBlocks } ! []

        MoveBlockUp block ->
            let
                maybePrevious : Maybe ( String, Block )
                maybePrevious =
                    DictList.previous block.uuid model.blocks

                updatedBlocks : Blocks
                updatedBlocks =
                    Maybe.withDefault model.blocks <| Maybe.map (\previous -> DictList.insertBefore (Tuple.first previous) block.uuid block model.blocks) maybePrevious
            in
                { model | blocks = updatedBlocks } ! []

        NoOp ->
            model ! []

        SetBlockContextualMenu uuid ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | blockContextualMenu = Just uuid }
            in
                { model | uiState = newUiState } ! []

        SetCurrentDate date ->
            { model | currentDate = date } ! []

        SetMultipleSelect boolean ->
            { model | multipleSelect = boolean } ! []

        SetTagForColor color label ->
            let
                sirColor : Maybe SIRColorPicker.SirColor
                sirColor =
                    SIRColorPicker.fromColor color

                newTags : Tags
                newTags =
                    model.tags
                        |> List.filter ((/=) color << SIRColorPicker.getColor << .color)
                        |> if sirColor /= Nothing then
                            (::) { color = Maybe.withDefault SIRColorPicker.Black sirColor, label = label }
                           else
                            List.map identity
            in
                { model | tags = newTags } ! []

        SetValueForCustomProperty property block value ->
            let
                updatedProperty : CustomProperty
                updatedProperty =
                    { property
                        | values =
                            if String.length value > 0 then
                                Dict.insert block.uuid value property.values
                            else
                                Dict.remove block.uuid property.values
                    }

                replaceProperty : CustomProperty -> CustomProperty
                replaceProperty customProperty =
                    if property == customProperty then
                        updatedProperty
                    else
                        customProperty
            in
                { model | customProperties = List.map replaceProperty model.customProperties } ! []

        SyncBlockInputs block ->
            let
                syncedSize : Size
                syncedSize =
                    { length = syncNumberInput block.size.length
                    , width = syncNumberInput block.size.width
                    , height = syncNumberInput block.size.height
                    }

                syncedPosition : Position
                syncedPosition =
                    { x = syncNumberInput block.position.x
                    , y = syncNumberInput block.position.y
                    , z = syncNumberInput block.position.z
                    }

                syncedMass : FloatInput
                syncedMass =
                    syncNumberInput block.mass

                syncedDensity : FloatInput
                syncedDensity =
                    syncNumberInput block.density

                syncedCenterOfGravity : CenterOfGravity
                syncedCenterOfGravity =
                    { x = syncNumberInput block.centerOfGravity.x
                    , y = syncNumberInput block.centerOfGravity.y
                    , z = syncNumberInput block.centerOfGravity.z
                    }

                syncedBlock : Block
                syncedBlock =
                    { block
                        | size = syncedSize
                        , position = syncedPosition
                        , mass = syncedMass
                        , density = syncedDensity
                        , centerOfGravity = syncedCenterOfGravity
                    }
            in
                { model | blocks = updateBlockInBlocks syncedBlock model.blocks } ! []

        SyncPartitions ->
            let
                syncedDecks : Decks
                syncedDecks =
                    { number =
                        syncNumberInput model.partitions.decks.number
                    , spacing =
                        syncNumberInput model.partitions.decks.spacing
                    , zero =
                        { index = model.partitions.decks.zero.index
                        , position = syncNumberInput model.partitions.decks.zero.position
                        }
                    , spacingExceptions =
                        -- we want to remove useless exceptions => those equal to the default value
                        Dict.map (\key input -> syncNumberInput input) model.partitions.decks.spacingExceptions
                            |> Dict.filter (\key input -> input.value /= model.partitions.decks.spacing.value)
                    }

                syncedBulkheads : Bulkheads
                syncedBulkheads =
                    { number =
                        syncNumberInput model.partitions.bulkheads.number
                    , spacing =
                        syncNumberInput model.partitions.bulkheads.spacing
                    , zero =
                        { index = model.partitions.bulkheads.zero.index
                        , position = syncNumberInput model.partitions.bulkheads.zero.position
                        }
                    , spacingExceptions =
                        Dict.map (\key input -> syncNumberInput input) model.partitions.bulkheads.spacingExceptions
                            |> Dict.filter (\key input -> input.value /= model.partitions.bulkheads.spacing.value)
                    }

                updatedModel : Model
                updatedModel =
                    syncedDecks
                        |> asDecksInPartitions model.partitions
                        |> flip asBulkheadsInPartitions syncedBulkheads
                        |> asPartitionsInModel model
            in
                updatedModel ! []

        RenameBlock blockToRename newLabel ->
            updateBlockInModel (renameBlock newLabel blockToRename) model ! []

        ToggleAccordion isOpen accordionId ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | accordions = Dict.insert accordionId isOpen uiState.accordions }
            in
                { model | uiState = newUiState } ! []

        UpdateCenterOfGravity axis block input ->
            let
                position =
                    block.centerOfGravity

                axisFloatInput : FloatInput
                axisFloatInput =
                    position |> axisAccessor axis

                updatedBlock : Block
                updatedBlock =
                    { block
                        | centerOfGravity =
                            (case String.toFloat input of
                                Ok value ->
                                    value
                                        |> asValueInNumberInput axisFloatInput
                                        |> flip asStringInNumberInput input

                                Err error ->
                                    input
                                        |> asStringInNumberInput axisFloatInput
                            )
                                |> (asAxisInPosition axis) position
                            -- |> UserInput
                    }
            in
                updateBlockInModel updatedBlock model ! []

        UpdateCustomPropertyLabel property newLabel ->
            { model
                | customProperties =
                    List.map
                        (\p ->
                            if p == property then
                                { p | label = newLabel }
                            else
                                p
                        )
                        model.customProperties
            }
                ! []

        UpdateMass block input ->
            let
                newMass : Float
                newMass =
                    abs <| Result.withDefault block.mass.value <| String.toFloat input

                updatedBlock : Block
                updatedBlock =
                    { block
                        | mass = { value = newMass, string = input }
                        , referenceForMass = Mass
                    }
                        |> updateBlockMassAndDensity

                updatedModel =
                    { model | blocks = updateBlockInBlocks updatedBlock model.blocks }
            in
                updatedModel ! []

        UpdateDensity block input ->
            let
                newDensity : Float
                newDensity =
                    abs <| Result.withDefault block.density.value <| String.toFloat input

                updatedBlock : Block
                updatedBlock =
                    { block
                        | density = { value = newDensity, string = input }
                        , referenceForMass = Density
                    }
                        |> updateBlockMassAndDensity

                updatedModel =
                    { model | blocks = updateBlockInBlocks updatedBlock model.blocks }
            in
                updatedModel ! []

        UnsetBlockContextualMenu ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | blockContextualMenu = Nothing }
            in
                { model | uiState = newUiState } ! []


updateToJs : ToJsMsg -> Model -> ( Model, Cmd Msg )
updateToJs msg model =
    let
        updatedModel =
            updateModelToJs msg model
    in
        ( updatedModel, sendCmdToJs model msg )


updateFromJs : FromJsMsg -> Model -> ( Model, Cmd Msg )
updateFromJs jsmsg model =
    case jsmsg of
        AddToSelection uuid ->
            { model | selectedBlocks = model.selectedBlocks ++ [ uuid ] } ! []

        RemoveFromSelection uuid ->
            { model | selectedBlocks = List.filter ((/=) uuid) model.selectedBlocks } ! []

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
                updatedViewMode : ViewMode
                updatedViewMode =
                    case model.viewMode of
                        SpaceReservation (DetailedBlock _) ->
                            SpaceReservation <| DetailedBlock uuid

                        otherViewMode ->
                            otherViewMode
            in
                { model | selectedBlocks = [ uuid ], viewMode = updatedViewMode } ! []

        SelectPartition partitionType index position ->
            if model.viewMode == (Partitioning <| OriginDefinition partitionType) then
                let
                    ( partition, updatePartition, tag, computePartition ) =
                        case partitionType of
                            Deck ->
                                ( .partitions >> .decks, asDecksInPartitions model.partitions, "make-decks", computeDecks )

                            Bulkhead ->
                                ( .partitions >> .bulkheads, asBulkheadsInPartitions model.partitions, "make-bulkheads", computeBulkheads )

                    updatedModel : Model
                    updatedModel =
                        if index < (.value <| .number (partition model)) && index >= 0 then
                            { model
                                | partitions =
                                    updatePartition <|
                                        asZeroInPartition (partition model) <|
                                            flip asPositionInPartitionZero (numberToNumberInput position) <|
                                                asIndexInPartitionZero (.zero <| partition model) index
                                , viewMode = Partitioning PropertiesEdition
                            }
                        else
                            model

                    jsCmd : Cmd aMsg
                    jsCmd =
                        toJs
                            { tag = tag
                            , data =
                                encodeComputedPartitions <|
                                    computePartition (partition updatedModel)
                            }
                in
                    updatedModel ! [ jsCmd ]
            else
                model ! []

        Unselect ->
            { model | selectedBlocks = [] }
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

        SynchronizePositions syncDict ->
            let
                updatedBlocks : Blocks
                updatedBlocks =
                    DictList.map
                        (\uuid block ->
                            case Dict.get uuid syncDict of
                                Just syncPosition ->
                                    syncPosition.position |> asPositionInBlock block

                                Nothing ->
                                    block
                        )
                        model.blocks
            in
                { model | blocks = updatedBlocks } ! []

        SynchronizeSize uuid size ->
            (case getBlockByUUID uuid model.blocks of
                Just block ->
                    size
                        |> asSizeInBlock block
                        |> updateBlockMassAndDensity
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

        KeyDownOnPartitionPositionInput partitionType keyEvent ->
            case toIncrement keyEvent of
                Just increment ->
                    let
                        ( partition, asPartition ) =
                            case partitionType of
                                Deck ->
                                    ( model.partitions.decks, asDecksInPartitions )

                                Bulkhead ->
                                    ( model.partitions.bulkheads, asBulkheadsInPartitions )

                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (partition.zero.position)

                        updatedPartitions : PartitionsData
                        updatedPartitions =
                            newFloatInput
                                |> asPositionInPartitionZero partition.zero
                                |> asZeroInPartition partition
                                |> asPartition model.partitions
                    in
                        { model | partitions = updatedPartitions }

                Nothing ->
                    model

        KeyDownOnPartitionSpacingInput partitionType keyEvent ->
            case toIncrement keyEvent of
                Just increment ->
                    let
                        ( partition, asPartition ) =
                            case partitionType of
                                Deck ->
                                    ( model.partitions.decks, asDecksInPartitions )

                                Bulkhead ->
                                    ( model.partitions.bulkheads, asBulkheadsInPartitions )

                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (partition.spacing)

                        updatedPartitions : PartitionsData
                        updatedPartitions =
                            newFloatInput
                                |> updateSpacingOfPartition partition
                                |> asPartition model.partitions
                    in
                        { model | partitions = updatedPartitions }

                Nothing ->
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
                                |> updateBlockMassAndDensity
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

        RemoveBlocks blocks ->
            let
                _ =
                    Debug.log "remove blocks " (List.length blocks)

                nblocks =
                    removeListBlocksFrom model.blocks blocks
            in
                { model | blocks = nblocks }

        SelectBlock block ->
            if model.multipleSelect == False then
                -- set selection as only this block
                { model | selectedBlocks = [ block.uuid ] }
            else if List.member block.uuid model.selectedBlocks then
                -- remove from selection
                { model | selectedBlocks = List.filter ((/=) block.uuid) model.selectedBlocks }
            else
                -- add to selection
                { model | selectedBlocks = model.selectedBlocks ++ [ block.uuid ] }

        SelectHullReference hullReference ->
            { model | selectedHullReference = Just hullReference.path }

        UnselectHullReference ->
            { model | selectedHullReference = Nothing }

        SetSpacingException partitionType index input ->
            let
                ( partition, asPartitionInPartitions ) =
                    case partitionType of
                        Deck ->
                            ( model.partitions.decks, asDecksInPartitions )

                        Bulkhead ->
                            ( model.partitions.bulkheads, asBulkheadsInPartitions )

                previousException : FloatInput
                previousException =
                    Maybe.withDefault (.spacing partition) <| Dict.get index <| .spacingExceptions partition

                parsedInput : Result String Float
                parsedInput =
                    if input == "" then
                        -- an empty input should result in the default spacing
                        Ok <| .value <| .spacing partition
                    else
                        String.toFloat input
            in
                (case parsedInput of
                    Ok value ->
                        abs value
                            |> asValueInNumberInput previousException
                            |> flip asStringInNumberInput input

                    Err error ->
                        input
                            |> asStringInNumberInput previousException
                )
                    |> (\floatInput -> Dict.insert index floatInput <| .spacingExceptions partition)
                    |> asSpacingExceptionsInPartition partition
                    |> asPartitionInPartitions model.partitions
                    |> asPartitionsInModel model

        SwitchViewMode newViewMode ->
            { model | viewMode = newViewMode }

        ToggleBlocksVisibility blocks isVisible ->
            let
                updateVisibilityIfTargeted : String -> Block -> Block
                updateVisibilityIfTargeted uuid block =
                    if List.member block blocks then
                        { block | visible = isVisible }
                    else
                        block
            in
                { model | blocks = DictList.map updateVisibilityIfTargeted model.blocks }

        TogglePartitions ->
            let
                partitions : PartitionsData
                partitions =
                    model.partitions

                _ =
                    Debug.log "toggle!" <| not partitions.showing

                updatedPartitions =
                    { partitions | showing = not partitions.showing }
            in
                { model | partitions = updatedPartitions }

        UpdatePartitionNumber partitionType input ->
            let
                ( getPartition, asPartitionInPartitions ) =
                    case partitionType of
                        Deck ->
                            ( .decks, asDecksInPartitions )

                        Bulkhead ->
                            ( .bulkheads, asBulkheadsInPartitions )
            in
                (case String.toInt input of
                    Ok value ->
                        abs value
                            |> asValueInNumberInput (.number <| getPartition model.partitions)
                            |> flip asStringInNumberInput input

                    Err error ->
                        input
                            |> asStringInNumberInput (.number <| getPartition model.partitions)
                )
                    |> asNumberInPartition (getPartition model.partitions)
                    |> asPartitionInPartitions model.partitions
                    |> asPartitionsInModel model

        UpdatePartitionSpacing partitionType input ->
            let
                ( getPartition, asPartitionInPartitions ) =
                    case partitionType of
                        Deck ->
                            ( .decks, asDecksInPartitions )

                        Bulkhead ->
                            ( .bulkheads, asBulkheadsInPartitions )
            in
                (case String.toFloat input of
                    Ok value ->
                        abs value
                            |> asValueInNumberInput (.spacing <| getPartition model.partitions)
                            |> flip asStringInNumberInput input

                    Err error ->
                        input
                            |> asStringInNumberInput (.spacing <| getPartition model.partitions)
                )
                    |> asSpacingInPartition (getPartition model.partitions)
                    |> asPartitionInPartitions model.partitions
                    |> asPartitionsInModel model

        UpdatePartitionZeroPosition partitionType input ->
            let
                ( getPartition, asPartitionInPartitions ) =
                    case partitionType of
                        Deck ->
                            ( .decks, asDecksInPartitions )

                        Bulkhead ->
                            ( .bulkheads, asBulkheadsInPartitions )
            in
                (case String.toFloat input of
                    Ok value ->
                        value
                            |> asValueInNumberInput (.spacing <| getPartition model.partitions)
                            |> flip asStringInNumberInput input

                    Err error ->
                        input
                            |> asStringInNumberInput (.spacing <| getPartition model.partitions)
                )
                    |> asPositionInPartitionZero (.zero <| getPartition model.partitions)
                    |> asZeroInPartition (getPartition model.partitions)
                    |> asPartitionInPartitions model.partitions
                    |> asPartitionsInModel model

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
                                    |> asValueInNumberInput axisFloatInput
                                    |> flip asStringInNumberInput input
                                    |> (asAxisInPosition axis) block.position
                                    |> asPositionInBlock block
                        in
                            updateBlockInModel updatedBlock model

                    Err error ->
                        input
                            |> asStringInNumberInput axisFloatInput
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
                                    |> asValueInNumberInput dimensionFloatInput
                                    |> flip asStringInNumberInput input
                                    |> (asDimensionInSize dimension) block.size
                                    |> asSizeInBlock block
                                    |> updateBlockMassAndDensity
                        in
                            updateBlockInModel updatedBlock model

                    Err message ->
                        input
                            |> asStringInNumberInput dimensionFloatInput
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

        KeyDownOnPartitionPositionInput partitionType keyEvent ->
            Maybe.map
                (\increment ->
                    let
                        ( partition, asPartition, tag, computePartition ) =
                            case partitionType of
                                Deck ->
                                    ( .partitions >> .decks, asDecksInPartitions, "make-decks", computeDecks )

                                Bulkhead ->
                                    ( .partitions >> .bulkheads, asBulkheadsInPartitions, "make-bulkheads", computeBulkheads )

                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (partition model |> .zero >> .position)

                        updatedPartition =
                            newFloatInput
                                |> asPositionInPartitionZero (partition model |> .zero)
                                |> asZeroInPartition (partition model)
                    in
                        { tag = tag
                        , data =
                            encodeComputedPartitions <|
                                computePartition updatedPartition
                        }
                )
            <|
                toIncrement keyEvent

        KeyDownOnPartitionSpacingInput partitionType keyEvent ->
            Maybe.map
                (\increment ->
                    let
                        ( partition, asPartition, tag, computePartition ) =
                            case partitionType of
                                Deck ->
                                    ( model.partitions.decks, asDecksInPartitions, "make-decks", computeDecks )

                                Bulkhead ->
                                    ( model.partitions.bulkheads, asBulkheadsInPartitions, "make-bulkheads", computeBulkheads )

                        newFloatInput : FloatInput
                        newFloatInput =
                            addToFloatInput increment (partition.spacing)

                        updatedPartition =
                            newFloatInput
                                |> updateSpacingOfPartition partition
                    in
                        { tag = tag
                        , data =
                            encodeComputedPartitions <|
                                computePartition updatedPartition
                        }
                )
            <|
                toIncrement keyEvent

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

        RemoveBlocks blocks ->
            Just
                { tag = "remove-blocks", data = encodeListBlocks blocks }

        SelectBlock block ->
            Just <|
                if model.multipleSelect == False then
                    -- set selection as only this block
                    { tag = "select-block", data = encodeBlock block }
                else if List.member block.uuid model.selectedBlocks then
                    -- remove from selection
                    { tag = "remove-block-from-selection", data = encodeBlock block }
                else
                    -- add to selection
                    { tag = "add-block-to-selection", data = encodeBlock block }

        SelectHullReference hullReference ->
            Just { tag = "load-hull", data = Encode.string hullReference.path }

        UnselectHullReference ->
            Just { tag = "unload-hull", data = Encode.null }

        SetSpacingException partitionType index input ->
            let
                ( tag, partition, computePartition ) =
                    case partitionType of
                        Deck ->
                            ( "make-decks", model.partitions.decks, computeDecks )

                        Bulkhead ->
                            ( "make-bulkheads", model.partitions.bulkheads, computeBulkheads )

                previousException : FloatInput
                previousException =
                    Maybe.withDefault (.spacing partition) <| Dict.get index <| .spacingExceptions partition

                parsedInput : Result String Float
                parsedInput =
                    if input == "" then
                        -- an empty input should result in the default spacing
                        Ok (.value <| .spacing partition)
                    else
                        String.toFloat input
            in
                case parsedInput of
                    Ok value ->
                        Just
                            { tag = tag
                            , data =
                                abs value
                                    |> asValueInNumberInput previousException
                                    |> flip asStringInNumberInput input
                                    |> (\floatInput -> Dict.insert index floatInput <| .spacingExceptions partition)
                                    |> asSpacingExceptionsInPartition partition
                                    |> computePartition
                                    |> encodeComputedPartitions
                            }

                    Err error ->
                        Nothing

        SwitchViewMode newViewMode ->
            Just { tag = "switch-mode", data = encodeViewMode newViewMode }

        TogglePartitions ->
            Just { tag = "showing-partitions", data = Encode.bool <| not model.partitions.showing }

        ToggleBlocksVisibility blocks isVisible ->
            Just { tag = "blocks-visibility", data = encodeToggleBlocksVisibilityCmd blocks isVisible }

        UpdatePartitionNumber partitionType input ->
            let
                ( tag, partition, computePartition ) =
                    case partitionType of
                        Deck ->
                            ( "make-decks", model.partitions.decks, computeDecks )

                        Bulkhead ->
                            ( "make-bulkheads", model.partitions.bulkheads, computeBulkheads )
            in
                case String.toInt input of
                    Ok value ->
                        Just
                            { tag = tag
                            , data =
                                encodeComputedPartitions <|
                                    computePartition
                                        { partition | number = numberToNumberInput <| abs value }
                            }

                    Err error ->
                        Nothing

        UpdatePartitionSpacing partitionType input ->
            let
                ( tag, partition, computePartition ) =
                    case partitionType of
                        Deck ->
                            ( "make-decks", model.partitions.decks, computeDecks )

                        Bulkhead ->
                            ( "make-bulkheads", model.partitions.bulkheads, computeBulkheads )
            in
                case String.toFloat input of
                    Ok value ->
                        Just
                            { tag = tag
                            , data =
                                encodeComputedPartitions <|
                                    computePartition
                                        { partition | spacing = numberToNumberInput <| abs value }
                            }

                    Err error ->
                        Nothing

        UpdatePartitionZeroPosition partitionType input ->
            let
                ( tag, partition, computePartition ) =
                    case partitionType of
                        Deck ->
                            ( "make-decks", model.partitions.decks, computeDecks )

                        Bulkhead ->
                            ( "make-bulkheads", model.partitions.bulkheads, computeBulkheads )
            in
                case String.toFloat input of
                    Ok value ->
                        Just
                            { tag = tag
                            , data =
                                encodeComputedPartitions <|
                                    computePartition <|
                                        asZeroInPartition partition <|
                                            asPositionInPartitionZero partition.zero <|
                                                numberToNumberInput value
                            }

                    Err error ->
                        Nothing

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
                                |> asValueInNumberInput axisFloatInput
                                |> flip asStringInNumberInput input
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
                                |> asValueInNumberInput dimensionFloatInput
                                |> flip asStringInNumberInput input
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
    [ { title = "Hull", icon = FASolid.ship, viewMode = HullStudio }
    , { title = "Partitions", icon = FASolid.bars, viewMode = Partitioning PropertiesEdition }
    , { title = "Blocks", icon = FARegular.clone, viewMode = SpaceReservation WholeList }
    , { title = "KPIs", icon = FASolid.tachometer_alt, viewMode = KpiStudio }
    , { title = "Modeller", icon = FASolid.clone, viewMode = Modeller }
    ]


type alias HullReference =
    { label : String
    , path : String
    }


hullReferences : HullReferences
hullReferences =
    [ { label = "Anthineas", path = "assets/anthineas.stl" }
    , { label = "KCS", path = "assets/KCS.stl" }
    , { label = "DTMB 5415", path = "assets/DTMB_5415.stl" }
    , { label = "OPV", path = "assets/OPV.stl" }
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


updateSpacingOfPartition : { a | spacing : FloatInput } -> FloatInput -> { a | spacing : FloatInput }
updateSpacingOfPartition partition floatInput =
    let
        validFloatInput =
            if floatInput.value < 0 then
                { value = 0, string = "0" }
            else
                floatInput
    in
        validFloatInput
            |> asSpacingInPartition partition


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
        , viewToasts model.toasts
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


viewToasts : Toasts -> Html Msg
viewToasts toasts =
    ul [ class "toasts" ] <|
        List.map viewToast <|
            DictList.values toasts


viewToast : Toast -> Html Msg
viewToast toast =
    let
        icon : Html Msg
        icon =
            case toast.type_ of
                Info ->
                    FASolid.info

                Success ->
                    FASolid.check

                Error ->
                    FASolid.exclamation_triangle

                Processing ->
                    FASolid.spinner
    in
        li
            [ class <| "toast toast__" ++ (String.toLower <| toString toast.type_)
            , onClick <| NoJs <| DismissToast toast.key
            ]
            [ icon
            , p [] [ text toast.message ]
            ]


colorToCssRgbString : Color -> String
colorToCssRgbString color =
    let
        rgb =
            Color.toRgb color
    in
        "rgb(" ++ (toString rgb.red) ++ "," ++ (toString rgb.green) ++ "," ++ (toString rgb.blue) ++ ")"


getDateForFilename : { a | currentDate : Date.Date } -> String
getDateForFilename dateSha =
    let
        offsetFromUTC : Int
        offsetFromUTC =
            -120
    in
        Date.Extra.Format.format config "%Y%m%d-%Hh%M" dateSha.currentDate



-- HEADER MENU


viewSaveMenuItem : Model -> Html Msg
viewSaveMenuItem model =
    div
        [ class "header-menu-item"
        , title "Save"
        ]
        [ a
            [ type_ "button"
            , href <|
                "data:application/json;charset=utf-8,"
                    ++ (encodeUri <|
                            stringifyEncodeValue <|
                                encodeModelForSave model
                       )
            , downloadAs <| (getDateForFilename model) ++ "_Project_Shipbuilder_" ++ model.build ++ ".json"
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

        Partitioning _ ->
            case right of
                Partitioning _ ->
                    True

                _ ->
                    False

        KpiStudio ->
            case right of
                KpiStudio ->
                    True

                _ ->
                    False

        Modeller ->
            case right of
                Modeller ->
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

        Partitioning partitioningView ->
            viewPartitioning partitioningView model

        KpiStudio ->
            viewKpiStudio model

        Modeller ->
            viewModeller model


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
                (ToJs <| UnselectHullReference)
                selectedHullReferencePath

        Nothing ->
            HullReferences.viewHullStudioPanel
                hullReferences
                (ToJs << SelectHullReference)
                (ToJs <| UnselectHullReference)


isAccordionOpened : UiState -> String -> Bool
isAccordionOpened uiState accordionId =
    Maybe.withDefault False <| Dict.get accordionId uiState.accordions


viewPartitioning : PartitioningView -> Model -> Html Msg
viewPartitioning partitioningView model =
    let
        isDeckSpacingDetailsOpen : Bool
        isDeckSpacingDetailsOpen =
            isAccordionOpened model.uiState "deck-spacing-details"

        isBulkheadSpacingDetailsOpen : Bool
        isBulkheadSpacingDetailsOpen =
            isAccordionOpened model.uiState "bulkhead-spacing-details"
    in
        div
            [ class "panel partioning-panel" ]
        <|
            viewShowingPartitions model.partitions.showing
                :: (case partitioningView of
                        PropertiesEdition ->
                            [ viewDecks False isDeckSpacingDetailsOpen model.partitions.decks
                            , viewBulkheads False isBulkheadSpacingDetailsOpen model.partitions.bulkheads
                            ]

                        OriginDefinition Deck ->
                            [ viewDecks True isDeckSpacingDetailsOpen model.partitions.decks
                            , viewBulkheads False isBulkheadSpacingDetailsOpen model.partitions.bulkheads
                            ]

                        OriginDefinition Bulkhead ->
                            [ viewDecks False isDeckSpacingDetailsOpen model.partitions.decks
                            , viewBulkheads True isBulkheadSpacingDetailsOpen model.partitions.bulkheads
                            ]
                   )


viewModeller : Model -> Html Msg
viewModeller model =
    div
        [ class "panel modeller-panel" ]
        [ h2
            [ class "modeller-panel-title" ]
            [ text "Modeller" ]
        ]


viewKpiStudio : Model -> Html Msg
viewKpiStudio model =
    let
        blocksBoundingBox : BoundingBox
        blocksBoundingBox =
            getBlocksBoundingBox model.blocks

        blocksBoundingBoxSize : { length : Float, width : Float, height : Float }
        blocksBoundingBoxSize =
            getBoundingBoxSize blocksBoundingBox

        cog : Point
        cog =
            getCentroidOfBlocks model.blocks
    in
        div
            [ class "panel kpi-panel" ]
            [ h2
                [ class "kpi-panel-title" ]
                [ text "KPIs" ]
            , a
                [ class "download-kpis"
                , type_ "button"
                , href <|
                    "data:text/csv;charset=utf-8,"
                        ++ (encodeUri <|
                                kpisAsCsv model.blocks model.tags
                           )
                , downloadAs <| (getDateForFilename model) ++ "_KPIs_Shipbuilder_" ++ model.build ++ ".csv"
                ]
                [ FASolid.download, text "Download as CSV" ]
            , viewLengthKpi blocksBoundingBoxSize.length
            , viewWidthKpi blocksBoundingBoxSize.width
            , viewHeightKpi blocksBoundingBoxSize.height
            , viewCenterOfGravityXKpi cog.x
            , viewCenterOfGravityYKpi cog.y
            , viewCenterOfGravityZKpi cog.z
            , viewVolumeKpi model.blocks model.tags <| isAccordionOpened model.uiState "volume-kpi"
            , viewMassKpi model.blocks model.tags <| isAccordionOpened model.uiState "mass-kpi"
            ]


roundToNearestHundredth : Float -> Float
roundToNearestHundredth float =
    float
        |> (*) 100.0
        |> round
        |> toFloat
        |> flip (/) 100.0


viewLengthKpi : Float -> Html Msg
viewLengthKpi length =
    viewSimpleKpi "Length (m)" "length" <| roundToNearestHundredth length


viewWidthKpi : Float -> Html Msg
viewWidthKpi width =
    viewSimpleKpi "Width (m)" "width" <| roundToNearestHundredth width


viewHeightKpi : Float -> Html Msg
viewHeightKpi height =
    viewSimpleKpi "Height (m)" "height" <| roundToNearestHundredth height


viewCenterOfGravityXKpi : Float -> Html Msg
viewCenterOfGravityXKpi cogx =
    viewSimpleKpi "Center of gravity : x" "cog-x" <| roundToNearestHundredth cogx


viewCenterOfGravityYKpi : Float -> Html Msg
viewCenterOfGravityYKpi cogy =
    viewSimpleKpi "Center of gravity : y" "cog-y" <| roundToNearestHundredth cogy


viewCenterOfGravityZKpi : Float -> Html Msg
viewCenterOfGravityZKpi cogz =
    viewSimpleKpi "Center of gravity : z" "cog-z" <| roundToNearestHundredth cogz


kpisAsCsv : Blocks -> Tags -> String
kpisAsCsv blocks tags =
    let
        blocksBoundingBox : BoundingBox
        blocksBoundingBox =
            getBlocksBoundingBox blocks

        blocksBoundingBoxSize : { length : Float, width : Float, height : Float }
        blocksBoundingBoxSize =
            getBoundingBoxSize blocksBoundingBox

        cog : Point
        cog =
            getCentroidOfBlocks blocks

        totalSummary : KpiSummary
        totalSummary =
            computeKpisForAll blocks

        summaryList : List KpiSummary
        summaryList =
            List.map (computeKpisForColor blocks) SIRColorPicker.palette
    in
        -- Length, width and height are not in KpiSummary because they only apply for the whole ship
        -- We add the corresponding headers to the end of the list of those inside KpiSummary
        listToCsvLine [ "Target", "Mass (T)", "Volume (m³)", "Length (m)", "Width (m)", "Height (m)", "Center of gravity : x", "Center of gravity : y", "Center of gravity : z" ]
            :: ((kpiSummaryToStringList tags totalSummary
                    |> flip (++)
                        -- We add the values for the whole ship at the end of the list with the values inside KpiSummary
                        [ toString <| blocksBoundingBoxSize.length
                        , toString <| blocksBoundingBoxSize.width
                        , toString <| blocksBoundingBoxSize.height
                          -- We add the values for the whole ship at the end of the list with the values inside KpiSummary
                        , toString <| cog.x
                        , toString <| cog.y
                        , toString <| cog.z
                        ]
                    |> listToCsvLine
                )
                    :: List.map
                        (\summary ->
                            kpiSummaryToStringList tags summary
                                |> flip (++) [ "", "", "", "", "", "" ]
                                -- We add empty values for the color groups because length, width, height and the center of gravity don't apply
                                |>
                                    listToCsvLine
                        )
                        summaryList
               )
            |> String.join "\n"


kpiSummaryToStringList : Tags -> KpiSummary -> List String
kpiSummaryToStringList tags summary =
    let
        getColorName : SIRColorPicker.SirColor -> String
        getColorName sirColor =
            SIRColorPicker.getName sirColor

        getTagLabelForColor : SIRColorPicker.SirColor -> Maybe String
        getTagLabelForColor sirColor =
            List.head <| List.map .label <| List.filter ((==) sirColor << .color) tags

        getLabelForColor : SIRColorPicker.SirColor -> String
        getLabelForColor sirColor =
            Maybe.withDefault (getColorName sirColor) (getTagLabelForColor sirColor)
    in
        [ case summary.target of
            WholeShip ->
                "Total"

            ColorGroup color ->
                getLabelForColor color

            SingleBlock uuid ->
                uuid
        , toString <| round <| summary.mass
        , toString <| roundToNearestHundredth summary.volume
        ]


listToCsvLine : List String -> String
listToCsvLine items =
    items
        |> List.map (\item -> "\"" ++ item ++ "\"")
        |> String.join ";"


viewMassKpi : Blocks -> Tags -> Bool -> Html Msg
viewMassKpi blocks tags showKpiForColors =
    let
        transform : Float -> Int
        transform value =
            round value

        viewMassKpiContent : String -> String -> Int -> (Color -> Int) -> Tags -> Html Msg
        viewMassKpiContent =
            if showKpiForColors then
                viewKpiWithColors
            else
                viewKpi
    in
        viewMassKpiContent "Σ Mass (T)" "mass" (transform <| getSumOfMasses blocks) (transform << getSumOfMassesForColor blocks) tags


viewVolumeKpi : Blocks -> Tags -> Bool -> Html Msg
viewVolumeKpi blocks tags showKpiForColors =
    let
        transform : Float -> Float
        transform value =
            roundToNearestHundredth value

        viewVolumeKpiContent : String -> String -> Float -> (Color -> Float) -> Tags -> Html Msg
        viewVolumeKpiContent =
            if showKpiForColors then
                viewKpiWithColors
            else
                viewKpi
    in
        viewVolumeKpiContent "Σ Volume (m³)" "volume" (transform <| getSumOfVolumes blocks) (transform << getSumOfVolumesForColor blocks) tags


getColor : SIRColorPicker.SirColor -> Color
getColor sirColor =
    SIRColorPicker.getColor sirColor


getColorName : SIRColorPicker.SirColor -> String
getColorName sirColor =
    SIRColorPicker.getName sirColor


getTagLabelForColor : SIRColorPicker.SirColor -> Tags -> Maybe String
getTagLabelForColor sirColor tags =
    List.head <| List.map .label <| List.filter ((==) sirColor << .color) tags


getLabelForColor : SIRColorPicker.SirColor -> Tags -> String
getLabelForColor sirColor tags =
    Maybe.withDefault (getColorName sirColor) (getTagLabelForColor sirColor tags)


viewSimpleKpi : String -> String -> number -> Html Msg
viewSimpleKpi kpiTitle className totalValue =
    div [ class <| "kpi " ++ className ] <|
        [ div
            [ class "kpi-total kpi-group"
            ]
            [ h3 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| toString totalValue ]
            ]
        ]


viewKpi : String -> String -> number -> (Color -> number) -> Tags -> Html Msg
viewKpi kpiTitle className totalValue valueForColor tags =
    div [ class <| "kpi " ++ className ] <|
        [ div
            [ class "kpi-total kpi-group"
            , onClick <| NoJs <| ToggleAccordion True <| className ++ "-kpi"
            ]
            [ h3 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| toString totalValue ]
            , FASolid.angle_right
            ]
        ]


viewKpiWithColors : String -> String -> number -> (Color -> number) -> Tags -> Html Msg
viewKpiWithColors kpiTitle className totalValue valueForColor tags =
    div [ class <| "kpi " ++ className ] <|
        (div
            [ class "kpi-total kpi-group"
            , onClick <| NoJs <| ToggleAccordion False <| className ++ "-kpi"
            ]
            [ h3 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| toString totalValue ]
            , FASolid.angle_down
            ]
        )
            :: List.map
                (\sirColor ->
                    viewKpiByColor className (getColor sirColor) (getLabelForColor sirColor tags) (valueForColor <| SIRColorPicker.getColor sirColor)
                )
                SIRColorPicker.palette


getFullKpiSummary : Blocks -> List KpiSummary
getFullKpiSummary blocks =
    computeKpisForAll blocks
        :: (List.map (computeKpisForColor blocks) SIRColorPicker.palette)


viewKpiByColor : String -> Color -> String -> number -> Html Msg
viewKpiByColor kpiClass color colorLabel kpiValue =
    div [ class <| "input-group kpi-group " ++ kpiClass ]
        [ label
            [ class "kpi-color-label"
            , style
                [ ( "background-color", colorToCssRgbString color )
                ]
            , title colorLabel
            ]
            []
        , input
            [ type_ "text"
            , class "kpi-label"
            , value colorLabel
            , onInput <| NoJs << SetTagForColor color
            , onBlur <| NoJs CleanTags
            ]
            []
        , p
            [ class "kpi-value" ]
            [ text <| toString kpiValue ]
        ]


viewShowingPartitions : Bool -> Html Msg
viewShowingPartitions showing =
    div
        [ class "showing-partitions input-group"
        , onClick <| ToJs TogglePartitions
        ]
    <|
        if showing then
            [ text "Hide partitions"
            , FASolid.eye_slash
            ]
        else
            [ text "Show partitions"
            , FASolid.eye
            ]


viewDecks : Bool -> Bool -> Decks -> Html Msg
viewDecks isDefiningOrigin isDetailsOpen decks =
    div [ class "decks stacked-subpanel" ]
        [ div
            [ class "stacked-subpanel-header" ]
            [ h2
                [ class "stacked-subpanel-title" ]
                [ text "Decks" ]
            ]
        , div
            [ class "stacked-subpanel-content" ]
            [ div
                [ class "input-group" ]
                [ label
                    [ for "decks-number" ]
                    [ text "Number of decks" ]
                , input
                    [ type_ "number"
                    , id "decks-number"
                    , value decks.number.string
                    , Html.Attributes.min "0"
                    , onInput <| ToJs << UpdatePartitionNumber Deck
                    , onBlur <| NoJs SyncPartitions
                    ]
                    []
                ]
            , div
                [ class "input-group" ]
                [ label
                    [ for "decks-spacing" ]
                    [ text "Default spacing of decks" ]
                , input
                    [ type_ "text"
                    , id "decks-spacing"
                    , value decks.spacing.string
                    , onInput <| ToJs << UpdatePartitionSpacing Deck
                    , onBlur <| NoJs SyncPartitions
                    , onKeyDown <| ToJs << KeyDownOnPartitionSpacingInput Deck
                    ]
                    []
                ]
            , div
                [ class "deck-zero" ]
                [ if isDefiningOrigin then
                    p [] [ text "Defining deck n°0..." ]
                  else
                    button
                        [ disabled <| decks.number.value == 0
                        , onClick <| ToJs << SwitchViewMode <| Partitioning <| OriginDefinition Deck
                        ]
                        [ text "Define deck n°0" ]
                ]
            , div
                [ class "input-group" ]
                [ label
                    [ for "deck-zero-position" ]
                    [ text "Position of deck n°0" ]
                , input
                    [ type_ "text"
                    , id "deck-zero-position"
                    , value decks.zero.position.string
                    , onInput <| ToJs << UpdatePartitionZeroPosition Deck
                    , onBlur <| NoJs SyncPartitions
                    , onKeyDown <| ToJs << KeyDownOnPartitionPositionInput Deck
                    ]
                    []
                ]
            , viewPartitionSpacingDetails Deck isDetailsOpen decks
            ]
        ]


viewPartitionSpacingDetails : PartitionType -> Bool -> { a | number : IntInput, spacing : FloatInput, zero : PartitionZero, spacingExceptions : Dict Int FloatInput } -> Html Msg
viewPartitionSpacingDetails partitionType isDetailsOpen partitionSummary =
    let
        rootClass : String
        rootClass =
            "spacing-details"
    in
        div
            [ class rootClass ]
        <|
            if isDetailsOpen then
                [ p
                    [ class <| rootClass ++ "-title"
                    , onClick <| NoJs <| ToggleAccordion False <| (String.toLower <| toString partitionType) ++ "-spacing-details"
                    ]
                    [ text "Spacing details"
                    , FASolid.angle_down
                    ]
                , if partitionSummary.number.value > 0 then
                    viewPartitionSpacingList partitionType partitionSummary
                  else
                    p [ class "text-muted" ] [ text <| "There's no " ++ (String.toLower <| toString partitionType) ++ " yet" ]
                ]
            else
                [ p
                    [ class <| rootClass ++ "-title"
                    , onClick <| NoJs <| ToggleAccordion True <| (String.toLower <| toString partitionType) ++ "-spacing-details"
                    ]
                    [ text "Spacing details"
                    , FASolid.angle_right
                    ]
                ]


viewPartitionSpacingList : PartitionType -> { a | number : IntInput, spacing : FloatInput, zero : PartitionZero, spacingExceptions : Dict Int FloatInput } -> Html Msg
viewPartitionSpacingList partitionType partitionSummary =
    let
        getPartitionSpacingData : Int -> { number : Int, index : Int, maybeSpacing : Maybe FloatInput }
        getPartitionSpacingData index =
            { number = index - partitionSummary.zero.index
            , index = index
            , maybeSpacing = Dict.get index partitionSummary.spacingExceptions
            }

        partitionList =
            List.range 0 (partitionSummary.number.value - 1)
                |> List.map getPartitionSpacingData
                |> List.reverse
    in
        ul [ class "spacing-list" ] <| List.map (viewPartitionSpacingListItem partitionType partitionSummary.spacing.value) partitionList


viewPartitionSpacingListItem : PartitionType -> Float -> { number : Int, index : Int, maybeSpacing : Maybe FloatInput } -> Html Msg
viewPartitionSpacingListItem partitionType defaultSpacing partitionSpacingData =
    li
        [ class "spacing-item input-group" ]
        [ label
            []
            [ text <| toString partitionSpacingData.number ]
        , input
            [ type_ "text"
            , placeholder <| toString defaultSpacing
            , value <|
                case partitionSpacingData.maybeSpacing of
                    Just spacing ->
                        spacing.string

                    Nothing ->
                        ""
            , onInput <| ToJs << SetSpacingException partitionType partitionSpacingData.index
            , onBlur <| NoJs SyncPartitions
            ]
            []
        ]


viewBulkheads : Bool -> Bool -> Bulkheads -> Html Msg
viewBulkheads isDefiningOrigin isDetailsOpen bulkheads =
    div [ class "bulkheads stacked-subpanel" ]
        [ div
            [ class "stacked-subpanel-header" ]
            [ h2
                [ class "stacked-subpanel-title" ]
                [ text "Bulkheads" ]
            ]
        , div
            [ class "stacked-subpanel-content" ]
            [ div
                [ class "input-group" ]
                [ label
                    [ for "bulkheads-number" ]
                    [ text "Number of bulkheads" ]
                , input
                    [ type_ "number"
                    , id "bulkheads-number"
                    , value bulkheads.number.string
                    , Html.Attributes.min "0"
                    , onInput <| ToJs << UpdatePartitionNumber Bulkhead
                    , onBlur <| NoJs SyncPartitions
                    ]
                    []
                ]
            , div
                [ class "input-group" ]
                [ label
                    [ for "bulkheads-spacing" ]
                    [ text "Default spacing of bulkheads" ]
                , input
                    [ type_ "text"
                    , id "bulkheads-spacing"
                    , value bulkheads.spacing.string
                    , onInput <| ToJs << UpdatePartitionSpacing Bulkhead
                    , onBlur <| NoJs SyncPartitions
                    , onKeyDown <| ToJs << KeyDownOnPartitionSpacingInput Bulkhead
                    ]
                    []
                ]
            , div
                [ class "bulkhead-zero" ]
                [ if isDefiningOrigin then
                    p [] [ text "Defining bulkhead n°0..." ]
                  else
                    button
                        [ disabled <| bulkheads.number.value == 0
                        , onClick <| ToJs << SwitchViewMode <| Partitioning <| OriginDefinition Bulkhead
                        ]
                        [ text "Define bulkhead n°0" ]
                ]
            , div
                [ class "input-group" ]
                [ label
                    [ for "bulkhead-zero-position" ]
                    [ text "Position of bulkhead n°0" ]
                , input
                    [ type_ "text"
                    , id "bulkhead-zero-position"
                    , value bulkheads.zero.position.string
                    , onInput <| ToJs << UpdatePartitionZeroPosition Bulkhead
                    , onBlur <| NoJs SyncPartitions
                    , onKeyDown <| ToJs << KeyDownOnPartitionPositionInput Bulkhead
                    ]
                    []
                ]
            , viewPartitionSpacingDetails Bulkhead isDetailsOpen bulkheads
            ]
        ]


viewWholeList : Model -> Html Msg
viewWholeList model =
    div
        [ class "panel blocks-panel" ]
        [ h2
            []
            [ text "Blocks"
            , div [ class "blocks-actions" ]
                [ downloadBlocksAsCsv (toList model.blocks) model
                , div
                    [ class "blocks-visibility" ]
                    [ viewShowBlocksAction (toList model.blocks)
                    , viewHideBlocksAction (toList model.blocks)
                    ]
                , viewDeleteBlocksAction (toList model.blocks)
                ]
            , viewSelectedBlocksSummary model
            ]
        , viewBlockList model
        ]


viewCsvButton : Html Msg
viewCsvButton =
    div [ class "csv-button text-button" ]
        [ text "CSV" ]


downloadBlocksAsCsv : List Block -> Model -> Html Msg
downloadBlocksAsCsv blocksList model =
    a
        [ type_ "button"
        , href <|
            "data:text/csv;charset=utf-8,"
                ++ (encodeUri <|
                        blocksAsCsv blocksList model.tags model.customProperties
                   )
        , downloadAs <| (getDateForFilename model) ++ "_Blocks_Shipbuilder_" ++ model.build ++ ".csv"
        , title "Download blocks as CSV"
        ]
        [ viewCsvButton ]


blocksAsCsv : List Block -> Tags -> List CustomProperty -> String
blocksAsCsv blocksList tags customProperties =
    let
        customPropertyLabels : List String
        customPropertyLabels =
            List.map .label customProperties
    in
        listToCsvLine ([ "uuid", "label", "color", "x", "y", "z", "length", "height", "width", "Center of gravity: x", "Center of gravity: y", "Center of gravity: z", "volume", "mass", "density" ] ++ customPropertyLabels)
            :: List.map (blockToCsvLine tags customProperties) blocksList
            |> String.join "\n"


blockToCsvLine : Tags -> List CustomProperty -> Block -> String
blockToCsvLine tags customProperties block =
    let
        getColorName : SIRColorPicker.SirColor -> String
        getColorName sirColor =
            SIRColorPicker.getName sirColor

        getTagLabelForColor : SIRColorPicker.SirColor -> Maybe String
        getTagLabelForColor sirColor =
            List.head <| List.map .label <| List.filter ((==) sirColor << .color) tags

        getLabelForColor : SIRColorPicker.SirColor -> String
        getLabelForColor sirColor =
            Maybe.withDefault (getColorName sirColor) (getTagLabelForColor sirColor)

        customPropertyValues : List String
        customPropertyValues =
            List.map (\customProperty -> Maybe.withDefault "" (Dict.get block.uuid customProperty.values)) customProperties

        cog : Point
        cog =
            getCenterOfGravity block
    in
        listToCsvLine
            ([ block.uuid
             , block.label
             , Maybe.withDefault "" <| Maybe.map getLabelForColor <| SIRColorPicker.fromColor block.color
             , block.position.x.string
             , block.position.y.string
             , block.position.z.string
             , block.size.length.string
             , block.size.height.string
             , block.size.width.string
             , toString cog.x
             , toString cog.y
             , toString cog.z
             , toString <| computeVolume block
             , block.mass.string
             , block.density.string
             ]
                ++ customPropertyValues
            )


viewSelectedBlocksSummary : Model -> Html Msg
viewSelectedBlocksSummary model =
    let
        selectedBlocks : List Block
        selectedBlocks =
            List.filter (\block -> List.member block.uuid model.selectedBlocks) <| toList model.blocks
    in
        div
            [ if List.length selectedBlocks > 1 then
                class "selected-blocks-summary selected-blocks-summary__visible"
              else
                class "selected-blocks-summary"
            ]
            [ text <| (toString <| List.length selectedBlocks) ++ " selected blocks"
            , div
                [ class "blocks-actions" ]
                [ downloadBlocksAsCsv selectedBlocks model
                , div
                    [ class "blocks-visibility" ]
                    [ viewShowBlocksAction selectedBlocks
                    , viewHideBlocksAction selectedBlocks
                    , viewDeleteBlocksAction selectedBlocks
                    ]
                ]
            ]


viewShowBlocksAction : List Block -> Html Msg
viewShowBlocksAction blocks =
    div
        [ class "blocks-action show-all-blocks"
        , onClick <| ToJs <| ToggleBlocksVisibility blocks True
        , title "Show all blocks"
        ]
        [ FASolid.eye ]


viewHideBlocksAction : List Block -> Html Msg
viewHideBlocksAction blocks =
    div
        [ class "blocks-action hide-all-blocks"
        , onClick <| ToJs <| ToggleBlocksVisibility blocks False
        , title "Hide all blocks"
        ]
        [ FASolid.eye_slash ]


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
                    viewBlockProperties block
                , div
                    [ class "focus-custom-properties" ]
                  <|
                    viewBlockCustomProperties model.customProperties block
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


viewBlockProperties : Block -> List (Html Msg)
viewBlockProperties block =
    [ if block.visible then
        div
            [ class "block-visibility primary-button"
            , onClick <| ToJs <| ToggleBlocksVisibility [ block ] False
            ]
            [ text "Hide block"
            , FASolid.eye_slash
            ]
      else
        div
            [ class "block-visibility primary-button"
            , onClick <| ToJs <| ToggleBlocksVisibility [ block ] True
            ]
            [ text "Show block"
            , FASolid.eye
            ]
    , div
        [ class "input-group block-color" ]
        [ label [] [ text "Color" ]
        , SIRColorPicker.view block.color (ToJs << ChangeBlockColor block)
        ]
    , div
        [ class "block-position" ]
      <|
        List.map (flip viewPositionInput block) [ X, Y, Z ]
    , div
        [ class "block-size" ]
      <|
        List.map (flip viewSizeInput block) [ Length, Width, Height ]
    , viewBlockCenterOfGravity block
    , viewBlockMassInfo block
    ]


viewBlockCustomProperties : List CustomProperty -> Block -> List (Html Msg)
viewBlockCustomProperties customProperties block =
    List.indexedMap (viewBlockCustomProperty block) customProperties
        ++ [ viewBlockAddCustomProperty ]


viewBlockCustomProperty : Block -> Int -> CustomProperty -> Html Msg
viewBlockCustomProperty block propertyIndex property =
    let
        -- used to focus the newly created properties
        labelId : String
        labelId =
            "custom-property-" ++ (toString <| propertyIndex + 1)

        propertyValue : String
        propertyValue =
            Maybe.withDefault "" <| Dict.get block.uuid property.values
    in
        div
            [ class "custom-property input-group" ]
            [ div
                [ class "custom-property-header" ]
                [ input
                    [ type_ "text"
                    , class "custom-property-label label-like input-label"
                    , id labelId
                    , value property.label
                    , onInput <| NoJs << UpdateCustomPropertyLabel property
                    ]
                    []
                , p
                    [ class "delete-custom-property"
                    , title <| "Delete " ++ property.label
                    , onClick <| NoJs <| DeleteCustomProperty property
                    ]
                    [ FASolid.trash ]
                ]
            , input
                [ type_ "text"
                , class "custom-property-value"
                , placeholder <| property.label ++ " value"
                , onInput <| NoJs << SetValueForCustomProperty property block
                , value propertyValue
                ]
                []
            ]


viewBlockAddCustomProperty : Html Msg
viewBlockAddCustomProperty =
    div
        [ class "custom-property add-custom-property input-group" ]
        [ input
            [ type_ "text"
            , placeholder "New custom property"
            , onInput <| NoJs << AddCustomProperty
            ]
            []
        ]


viewBlockMassInfo : Block -> Html Msg
viewBlockMassInfo block =
    div
        [ class "block-mass-info" ]
        [ div
            [ class "block-volume" ]
            [ p
                [ class "block-volume-label" ]
                [ text "volume" ]
            , p
                [ class "block-volume-value" ]
                [ text <| toString <| computeVolume block ]
            ]
        , div
            [ class "input-group block-density" ]
            [ label
                [ for "block-density-input" ]
                [ text "density" ]
            , input
                [ type_ "text"
                , id "block-density-input"
                , value block.density.string
                , onBlur <| NoJs <| SyncBlockInputs block
                , onInput <| NoJs << UpdateDensity block
                ]
                []
            ]
        , div
            [ class "input-group block-mass" ]
            [ label
                [ for "block-mass-input" ]
                [ text "mass" ]
            , input
                [ type_ "text"
                , id "block-mass-input"
                , value block.mass.string
                , onBlur <| NoJs <| SyncBlockInputs block
                , onInput <| NoJs << UpdateMass block
                ]
                []
            ]
        ]


viewBlockCenterOfGravity : Block -> Html Msg
viewBlockCenterOfGravity block =
    div [ class "block-cog form-group" ] <|
        viewBlockCenterOfGravityUserInput block block.centerOfGravity


viewBlockCenterOfGravityUserInput : Block -> Position -> List (Html Msg)
viewBlockCenterOfGravityUserInput block cog =
    [ div
        [ class "form-group-title" ]
        [ text "Center of gravity"
        , div
            [ class "form-group-action"
            , title "Set to the center of the volume"
            , onClick <| NoJs <| LockCenterOfGravityToCenterOfVolume block
            ]
            [ FASolid.crosshairs ]
        ]
    , viewCenterOfGravityUserInputCoordinate X block cog.x
    , viewCenterOfGravityUserInputCoordinate Y block cog.y
    , viewCenterOfGravityUserInputCoordinate Z block cog.z
    ]


viewCenterOfGravityUserInputCoordinate : Axis -> Block -> FloatInput -> Html Msg
viewCenterOfGravityUserInputCoordinate axis block coordinateInput =
    let
        axisLabel : String
        axisLabel =
            String.toLower <| toString axis
    in
        div
            [ class "input-group cog-coordinate" ]
            [ label
                [ for <| "block-cog-" ++ axisLabel ++ "-input"
                , title <| "Center of gravity: " ++ axisLabel ++ " coordinate"
                ]
                [ text "CoG", sub [] [ text axisLabel ] ]
            , input
                [ type_ "text"
                , id <| "block-cog-" ++ axisLabel ++ "-input"
                , value coordinateInput.string
                , onInput <| NoJs << UpdateCenterOfGravity axis block
                , onBlur <| NoJs <| SyncBlockInputs block
                ]
                []
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
        , onBlur <| NoJs <| SyncBlockInputs block
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
        , onBlur <| NoJs <| SyncBlockInputs block
        , onKeyDown <| ToJs << KeyDownOnSizeInput dimension block
        ]
        []


type alias FloatInput =
    { value : Float
    , string : String
    }


type alias IntInput =
    { value : Int
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


viewBlockList : { a | blocks : Blocks, selectedBlocks : List String, uiState : UiState } -> Html Msg
viewBlockList model =
    let
        showContextualMenuFor : Block -> Bool
        showContextualMenuFor block =
            Maybe.withDefault False <| Maybe.map ((==) block.uuid) model.uiState.blockContextualMenu

        viewBlockWithSelection : Block -> Html Msg
        viewBlockWithSelection block =
            viewBlockItemWithSelection (showContextualMenuFor block) model.selectedBlocks block

        viewBlockWithoutSelection : Block -> Html Msg
        viewBlockWithoutSelection block =
            viewBlockItem (showContextualMenuFor block) block
    in
        ul
            [ class "blocks" ]
        <|
            if List.length model.selectedBlocks > 0 then
                (List.map viewBlockWithSelection <| toList model.blocks)
                    ++ [ viewNewBlockItem ]
            else
                (List.map viewBlockWithoutSelection <| toList model.blocks)
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


viewBlockItem : Bool -> Block -> Html Msg
viewBlockItem showContextualMenu block =
    li
        [ if block.visible then
            class "block-item"
          else
            class "block-item hidden"
        , style [ ( "borderColor", colorToCssRgbString block.color ) ]
        , onMouseLeave <| NoJs <| UnsetBlockContextualMenu
        ]
    <|
        viewBlockItemContent showContextualMenu block


viewBlockItemContent : Bool -> Block -> List (Html Msg)
viewBlockItemContent showContextualMenu block =
    if showContextualMenu then
        [ div
            [ class "block-info-wrapper"
            , onClick <| ToJs <| SelectBlock block
            ]
            [ viewEditableBlockName block
            , p
                [ class "block-uuid" ]
                [ text block.uuid ]
            , viewBlockContextualMenu block
            ]
        , div
            [ class "block-actions" ]
            [ viewFocusBlockAction block
            , viewCloseBlockContextualMenuAction
            ]
        ]
    else
        [ div
            [ class "block-info-wrapper"
            , onClick <| ToJs <| SelectBlock block
            ]
            [ viewEditableBlockName block
            , p
                [ class "block-uuid" ]
                [ text block.uuid ]
            , div
                [ class "move-up move-block"
                , onClickWithoutPropagation <| NoJs <| MoveBlockUp block
                , title "Move up"
                ]
                [ FASolid.angle_up ]
            , div
                [ class "move-down move-block"
                , onClickWithoutPropagation <| NoJs <| MoveBlockDown block
                , title "Move down"
                ]
                [ FASolid.angle_down ]
            ]
        , div
            [ class "block-actions" ]
            [ viewFocusBlockAction block
            , viewOpenBlockContextualMenuAction block
            ]
        ]


viewOpenBlockContextualMenuAction : Block -> Html Msg
viewOpenBlockContextualMenuAction block =
    div
        [ class "block-action open-contextual-menu"
        , onClick <| NoJs <| SetBlockContextualMenu block.uuid
        , title "See extra actions"
        ]
        [ FASolid.ellipsis_h ]


viewCloseBlockContextualMenuAction : Html Msg
viewCloseBlockContextualMenuAction =
    div
        [ class "block-action close-contextual-menu"
        , onClick <| NoJs <| UnsetBlockContextualMenu
        , title "Hide extra actions"
        ]
        [ FARegular.times_circle ]


viewBlockContextualMenu : Block -> Html Msg
viewBlockContextualMenu block =
    div
        [ class "block-contextual-menu"
        , onClickWithoutPropagation <| NoJs <| NoOp
        ]
        [ viewDeleteBlockAction block
        , if block.visible then
            viewHideBlockAction block
          else
            viewShowBlockAction block
        ]


viewFocusBlockAction : Block -> Html Msg
viewFocusBlockAction block =
    div
        [ class "block-action focus-block"
        , onClick <| ToJs <| SwitchViewMode <| SpaceReservation <| DetailedBlock block.uuid
        , title "Focus block"
        ]
        [ FASolid.arrow_right
        ]


viewDeleteBlocksAction : List Block -> Html Msg
viewDeleteBlocksAction blocks =
    div
        [ class "blocks-action delete-block"
        , onClick <| ToJs <| RemoveBlocks blocks
        , title "Delete all blocks"
        ]
        [ FASolid.trash ]


viewDeleteBlockAction : Block -> Html Msg
viewDeleteBlockAction block =
    div
        [ class "block-action delete-block"
        , onClickWithoutPropagation <| ToJs <| RemoveBlock block
        , title "Delete block"
        ]
        [ FASolid.trash ]


onClickWithoutPropagation : Msg -> Html.Attribute Msg
onClickWithoutPropagation msg =
    onWithOptions "click" { stopPropagation = True, preventDefault = False } (Decode.succeed msg)


viewShowBlockAction : Block -> Html Msg
viewShowBlockAction block =
    div
        [ class "block-action show-block"
        , onClickWithoutPropagation <| ToJs <| ToggleBlocksVisibility [ block ] True
        , title "Show block"
        ]
        [ FASolid.eye ]


viewHideBlockAction : Block -> Html Msg
viewHideBlockAction block =
    div
        [ class "block-action hide-block"
        , onClickWithoutPropagation <| ToJs <| ToggleBlocksVisibility [ block ] False
        , title "Hide block"
        ]
        [ FASolid.eye_slash ]


viewBlockItemWithSelection : Bool -> List String -> Block -> Html Msg
viewBlockItemWithSelection showContextualMenu selectedBlocks block =
    if List.member block.uuid selectedBlocks then
        li
            [ if block.visible then
                class "block-item block-item__selected"
              else
                class "block-item block-item__selected hidden"
            , style [ ( "borderColor", colorToCssRgbString block.color ) ]
            ]
        <|
            viewBlockItemContent showContextualMenu block
    else
        viewBlockItem showContextualMenu block



-- WORKSPACE


viewWorkspace : Model -> Html Msg
viewWorkspace model =
    div [ class "workspace" ]
        [ div [ id "three-wrapper" ] []
        ]
