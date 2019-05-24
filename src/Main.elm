port module Main exposing
    ( Axis(..)
    , Block
    , Blocks
    , Dimension(..)
    , FromJsMsg(..)
    , HullView(..)
    , JsData
    , Model
    , Msg(..)
    , NoJsMsg(..)
    , PartitionType(..)
    , PartitioningView(..)
    , SaveFile
    , SpaceReservationView(..)
    , ToJsMsg(..)
    , ViewMode(..)
    , addBlockTo
    , asHeightInSize
    , asLengthInSize
    , asWidthInSize
    , asXInPosition
    , asYInPosition
    , asZInPosition
    , encodeInitThreeCommand
    , init
    , initBlock
    , initCmd
    , initModel
    , initPartitions
    , main
    , msg2json
    , removeBlockFrom
    , toJs
    , toList
    , update
    , updateNoJs
    , view
    )

import AreaCurve
import Browser
import Browser.Dom
import Browser.Events
import Color exposing (Color)
import CoordinatesTransform exposing (CoordinatesTransform)
import DateFormat
import Dict exposing (Dict)
import DictList
import EncodersDecoders
import ExtraEvents exposing (onKeyDown)
import FontAwesome.Regular as FARegular
import FontAwesome.Solid as FASolid
import Html exposing (Html, a, button, div, h1, h2, h3, img, input, label, li, p, sub, text, ul)
import Html.Attributes exposing (accept, attribute, class, disabled, download, for, hidden, href, id, name, placeholder, src, style, title, type_, value)
import Html.Events exposing (on, onBlur, onClick, onInput, onMouseLeave)
import HullReferences
import HullSliceModifiers
import HullSlices exposing (HullSlice, HullSlices, applyCustomPropertiesToHullSlices, isHullCustomized)
import HullSlicesMetrics
    exposing
        ( HullSlicesMetrics
        , fillHullSliceMetrics
        , getBlockCoefficient
        , getCenterOfBuoyancy
        , getDisplacement
        , getMetacentre
        , getPrismaticCoefficient
        )
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import SIRColorPicker
import StringValueInput
import Task
import Time
import Url
import Viewports exposing (Viewports, encodeViewports)


port toJs : JsData -> Cmd msg


port fromJs : (JsData -> msg) -> Sub msg


type alias DictList k v =
    DictList.DictList k v


type alias JsData =
    { tag : String
    , data : Encode.Value
    }


type alias Flag =
    { buildSHA : String
    , hullsJSON : String
    }


main : Program Flag Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ fromJs jsMsgToMsg
        , Browser.Events.onKeyDown <| Decode.map keydownToMsg keyDecoder
        , Browser.Events.onKeyUp <| Decode.map keyupToMsg keyDecoder
        , Time.every (20 * 1000) (NoJs << SetCurrentDate)
        ]


type alias SyncPosition =
    { uuid : String
    , position : Position
    }


syncPositionDecoder : Decode.Decoder SyncPosition
syncPositionDecoder =
    Decode.succeed SyncPosition
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "position" decodePosition


type alias SyncSize =
    { uuid : String
    , size : Size
    }


type alias SaveFile =
    { selectedHullReference : Maybe String
    , hulls : Dict ShipName HullSlices.HullSlices
    , blocks : List Block
    , coordinatesTransform : List Float
    , partitions : PartitionsData
    , tags : Tags
    , customProperties : List CustomProperty
    }


saveFileDecoderV1 : Decode.Decoder SaveFile
saveFileDecoderV1 =
    Decode.succeed SaveFile
        |> Pipeline.optional "selectedHullReference" (Decode.map Just Decode.string) Nothing
        |> Pipeline.optional "hulls" EncodersDecoders.dictDecoder Dict.empty
        |> Pipeline.required "blocks" decodeBlocks
        |> Pipeline.required "coordinatesTransform" (Decode.list Decode.float)
        |> Pipeline.hardcoded initPartitions
        |> Pipeline.hardcoded []
        |> Pipeline.hardcoded []


saveFileDecoderV2 : Decode.Decoder SaveFile
saveFileDecoderV2 =
    Decode.succeed SaveFile
        |> Pipeline.optional "selectedHullReference" (Decode.map Just Decode.string) Nothing
        |> Pipeline.optional "hulls" EncodersDecoders.dictDecoder Dict.empty
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
            Decode.fail <| "Unknown version " ++ String.fromInt version


decodeVersion : Decode.Decoder Int
decodeVersion =
    Decode.field "version" Decode.int


decodeCustomProperties : Decode.Decoder (List CustomProperty)
decodeCustomProperties =
    Decode.list decodeCustomProperty


decodeCustomProperty : Decode.Decoder CustomProperty
decodeCustomProperty =
    Decode.succeed CustomProperty
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
    Decode.succeed SelectPartitionData
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


updateBlockCenterOfGravity : Block -> Block
updateBlockCenterOfGravity block =
    let
        centerOfVolume : Point
        centerOfVolume =
            getRelativeCenterOfVolume block
    in
    { block
        | centerOfGravity =
            { x = StringValueInput.fromNumber "m" "x" 1 centerOfVolume.x
            , y = StringValueInput.fromNumber "m" "y" 1 centerOfVolume.y
            , z = StringValueInput.fromNumber "m" "z" 1 centerOfVolume.z
            }
    }


decodeBlock : Decode.Decoder Block
decodeBlock =
    let
        d =
            Decode.succeed Block
                |> Pipeline.required "uuid" Decode.string
                |> Pipeline.required "label" Decode.string
                |> Pipeline.required "color" decodeColor
                |> Pipeline.required "position" decodePosition
                |> Pipeline.required "size" decodeSize
                |> Pipeline.optional "referenceForMass" decodeReferenceForMass None
                |> Pipeline.optional "mass" (StringValueInput.floatInputDecoder 1 "m" "Mass") (StringValueInput.emptyFloat 1)
                |> Pipeline.optional "density" (StringValueInput.floatInputDecoder 1 "kg/m^3" "Density") (StringValueInput.emptyFloat 1)
                |> Pipeline.optional "visible" Decode.bool True
                |> Pipeline.optional "centerOfGravity" decodePosition initPosition
                |> Pipeline.optional "centerOfGravityFixed" Decode.bool False
    in
    Decode.map updateBlockCenterOfGravity d


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
    Decode.succeed Color.rgba
        |> Pipeline.required "red" Decode.float
        |> Pipeline.required "green" Decode.float
        |> Pipeline.required "blue" Decode.float
        |> Pipeline.optional "alpha" Decode.float 1


syncSizeDecoder : Decode.Decoder SyncSize
syncSizeDecoder =
    Decode.succeed SyncSize
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "size" decodeSize


decodePosition : Decode.Decoder Position
decodePosition =
    Decode.succeed Position
        |> Pipeline.required "x" (StringValueInput.floatInputDecoder 1 "m" "x")
        |> Pipeline.required "y" (StringValueInput.floatInputDecoder 1 "m" "y")
        |> Pipeline.required "z" (StringValueInput.floatInputDecoder 1 "m" "z")


decodeSize : Decode.Decoder Size
decodeSize =
    Decode.succeed Size
        |> Pipeline.required "x" (StringValueInput.floatInputDecoder 1 "m" "x")
        |> Pipeline.required "y" (StringValueInput.floatInputDecoder 1 "m" "y")
        |> Pipeline.required "z" (StringValueInput.floatInputDecoder 1 "m" "z")


decodeRgbRecord : Decode.Decoder Color
decodeRgbRecord =
    Decode.succeed Color.rgb
        |> Pipeline.required "red" Decode.float
        |> Pipeline.required "green" Decode.float
        |> Pipeline.required "blue" Decode.float


decodePartitions : Decode.Decoder PartitionsData
decodePartitions =
    Decode.succeed PartitionsData
        |> Pipeline.required "decks" decodeDecks
        |> Pipeline.required "bulkheads" decodeBulkheads
        |> Pipeline.hardcoded True


decodeDecks : Decode.Decoder Decks
decodeDecks =
    Decode.succeed Decks
        |> Pipeline.required "number" (Decode.map (StringValueInput.fromInt "Number of decks") Decode.int)
        |> Pipeline.required "spacing" (StringValueInput.floatInputDecoder 1 "m" "Spacing")
        |> Pipeline.required "zero" decodePartitionZero
        |> Pipeline.optional "spacingExceptions" StringValueInput.decodeSpacingExceptions Dict.empty


decodeBulkheads : Decode.Decoder Bulkheads
decodeBulkheads =
    Decode.succeed Bulkheads
        |> Pipeline.required "number" (Decode.map (StringValueInput.fromInt "Number of decks") Decode.int)
        |> Pipeline.required "spacing" (StringValueInput.floatInputDecoder 1 "m" "Spacing")
        |> Pipeline.required "zero" decodePartitionZero
        |> Pipeline.optional "spacingExceptions" StringValueInput.decodeSpacingExceptions Dict.empty


decodePartitionZero : Decode.Decoder PartitionZero
decodePartitionZero =
    Decode.succeed PartitionZero
        |> Pipeline.required "index" Decode.int
        |> Pipeline.required "position" (StringValueInput.floatInputDecoder 1 "m" "Position")


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


toastTypeToString : ToastType -> String
toastTypeToString toastType =
    case toastType of
        Error ->
            "error"

        Info ->
            "info"

        Processing ->
            "processing"

        Success ->
            "success"


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
    Decode.succeed Toast
        |> Pipeline.required "key" Decode.string
        |> Pipeline.required "message" Decode.string
        |> Pipeline.required "type" toastTypeDecoder


keyDecoder : Decode.Decoder String
keyDecoder =
    Decode.field "key" Decode.string


keydownToMsg : String -> Msg
keydownToMsg keyCode =
    case keyCode of
        "17" ->
            -- Control
            NoJs <| SetMultipleSelect True

        _ ->
            NoJs NoOp


keyupToMsg : String -> Msg
keyupToMsg keyCode =
    case keyCode of
        "17" ->
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
                    FromJs <| JSError <| Decode.errorToString message

        "dismiss-toast" ->
            case Decode.decodeValue Decode.string js.data of
                Ok key ->
                    NoJs <| DismissToast key

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "display-toast" ->
            case Decode.decodeValue toastDecoder js.data of
                Ok toast ->
                    NoJs <| DisplayToast toast

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "save-data" ->
            case Decode.decodeValue (decodeVersion |> Decode.andThen decodeSaveFile) js.data of
                Ok fileContents ->
                    FromJs <| RestoreSave fileContents

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "import-data" ->
            case Decode.decodeValue (decodeVersion |> Decode.andThen decodeSaveFile) js.data of
                Ok fileContents ->
                    FromJs <| ImportHullsLibrary fileContents

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "new-block" ->
            case Decode.decodeValue decodeBlock js.data of
                Ok block ->
                    FromJs <| NewBlock block

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "remove-from-selection" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| RemoveFromSelection uuid

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "select" ->
            case Decode.decodeValue Decode.string js.data of
                Ok uuid ->
                    FromJs <| Select uuid

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "select-partition" ->
            case Decode.decodeValue selectPartitionDecoder js.data of
                Ok selectionData ->
                    FromJs <| SelectPartition selectionData.partitionType selectionData.partitionIndex selectionData.partitionPosition

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "sync-position" ->
            case Decode.decodeValue syncPositionDecoder js.data of
                Ok syncPosition ->
                    FromJs <| SynchronizePosition syncPosition.uuid syncPosition.position

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "sync-positions" ->
            case Decode.decodeValue (Decode.list syncPositionDecoder) js.data of
                Ok syncPositions ->
                    FromJs <|
                        SynchronizePositions <|
                            Dict.fromList <|
                                List.map (\syncPos -> ( syncPos.uuid, syncPos )) syncPositions

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "sync-size" ->
            case Decode.decodeValue syncSizeDecoder js.data of
                Ok syncSize ->
                    FromJs <| SynchronizeSize syncSize.uuid syncSize.size

                Err message ->
                    FromJs <| JSError <| Decode.errorToString message

        "unselect" ->
            FromJs Unselect

        unknownTag ->
            FromJs <| JSError <| "Unknown tag received from JS: " ++ unknownTag


type FromJsMsg
    = AddToSelection String
    | RemoveFromSelection String
    | Select String
    | SelectPartition PartitionType Int Float
    | Unselect
    | JSError String
    | NewBlock Block
    | RestoreSave SaveFile
    | ImportHullsLibrary SaveFile
    | SynchronizePosition String Position
    | SynchronizePositions (Dict String SyncPosition)
    | SynchronizeSize String Size


restoreSaveInModel : Model -> SaveFile -> Model
restoreSaveInModel model saveFile =
    let
        maybeCoordinatesTransform : Maybe CoordinatesTransform
        maybeCoordinatesTransform =
            CoordinatesTransform.fromList saveFile.coordinatesTransform

        savedSelectedHullReference =
            saveFile.selectedHullReference

        savedHull =
            saveFile.hulls

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
            initModel
                { buildSHA = model.build
                , hullsJSON = Encode.encode 0 <| EncodersDecoders.dictEncoder model.slices
                }
    in
    case maybeCoordinatesTransform of
        Just savedCoordinatesTransform ->
            { cleanModel
              -- resets focused block and selections
                | currentDate = model.currentDate
                , selectedHullReference = savedSelectedHullReference
                , slices = savedHull
                , blocks = savedBlocks
                , coordinatesTransform = savedCoordinatesTransform
                , partitions = partitions
                , tags = tags
                , customProperties = customProperties
            }

        Nothing ->
            model


fromList : List ( comparable, v ) -> DictList comparable v
fromList l =
    let
        append : ( comparable, v ) -> DictList comparable v -> DictList comparable v
        append ( key, value ) dict =
            DictList.insert key value dict
    in
    List.foldr append DictList.empty l


listOfBlocksToBlocks : List Block -> Blocks
listOfBlocksToBlocks blockList =
    fromList <| List.map (\block -> ( block.uuid, block )) blockList


restoreSaveCmd : Model -> JsData
restoreSaveCmd model =
    { tag = "restore-save", data = encodeRestoreSaveCmd model }


encodeRestoreSaveCmd : Model -> Encode.Value
encodeRestoreSaveCmd model =
    let
        currentHullSlices =
            case model.selectedHullReference of
                Nothing ->
                    Encode.string ""

                Just hullName ->
                    case Dict.get hullName model.slices of
                        Nothing ->
                            Encode.string ""

                        Just hullSlices ->
                            applyCustomPropertiesToHullSlices hullSlices
                                |> EncodersDecoders.encoderWithSelectedSlice
                                    model.uiState.selectedSlice.value
                                    model.uiState.showSelectedSlice
    in
    Encode.object
        [ ( "viewMode", encodeViewMode model.viewMode )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "hull", currentHullSlices )
        , ( "blocks", encodeBlocks model.blocks )
        , ( "showingPartitions", Encode.bool model.partitions.showing )
        , ( "decks", encodeComputedPartitions <| computeDecks model.partitions.decks )
        , ( "bulkheads", encodeComputedPartitions <| computeBulkheads model.partitions.bulkheads )
        ]


encodeToggleBlocksVisibilityCmd : List Block -> Bool -> Encode.Value
encodeToggleBlocksVisibilityCmd blocks visible =
    Encode.object
        [ ( "visible", Encode.bool visible )
        , ( "uuids", Encode.list (Encode.string << .uuid) blocks )
        ]


renameKey : Model -> String -> String
renameKey model key =
    let
        findSingleKey : String -> String
        findSingleKey originalKey =
            if not <| Dict.member originalKey model.slices then
                originalKey

            else
                findSingleKey (originalKey ++ " - bis")
    in
    findSingleKey key


insertIfUnique : String -> HullSlices -> Dict String HullSlices -> Dict String HullSlices -> Dict String HullSlices
insertIfUnique key value dict =
    let
        listSHAInDict : List String
        listSHAInDict =
            List.map EncodersDecoders.getHashImageForSlices <| Dict.values dict

        valueSHA : String
        valueSHA =
            EncodersDecoders.getHashImageForSlices value
    in
    if List.member valueSHA listSHAInDict then
        identity

    else
        Dict.insert key value


importHullsLibraryiInModel : Model -> SaveFile -> Model
importHullsLibraryiInModel model saveFile =
    let
        importedHullsLibrary : Dict String HullSlices
        importedHullsLibrary =
            Dict.map (\_ val -> HullSliceModifiers.resetSlicesToOriginals val) saveFile.hulls

        insertBothWithoutColision : String -> HullSlices -> HullSlices -> Dict String HullSlices -> Dict String HullSlices
        insertBothWithoutColision key a b =
            Dict.insert key a << insertIfUnique (renameKey model key) b model.slices

        updatedSlices : Dict ShipName HullSlices.HullSlices
        updatedSlices =
            let
                ifHullOnlyInModel =
                    Dict.insert

                ifHullInModelAndInSavedFile =
                    insertBothWithoutColision

                ifHullOnlyInSavedFile key value =
                    insertIfUnique key value model.slices
            in
            Dict.merge
                ifHullOnlyInModel
                ifHullInModelAndInSavedFile
                ifHullOnlyInSavedFile
                model.slices
                importedHullsLibrary
                Dict.empty
    in
    { model | slices = updatedSlices }



-- MODEL


type alias ShipName =
    String


type alias Model =
    { build : String
    , currentDate : Time.Posix
    , viewMode : ViewMode
    , viewports : Viewports
    , coordinatesTransform : CoordinatesTransform
    , selectedBlocks : List String
    , multipleSelect : Bool
    , selectedHullReference : Maybe String
    , blocks : Blocks
    , globalCenterOfGravity : Point
    , toasts : Toasts
    , partitions : PartitionsData
    , uiState : UiState
    , tags : Tags
    , customProperties : List CustomProperty
    , slices : Dict ShipName HullSlices.HullSlices
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
    Decode.succeed Tag
        |> Pipeline.required "label" Decode.string
        |> Pipeline.required "color" (Decode.map getColorFromName Decode.string)


type alias UiState =
    { accordions : Dict String Bool
    , blockContextualMenu : Maybe String
    , selectedSlice : StringValueInput.IntInput
    , showSelectedSlice : Bool
    }


type alias Block =
    { uuid : String
    , label : String
    , color : Color
    , position : Position
    , size : Size
    , referenceForMass : ReferenceForMass
    , mass : StringValueInput.FloatInput
    , density : StringValueInput.FloatInput
    , visible : Bool
    , centerOfGravity : CenterOfGravity
    , centerOfGravityFixed : Bool
    }


emptyBlock : Block
emptyBlock =
    let
        emptyFloat : StringValueInput.FloatInput
        emptyFloat =
            StringValueInput.emptyFloat 1
    in
    { uuid = ""
    , label = ""
    , color = Color.red
    , position =
        { x = { emptyFloat | description = "x" }
        , y = { emptyFloat | description = "y" }
        , z = { emptyFloat | description = "z" }
        }
    , size = { length = StringValueInput.emptyFloat 1, width = StringValueInput.emptyFloat 1, height = StringValueInput.emptyFloat 1 }
    , referenceForMass = None
    , mass = StringValueInput.emptyFloat 1
    , density = StringValueInput.emptyFloat 1
    , visible = False
    , centerOfGravity = { x = StringValueInput.emptyFloat 1, y = StringValueInput.emptyFloat 1, z = StringValueInput.emptyFloat 1 }
    , centerOfGravityFixed = False
    }


referenceForMassToString : ReferenceForMass -> String
referenceForMassToString referenceForMass =
    case referenceForMass of
        None ->
            "None"

        Mass ->
            "Mass"

        Density ->
            "Density"


initBlock : String -> String -> Color -> Position -> Size -> Block
initBlock uuid label color position size =
    { uuid = uuid
    , label = label
    , color = color
    , position = position
    , size = size
    , referenceForMass = None
    , mass = StringValueInput.emptyFloat 1
    , density = StringValueInput.emptyFloat 1
    , visible = True
    , centerOfGravity =
        { x = StringValueInput.fromNumber "m" "x" 1 <| size.length.value / 2
        , y = StringValueInput.fromNumber "m" "y" 1 <| size.width.value / 2
        , z = StringValueInput.fromNumber "m" "z" 1 <| size.height.value / 2
        }
    , centerOfGravityFixed = False
    }


type alias CenterOfGravity =
    Position


cogToPoint : CenterOfGravity -> Point
cogToPoint p =
    { x = p.x.value
    , y = p.y.value
    , z = p.z.value
    }


getAbsoluteCenterOfVolume : Block -> Point
getAbsoluteCenterOfVolume block =
    { x = StringValueInput.round_n 2 <| block.position.x.value + 0.5 * block.size.length.value
    , y = StringValueInput.round_n 2 <| block.position.y.value + 0.5 * block.size.width.value
    , z = StringValueInput.round_n 2 <| block.position.z.value - 0.5 * block.size.height.value
    }


getRelativeCenterOfVolume : Block -> Point
getRelativeCenterOfVolume block =
    { x = StringValueInput.round_n 2 <| 0.5 * block.size.length.value
    , y = StringValueInput.round_n 2 <| 0.5 * block.size.width.value
    , z = StringValueInput.round_n 2 <| 0.5 * block.size.height.value
    }


getCenterOfGravity : Block -> Point
getCenterOfGravity block =
    cogToPoint block.centerOfGravity


getAbsoluteCenterOfGravity : Block -> Point
getAbsoluteCenterOfGravity block =
    { x = block.position.x.value + block.centerOfGravity.x.value
    , y = block.position.y.value + block.centerOfGravity.y.value
    , z = block.position.z.value - block.centerOfGravity.z.value
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
    { x : StringValueInput.FloatInput
    , y : StringValueInput.FloatInput
    , z : StringValueInput.FloatInput
    }


initPosition : Position
initPosition =
    { x = StringValueInput.fromNumber "m" "x" 1 5
    , y = StringValueInput.fromNumber "m" "y" 1 2.5
    , z = StringValueInput.fromNumber "m" "z" 1 2.5
    }


type alias Size =
    { length : StringValueInput.FloatInput
    , width : StringValueInput.FloatInput
    , height : StringValueInput.FloatInput
    }


type alias Blocks =
    DictList String Block


type alias KpiSummary =
    { target : KpiTarget
    , volume : Float
    , mass : Float
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
    { number : StringValueInput.IntInput
    , spacing : StringValueInput.FloatInput
    , zero : PartitionZero
    , spacingExceptions : Dict Int StringValueInput.FloatInput
    }


type alias PartitionZero =
    { -- the index of the partition n° 0
      index : Int
    , position : StringValueInput.FloatInput
    }


type alias Bulkheads =
    { number : StringValueInput.IntInput
    , spacing : StringValueInput.FloatInput
    , zero : PartitionZero
    , spacingExceptions : Dict Int StringValueInput.FloatInput
    }


asSpacingExceptionsInPartition : { a | spacingExceptions : Dict Int StringValueInput.FloatInput } -> Dict Int StringValueInput.FloatInput -> { a | spacingExceptions : Dict Int StringValueInput.FloatInput }
asSpacingExceptionsInPartition partition newSpacingExceptions =
    { partition | spacingExceptions = newSpacingExceptions }


asNumberInPartition : { a | number : StringValueInput.IntInput } -> StringValueInput.IntInput -> { a | number : StringValueInput.IntInput }
asNumberInPartition partition newNumber =
    { partition | number = newNumber }


asSpacingInPartition : { a | spacing : StringValueInput.FloatInput } -> StringValueInput.FloatInput -> { a | spacing : StringValueInput.FloatInput }
asSpacingInPartition partition newSpacing =
    { partition | spacing = newSpacing }


asIndexInPartitionZero : { a | index : Int } -> Int -> { a | index : Int }
asIndexInPartitionZero zero newIndex =
    { zero | index = newIndex }


asPositionInPartitionZero : { a | position : StringValueInput.FloatInput } -> StringValueInput.FloatInput -> { a | position : StringValueInput.FloatInput }
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
    Encode.list encodeBlock blocks


encodeBlocks : Blocks -> Encode.Value
encodeBlocks blocks =
    encodeListBlocks (toList blocks)


encodeModelForSave : Model -> Encode.Value
encodeModelForSave model =
    Encode.object
        [ ( "version", Encode.int 2 )
        , ( "selectedHullReference", encodeselectedHullReference model )
        , ( "hulls", EncodersDecoders.dictEncoder model.slices )
        , ( "blocks", encodeBlocks model.blocks )
        , ( "coordinatesTransform", CoordinatesTransform.encode model.coordinatesTransform )
        , ( "partitions", encodePartitions model.partitions )
        , ( "tags", encodeTags model.tags )
        , ( "customProperties", encodeCustomProperties model.customProperties )
        ]


encodeselectedHullReference : Model -> Encode.Value
encodeselectedHullReference model =
    case model.selectedHullReference of
        Just hullName ->
            Encode.string hullName

        Nothing ->
            Encode.string ""


encodeCustomProperties : List CustomProperty -> Encode.Value
encodeCustomProperties customProperties =
    Encode.list encodeCustomProperty customProperties


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
        , ( "referenceForMass", Encode.string <| referenceForMassToString block.referenceForMass )
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


encodePoint : Point -> Encode.Value
encodePoint point =
    Encode.object
        [ ( "x", Encode.float point.x )
        , ( "y", Encode.float point.y )
        , ( "z", Encode.float point.z )
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
                |> List.map (\( index, input ) -> ( String.fromInt index, Encode.float input.value ))
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
                |> List.map (\( index, input ) -> ( String.fromInt index, Encode.float input.value ))
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
    Encode.list encodeTag tags


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
    Encode.list encodeComputedPartition computedPartitions


computeDecks : Decks -> List ComputedPartition
computeDecks decks =
    let
        initialDeckList : List ComputedPartition
        initialDeckList =
            List.repeat decks.number.value { index = 0, position = 0.0, number = 0 }

        computeDeck : Int -> ComputedPartition -> ComputedPartition
        computeDeck index _ =
            let
                number : Int
                number =
                    index - decks.zero.index
            in
            { index = index, position = decks.zero.position.value - 1 * getPartitionOffset decks index, number = number }
    in
    List.indexedMap computeDeck initialDeckList


getPartitionOffset : { a | number : StringValueInput.IntInput, spacing : StringValueInput.FloatInput, zero : PartitionZero, spacingExceptions : Dict Int StringValueInput.FloatInput } -> Int -> Float
getPartitionOffset partitionSummary index =
    let
        number : Int
        number =
            index - partitionSummary.zero.index

        exceptionsToAccountFor : Int -> Int -> Dict Int StringValueInput.FloatInput
        exceptionsToAccountFor minKey maxKey =
            Dict.filter (\key _ -> key < (maxKey + partitionSummary.zero.index) && key >= (minKey + partitionSummary.zero.index)) partitionSummary.spacingExceptions

        total : Dict Int StringValueInput.FloatInput -> Float
        total exceptions_ =
            Dict.foldl (\_ value currentTotal -> currentTotal + value.value) 0.0 exceptions_

        exceptions : Dict Int StringValueInput.FloatInput
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
        computeBulkhead index _ =
            let
                number : Int
                number =
                    index - bulkheads.zero.index
            in
            { index = index, position = bulkheads.zero.position.value + getPartitionOffset bulkheads index, number = number }
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
    DictList.filter emptyBlock (\_ block -> block.color == color) blocks


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
        , Task.perform (NoJs << SetCurrentDate) Time.now
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
            Hull HullLibrary
    in
    { build = flag.buildSHA
    , currentDate = Time.millisToPosix 0
    , viewMode = viewMode
    , viewports = viewports
    , coordinatesTransform = CoordinatesTransform.default
    , selectedBlocks = []
    , multipleSelect = False
    , selectedHullReference = Nothing
    , blocks = DictList.empty
    , globalCenterOfGravity = { x = 0, y = 0, z = 0 }
    , toasts = emptyToasts
    , partitions = initPartitions
    , uiState =
        { accordions = Dict.empty
        , blockContextualMenu = Nothing
        , selectedSlice = StringValueInput.fromInt "slice number" 1
        , showSelectedSlice = False
        }
    , tags = []
    , customProperties = []
    , slices =
        let
            cuts =
                case Decode.decodeString EncodersDecoders.dictDecoder flag.hullsJSON of
                    Ok c ->
                        c

                    Err _ ->
                        Dict.empty
        in
        cuts
    }


initPartitions : PartitionsData
initPartitions =
    { decks =
        { number = StringValueInput.emptyInt
        , spacing = StringValueInput.fromNumber "m" "Spacing" 1 3.0
        , zero =
            { index = 0
            , position = StringValueInput.emptyFloat 1
            }
        , spacingExceptions = Dict.empty
        }
    , bulkheads =
        { number = StringValueInput.emptyInt
        , spacing = StringValueInput.fromNumber "m" "Spacing" 1 5
        , zero =
            { index = 0
            , position = StringValueInput.fromNumber "m" "Position of bulckhead zero" 1 0
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
    | Hull HullView
    | Partitioning PartitioningView
    | KpiStudio


type HullView
    = HullLibrary
    | HullDetails


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

            Hull _ ->
                "library"

            Partitioning _ ->
                "partition"

            KpiStudio ->
                "kpi"


encodeColor : Color -> Encode.Value
encodeColor color =
    let
        rgb : { red : Float, green : Float, blue : Float, alpha : Float }
        rgb =
            Color.toRgba color
    in
    Encode.object
        [ ( "red", Encode.float rgb.red )
        , ( "green", Encode.float rgb.green )
        , ( "blue", Encode.float rgb.blue )
        , ( "alpha", Encode.float rgb.alpha )
        ]



-- UPDATE


encodeAddBlockCommand : String -> Encode.Value
encodeAddBlockCommand label =
    Encode.object
        [ ( "label", Encode.string label )
        , ( "color", encodeColor SIRColorPicker.indigo )
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


encodeSTL : String -> HullSlices -> Encode.Value
encodeSTL name hullSlices =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "data", EncodersDecoders.encoder hullSlices )
        ]


updateBlockInModel : Block -> { a | blocks : Blocks } -> { a | blocks : Blocks }
updateBlockInModel block model =
    { model | blocks = updateBlockInBlocks block model.blocks }


asAxisInPosition : Axis -> (Position -> StringValueInput.FloatInput -> Position)
asAxisInPosition axis =
    case axis of
        X ->
            asXInPosition

        Y ->
            asYInPosition

        Z ->
            asZInPosition


asXInPosition : Position -> StringValueInput.FloatInput -> Position
asXInPosition position x =
    { position | x = x }


asYInPosition : Position -> StringValueInput.FloatInput -> Position
asYInPosition position y =
    { position | y = y }


asZInPosition : Position -> StringValueInput.FloatInput -> Position
asZInPosition position z =
    { position | z = z }


asPositionInBlock : Block -> Position -> Block
asPositionInBlock block position =
    { block | position = position }


asWidthInSize : Size -> StringValueInput.FloatInput -> Size
asWidthInSize size width =
    { size | width = width }


asDimensionInSize : Dimension -> Size -> StringValueInput.FloatInput -> Size
asDimensionInSize dimension =
    case dimension of
        Length ->
            asLengthInSize

        Width ->
            asWidthInSize

        Height ->
            asHeightInSize


asHeightInSize : Size -> StringValueInput.FloatInput -> Size
asHeightInSize size height =
    { size | height = height }


asLengthInSize : Size -> StringValueInput.FloatInput -> Size
asLengthInSize size length =
    { size | length = length }


asSizeInBlock : Block -> Size -> Block
asSizeInBlock block size =
    { block | size = size }


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
            { block | density = StringValueInput.fromNumber "kg" "Mass" 1 <| block.mass.value / computeVolume block }

        Density ->
            { block | mass = StringValueInput.fromNumber "kg/m^3" "Density" 1 <| block.density.value * computeVolume block }


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
        { x = block.position.x.value + block.size.length.value
        , y = block.position.y.value + block.size.width.value
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
                    if a.min.x < b.min.x then
                        a.min.x

                    else
                        b.min.x
                , y =
                    if a.min.y < b.min.y then
                        a.min.y

                    else
                        b.min.y
                , z =
                    if a.min.z > b.min.z then
                        a.min.z

                    else
                        b.min.z
                }
            , max =
                { x =
                    if a.max.x > b.max.x then
                        a.max.x

                    else
                        b.max.x
                , y =
                    if a.max.y > b.max.y then
                        a.max.y

                    else
                        b.max.y
                , z =
                    if a.max.z < b.max.z then
                        a.max.z

                    else
                        b.max.z
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


updateCentreOfGravity : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
updateCentreOfGravity ( model, cmd ) =
    let
        ( updatedModel, cmdUpdateCog ) =
            updateToJs UpdateGlobalCenterOfGravity model
    in
    ( updatedModel, Cmd.batch [ cmd, cmdUpdateCog ] )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    (case msg of
        FromJs fromJsMsg ->
            updateFromJs fromJsMsg model

        NoJs noJsMsg ->
            updateNoJs noJsMsg model

        ToJs toJsMsg ->
            updateToJs toJsMsg model
    )
        |> updateCentreOfGravity


type ToJsMsg
    = AddBlock String
    | ChangeBlockColor Block Color
    | OpenSaveFile
    | OpenHullsLibrary
    | RemoveBlock Block
    | RemoveBlocks (List Block)
    | SelectBlock Block
    | SelectHullReference String
    | SelectSlice String Int String
    | ToggleSlicesDetails Bool String
    | RemoveHull String
    | SetSpacingException PartitionType Int String
    | ModifySlice (String -> HullSlices -> HullSlices) String String
    | ResetSlice String
    | SwitchViewMode ViewMode
    | ToggleBlocksVisibility (List Block) Bool
    | TogglePartitions
    | UnselectHullReference
    | UpdatePartitionNumber PartitionType String
    | UpdatePartitionSpacing PartitionType String
    | UpdatePartitionZeroPosition PartitionType String
    | UpdatePosition Axis Block String
    | UpdateDimension Dimension Block String
    | UpdateGlobalCenterOfGravity
    | ExportCSV String
    | ExportSTL String
    | ExportSubModel String


type NoJsMsg
    = AddCustomProperty String
    | CleanTags
    | DeleteCustomProperty CustomProperty
    | DismissToast String
    | DisplayToast Toast
    | LockCenterOfGravityToCenterOfVolume Block
    | MoveBlockDown Block
    | MoveBlockUp Block
    | NoOp
    | RenameBlock Block String
    | RenameHull String String
    | SaveAsNewHull String
    | SetBlockContextualMenu String
    | UnsetBlockContextualMenu
    | SetCurrentDate Time.Posix
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
                    "custom-property-" ++ (String.fromInt <| List.length updatedCustomProperties)
            in
            ( { model | customProperties = updatedCustomProperties }, Cmd.batch [ Task.attempt (\_ -> NoJs NoOp) (Browser.Dom.focus newCustomPropertyId) ] )

        CleanTags ->
            ( { model | tags = List.filter ((/=) 0 << String.length << .label) model.tags }, Cmd.none )

        DeleteCustomProperty property ->
            ( { model | customProperties = List.filter ((/=) property) model.customProperties }, Cmd.none )

        DismissToast keyToDismiss ->
            ( { model | toasts = removeToast keyToDismiss model.toasts }, Cmd.none )

        DisplayToast toast ->
            ( { model | toasts = addToast toast model.toasts }, Cmd.none )

        LockCenterOfGravityToCenterOfVolume block ->
            let
                updatedBlock : Block
                updatedBlock =
                    updateBlockCenterOfGravity block

                updatedBlockUnfixed =
                    { updatedBlock
                        | centerOfGravityFixed = False
                    }
            in
            ( { model | blocks = updateBlockInBlocks updatedBlockUnfixed model.blocks }, Cmd.none )

        MoveBlockDown block ->
            let
                maybeNext : Maybe ( String, Block )
                maybeNext =
                    DictList.next block.uuid model.blocks

                updatedBlocks : Blocks
                updatedBlocks =
                    Maybe.withDefault model.blocks <| Maybe.map (\next -> DictList.insertAfter (Tuple.first next) block.uuid block model.blocks) maybeNext
            in
            ( { model | blocks = updatedBlocks }, Cmd.none )

        MoveBlockUp block ->
            let
                maybePrevious : Maybe ( String, Block )
                maybePrevious =
                    DictList.previous block.uuid model.blocks

                updatedBlocks : Blocks
                updatedBlocks =
                    Maybe.withDefault model.blocks <| Maybe.map (\previous -> DictList.insertBefore (Tuple.first previous) block.uuid block model.blocks) maybePrevious
            in
            ( { model | blocks = updatedBlocks }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )

        SetBlockContextualMenu uuid ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | blockContextualMenu = Just uuid }
            in
            ( { model | uiState = newUiState }, Cmd.none )

        SetCurrentDate date ->
            ( { model | currentDate = date }, Cmd.none )

        SetMultipleSelect boolean ->
            ( { model | multipleSelect = boolean }, Cmd.none )

        SetTagForColor color label ->
            let
                sirColor : Maybe SIRColorPicker.SirColor
                sirColor =
                    SIRColorPicker.fromColor color

                newTags : Tags
                newTags =
                    model.tags
                        |> List.filter ((/=) color << SIRColorPicker.getColor << .color)
                        |> (if sirColor /= Nothing then
                                (::) { color = Maybe.withDefault SIRColorPicker.Black sirColor, label = label }

                            else
                                List.map identity
                           )
            in
            ( { model | tags = newTags }, Cmd.none )

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
            ( { model | customProperties = List.map replaceProperty model.customProperties }, Cmd.none )

        SyncBlockInputs block ->
            let
                syncedSize : Size
                syncedSize =
                    { length = StringValueInput.syncFloatInput block.size.length
                    , width = StringValueInput.syncFloatInput block.size.width
                    , height = StringValueInput.syncFloatInput block.size.height
                    }

                syncedPosition : Position
                syncedPosition =
                    { x = StringValueInput.syncFloatInput block.position.x
                    , y = StringValueInput.syncFloatInput block.position.y
                    , z = StringValueInput.syncFloatInput block.position.z
                    }

                syncedMass : StringValueInput.FloatInput
                syncedMass =
                    StringValueInput.syncFloatInput block.mass

                syncedDensity : StringValueInput.FloatInput
                syncedDensity =
                    StringValueInput.syncFloatInput block.density

                syncedCenterOfGravity : CenterOfGravity
                syncedCenterOfGravity =
                    { x = StringValueInput.syncFloatInput block.centerOfGravity.x
                    , y = StringValueInput.syncFloatInput block.centerOfGravity.y
                    , z = StringValueInput.syncFloatInput block.centerOfGravity.z
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
            ( { model | blocks = updateBlockInBlocks syncedBlock model.blocks }, Cmd.none )

        SyncPartitions ->
            let
                syncedDecks : Decks
                syncedDecks =
                    { number =
                        StringValueInput.syncIntInput model.partitions.decks.number
                    , spacing =
                        StringValueInput.syncFloatInput model.partitions.decks.spacing
                    , zero =
                        { index = model.partitions.decks.zero.index
                        , position = StringValueInput.syncFloatInput model.partitions.decks.zero.position
                        }
                    , spacingExceptions =
                        -- we want to remove useless exceptions => those equal to the default value
                        Dict.map (\_ input -> StringValueInput.syncFloatInput input) model.partitions.decks.spacingExceptions
                            |> Dict.filter (\_ input -> input.value /= model.partitions.decks.spacing.value)
                    }

                syncedBulkheads : Bulkheads
                syncedBulkheads =
                    { number =
                        StringValueInput.syncIntInput model.partitions.bulkheads.number
                    , spacing =
                        StringValueInput.syncFloatInput model.partitions.bulkheads.spacing
                    , zero =
                        { index = model.partitions.bulkheads.zero.index
                        , position = StringValueInput.syncFloatInput model.partitions.bulkheads.zero.position
                        }
                    , spacingExceptions =
                        Dict.map (\_ input -> StringValueInput.syncFloatInput input) model.partitions.bulkheads.spacingExceptions
                            |> Dict.filter (\_ input -> input.value /= model.partitions.bulkheads.spacing.value)
                    }

                updatedModel : Model
                updatedModel =
                    syncedDecks
                        |> asDecksInPartitions model.partitions
                        |> flip asBulkheadsInPartitions syncedBulkheads
                        |> asPartitionsInModel model
            in
            ( updatedModel, Cmd.none )

        RenameBlock blockToRename newLabel ->
            ( updateBlockInModel (renameBlock newLabel blockToRename) model, Cmd.none )

        RenameHull hullReference newLabel ->
            let
                refToFocus : String
                refToFocus =
                    if not <| Dict.member newLabel model.slices then
                        newLabel

                    else
                        hullReference

                updatedModel : Model
                updatedModel =
                    case Dict.get hullReference model.slices of
                        Just hullSlicesForRef ->
                            if not <| Dict.member newLabel model.slices then
                                { model
                                    | slices = Dict.insert newLabel hullSlicesForRef <| Dict.remove hullReference model.slices
                                    , selectedHullReference = Just newLabel
                                }

                            else
                                model

                        Nothing ->
                            model
            in
            ( updatedModel, Cmd.batch [ Task.attempt (\_ -> NoJs NoOp) (Browser.Dom.focus refToFocus) ] )

        SaveAsNewHull hullReference ->
            let
                newLabel : String
                newLabel =
                    renameKey model hullReference

                updatedModel : Model
                updatedModel =
                    case Dict.get hullReference model.slices of
                        Just hullSlicesForRef ->
                            if not <| Dict.member newLabel model.slices then
                                { model
                                    | slices = model.slices |> insertIfUnique newLabel (applyCustomPropertiesToHullSlices hullSlicesForRef) model.slices
                                    , selectedHullReference = Just newLabel
                                }

                            else
                                model

                        Nothing ->
                            model
            in
            ( updatedModel, Cmd.batch [ Task.attempt (\_ -> NoJs NoOp) (Browser.Dom.focus newLabel) ] )

        ToggleAccordion isOpen accordionId ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | accordions = Dict.insert accordionId isOpen uiState.accordions }
            in
            ( { model | uiState = newUiState }, Cmd.none )

        UpdateCenterOfGravity axis block input ->
            let
                position =
                    block.centerOfGravity

                axisFloatInput : StringValueInput.FloatInput
                axisFloatInput =
                    position |> axisAccessor axis

                updatedBlock : Block
                updatedBlock =
                    { block
                        | centerOfGravity =
                            (case String.toFloat input of
                                Just value ->
                                    value
                                        |> StringValueInput.asValueIn axisFloatInput
                                        |> flip StringValueInput.asStringIn input

                                Nothing ->
                                    input
                                        |> StringValueInput.asStringIn axisFloatInput
                            )
                                |> asAxisInPosition axis position
                    }

                updatedBlockFixed =
                    { updatedBlock
                        | centerOfGravityFixed = True
                    }
            in
            ( updateBlockInModel updatedBlockFixed model, Cmd.none )

        UpdateCustomPropertyLabel property newLabel ->
            ( { model
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
            , Cmd.none
            )

        UpdateMass block input ->
            let
                updatedBlock : Block
                updatedBlock =
                    { block
                        | mass = StringValueInput.setString input block.mass
                        , referenceForMass = Mass
                    }
                        |> updateBlockMassAndDensity

                updatedModel =
                    { model | blocks = updateBlockInBlocks updatedBlock model.blocks }
            in
            ( updatedModel, Cmd.none )

        UpdateDensity block input ->
            let
                updatedBlock : Block
                updatedBlock =
                    { block
                        | density = StringValueInput.setString (String.filter ((/=) '-') input) block.density
                        , referenceForMass = Density
                    }
                        |> updateBlockMassAndDensity

                updatedModel =
                    { model | blocks = updateBlockInBlocks updatedBlock model.blocks }
            in
            ( updatedModel, Cmd.none )

        UnsetBlockContextualMenu ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState | blockContextualMenu = Nothing }
            in
            ( { model | uiState = newUiState }, Cmd.none )


updateToJs : ToJsMsg -> Model -> ( Model, Cmd Msg )
updateToJs msg model =
    let
        updatedModel =
            updateModelToJs msg model
    in
    ( updatedModel, sendCmdToJs updatedModel msg )


updateFromJs : FromJsMsg -> Model -> ( Model, Cmd Msg )
updateFromJs jsmsg model =
    case jsmsg of
        AddToSelection uuid ->
            ( { model | selectedBlocks = model.selectedBlocks ++ [ uuid ] }, Cmd.none )

        RemoveFromSelection uuid ->
            ( { model | selectedBlocks = List.filter ((/=) uuid) model.selectedBlocks }, Cmd.none )

        NewBlock block ->
            let
                blocks : Blocks
                blocks =
                    addBlockTo model.blocks <| updateBlockCenterOfGravity block
            in
            ( { model | blocks = blocks }, Cmd.batch [ Task.attempt (\_ -> NoJs NoOp) (Browser.Dom.focus block.uuid) ] )

        RestoreSave saveFile ->
            let
                newModel : Model
                newModel =
                    restoreSaveInModel model saveFile
            in
            ( newModel, Cmd.batch [ toJs <| restoreSaveCmd newModel ] )

        ImportHullsLibrary saveFile ->
            let
                newModel : Model
                newModel =
                    importHullsLibraryiInModel model saveFile
            in
            ( newModel, Cmd.none )

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
            ( { model | selectedBlocks = [ uuid ], viewMode = updatedViewMode }, Cmd.none )

        SelectPartition partitionType index position ->
            if model.viewMode == (Partitioning <| OriginDefinition partitionType) then
                let
                    ( partition, updatePartition ) =
                        case partitionType of
                            Deck ->
                                ( .partitions >> .decks, asDecksInPartitions model.partitions )

                            Bulkhead ->
                                ( .partitions >> .bulkheads, asBulkheadsInPartitions model.partitions )

                    ( tag, computePartition ) =
                        case partitionType of
                            Deck ->
                                ( "make-decks", computeDecks )

                            Bulkhead ->
                                ( "make-bulkheads", computeBulkheads )

                    updatedModel : Model
                    updatedModel =
                        if index < (.value <| .number (partition model)) && index >= 0 then
                            { model
                                | partitions =
                                    updatePartition <|
                                        asZeroInPartition (partition model) <|
                                            flip asPositionInPartitionZero (StringValueInput.fromNumber "m" "Position" 1 position) <|
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
                ( updatedModel, jsCmd )

            else
                ( model, Cmd.none )

        Unselect ->
            ( { model | selectedBlocks = [] }
            , Cmd.none
            )

        SynchronizePosition uuid position ->
            ( case getBlockByUUID uuid model.blocks of
                Just block ->
                    position
                        |> asPositionInBlock block
                        |> flip updateBlockInModel model

                Nothing ->
                    model
            , Cmd.none
            )

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
            ( { model | blocks = updatedBlocks }, Cmd.none )

        SynchronizeSize uuid size ->
            ( case getBlockByUUID uuid model.blocks of
                Just block ->
                    let
                        updatedBlock : Block
                        updatedBlock =
                            size
                                |> asSizeInBlock block
                                |> updateBlockMassAndDensity

                        newCenterOfVolume : Point
                        newCenterOfVolume =
                            if block.centerOfGravityFixed == False then
                                getRelativeCenterOfVolume updatedBlock

                            else
                                getCenterOfGravity updatedBlock

                        updatedBlockWithCog : Block
                        updatedBlockWithCog =
                            { updatedBlock
                                | centerOfGravity =
                                    { x = StringValueInput.fromNumber "m" "x" 1 newCenterOfVolume.x
                                    , y = StringValueInput.fromNumber "m" "y" 1 newCenterOfVolume.y
                                    , z = StringValueInput.fromNumber "m" "z" 1 newCenterOfVolume.z
                                    }
                            }
                    in
                    updateBlockInModel updatedBlockWithCog model

                Nothing ->
                    model
            , Cmd.none
            )

        JSError _ ->
            ( model, Cmd.none )


updateModelToJs : ToJsMsg -> Model -> Model
updateModelToJs msg model =
    case msg of
        ExportCSV _ ->
            model

        ExportSTL _ ->
            model

        ExportSubModel _ ->
            model

        OpenSaveFile ->
            model

        OpenHullsLibrary ->
            model

        ChangeBlockColor block newColor ->
            case getBlockByUUID block.uuid model.blocks of
                Just _ ->
                    let
                        updatedBlock : Block
                        updatedBlock =
                            { block | color = newColor }
                    in
                    updateBlockInModel updatedBlock model

                Nothing ->
                    model

        AddBlock _ ->
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
            { model | selectedHullReference = Just hullReference }

        SelectSlice hullReference maxSelector inputValue ->
            let
                olduiState =
                    model.uiState

                updateUiState : Int -> UiState
                updateUiState newValue =
                    { olduiState | selectedSlice = StringValueInput.asIntIn olduiState.selectedSlice newValue }
            in
            case String.toInt inputValue of
                Nothing ->
                    model

                Just int ->
                    case int == 0 || int > maxSelector of
                        True ->
                            model

                        False ->
                            { model | uiState = updateUiState int }

        ToggleSlicesDetails isOpen _ ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState
                        | accordions = Dict.insert "hull-slices-details" isOpen uiState.accordions
                        , selectedSlice = StringValueInput.asIntIn uiState.selectedSlice 1
                        , showSelectedSlice = isOpen
                    }
            in
            { model | uiState = newUiState }

        RemoveHull hullReference ->
            { model | selectedHullReference = Nothing, slices = Dict.remove hullReference model.slices }

        UnselectHullReference ->
            { model | selectedHullReference = Nothing }

        ModifySlice modifier hullReference newValue ->
            { model | slices = Dict.update hullReference (Maybe.map <| modifier newValue) model.slices }

        ResetSlice hullReference ->
            { model | slices = Dict.update hullReference (Maybe.map <| HullSliceModifiers.resetSlicesToOriginals) model.slices }

        SetSpacingException partitionType index input ->
            let
                ( partition, asPartitionInPartitions ) =
                    case partitionType of
                        Deck ->
                            ( model.partitions.decks, asDecksInPartitions )

                        Bulkhead ->
                            ( model.partitions.bulkheads, asBulkheadsInPartitions )

                previousException : StringValueInput.FloatInput
                previousException =
                    Maybe.withDefault (.spacing partition) <| Dict.get index <| .spacingExceptions partition

                parsedInput : Maybe Float
                parsedInput =
                    if input == "" then
                        -- an empty input should result in the default spacing
                        Just <| .value <| .spacing partition

                    else
                        String.toFloat input
            in
            (case parsedInput of
                Just value ->
                    abs value
                        |> StringValueInput.asValueIn previousException
                        |> flip StringValueInput.asStringIn input

                Nothing ->
                    input
                        |> StringValueInput.asStringIn previousException
            )
                |> (\floatInput -> Dict.insert index floatInput <| .spacingExceptions partition)
                |> asSpacingExceptionsInPartition partition
                |> asPartitionInPartitions model.partitions
                |> asPartitionsInModel model

        SwitchViewMode newViewMode ->
            let
                uiState : UiState
                uiState =
                    model.uiState

                newUiState : UiState
                newUiState =
                    { uiState
                        | accordions = Dict.insert "hull-slices-details" False uiState.accordions
                        , showSelectedSlice = False
                    }
            in
            { model | viewMode = newViewMode, uiState = newUiState }

        ToggleBlocksVisibility blocks isVisible ->
            let
                updateVisibilityIfTargeted : String -> Block -> Block
                updateVisibilityIfTargeted _ block =
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
                Just value ->
                    abs value
                        |> StringValueInput.asValueIn (.number <| getPartition model.partitions)
                        |> flip StringValueInput.asStringIn input

                Nothing ->
                    input
                        |> StringValueInput.asStringIn (.number <| getPartition model.partitions)
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
                Just value ->
                    abs value
                        |> StringValueInput.asValueIn (.spacing <| getPartition model.partitions)
                        |> flip StringValueInput.asStringIn input

                Nothing ->
                    input
                        |> StringValueInput.asStringIn (.spacing <| getPartition model.partitions)
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
                Just value ->
                    value
                        |> StringValueInput.asValueIn (.spacing <| getPartition model.partitions)
                        |> flip StringValueInput.asStringIn input

                Nothing ->
                    input
                        |> StringValueInput.asStringIn (.spacing <| getPartition model.partitions)
            )
                |> asPositionInPartitionZero (.zero <| getPartition model.partitions)
                |> asZeroInPartition (getPartition model.partitions)
                |> asPartitionInPartitions model.partitions
                |> asPartitionsInModel model

        UpdatePosition axis block input ->
            let
                axisFloatInput : StringValueInput.FloatInput
                axisFloatInput =
                    block.position |> axisAccessor axis

                blockInModel : Block
                blockInModel =
                    Maybe.withDefault block <| getBlockByUUID block.uuid model.blocks

                updatedBlock : Block
                updatedBlock =
                    axisFloatInput
                        |> StringValueInput.setString input
                        |> asAxisInPosition axis blockInModel.position
                        |> asPositionInBlock blockInModel
            in
            updateBlockInModel updatedBlock model

        UpdateDimension dimension block input ->
            let
                dimensionFloatInput =
                    block.size |> dimensionAccessor dimension

                blockInModel : Block
                blockInModel =
                    Maybe.withDefault block <| getBlockByUUID block.uuid model.blocks
            in
            case String.toFloat input of
                Just value ->
                    let
                        newValue : Float
                        newValue =
                            if value == 0 then
                                0.1

                            else
                                abs value

                        updatedBlock : Block
                        updatedBlock =
                            newValue
                                |> StringValueInput.asValueIn dimensionFloatInput
                                |> flip StringValueInput.asStringIn input
                                |> asDimensionInSize dimension blockInModel.size
                                |> asSizeInBlock blockInModel
                                |> updateBlockMassAndDensity

                        newCenterOfVolume : Point
                        newCenterOfVolume =
                            if updatedBlock.centerOfGravityFixed == False then
                                getRelativeCenterOfVolume updatedBlock

                            else
                                getCenterOfGravity blockInModel

                        updatedBlockWithCog : Block
                        updatedBlockWithCog =
                            { updatedBlock
                                | centerOfGravity =
                                    { x = StringValueInput.fromNumber "m" "x" 1 newCenterOfVolume.x
                                    , y = StringValueInput.fromNumber "m" "y" 1 newCenterOfVolume.y
                                    , z = StringValueInput.fromNumber "m" "z" 1 newCenterOfVolume.z
                                    }
                            }
                    in
                    updateBlockInModel updatedBlockWithCog model

                Nothing ->
                    input
                        |> StringValueInput.asStringIn dimensionFloatInput
                        |> asDimensionInSize dimension blockInModel.size
                        |> asSizeInBlock blockInModel
                        |> flip updateBlockInModel model

        UpdateGlobalCenterOfGravity ->
            let
                updatedCoG : Point
                updatedCoG =
                    getCentroidOfBlocks model.blocks
            in
            { model | globalCenterOfGravity = updatedCoG }


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
        ExportSTL hullReference ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just { tag = "export-stl", data = encodeSTL hullReference hullSlices }

        ExportSubModel hullReference ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    let
                        zAtDraught_ =
                            hullSlices.zmin + hullSlices.depth.value - hullSlices.draught.value

                        intersectBelowSlicesZY =
                            HullSlicesMetrics.intersectBelow zAtDraught_ <| fillHullSliceMetrics hullSlices
                    in
                    Just { tag = "export-submodel", data = EncodersDecoders.encodeSubModel intersectBelowSlicesZY }

        ExportCSV hullReference ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    let
                        zAtDraught_ =
                            hullSlices.zmin + hullSlices.depth.value - hullSlices.draught.value

                        computedPartitions =
                            computeDecks model.partitions.decks

                        ldecks =
                            List.append (List.map (\u -> u.position) computedPartitions) [ zAtDraught_ ]

                        hullSlicesAsXYList =
                            EncodersDecoders.exportHullSlicesAsAreaXYList
                                { ldecks = ldecks
                                , xmin = hullSlices.xmin
                                , xmax = hullSlices.xmin + hullSlices.length.value
                                , zAtDraught = zAtDraught_
                                }
                                hullSlices
                    in
                    Just
                        { tag = "export-csv"
                        , data = Encode.list EncodersDecoders.hullSliceAsAreaXYListEncoder hullSlicesAsXYList
                        }

        ChangeBlockColor block newColor ->
            Maybe.map
                (\_ ->
                    let
                        updatedBlock =
                            { block | color = newColor }
                    in
                    { tag = "update-color", data = encodeChangeColorCommand updatedBlock }
                )
            <|
                getBlockByUUID block.uuid model.blocks

        AddBlock label ->
            Just { tag = "add-block", data = encodeAddBlockCommand label }

        OpenSaveFile ->
            Just { tag = "read-json-file-open", data = Encode.string "open-save-file" }

        OpenHullsLibrary ->
            Just { tag = "read-json-file-import", data = Encode.string "import-hull-library" }

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
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just
                        { tag = "load-hull"
                        , data =
                            applyCustomPropertiesToHullSlices hullSlices
                                |> EncodersDecoders.encoderWithSelectedSlice
                                    model.uiState.selectedSlice.value
                                    model.uiState.showSelectedSlice
                        }

        SelectSlice hullReference _ _ ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just
                        { tag = "load-hull"
                        , data =
                            applyCustomPropertiesToHullSlices hullSlices
                                |> EncodersDecoders.encoderWithSelectedSlice
                                    model.uiState.selectedSlice.value
                                    model.uiState.showSelectedSlice
                        }

        ToggleSlicesDetails isOpen hullReference ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just
                        { tag = "load-hull"
                        , data =
                            applyCustomPropertiesToHullSlices hullSlices
                                |> EncodersDecoders.encoderWithSelectedSlice
                                    model.uiState.selectedSlice.value
                                    model.uiState.showSelectedSlice
                        }

        RemoveHull hullReference ->
            Just { tag = "unload-hull", data = Encode.null }

        ModifySlice _ hullReference _ ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just
                        { tag = "load-hull"
                        , data =
                            applyCustomPropertiesToHullSlices hullSlices
                                |> EncodersDecoders.encoderWithSelectedSlice
                                    model.uiState.selectedSlice.value
                                    model.uiState.showSelectedSlice
                        }

        ResetSlice hullReference ->
            case Dict.get hullReference model.slices of
                Nothing ->
                    Nothing

                Just hullSlices ->
                    Just
                        { tag = "load-hull"
                        , data =
                            EncodersDecoders.encoderWithSelectedSlice
                                model.uiState.selectedSlice.value
                                model.uiState.showSelectedSlice
                                hullSlices
                        }

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

                previousException : StringValueInput.FloatInput
                previousException =
                    Maybe.withDefault (.spacing partition) <| Dict.get index <| .spacingExceptions partition

                parsedInput : Maybe Float
                parsedInput =
                    if input == "" then
                        -- an empty input should result in the default spacing
                        Just (.value <| .spacing partition)

                    else
                        String.toFloat input
            in
            case parsedInput of
                Just value ->
                    Just
                        { tag = tag
                        , data =
                            abs value
                                |> StringValueInput.asValueIn previousException
                                |> flip StringValueInput.asStringIn input
                                |> (\floatInput -> Dict.insert index floatInput <| .spacingExceptions partition)
                                |> asSpacingExceptionsInPartition partition
                                |> computePartition
                                |> encodeComputedPartitions
                        }

                Nothing ->
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
                Just value ->
                    Just
                        { tag = tag
                        , data =
                            encodeComputedPartitions <|
                                computePartition
                                    { partition | number = StringValueInput.fromInt "Number of partitions" <| abs value }
                        }

                Nothing ->
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
                Just value ->
                    Just
                        { tag = tag
                        , data =
                            encodeComputedPartitions <|
                                computePartition
                                    { partition | spacing = StringValueInput.fromNumber "m" "Spacing" 1 <| abs value }
                        }

                Nothing ->
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
                Just value ->
                    Just
                        { tag = tag
                        , data =
                            encodeComputedPartitions <|
                                computePartition <|
                                    asZeroInPartition partition <|
                                        asPositionInPartitionZero partition.zero <|
                                            StringValueInput.fromNumber "m" "Position of partition zero" 0 value
                        }

                Nothing ->
                    Nothing

        UpdatePosition axis block input ->
            Maybe.map
                (\value ->
                    let
                        axisFloatInput : StringValueInput.FloatInput
                        axisFloatInput =
                            block.position |> axisAccessor axis

                        blockInModel : Block
                        blockInModel =
                            Maybe.withDefault block <| getBlockByUUID block.uuid model.blocks

                        updatedBlock : Block
                        updatedBlock =
                            value
                                |> StringValueInput.asValueIn axisFloatInput
                                |> flip StringValueInput.asStringIn input
                                |> asAxisInPosition axis blockInModel.position
                                |> asPositionInBlock blockInModel
                    in
                    { tag = "update-position", data = encodeUpdatePositionCommand updatedBlock }
                )
            <|
                String.toFloat input

        UpdateDimension dimension block input ->
            Maybe.map
                (\value ->
                    let
                        dimensionFloatInput : StringValueInput.FloatInput
                        dimensionFloatInput =
                            block.size |> dimensionAccessor dimension

                        newValue : Float
                        newValue =
                            if value == 0 then
                                0.1

                            else
                                abs value

                        blockInModel : Block
                        blockInModel =
                            Maybe.withDefault block <| getBlockByUUID block.uuid model.blocks

                        updatedBlock : Block
                        updatedBlock =
                            newValue
                                |> StringValueInput.asValueIn dimensionFloatInput
                                |> flip StringValueInput.asStringIn input
                                |> asDimensionInSize dimension blockInModel.size
                                |> asSizeInBlock blockInModel
                    in
                    { tag = "update-size", data = encodeUpdateSizeCommand updatedBlock }
                )
            <|
                String.toFloat input

        UpdateGlobalCenterOfGravity ->
            let
                updatedCoG =
                    model.globalCenterOfGravity
            in
            Just { tag = "show-center-of-gravity", data = encodePoint updatedCoG }



-- VIEW


type alias Tab =
    { title : String
    , icon : Html Msg
    , viewMode : ViewMode
    }


type alias Tabs =
    List Tab


tabItems : Tabs
tabItems =
    [ { title = "Library", icon = FASolid.ship [], viewMode = Hull HullLibrary }
    , { title = "Partitions", icon = FASolid.bars [], viewMode = Partitioning PropertiesEdition }
    , { title = "Blocks", icon = FARegular.clone [], viewMode = SpaceReservation WholeList }
    , { title = "KPIs", icon = FASolid.tachometerAlt [], viewMode = KpiStudio }
    ]


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
                [ src "assets/NAVAL_GROUP_Logotype_blanc_sur_bleu.png" ]
                []
            , img
                [ src "assets/SIREHNA_R.png" ]
                []
            , img
                [ src "assets/HOLISHIP_LOGO_Transparent_background.png" ]
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
        , viewCopyright
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
                    FASolid.info []

                Success ->
                    FASolid.check []

                Error ->
                    FASolid.exclamationTriangle []

                Processing ->
                    FASolid.spinner []
    in
    li
        [ class <| "toast toast__" ++ toastTypeToString toast.type_
        , onClick <| NoJs <| DismissToast toast.key
        ]
        [ icon
        , p [] [ text toast.message ]
        ]


colorToCssRgbString : Color -> String
colorToCssRgbString color =
    let
        rgb =
            Color.toRgba color
    in
    "rgb(" ++ String.fromFloat rgb.red ++ "," ++ String.fromFloat rgb.green ++ "," ++ String.fromFloat rgb.blue ++ ")"


dateFormatter : Time.Zone -> Time.Posix -> String
dateFormatter =
    DateFormat.format
        [ DateFormat.yearNumber
        , DateFormat.dayOfMonthNumber
        , DateFormat.text "-"
        , DateFormat.hourMilitaryFixed
        , DateFormat.minuteFixed
        ]


getDateForFilename : { a | currentDate : Time.Posix } -> String
getDateForFilename dateSha =
    dateFormatter Time.utc dateSha.currentDate



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
                    ++ (Url.percentEncode <|
                            stringifyEncodeValue <|
                                encodeModelForSave model
                       )
            , download <| getDateForFilename model ++ "_Project_Shipbuilder_" ++ model.build ++ ".json"
            ]
            [ FASolid.download [] ]
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
            [ FASolid.folderOpen [] ]
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

        Hull _ ->
            case right of
                Hull _ ->
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


viewCopyright : Html Msg
viewCopyright =
    p [ class "copyright-info" ] [ text "(c) Naval Group / Sirehna 2019 All rights reserved" ]


viewPanel : Model -> Html Msg
viewPanel model =
    case model.viewMode of
        SpaceReservation spaceReservationView ->
            viewSpaceReservationPanel spaceReservationView model

        Hull hullView ->
            viewHullPanel hullView model

        Partitioning partitioningView ->
            viewPartitioning partitioningView model

        KpiStudio ->
            viewKpiStudio model


viewSpaceReservationPanel : SpaceReservationView -> Model -> Html Msg
viewSpaceReservationPanel spaceReservationView model =
    case spaceReservationView of
        DetailedBlock uuid ->
            viewDetailedBlock uuid model

        WholeList ->
            viewWholeList model


hullReferencesMsgs : HullReferences.HullReferencesMsgs Msg
hullReferencesMsgs =
    { selectHullMsg = ToJs << SelectHullReference
    , unselectHullMsg = ToJs <| UnselectHullReference
    , openLibraryMsg = ToJs <| OpenHullsLibrary
    , renameHullMsg = \s1 s2 -> NoJs <| RenameHull s1 s2
    , removeHullMsg = ToJs << RemoveHull
    , saveAsNewMsg = NoJs << SaveAsNewHull
    , changeViewMsg = ToJs <| SwitchViewMode <| Hull <| HullDetails
    }


viewHullPanel : HullView -> Model -> Html Msg
viewHullPanel hullview model =
    case hullview of
        HullLibrary ->
            viewHullLibraryPanel model

        HullDetails ->
            viewModeller model


viewHullLibraryPanel : Model -> Html Msg
viewHullLibraryPanel model =
    HullReferences.viewHullLibraryPanel
        (Dict.keys model.slices)
        (List.map EncodersDecoders.getHashImageForSlices <| Dict.values model.slices)
        (List.map HullSlices.isHullCustomized <| Dict.values model.slices)
        model.selectedHullReference
        hullReferencesMsgs


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
        [ class "panel partitioning-panel" ]
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
    let
        viewSlices : ( String, HullSlices ) -> Maybe (Html Msg)
        viewSlices ( hullReference, slices ) =
            let
                hullSlicesMetrics : HullSlicesMetrics
                hullSlicesMetrics =
                    HullSlicesMetrics.fillHullSliceMetrics slices
            in
            if model.selectedHullReference == Just hullReference then
                Just <|
                    div
                        [ id "slices-inputs" ]
                        [ (StringValueInput.view <| HullSlices.getLength slices) <| ToJs << ModifySlice HullSliceModifiers.setLengthOverAll hullReference
                        , (StringValueInput.view <| HullSlices.getBreadth slices) <| ToJs << ModifySlice HullSliceModifiers.setBreadth hullReference
                        , (StringValueInput.view <| HullSlices.getDepth slices) <| ToJs << ModifySlice HullSliceModifiers.setDepth hullReference
                        , (StringValueInput.view <| HullSlices.getDraught slices) <| ToJs << ModifySlice HullSliceModifiers.setDraught hullReference
                        , (StringValueInput.view <| getPrismaticCoefficient hullSlicesMetrics) <| ToJs << ModifySlice HullSliceModifiers.setPrismaticCoefficient hullReference
                        , viewHullSlicesDetails model.uiState hullReference slices
                        , div [ id "hydrocalc" ]
                            [ div [ id "disclaimer", class "disclaimer" ] [ text "Hull models are approximate", Html.br [] [], text "The values below are given for information only" ]
                            , Html.br [] []
                            , AreaCurve.view hullSlicesMetrics
                            , viewModellerSimpleKpi "Displacement (m3)" "displacement" (StringValueInput.round_n -1 <| getDisplacement hullSlicesMetrics)
                            , viewModellerSimpleKpi "Block Coefficient Cb" "block-coefficient" (StringValueInput.round_n 2 <| getBlockCoefficient hullSlicesMetrics)
                            , viewModellerSimpleKpi "KB" "KB" (StringValueInput.round_n 1 <| getCenterOfBuoyancy hullSlicesMetrics)
                            , viewModellerSimpleKpi "KM" "KM" (StringValueInput.round_n 1 <| getMetacentre hullSlicesMetrics)
                            , button
                                [ id "exportCSV"
                                , value "exportCSV"
                                , onClick <| ToJs (ExportCSV hullReference)
                                ]
                                [ text "export decks (csv)" ]
                            , button
                                [ id "exportSTL"
                                , value "exportSTL"
                                , onClick <| ToJs (ExportSTL hullReference)
                                ]
                                [ text "export 3D (stl)" ]
                            ]
                        ]

            else
                Nothing

        modellerName : String
        modellerName =
            case model.selectedHullReference of
                Just hullname ->
                    "Modelling " ++ hullname

                Nothing ->
                    "No hull selected"
    in
    div
        [ class "panel modeller-panel" ]
        (h2
            [ class "modeller-panel-title" ]
            [ div [ class "modeller-name" ]
                [ viewBackToHullList
                , text modellerName
                ]
            , div [ class "modeller-actions" ]
                [ resetHullSlices model ]
            ]
            :: (model.slices |> Dict.toList |> List.filterMap viewSlices)
        )


viewBackToHullList : Html Msg
viewBackToHullList =
    div
        [ class "focus-back"
        , onClick <| ToJs <| SwitchViewMode <| Hull HullLibrary
        ]
        [ FASolid.arrowLeft [] ]


resetHullSlices : Model -> Html Msg
resetHullSlices model =
    let
        hullReference : String
        hullReference =
            case model.selectedHullReference of
                Just hullName ->
                    hullName

                Nothing ->
                    ""

        isResetButtonDisplayed : Bool
        isResetButtonDisplayed =
            case Dict.get hullReference model.slices of
                Nothing ->
                    True

                Just hullSlices ->
                    not <| HullSlices.isHullCustomized hullSlices
    in
    div
        [ class "reset-button" ]
        [ button
            [ id "buttonReset"
            , hidden isResetButtonDisplayed
            , onClick <| ToJs <| ResetSlice hullReference
            , title "Reset parameters to origin"
            ]
            [ text "Reset" ]
        ]


viewHullSlicesDetails : UiState -> String -> HullSlices -> Html Msg
viewHullSlicesDetails uiState hullReference hullslices =
    div
        [ class "slices-details" ]
    <|
        if isAccordionOpened uiState "hull-slices-details" then
            [ p
                [ class "slices-details-title"
                , onClick <| ToJs <| ToggleSlicesDetails False hullReference
                ]
                [ text "Slices details"
                , FASolid.angleDown []
                ]
            , viewHullSliceSelector uiState.selectedSlice hullReference <| List.length hullslices.slices
            , viewHullSliceList hullslices uiState.selectedSlice.value
            ]

        else
            [ p
                [ class "slices-details-title"
                , onClick <| ToJs <| ToggleSlicesDetails True hullReference
                ]
                [ text "Slices details"
                , FASolid.angleRight []
                ]
            ]


viewHullSliceSelector : StringValueInput.IntInput -> String -> Int -> Html Msg
viewHullSliceSelector sliceSelector hullReference maxSelector =
    div
        [ class "slices-selector" ]
        [ StringValueInput.viewIntInput sliceSelector <| ToJs << SelectSlice hullReference maxSelector ]


viewHullSliceList : HullSlices -> Int -> Html Msg
viewHullSliceList hullslices sliceSelected =
    let
        slices =
            HullSlices.setLongitudinalPositionOfEachSlice hullslices

        metrics =
            { length = .value <| HullSlices.getLength hullslices
            , breadth = .value <| HullSlices.getBreadth hullslices
            , depth = .value <| HullSlices.getDepth hullslices
            , xmin = hullslices.xmin
            , zmin = hullslices.zmin
            }
    in
    case List.head <| List.drop (sliceSelected - 1) slices of
        Nothing ->
            Html.text ""

        Just slice ->
            ul [ class "slices-list" ] <|
                List.append
                    [ li
                        [ class "slices-item-title input-group" ]
                        [ input
                            [ type_ "text"
                            , disabled True
                            , value "x"
                            ]
                            []
                        , input
                            [ type_ "text"
                            , disabled True
                            , value "y"
                            ]
                            []
                        , input
                            [ type_ "text"
                            , disabled True
                            , value "z"
                            ]
                            []
                        ]
                    ]
                    (slice
                        |> HullSlices.denormalizeHullSlice metrics
                        |> HullSlices.toHullSliceAsZYList
                        |> HullSlices.extractXYZ
                        |> List.map viewHullSliceCoordinate
                    )


viewHullSliceCoordinate : HullSlices.XYZ -> Html Msg
viewHullSliceCoordinate xyz =
    li
        [ class "slices-item input-group" ]
        [ input
            [ type_ "text"
            , disabled True
            , value <| String.fromFloat <| StringValueInput.round_n 2 xyz.x
            ]
            []
        , input
            [ type_ "text"
            , disabled True
            , value <| String.fromFloat <| StringValueInput.round_n 2 xyz.y
            ]
            []
        , input
            [ type_ "text"
            , disabled True
            , value <| String.fromFloat <| negate <| StringValueInput.round_n 2 xyz.z
            ]
            []
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
                    ++ (Url.percentEncode <|
                            kpisAsCsv model.blocks model.tags
                       )
            , download <| getDateForFilename model ++ "_KPIs_Shipbuilder_" ++ model.build ++ ".csv"
            ]
            [ FASolid.download [], text "Download as CSV" ]
        , viewLengthKpi blocksBoundingBoxSize.length
        , viewWidthKpi blocksBoundingBoxSize.width
        , viewHeightKpi blocksBoundingBoxSize.height
        , viewCenterOfGravityXKpi cog.x
        , viewCenterOfGravityYKpi cog.y
        , viewCenterOfGravityZKpi cog.z
        , viewVolumeKpi model.blocks model.tags <| isAccordionOpened model.uiState "volume-kpi"
        , viewMassKpi model.blocks model.tags <| isAccordionOpened model.uiState "mass-kpi"
        ]


viewLengthKpi : Float -> Html Msg
viewLengthKpi length =
    viewSimpleKpi "Length (m)" "length" <| StringValueInput.round_n 1 length


viewWidthKpi : Float -> Html Msg
viewWidthKpi width =
    viewSimpleKpi "Width (m)" "width" <| StringValueInput.round_n 1 width


viewHeightKpi : Float -> Html Msg
viewHeightKpi height =
    viewSimpleKpi "Height (m)" "height" <| StringValueInput.round_n 1 height


viewCenterOfGravityXKpi : Float -> Html Msg
viewCenterOfGravityXKpi cogx =
    viewSimpleKpi "Center of gravity : x" "cog-x" <| StringValueInput.round_n 1 cogx


viewCenterOfGravityYKpi : Float -> Html Msg
viewCenterOfGravityYKpi cogy =
    viewSimpleKpi "Center of gravity : y" "cog-y" <| StringValueInput.round_n 1 cogy


viewCenterOfGravityZKpi : Float -> Html Msg
viewCenterOfGravityZKpi cogz =
    viewSimpleKpi "Center of gravity : z" "cog-z" <| StringValueInput.round_n 1 cogz


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
                    [ String.fromFloat <| blocksBoundingBoxSize.length
                    , String.fromFloat <| blocksBoundingBoxSize.width
                    , String.fromFloat <| blocksBoundingBoxSize.height

                    -- We add the values for the whole ship at the end of the list with the values inside KpiSummary
                    , String.fromFloat <| cog.x
                    , String.fromFloat <| cog.y
                    , String.fromFloat <| cog.z
                    ]
                |> listToCsvLine
            )
                :: List.map
                    (\summary ->
                        kpiSummaryToStringList tags summary
                            |> flip (++) [ "", "", "", "", "", "" ]
                            -- We add empty values for the color groups because length, width, height and the center of gravity don't apply
                            |> listToCsvLine
                    )
                    summaryList
           )
        |> String.join "\n"


kpiSummaryToStringList : Tags -> KpiSummary -> List String
kpiSummaryToStringList tags summary =
    let
        getColorName_ : SIRColorPicker.SirColor -> String
        getColorName_ sirColor =
            SIRColorPicker.getName sirColor

        getTagLabelForColor_ : SIRColorPicker.SirColor -> Maybe String
        getTagLabelForColor_ sirColor =
            List.head <| List.map .label <| List.filter ((==) sirColor << .color) tags

        getLabelForColor_ : SIRColorPicker.SirColor -> String
        getLabelForColor_ sirColor =
            Maybe.withDefault (getColorName_ sirColor) (getTagLabelForColor_ sirColor)
    in
    [ case summary.target of
        WholeShip ->
            "Total"

        ColorGroup color ->
            getLabelForColor_ color
    , String.fromInt <| round <| summary.mass
    , String.fromFloat <| StringValueInput.round_n 2 summary.volume
    ]


listToCsvLine : List String -> String
listToCsvLine items =
    items
        |> List.map (\item -> "\"" ++ item ++ "\"")
        |> String.join ";"


viewMassKpi : Blocks -> Tags -> Bool -> Html Msg
viewMassKpi blocks tags showKpiForColors =
    let
        transform : Float -> Float
        transform value =
            StringValueInput.round_n -1 value

        viewMassKpiContent : String -> String -> Float -> (Color -> Float) -> Tags -> Html Msg
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
            StringValueInput.round_n -1 value

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


viewSimpleKpi : String -> String -> Float -> Html Msg
viewSimpleKpi kpiTitle className totalValue =
    div [ class <| "kpi " ++ className ] <|
        [ div
            [ class "kpi-total kpi-group"
            ]
            [ Html.h5 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| String.fromFloat totalValue ]
            ]
        ]


viewModellerSimpleKpi : String -> String -> Float -> Html Msg
viewModellerSimpleKpi kpiTitle className totalValue =
    div [ class <| "kpi " ++ className ] <|
        [ div
            [ class "kpi-total kpi-group"
            ]
            [ Html.h5 [ class "kpi-modeller-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-modeller-value" ] [ text <| String.fromFloat totalValue ]
            ]
        ]


viewKpi : String -> String -> Float -> (Color -> Float) -> Tags -> Html Msg
viewKpi kpiTitle className totalValue _ _ =
    div [ class <| "kpi " ++ className ] <|
        [ div
            [ class "kpi-total kpi-group"
            , onClick <| NoJs <| ToggleAccordion True <| className ++ "-kpi"
            ]
            [ h3 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| String.fromFloat totalValue ]
            , FASolid.angleRight []
            ]
        ]


viewKpiWithColors : String -> String -> Float -> (Color -> Float) -> Tags -> Html Msg
viewKpiWithColors kpiTitle className totalValue valueForColor tags =
    div [ class <| "kpi " ++ className ] <|
        div
            [ class "kpi-total kpi-group"
            , onClick <| NoJs <| ToggleAccordion False <| className ++ "-kpi"
            ]
            [ h3 [ class "kpi-label" ] [ text <| kpiTitle ]
            , p [ class "kpi-value" ] [ text <| String.fromFloat totalValue ]
            , FASolid.angleDown []
            ]
            :: List.map
                (\sirColor ->
                    viewKpiByColor className (getColor sirColor) (getLabelForColor sirColor tags) (valueForColor <| SIRColorPicker.getColor sirColor)
                )
                SIRColorPicker.palette


viewKpiByColor : String -> Color -> String -> Float -> Html Msg
viewKpiByColor kpiClass color colorLabel kpiValue =
    div [ class <| "input-group kpi-group " ++ kpiClass ]
        [ label
            [ class "kpi-color-label"
            , style "background-color" <| colorToCssRgbString color
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
            [ text <| String.fromFloat kpiValue ]
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
            , FASolid.eyeSlash []
            ]

        else
            [ text "Show partitions"
            , FASolid.eye []
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
                    , onKeyDown decks.spacing.nbOfDigits decks.spacing.string <| ToJs << UpdatePartitionSpacing Deck
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
                    , onKeyDown decks.zero.position.nbOfDigits decks.zero.position.string <| ToJs << UpdatePartitionZeroPosition Deck
                    ]
                    []
                ]
            , viewPartitionSpacingDetails Deck isDetailsOpen decks
            ]
        ]


partitionTypeToString : PartitionType -> String
partitionTypeToString partitionType =
    case partitionType of
        Bulkhead ->
            "bulkhead"

        Deck ->
            "deck"


viewPartitionSpacingDetails : PartitionType -> Bool -> { a | number : StringValueInput.IntInput, spacing : StringValueInput.FloatInput, zero : PartitionZero, spacingExceptions : Dict Int StringValueInput.FloatInput } -> Html Msg
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
                , onClick <| NoJs <| ToggleAccordion False <| partitionTypeToString partitionType ++ "-spacing-details"
                ]
                [ text "Spacing details"
                , FASolid.angleDown []
                ]
            , if partitionSummary.number.value > 0 then
                viewPartitionSpacingList partitionType partitionSummary

              else
                p [ class "text-muted" ] [ text <| "There's no " ++ partitionTypeToString partitionType ++ " yet" ]
            ]

        else
            [ p
                [ class <| rootClass ++ "-title"
                , onClick <| NoJs <| ToggleAccordion True <| partitionTypeToString partitionType ++ "-spacing-details"
                ]
                [ text "Spacing details"
                , FASolid.angleRight []
                ]
            ]


viewPartitionSpacingList : PartitionType -> { a | number : StringValueInput.IntInput, spacing : StringValueInput.FloatInput, zero : PartitionZero, spacingExceptions : Dict Int StringValueInput.FloatInput } -> Html Msg
viewPartitionSpacingList partitionType partitionSummary =
    let
        getPartitionSpacingData : Int -> { number : Int, index : Int, maybeSpacing : Maybe StringValueInput.FloatInput }
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


viewPartitionSpacingListItem : PartitionType -> Float -> { number : Int, index : Int, maybeSpacing : Maybe StringValueInput.FloatInput } -> Html Msg
viewPartitionSpacingListItem partitionType defaultSpacing partitionSpacingData =
    li
        [ class "spacing-item input-group" ]
        [ label
            []
            [ text <| String.fromInt partitionSpacingData.number ]
        , input
            [ type_ "text"
            , placeholder <| String.fromFloat defaultSpacing
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
                    , onKeyDown bulkheads.spacing.nbOfDigits bulkheads.spacing.string <| ToJs << UpdatePartitionSpacing Bulkhead
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
                    , onKeyDown bulkheads.zero.position.nbOfDigits bulkheads.zero.position.string <| ToJs << UpdatePartitionZeroPosition Bulkhead
                    ]
                    []
                ]
            , viewPartitionSpacingDetails Bulkhead isDetailsOpen bulkheads
            ]
        ]



-- VIEW BLOCK


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
                ++ (Url.percentEncode <|
                        blocksAsCsv blocksList model.tags model.customProperties
                   )
        , download <| getDateForFilename model ++ "_Blocks_Shipbuilder_" ++ model.build ++ ".csv"
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
        getColorName_ : SIRColorPicker.SirColor -> String
        getColorName_ sirColor =
            SIRColorPicker.getName sirColor

        getTagLabelForColor_ : SIRColorPicker.SirColor -> Maybe String
        getTagLabelForColor_ sirColor =
            List.head <| List.map .label <| List.filter ((==) sirColor << .color) tags

        getLabelForColor_ : SIRColorPicker.SirColor -> String
        getLabelForColor_ sirColor =
            Maybe.withDefault (getColorName_ sirColor) (getTagLabelForColor_ sirColor)

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
         , Maybe.withDefault "" <| Maybe.map getLabelForColor_ <| SIRColorPicker.fromColor block.color
         , block.position.x.string
         , block.position.y.string
         , block.position.z.string
         , block.size.length.string
         , block.size.height.string
         , block.size.width.string
         , String.fromFloat cog.x
         , String.fromFloat cog.y
         , String.fromFloat cog.z
         , String.fromFloat <| computeVolume block
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
        [ text <| (String.fromInt <| List.length selectedBlocks) ++ " selected blocks"
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
        [ FASolid.eye [] ]


viewHideBlocksAction : List Block -> Html Msg
viewHideBlocksAction blocks =
    div
        [ class "blocks-action hide-all-blocks"
        , onClick <| ToJs <| ToggleBlocksVisibility blocks False
        , title "Hide all blocks"
        ]
        [ FASolid.eyeSlash [] ]


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
        [ FASolid.arrowLeft [] ]


viewBlockProperties : Block -> List (Html Msg)
viewBlockProperties block =
    [ if block.visible then
        div
            [ class "block-visibility primary-button"
            , onClick <| ToJs <| ToggleBlocksVisibility [ block ] False
            ]
            [ text "Hide block"
            , FASolid.eyeSlash []
            ]

      else
        div
            [ class "block-visibility primary-button"
            , onClick <| ToJs <| ToggleBlocksVisibility [ block ] True
            ]
            [ text "Show block"
            , FASolid.eye []
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
            "custom-property-" ++ (String.fromInt <| propertyIndex + 1)

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
                [ FASolid.trash [] ]
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
                [ text <| String.fromFloat <| StringValueInput.round_n 0 <| computeVolume block ]
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


flip : (a -> b -> c) -> (b -> a -> c)
flip f =
    let
        g : b -> a -> c
        g y x =
            f x y
    in
    g


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
            , title "Reset the center of gravity to the center of the volume"
            , onClick <| NoJs <| LockCenterOfGravityToCenterOfVolume block
            ]
            [ FASolid.crosshairs [] ]
        ]
    , viewCenterOfGravityUserInputCoordinate X block cog.x
    , viewCenterOfGravityUserInputCoordinate Y block cog.y
    , viewCenterOfGravityUserInputCoordinate Z block cog.z
    ]


viewCenterOfGravityUserInputCoordinate : Axis -> Block -> StringValueInput.FloatInput -> Html Msg
viewCenterOfGravityUserInputCoordinate axis block coordinateInput =
    let
        axisLabel : String
        axisLabel =
            axisToString axis
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


axisToString : Axis -> String
axisToString axis =
    case axis of
        X ->
            "x"

        Y ->
            "y"

        Z ->
            "z"


viewPositionInput : Axis -> Block -> Html Msg
viewPositionInput axis block =
    let
        floatInput : StringValueInput.FloatInput
        floatInput =
            axisAccessor axis <| .position block
    in
    StringValueInput.view floatInput <| ToJs << UpdatePosition axis block


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
            case dimension of
                Length ->
                    "length"

                Width ->
                    "width"

                Height ->
                    "height"
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
    let
        val : String
        val =
            .string <| dimensionAccessor dimension <| .size block
    in
    input
        [ class "block-size-input"
        , id ("size-" ++ dimensionLabel)
        , type_ "text"
        , value val
        , onInput <| ToJs << UpdateDimension dimension block
        , onBlur <| NoJs <| SyncBlockInputs block
        , onKeyDown 1 val <| ToJs << UpdateDimension dimension block
        ]
        []


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
        , style "borderColor" <| colorToCssRgbString block.color
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
                [ FASolid.angleUp [] ]
            , div
                [ class "move-down move-block"
                , onClickWithoutPropagation <| NoJs <| MoveBlockDown block
                , title "Move down"
                ]
                [ FASolid.angleDown [] ]
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
        [ FASolid.ellipsisH [] ]


viewCloseBlockContextualMenuAction : Html Msg
viewCloseBlockContextualMenuAction =
    div
        [ class "block-action close-contextual-menu"
        , onClick <| NoJs <| UnsetBlockContextualMenu
        , title "Hide extra actions"
        ]
        [ FARegular.timesCircle [] ]


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
        [ FASolid.arrowRight []
        ]


viewDeleteBlocksAction : List Block -> Html Msg
viewDeleteBlocksAction blocks =
    div
        [ class "blocks-action delete-block"
        , onClick <| ToJs <| RemoveBlocks blocks
        , title "Delete all blocks"
        ]
        [ FASolid.trash [] ]


viewDeleteBlockAction : Block -> Html Msg
viewDeleteBlockAction block =
    div
        [ class "block-action delete-block"
        , onClickWithoutPropagation <| ToJs <| RemoveBlock block
        , title "Delete block"
        ]
        [ FASolid.trash [] ]


onClickWithoutPropagation : Msg -> Html.Attribute Msg
onClickWithoutPropagation msg =
    Html.Events.custom "click" <| Decode.map (\_ -> { message = msg, stopPropagation = True, preventDefault = False }) (Decode.succeed msg)


viewShowBlockAction : Block -> Html Msg
viewShowBlockAction block =
    div
        [ class "block-action show-block"
        , onClickWithoutPropagation <| ToJs <| ToggleBlocksVisibility [ block ] True
        , title "Show block"
        ]
        [ FASolid.eye [] ]


viewHideBlockAction : Block -> Html Msg
viewHideBlockAction block =
    div
        [ class "block-action hide-block"
        , onClickWithoutPropagation <| ToJs <| ToggleBlocksVisibility [ block ] False
        , title "Hide block"
        ]
        [ FASolid.eyeSlash [] ]


viewBlockItemWithSelection : Bool -> List String -> Block -> Html Msg
viewBlockItemWithSelection showContextualMenu selectedBlocks block =
    if List.member block.uuid selectedBlocks then
        li
            [ if block.visible then
                class "block-item block-item__selected"

              else
                class "block-item block-item__selected hidden"
            , style "borderColor" <| colorToCssRgbString block.color
            ]
        <|
            viewBlockItemContent showContextualMenu block

    else
        viewBlockItem showContextualMenu block



-- WORKSPACE


viewWorkspace : Model -> Html Msg
viewWorkspace _ =
    div [ class "workspace" ]
        [ div [ id "three-wrapper" ] []
        ]
