module UITests exposing (suite)

import Color
import Dict
import DictList exposing (DictList)
import EncodersDecoders
import Expect exposing (Expectation)
import ExtraEvents exposing (KeyEvent)
import Fuzz
import Html exposing (Html)
import Html.Attributes as Attributes
import HullReferences
import HullSliceModifiers
import HullSlices
import HullSlicesMetrics exposing (fillHullSliceMetrics, getPrismaticCoefficient)
import Json.Decode as Decode exposing (Decoder, decodeString, decodeValue)
import Json.Encode as Encode exposing (encode)
import Main exposing (..)
import StringValueInput
import Test exposing (..)
import Test.Html.Event as Event
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import TestData exposing (..)


setView : List Msg -> Html Msg
setView =
    view << setModel


discardCmd : ( Model, Cmd Msg ) -> Model
discardCmd ( model, _ ) =
    model


type alias ParsedJSData a =
    { tag : String
    , data : a
    }


keyDown : Int -> KeyEvent -> ( String, Encode.Value )
keyDown key keyEvent =
    ( "keydown"
    , Encode.object
        [ ( "keyCode", Encode.int key )
        , ( "shiftKey", Encode.bool keyEvent.shift )
        , ( "altKey", Encode.bool keyEvent.alt )
        , ( "ctrlKey", Encode.bool keyEvent.ctrl )
        , ( "target", Encode.object [ ( "value", Encode.string keyEvent.targetValue ) ] )
        ]
    )


modellerView : Html Msg
modellerView =
    setView
        [ ToJs <| SelectHullReference "anthineas"
        , ToJs <| SwitchViewMode <| Hull HullDetails
        ]


downArrow : KeyEvent -> ( String, Encode.Value )
downArrow =
    keyDown 40


upArrow : KeyEvent -> ( String, Encode.Value )
upArrow =
    keyDown 38


press : String -> KeyEvent
press targetValue =
    { key = 0, shift = False, alt = False, ctrl = False, targetValue = targetValue }


shift : KeyEvent -> KeyEvent
shift keyEvent =
    { keyEvent | shift = True }


alt : KeyEvent -> KeyEvent
alt keyEvent =
    { keyEvent | alt = True }


ctrl : KeyEvent -> KeyEvent
ctrl keyEvent =
    { keyEvent | ctrl = True }


toJS : List Msg -> ToJsMsg -> Decoder a -> Maybe (ParsedJSData a)
toJS msgs msg decoder =
    let
        original : Maybe JsData
        original =
            msg2json (setModel msgs) msg
    in
    case original of
        Nothing ->
            Nothing

        Just data ->
            case decodeValue decoder data.data of
                Ok p ->
                    Just { tag = data.tag, data = p }

                Err e ->
                    Nothing


setModel : List Msg -> Model
setModel msgs =
    List.foldl (\msg model -> update msg model |> discardCmd) initialModel msgs


updateModel : List Msg -> Model -> Model
updateModel msgs modelToUpdate =
    List.foldl (\msg model -> update msg model |> discardCmd) modelToUpdate msgs


suite =
    describe "UI" <|
        [ viewModeTests
        , hullLibraryTests
        , partitionsTests
        , blockList
        , blockDetails
        , kpiTests
        , modellerTests
        ]


viewModeTests =
    describe "ViewMode"
        [ test "Hull panel is the default" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "hull-panel" ]
        , test "Hull panel is displayed when switching mode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Hull HullLibrary ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "hull-panel" ]
        , test "Partitioning panel is displayed when switching mode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "partitioning-panel" ]
        , test "Blocks panel is displayed when switching mode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| SpaceReservation WholeList ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "blocks-panel" ]
        , test "KPIs panel is displayed when switching mode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "kpi-panel" ]
        , test "Modeller panel is displayed when switching mode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Hull HullDetails ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "modeller-panel" ]
        , test "There is a single active tab-item on init" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.classes [ "tab-item", "active" ] ]
                    |> Query.count (Expect.equal 1)
        , test "There is a single active tab-item after switching ViewMode" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| KpiStudio ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.classes [ "tab-item", "active" ] ]
                    |> Query.count (Expect.equal 1)
        , test "The first tab-item triggers HullLibrary" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "tab-item" ]
                    |> Query.index 0
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| Hull HullLibrary)
        , test "The second tab-item triggers Partitioning" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "tab-item" ]
                    |> Query.index 1
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| Partitioning PropertiesEdition)
        , test "The second tab-item triggers SpaceReservation" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "tab-item" ]
                    |> Query.index 2
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| SpaceReservation WholeList)
        , test "The second tab-item triggers KPIs" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "tab-item" ]
                    |> Query.index 3
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode KpiStudio)
        ]


hullLibraryTests =
    describe "HullLibrary" <|
        [ test "None selected by default" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference-none" ] ]
                    |> Query.has [ Selector.class "hull-reference__selected" ]
        , test "None unselected if a hull-reference is selected" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas" ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference-none" ] ]
                    |> Query.hasNot [ Selector.class "hull-reference__selected" ]
        , test "Selected HullReference correctly displayed" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas" ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference__selected" ] ]
                    |> Query.find [ Selector.class "hull-label" ]
                    |> Query.has [ Selector.id "anthineas" ]
        , test "Clicking a hull reference selects it" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "hull-reference" ]
                    |> Query.index 1
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SelectHullReference "anthineas")
        , test "Hull-label trigger RenameHull on input" <|
            \_ ->
                initialView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "hull-reference" ]
                    |> Query.index 1
                    |> Query.find [ Selector.class "hull-label" ]
                    |> Event.simulate (Event.input "a")
                    |> Event.expect (NoJs <| RenameHull "anthineas" "a")
        , test "Clicking 'remove' button triggers RemoveHull" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas" ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference__selected" ] ]
                    |> Query.find [ Selector.class "delete-hull" ]
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| RemoveHull "anthineas")
        , test "Clicking 'save as new' button triggers SaveAsNewHull" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas"
                    , ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "10"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference__selected" ] ]
                    |> Query.find [ Selector.class "save-hull" ]
                    |> Event.simulate Event.click
                    |> Event.expect (NoJs <| SaveAsNewHull "anthineas")
        , test "Clicking 'focus hull' button trigger SwitchViewMode" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas" ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "hull-reference", "hull-reference__selected" ] ]
                    |> Query.find [ Selector.class "focus-hull" ]
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| Hull <| HullDetails)
        ]


partitionsTests =
    describe "Partitions" <|
        [ test "Show/hide partitions triggers the right event" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "showing-partitions" ]
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| TogglePartitions)
        , test "Show partitions on init" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "showing-partitions" ]
                    |> Query.has [ Selector.text "Hide" ]
        , test "Hide partitions after first toggle" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition
                    , ToJs <| TogglePartitions
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "showing-partitions" ]
                    |> Query.has [ Selector.text "Show" ]
        , test "Partitions panel has decks" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.children [ Selector.class "decks" ]
                    |> Query.count (Expect.equal 1)
        , test "Decks number input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.has [ Selector.id "decks-number" ]
        , test "Decks number input triggers UpdatePartitionNumber" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "decks-number" ]
                    |> Event.simulate (Event.input "10")
                    |> Event.expect (ToJs <| UpdatePartitionNumber Deck "10")
        , test "Decks number input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "decks-number" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Decks spacing input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.has [ Selector.id "decks-spacing" ]
        , test "Decks spacing input triggers UpdatePartitionSpacing" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "decks-spacing" ]
                    |> Event.simulate (Event.input "4.5")
                    |> Event.expect (ToJs <| UpdatePartitionSpacing Deck "4.5")
        , test "Decks spacing input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "decks-spacing" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Define deck zero is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.has [ Selector.class "deck-zero" ]
        , test "Define deck zero triggers Defining" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.class "deck-zero" ]
                    |> Query.find [ Selector.tag "button" ]
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| Partitioning <| OriginDefinition Deck)
        , test "Deck zero position input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.has [ Selector.id "deck-zero-position" ]
        , test "Decks zero position input triggers UpdatePartitionNumber" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "deck-zero-position" ]
                    |> Event.simulate (Event.input "10")
                    |> Event.expect (ToJs <| UpdatePartitionZeroPosition Deck "10")
        , test "Decks zero position input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.id "deck-zero-position" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Decks has spacing details" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.findAll [ Selector.class "spacing-details" ]
                    |> Query.count (Expect.equal 1)
        , test "Decks spacing details accordion is closed by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.hasNot [ Selector.tag "ul" ]
        , test "Decks spacing details accordion contains nothing by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition
                    , NoJs <| ToggleAccordion True "deck-spacing-details"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.children []
                    |> Query.each (Expect.all [ Query.has [ Selector.tag "p" ] ])
        , fuzz (Fuzz.intRange 1 100) "Decks spacing details accordion contains a list of {deck number} element when deck number > 0" <|
            \numberOfDecks ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition
                    , ToJs <| UpdatePartitionNumber Deck (String.fromInt numberOfDecks)
                    , NoJs <| ToggleAccordion True "deck-spacing-details"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "decks" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.find [ Selector.tag "ul" ]
                    |> Query.children [ Selector.tag "li" ]
                    |> Query.count (Expect.equal numberOfDecks)
        , test "Partitions panel has bulkheads" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.children [ Selector.class "bulkheads" ]
                    |> Query.count (Expect.equal 1)
        , test "Bulkheads number input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.has [ Selector.id "bulkheads-number" ]
        , test "Bulkheads number input triggers UpdatePartitionNumber" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkheads-number" ]
                    |> Event.simulate (Event.input "10")
                    |> Event.expect (ToJs <| UpdatePartitionNumber Bulkhead "10")
        , test "Bulkheads number input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkheads-number" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Bulkheads spacing input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.has [ Selector.id "bulkheads-spacing" ]
        , test "Bulkheads spacing input triggers UpdatePartitionSpacing" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkheads-spacing" ]
                    |> Event.simulate (Event.input "4.5")
                    |> Event.expect (ToJs <| UpdatePartitionSpacing Bulkhead "4.5")
        , test "Bulkheads spacing input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkheads-spacing" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Define bulkhead zero is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.has [ Selector.class "bulkhead-zero" ]
        , test "Define bulkhead zero triggers Defining" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.class "bulkhead-zero" ]
                    |> Query.find [ Selector.tag "button" ]
                    |> Event.simulate Event.click
                    |> Event.expect (ToJs <| SwitchViewMode <| Partitioning <| OriginDefinition Bulkhead)
        , test "Bulkhead zero position input is present" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.has [ Selector.id "bulkhead-zero-position" ]
        , test "Bulkhead zero position input triggers UpdatePartitionNumber" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkhead-zero-position" ]
                    |> Event.simulate (Event.input "10")
                    |> Event.expect (ToJs <| UpdatePartitionZeroPosition Bulkhead "10")
        , test "Bulkhead zero position input syncs on blur" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.id "bulkhead-zero-position" ]
                    |> Event.simulate Event.blur
                    |> Event.expect (NoJs <| SyncPartitions)
        , test "Bulkheads has spacing details" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.findAll [ Selector.class "spacing-details" ]
                    |> Query.count (Expect.equal 1)
        , test "Bulkheads spacing details accordion is closed by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.hasNot [ Selector.tag "ul" ]
        , test "Bulkheads spacing details accordion contains nothing by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition
                    , NoJs <| ToggleAccordion True "bulkhead-spacing-details"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.children []
                    |> Query.each (Expect.all [ Query.has [ Selector.tag "p" ] ])
        , fuzz (Fuzz.intRange 1 100) "Bulkheads spacing details accordion contains a list of {bulkhead number} element when bulkhead number > 0" <|
            \numberOfBulkheads ->
                setView
                    [ ToJs <| SwitchViewMode <| Partitioning PropertiesEdition
                    , ToJs <| UpdatePartitionNumber Bulkhead (String.fromInt numberOfBulkheads)
                    , NoJs <| ToggleAccordion True "bulkhead-spacing-details"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "bulkheads" ]
                    |> Query.find [ Selector.class "spacing-details" ]
                    |> Query.find [ Selector.tag "ul" ]
                    |> Query.children [ Selector.tag "li" ]
                    |> Query.count (Expect.equal numberOfBulkheads)
        ]


blockList =
    describe "Blocks list" <|
        [ test "Block list displayed in blocks panel" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| SpaceReservation <| WholeList ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.children [ Selector.tag "ul", Selector.class "blocks" ]
                    |> Query.count (Expect.equal 1)
        , test "Block list has one element by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| SpaceReservation <| WholeList ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "ul", Selector.class "blocks" ]
                    |> Query.children []
                    |> Query.count (Expect.equal 1)
        , test "Only element in block list is 'add-block' by default" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| SpaceReservation <| WholeList ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "ul", Selector.class "blocks" ]
                    |> Query.has [ Selector.tag "li", Selector.class "add-block" ]
        , fuzz (Fuzz.intRange 0 20) "Block list has number of blocks + 1 elements" <|
            \numberOfBlocks ->
                List.repeat numberOfBlocks blockA
                    |> List.indexedMap (\index block -> { block | uuid = String.fromInt index, label = String.fromInt index })
                    |> List.map (\block -> FromJs <| NewBlock block)
                    |> (++) [ ToJs <| SwitchViewMode <| SpaceReservation <| WholeList ]
                    |> setView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "ul", Selector.class "blocks" ]
                    |> Query.children []
                    |> Query.count (Expect.equal (numberOfBlocks + 1))
        , test "Adding a new block triggers AddBlock" <|
            \_ ->
                setView [ ToJs <| SwitchViewMode <| SpaceReservation <| WholeList ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.tag "li", Selector.class "add-block" ]
                    |> Query.find [ Selector.tag "input", Selector.class "block-label" ]
                    |> Event.simulate (Event.input "Block")
                    |> Event.expect (ToJs <| AddBlock "Block")
        , test "Blocks have a block-label triggering RenameBlock on input" <|
            \_ ->
                setView
                    [ FromJs <| NewBlock blockA
                    , ToJs <| SwitchViewMode <| SpaceReservation <| WholeList
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.tag "li", Selector.class "block-item" ]
                    |> Query.find [ Selector.tag "input", Selector.class "block-label" ]
                    |> Event.simulate (Event.input "a")
                    |> Event.expect (NoJs <| RenameBlock blockA "a")
        ]


blockDetails =
    describe "Block details" <|
        let
            blockDetailsView =
                setView
                    [ FromJs <| NewBlock blockA
                    , ToJs <| SwitchViewMode <| SpaceReservation <| DetailedBlock blockA.uuid
                    ]
        in
        [ test "Block details view shows its name" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.class "block-label" ]
                    |> Query.has [ Selector.attribute <| Attributes.value blockA.label ]
        , test "Block details view allows renaming the block" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.class "block-label" ]
                    |> Event.simulate (Event.input "a")
                    |> Event.expect (NoJs <| RenameBlock blockA "a")
        , test "Block details view displays the position" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "block-position" ]
        , test "Block details view displays the position on 3 axis" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.class "block-position" ]
                    |> Query.children []
                    |> Query.count (Expect.equal 3)
        , test "Block details view displays an input for the position on X" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "block-position" ]
                    |> Query.has [ Selector.tag "input", Selector.id "x" ]
        , test "Input for the position of the block on X triggers UpdatePosition X" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "x" ]
                    |> Event.simulate (Event.input "-8")
                    |> Event.expect (ToJs <| UpdatePosition X blockA "-8")
        , test "Block details view displays an input for the position on Y" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "y" ]
        , test "Input for the position of the block on Y triggers UpdatePosition Y" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "y" ]
                    |> Event.simulate (Event.input "1.2")
                    |> Event.expect (ToJs <| UpdatePosition Y blockA "1.2")
        , test "Block details view displays an input for the position on Z" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "z" ]
        , test "Input for the position of the block on Z triggers UpdatePosition Z" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "z" ]
                    |> Event.simulate (Event.input "199")
                    |> Event.expect (ToJs <| UpdatePosition Z blockA "199")
        , test "Block details view displays the size" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.class "block-size" ]
        , test "Block details view displays the size on 3 axis" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.class "block-size" ]
                    |> Query.children []
                    |> Query.count (Expect.equal 3)
        , test "Block details view displays an input for the length" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "size-length" ]
        , test "Input for the length of the block triggers UpdateDimension Length" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "size-length" ]
                    |> Event.simulate (Event.input "0")
                    |> Event.expect (ToJs <| UpdateDimension Length blockA "0")
        , test "Block details view displays an input for the width" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "size-width" ]
        , test "Input for the width the block triggers UpdateDimension Width" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "size-width" ]
                    |> Event.simulate (Event.input "1.2")
                    |> Event.expect (ToJs <| UpdateDimension Width blockA "1.2")
        , test "Block details view displays an input for the height" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "size-height" ]
        , test "Input for the height the block triggers UpdateDimension Height" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "size-height" ]
                    |> Event.simulate (Event.input "255")
                    |> Event.expect (ToJs <| UpdateDimension Height blockA "255")
        , test "Block details view displays an input for the density" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "block-density-input" ]
        , test "Input for the density the block triggers UpdateDensity" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "block-density-input" ]
                    |> Event.simulate (Event.input "0.5")
                    |> Event.expect (NoJs <| UpdateDensity blockA "0.5")
        , test "Block details view displays an input for the mass" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.tag "input", Selector.id "block-mass-input" ]
        , test "Input for the mass the block triggers UpdateMass" <|
            \_ ->
                blockDetailsView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.find [ Selector.tag "input", Selector.id "block-mass-input" ]
                    |> Event.simulate (Event.input "10.5")
                    |> Event.expect (NoJs <| UpdateMass blockA "10.5")
        ]


kpiTests =
    describe "KPIs" <|
        [ test "All KPIs are equal to 0 on init" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.findAll [ Selector.class "kpi-value" ]
                    |> Query.each
                        (Expect.all [ Query.has [ Selector.text "0" ] ])
        , test "KPIs by color are not displayed on init" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.class "kpi-color-label" ]
                    |> Query.count (Expect.equal 0)
        , test "KPIs Length is displayed" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.classes [ "kpi", "length" ] ]
        , test "KPIs Width is displayed" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.classes [ "kpi", "width" ] ]
        , test "KPIs Height is displayed" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.classes [ "kpi", "height" ] ]
        , test "KPIs Volume is displayed" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.classes [ "kpi", "volume" ] ]
        , test "KPIs Mass is displayed" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "panel" ]
                    |> Query.has [ Selector.classes [ "kpi", "mass" ] ]
        , test "KPIs by color for Volume are displayed after toggling the accordion" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio
                    , NoJs <| ToggleAccordion True "volume-kpi"
                    ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.classes [ "kpi-group", "volume" ] ]
                    |> Query.count (Expect.equal 18)
        , test "All KPIs by color for Volume are equal to 0 on init" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio
                    , NoJs <| ToggleAccordion True "volume-kpi"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "kpi", "volume" ] ]
                    |> Query.children [ Selector.class "kpi-value" ]
                    |> Query.each
                        (Expect.all [ Query.has [ Selector.text "0" ] ])
        , test "KPIs by color for Mass are displayed after toggling the accordion" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio
                    , NoJs <| ToggleAccordion True "mass-kpi"
                    ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.classes [ "kpi-group", "mass" ] ]
                    |> Query.count (Expect.equal 18)
        , test "All KPIs by color for Mass are equal to 0 on init" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode KpiStudio
                    , NoJs <| ToggleAccordion True "mass-kpi"
                    ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.classes [ "kpi", "mass" ] ]
                    |> Query.children [ Selector.class "kpi-value" ]
                    |> Query.each
                        (Expect.all [ Query.has [ Selector.text "0" ] ])
        ]


modellerTests =
    describe "Modeller" <|
        [ test "Title has selected hull's name" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "modeller-panel-title" ]
                    |> Query.has [ Selector.text "anthineas" ]
        , test "Title display 'No hull' message when no hull selected" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Hull HullDetails ]
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "modeller-panel-title" ]
                    |> Query.has [ Selector.text "No hull selected" ]
        , test "Length over all input is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "length-over-all" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.value "22.8" ]
        , test "Block cefficient is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "block-coefficient" ]
                    |> Query.find [ Selector.class "kpi-modeller-value" ]
                    |> Query.has [ Selector.text "0.14" ]
        , test "Volume is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.find [ Selector.class "displacement" ]
                    |> Query.find [ Selector.class "kpi-modeller-value" ]
                    |> Query.has [ Selector.text "20" ]
        , test "Length over all input triggers ModifySlice" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "length-over-all" ]
                    |> Query.first
                    |> Event.simulate (Event.input "123.4")
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "123.4")
        , test "ModifySlice sets length over all" <|
            \_ ->
                Expect.equal (Just (Just 123.4))
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "123.4" ]
                        |> .slices
                        |> Dict.get "anthineas"
                        |> Maybe.map
                            (.custom
                                >> .length
                                >> Maybe.map .value
                            )
                    )

        -- , test "ModifySlice is properly sent to JS" <|
        --     \_ ->
        --         let
        --             msg =
        --                 ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "123.4"
        --         in
        --         Expect.equal
        --             (toJS [ ToJs msg ] msg (Decode.map Just EncodersDecoders.decoder))
        --         <|
        --             Just
        --                 { tag = "load-hull"
        --                 , data = setModel [ ToJs msg ] |> .slices |> Dict.get "anthineas"
        --                 }
        , test "Can press down arrow key to decrement length over all" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "length-over-all" ]
                    |> Query.first
                    |> Event.simulate ("22" |> press |> downArrow)
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "21.8")
        , test "Can press shift down arrow key to decrement length over all" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "length-over-all" ]
                    |> Query.first
                    |> Event.simulate ("22" |> press |> shift |> downArrow)
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "12.8")
        , test "Breadth input is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "breadth" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.value "6.9" ]
        , test "Breadth input triggers ModifySlice" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "breadth" ]
                    |> Query.first
                    |> Event.simulate (Event.input "123.4")
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setBreadth "anthineas" "123.4")
        , test "ModifySlice sets breadth" <|
            \_ ->
                Expect.equal (Just (Just 123.4))
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setBreadth "anthineas" "123.4" ]
                        |> .slices
                        |> Dict.get "anthineas"
                        |> Maybe.map
                            (.custom
                                >> .breadth
                                >> Maybe.map .value
                            )
                    )
        , test "Can press down arrow key to decrement breadth" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "breadth" ]
                    |> Query.first
                    |> Event.simulate ("22" |> press |> downArrow)
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setBreadth "anthineas" "5.9")
        , test "Can press up arrow key to increment breadth" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "breadth" ]
                    |> Query.first
                    |> Event.simulate ("22" |> press |> upArrow)
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setBreadth "anthineas" "7.9")
        , test "Draught input is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "draught" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.value "1.4" ]
        , test "Draught input triggers ModifySlice" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "draught" ]
                    |> Query.first
                    |> Event.simulate (Event.input "123.4")
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setDraught "anthineas" "123.4")
        , test "SetDraught sets draught" <|
            \_ ->
                Expect.equal (Just (Just 123.4))
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "anthineas" "123.4" ]
                        |> .slices
                        |> Dict.get "anthineas"
                        |> Maybe.map
                            (.custom
                                >> .draught
                                >> Maybe.map .value
                            )
                    )
        , test "Depth input is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "depth" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.value "6.8" ]
        , test "Depth input triggers ModifySlice" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "depth" ]
                    |> Query.first
                    |> Event.simulate (Event.input "123.4")
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setDepth "anthineas" "123.4")
        , test "ModifySlice sets depth" <|
            \_ ->
                Expect.equal (Just (Just 123.4))
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDepth "anthineas" "123.4" ]
                        |> .slices
                        |> Dict.get "anthineas"
                        |> Maybe.map
                            (.custom
                                >> .depth
                                >> Maybe.map .value
                            )
                    )
        , test "Prismatic Coefficient input is present" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "prismatic-coefficient" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.value "0.41" ]
        , test "Prismatic Coefficient input triggers ModifySlice" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "prismatic-coefficient" ]
                    |> Query.first
                    |> Event.simulate (Event.input "0.51")
                    |> Event.expect (ToJs <| ModifySlice HullSliceModifiers.setPrismaticCoefficient "anthineas" "0.51")
        , test "ModifySlice sets Prismatic Coefficient" <|
            \_ ->
                Expect.equal (Just 0.51)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setPrismaticCoefficient "anthineas" "0.51" ]
                        |> .slices
                        |> Dict.get "anthineas"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map getPrismaticCoefficient
                        |> Maybe.map .value
                    )
        , test "Disabled reset button when no customization" <|
            \_ ->
                modellerView
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "buttonReset" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.hidden True ]
        , test "Active reset button when customization" <|
            \_ ->
                setView
                    [ ToJs <| SelectHullReference "anthineas"
                    , ToJs <| SwitchViewMode <| Hull HullDetails
                    , ToJs <| ModifySlice HullSliceModifiers.setDepth "anthineas" "123.4"
                    ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "buttonReset" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.hidden False ]
        , test "Disabled reset button when no hull selected" <|
            \_ ->
                setView
                    [ ToJs <| SwitchViewMode <| Hull HullDetails ]
                    |> Query.fromHtml
                    |> Query.findAll [ Selector.id "buttonReset" ]
                    |> Query.first
                    |> Query.has [ Selector.attribute <| Attributes.hidden True ]
        ]
