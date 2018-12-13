module MainTests exposing (..)

import Color
import Dict
import DictList
import Expect exposing (Expectation)
import Fuzz
import Main exposing (..)
import ExtraEvents exposing (KeyEvent)
import Test exposing (..)
import Html exposing (Html)
import Html.Attributes as Attributes
import Test.Html.Query as Query
import Test.Html.Event as Event
import Test.Html.Selector as Selector
import TestData exposing (..)
import HullReferences
import HullSlices
import Json.Decode exposing (decodeString, decodeValue, Decoder)
import Json.Encode as Encode exposing (encode)
import StringValueInput


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
                        let
                            _ =
                                Debug.log "In toJS, failed to parse:" e
                        in
                            Nothing


setModel : List Msg -> Model
setModel msgs =
    List.foldl (\msg model -> update msg model |> discardCmd) initialModel msgs


updateModel : List Msg -> Model -> Model
updateModel msgs modelToUpdate =
    List.foldl (\msg model -> update msg model |> discardCmd) modelToUpdate msgs


suite : Test
suite =
    describe "Main"
        [ describe "Blocks"
            [ test "Add one block to an empty list" <|
                \_ ->
                    Expect.equal (DictList.fromList [ ( blockA.uuid, blockA ) ]) (addBlockTo DictList.empty blockA)
            , test "Add one block to a list containing that exact block" <|
                \_ ->
                    Expect.equal (DictList.fromList [ ( blockA.uuid, blockA ) ]) (addBlockTo (DictList.fromList [ ( blockA.uuid, blockA ) ]) blockA)
            , test "Add one block to a list containing a block with the same uuid" <|
                \_ ->
                    Expect.equal
                        (DictList.fromList
                            [ ( { blockA | color = Color.yellow }.uuid
                              , { blockA | color = Color.yellow }
                              )
                            ]
                        )
                        (addBlockTo (DictList.fromList [ ( blockA.uuid, blockA ) ])
                            { blockA | color = Color.yellow }
                        )
            , test "Add one block to an existing list (same order)" <|
                \_ ->
                    Expect.equal
                        (DictList.fromList
                            [ ( blockA.uuid, blockA )
                            , ( blockB.uuid, blockB )
                            ]
                        )
                        (addBlockTo
                            (DictList.fromList
                                [ ( blockA.uuid, blockA )
                                ]
                            )
                            blockB
                        )
            , test "Add one block to an existing list (different order)" <|
                \_ ->
                    Expect.notEqual
                        (DictList.fromList
                            [ ( blockA.uuid, blockA )
                            , ( blockB.uuid, blockB )
                            ]
                        )
                        (addBlockTo
                            (DictList.fromList
                                [ ( blockB.uuid, blockB )
                                ]
                            )
                            blockA
                        )
            , test "Removing one block from a list with one block" <|
                \_ ->
                    Expect.equal
                        DictList.empty
                        (removeBlockFrom
                            (DictList.fromList [ ( blockA.uuid, blockA ) ])
                            blockA
                        )
            , test "Removing one block from a list with two block" <|
                \_ ->
                    Expect.equal
                        (DictList.fromList [ ( blockB.uuid, blockB ) ])
                        (removeBlockFrom
                            (DictList.fromList [ ( blockA.uuid, blockA ), ( blockB.uuid, blockB ) ])
                            blockA
                        )
            , test "Removing one block from a list without that block" <|
                \_ ->
                    Expect.equal
                        (DictList.fromList [ ( blockB.uuid, blockB ) ])
                        (removeBlockFrom
                            (DictList.fromList [ ( blockB.uuid, blockB ) ])
                            blockC
                        )
            , test "Removing an updated version of a block from a list with that block" <|
                \_ ->
                    Expect.equal
                        DictList.empty
                        (removeBlockFrom
                            (DictList.fromList [ ( blockA.uuid, blockA ) ])
                            { blockA | color = Color.yellow }
                        )
            , test "Removing one block from an empty list" <|
                \_ ->
                    Expect.equal
                        DictList.empty
                        (removeBlockFrom
                            (DictList.fromList [ ( blockB.uuid, blockB ) ])
                            blockB
                        )
            ]
        , describe "init"
            [ test "init with initModel" <|
                \_ ->
                    init flags
                        |> Tuple.first
                        |> Expect.equal initialModel
            , test "init has side effects" <|
                \_ ->
                    let
                        ( model, cmd ) =
                            init { buildSHA = "1.0.0", hullsJSON = "" }
                    in
                        Expect.notEqual cmd Cmd.none
            , test "initCmd is init-three" <|
                \_ ->
                    Expect.equal
                        (initCmd initialModel)
                        { tag = "init-three"
                        , data = (encodeInitThreeCommand initialModel)
                        }
            ]
        , describe "update"
            [ describe "NoJs"
                [ describe "NoOp"
                    [ test "leaves model untouched" <|
                        \_ ->
                            initialModel
                                |> update (NoJs NoOp)
                                |> Tuple.first
                                |> Expect.equal initialModel
                    , test
                        "has no side effect"
                      <|
                        \_ ->
                            initialModel
                                |> update (NoJs NoOp)
                                |> Tuple.second
                                |> Expect.equal Cmd.none
                    ]
                , describe "ToJs"
                    [ describe "ChangeBlockColor"
                        [ test "updates only the color of the given block" <|
                            \_ ->
                                { initialModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockA Color.yellow)
                                    |> Tuple.first
                                    |> Expect.equal { initialModel | blocks = DictList.fromList [ ( blockA.uuid, { blockA | color = Color.yellow } ) ] }
                        , test "leaves model untouched if the block doesn't exist" <|
                            \_ ->
                                { initialModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockB Color.yellow)
                                    |> Tuple.first
                                    |> Expect.equal { initialModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                        , test "has a side effect" <|
                            \_ ->
                                { initialModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockA Color.yellow)
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        , test "has no side effect if the block doesn't exist" <|
                            \_ ->
                                { initialModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockB Color.yellow)
                                    |> Tuple.second
                                    |> Expect.equal Cmd.none
                        ]
                    , describe "AddBlock"
                        [ test "leaves the model untouched" <|
                            \_ ->
                                initialModel
                                    |> update (ToJs <| AddBlock "aLabel")
                                    |> Tuple.first
                                    |> Expect.equal initialModel
                        , test "has a side effect" <|
                            \_ ->
                                initialModel
                                    |> update (ToJs <| AddBlock "aLabel")
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        , fuzz Fuzz.string "leaves the model untouched no matter the label" <|
                            \label ->
                                initialModel
                                    |> update (ToJs <| AddBlock label)
                                    |> Tuple.first
                                    |> Expect.equal initialModel
                        , fuzz Fuzz.string "has a side effect no matter the label" <|
                            \label ->
                                initialModel
                                    |> update (ToJs <| AddBlock label)
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        ]
                    ]
                ]
            ]
        , describe "Common messages From/ToJs"
            [ describe "Select a block" <|
                let
                    selectOneInElm : Model
                    selectOneInElm =
                        setModel
                            [ FromJs <| NewBlock blockA
                            , FromJs <| NewBlock blockB
                            , ToJs <| SelectBlock blockA
                            ]

                    selectOneInJs : Model
                    selectOneInJs =
                        setModel
                            [ FromJs <| NewBlock <| blockA
                            , FromJs <| NewBlock blockB
                            , FromJs <| Select blockA.uuid
                            ]

                    selectSecondInElm : Model
                    selectSecondInElm =
                        updateModel [ NoJs <| SetMultipleSelect True, ToJs <| SelectBlock blockB, NoJs <| SetMultipleSelect False ] selectOneInElm

                    selectSecondInJs : Model
                    selectSecondInJs =
                        updateModel [ FromJs <| AddToSelection blockB.uuid ] selectOneInJs

                    unselectFirstInElm : Model
                    unselectFirstInElm =
                        updateModel [ NoJs <| SetMultipleSelect True, ToJs <| SelectBlock blockA, NoJs <| SetMultipleSelect False ] selectSecondInElm

                    unselectFirstInJs : Model
                    unselectFirstInJs =
                        updateModel [ FromJs <| RemoveFromSelection blockA.uuid ] selectSecondInJs
                in
                    [ test "Select a block in Elm" <|
                        \_ ->
                            selectOneInElm
                                |> .selectedBlocks
                                |> Expect.equal [ blockA.uuid ]
                    , test "Select a block in Js" <|
                        \_ ->
                            selectOneInJs
                                |> .selectedBlocks
                                |> Expect.equal [ blockA.uuid ]
                    , test "Select a block in Js == Select a block in Elm" <|
                        \_ ->
                            Expect.equal selectOneInElm selectOneInJs
                    , test "Select second block in Elm" <|
                        \_ ->
                            selectSecondInElm
                                |> .selectedBlocks
                                |> Expect.equal [ blockA.uuid, blockB.uuid ]
                    , test "Select second block in Js" <|
                        \_ ->
                            selectSecondInJs
                                |> .selectedBlocks
                                |> Expect.equal [ blockA.uuid, blockB.uuid ]
                    , test "Select second block in Js == Select second block in Elm" <|
                        \_ ->
                            Expect.equal selectSecondInElm selectSecondInJs
                    , test "Unselect first block in Elm" <|
                        \_ ->
                            unselectFirstInElm
                                |> .selectedBlocks
                                |> Expect.equal [ blockB.uuid ]
                    , test "Unselect first block in Js" <|
                        \_ ->
                            unselectFirstInJs
                                |> .selectedBlocks
                                |> Expect.equal [ blockB.uuid ]
                    , test "Unselect first block in Js == Unselect first block in Elm" <|
                        \_ ->
                            Expect.equal unselectFirstInElm unselectFirstInJs
                    ]
            , describe "Update the position of a block" <|
                let
                    modelWithTwoBlocks : Model
                    modelWithTwoBlocks =
                        setModel
                            [ FromJs <| NewBlock blockA
                            , FromJs <| NewBlock blockB
                            ]

                    updateX : Block -> Block
                    updateX block =
                        { block | position = StringValueInput.fromNumber "" "" 1.0 |> asXInPosition block.position }

                    updateY : Block -> Block
                    updateY block =
                        { block | position = StringValueInput.fromNumber "" "" 2.0 |> asYInPosition block.position }

                    updateZ : Block -> Block
                    updateZ block =
                        { block | position = StringValueInput.fromNumber "" "" 3.3 |> asZInPosition block.position }

                    updateXInAFromElm : Model
                    updateXInAFromElm =
                        updateModel [ ToJs <| UpdatePosition X blockA "1" ] modelWithTwoBlocks

                    updateXInAFromJs : Model
                    updateXInAFromJs =
                        updateModel [ FromJs <| SynchronizePosition blockA.uuid (.position <| updateX blockA) ] modelWithTwoBlocks

                    updateMultipleAxisFromElm : Model
                    updateMultipleAxisFromElm =
                        updateModel [ ToJs <| UpdatePosition X blockB "1", ToJs <| UpdatePosition Y blockB "2", ToJs <| UpdatePosition Z blockB "3.3" ] modelWithTwoBlocks

                    updateMultipleAxisFromJs : Model
                    updateMultipleAxisFromJs =
                        updateModel [ FromJs <| SynchronizePosition blockB.uuid (.position <| updateX <| updateZ <| updateY blockB) ] modelWithTwoBlocks
                in
                    [ test "Update X from Elm" <|
                        \_ ->
                            updateXInAFromElm
                                |> .blocks
                                |> toList
                                |> Expect.equal [ updateX blockA, blockB ]
                    , test "Update X from Js" <|
                        \_ ->
                            updateXInAFromJs
                                |> .blocks
                                |> toList
                                |> Expect.equal [ updateX blockA, blockB ]
                    , test "Update X from Elm == Update X from Js" <|
                        \_ ->
                            Expect.equal updateXInAFromElm updateXInAFromJs
                    , test "Update the position on multiple axis from Elm" <|
                        \_ ->
                            updateMultipleAxisFromElm
                                |> .blocks
                                |> toList
                                |> Expect.equal [ blockA, updateX <| updateY <| updateZ blockB ]
                    , test "Update the position on multiple axis from Js" <|
                        \_ ->
                            updateMultipleAxisFromJs
                                |> .blocks
                                |> toList
                                |> Expect.equal [ blockA, updateX <| updateY <| updateZ blockB ]
                    , test "Update the position on multiple axis from Elm == from Js" <|
                        \_ ->
                            Expect.equal updateMultipleAxisFromElm updateMultipleAxisFromJs
                    ]
            , describe "Update the size of a block" <|
                let
                    modelWithTwoBlocks : Model
                    modelWithTwoBlocks =
                        setModel
                            [ FromJs <| NewBlock blockA
                            , FromJs <| NewBlock blockB
                            ]

                    updateLength : Block -> Block
                    updateLength block =
                        { block | size = StringValueInput.fromNumber "" "" 20 |> asLengthInSize block.size }

                    updateWidth : Block -> Block
                    updateWidth block =
                        { block | size = StringValueInput.fromNumber "" "" 1 |> asWidthInSize block.size }

                    updateHeight : Block -> Block
                    updateHeight block =
                        { block | size = StringValueInput.fromNumber "" "" 150.8 |> asHeightInSize block.size }

                    updateLengthInAFromElm : Model
                    updateLengthInAFromElm =
                        updateModel [ ToJs <| UpdateDimension Length blockA "20" ] modelWithTwoBlocks

                    updateLengthInAFromJs : Model
                    updateLengthInAFromJs =
                        updateModel [ FromJs <| SynchronizeSize blockA.uuid (.size <| updateLength blockA) ] modelWithTwoBlocks

                    updateMultipleDimensionFromElm : Model
                    updateMultipleDimensionFromElm =
                        updateModel [ ToJs <| UpdateDimension Length blockB "20", ToJs <| UpdateDimension Width blockB "1", ToJs <| UpdateDimension Height blockB "150.8" ] modelWithTwoBlocks

                    updateMultipleDimensionFromJs : Model
                    updateMultipleDimensionFromJs =
                        updateModel [ FromJs <| SynchronizeSize blockB.uuid (.size <| updateLength <| updateWidth <| updateHeight blockB) ] modelWithTwoBlocks
                in
                    [ test "Update length from Elm" <|
                        \_ ->
                            updateLengthInAFromElm
                                |> .blocks
                                |> toList
                                |> Expect.equal [ updateLength blockA, blockB ]
                    , test "Update length from Js" <|
                        \_ ->
                            updateLengthInAFromJs
                                |> .blocks
                                |> toList
                                |> Expect.equal [ updateLength blockA, blockB ]
                    , test "Update length from Elm == Update length from Js" <|
                        \_ ->
                            Expect.equal updateLengthInAFromElm updateLengthInAFromJs
                    , test "Update the size on multiple dimensions from Elm" <|
                        \_ ->
                            updateMultipleDimensionFromElm
                                |> .blocks
                                |> toList
                                |> Expect.equal [ blockA, updateLength <| updateWidth <| updateHeight blockB ]
                    , test "Update the size on multiple dimensions from Js" <|
                        \_ ->
                            updateMultipleDimensionFromJs
                                |> .blocks
                                |> toList
                                |> Expect.equal [ blockA, updateLength <| updateWidth <| updateHeight blockB ]
                    , test "Update the size on multiple dimensions from Elm == from Js" <|
                        \_ ->
                            Expect.equal updateMultipleDimensionFromElm updateMultipleDimensionFromJs
                    ]
            ]
        , describe "UI" <|
            [ describe "ViewMode"
                [ test "Hull panel is the default" <|
                    \_ ->
                        initialView
                            |> Query.fromHtml
                            |> Query.find [ Selector.class "panel" ]
                            |> Query.has [ Selector.class "hull-panel" ]
                , test "Hull panel is displayed when switching mode" <|
                    \_ ->
                        setView
                            [ ToJs <| SwitchViewMode <| HullStudio ]
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
                            [ ToJs <| SwitchViewMode <| Modeller ]
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
                , test "The first tab-item triggers HullStudio" <|
                    \_ ->
                        initialView
                            |> Query.fromHtml
                            |> Query.findAll [ Selector.class "tab-item" ]
                            |> Query.index 0
                            |> Event.simulate Event.click
                            |> Event.expect (ToJs <| SwitchViewMode HullStudio)
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
                , test "The fourth tab-item triggers Modeller" <|
                    \_ ->
                        initialView
                            |> Query.fromHtml
                            |> Query.findAll [ Selector.class "tab-item" ]
                            |> Query.index 4
                            |> Event.simulate Event.click
                            |> Event.expect (ToJs <| SwitchViewMode Modeller)
                ]
            , describe "HullStudio" <|
                let
                    hullRef : HullReferences.HullReference
                    hullRef =
                        Maybe.withDefault { path = "tests/assets", label = "Test asset" } <| List.head hullReferences
                in
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
                                |> Query.has [ Selector.text "anthineas" ]
                    , test "Clicking a hull reference selects it" <|
                        \_ ->
                            initialView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.class "hull-reference" ]
                                |> Query.index 1
                                |> Event.simulate Event.click
                                |> Event.expect (ToJs <| SelectHullReference "anthineas")
                    ]
            , describe "Partitions" <|
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
                            , ToJs <| UpdatePartitionNumber Deck (toString numberOfDecks)
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
                            , ToJs <| UpdatePartitionNumber Bulkhead (toString numberOfBulkheads)
                            , NoJs <| ToggleAccordion True "bulkhead-spacing-details"
                            ]
                            |> Query.fromHtml
                            |> Query.find [ Selector.class "bulkheads" ]
                            |> Query.find [ Selector.class "spacing-details" ]
                            |> Query.find [ Selector.tag "ul" ]
                            |> Query.children [ Selector.tag "li" ]
                            |> Query.count (Expect.equal numberOfBulkheads)
                ]
            , describe "Blocks list" <|
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
                            |> List.indexedMap (\index block -> { block | uuid = toString index, label = toString index })
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
            , describe "Block details" <|
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
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.has [ Selector.tag "input", Selector.id "position-x" ]
                    , test "Input for the position of the block on X triggers UpdatePosition X" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-x" ]
                                |> Event.simulate (Event.input "-8")
                                |> Event.expect (ToJs <| UpdatePosition X blockA "-8")
                    , test "onBlur on position on X triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-x" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
                    , test "Block details view displays an input for the position on Y" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.has [ Selector.tag "input", Selector.id "position-y" ]
                    , test "Input for the position of the block on Y triggers UpdatePosition Y" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-y" ]
                                |> Event.simulate (Event.input "1.2")
                                |> Event.expect (ToJs <| UpdatePosition Y blockA "1.2")
                    , test "onBlur on position on Y triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-y" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
                    , test "Block details view displays an input for the position on Z" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.has [ Selector.tag "input", Selector.id "position-z" ]
                    , test "Input for the position of the block on Z triggers UpdatePosition Z" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-z" ]
                                |> Event.simulate (Event.input "199")
                                |> Event.expect (ToJs <| UpdatePosition Z blockA "199")
                    , test "onBlur on position on Z triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "position-z" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
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
                    , test "onBlur on length triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "size-length" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
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
                    , test "onBlur on width triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "size-width" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
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
                    , test "onBlur on height triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "size-height" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
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
                    , test "onBlur on density triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "block-density-input" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
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
                    , test "onBlur on mass triggers SyncBlockInputs" <|
                        \_ ->
                            blockDetailsView
                                |> Query.fromHtml
                                |> Query.find [ Selector.class "panel" ]
                                |> Query.find [ Selector.tag "input", Selector.id "block-mass-input" ]
                                |> Event.simulate Event.blur
                                |> Event.expect (NoJs <| SyncBlockInputs blockA)
                    ]
            , describe "KPIs" <|
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
            , describe "Modeller" <|
                let
                    modellerView =
                        setView
                            [ ToJs <| SelectHullReference "anthineas"
                            , ToJs <| SwitchViewMode <| Modeller
                            ]
                in
                    [ test "Length over all input is present" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "length-over-all" ]
                                |> Query.first
                                |> Query.has [ Selector.attribute <| Attributes.value "22.84600067138672" ]
                    , test "Length over all input triggers SetLengthOverAll" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "length-over-all" ]
                                |> Query.first
                                |> Event.simulate (Event.input "123.4")
                                |> Event.expect (ToJs <| SetLengthOverAll "anthineas" "123.4")
                    , test "SetLengthOverAll sets length over all" <|
                        \_ ->
                            Expect.equal (Just 123.4)
                                (setModel [ ToJs <| SetLengthOverAll "anthineas" "123.4" ]
                                    |> .slices
                                    |> Dict.get "anthineas"
                                    |> Maybe.map (.length >> .value)
                                )
                    , test "SetLengthOverAll is properly sent to JS" <|
                        \_ ->
                            let
                                msg =
                                    SetLengthOverAll "anthineas" "123.4"
                            in
                                Expect.equal
                                    (toJS [ ToJs msg ] msg (Json.Decode.map Just HullSlices.decoder))
                                <|
                                    Just
                                        { tag = "load-hull"
                                        , data = setModel [ ToJs msg ] |> .slices |> Dict.get "anthineas"
                                        }
                    , test "Can press down arrow key to decrement length over all" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "length-over-all" ]
                                |> Query.first
                                |> Event.simulate ("22" |> press |> downArrow)
                                |> Event.expect (ToJs <| SetLengthOverAll "anthineas" "21.84600067138672")
                    , test "Can press shift down arrow key to decrement length over all" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "length-over-all" ]
                                |> Query.first
                                |> Event.simulate ("22" |> press |> shift |> downArrow)
                                |> Event.expect (ToJs <| SetLengthOverAll "anthineas" "12.846000671386719")
                    , test "Breadth input is present" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "breadth" ]
                                |> Query.first
                                |> Query.has [ Selector.attribute <| Attributes.value "6.8935699462890625" ]
                    , test "Breadth input triggers SetBreadth" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "breadth" ]
                                |> Query.first
                                |> Event.simulate (Event.input "123.4")
                                |> Event.expect (ToJs <| SetBreadth "anthineas" "123.4")
                    , test "SetBreadth sets breadth" <|
                        \_ ->
                            Expect.equal (Just 123.4)
                                (setModel [ ToJs <| SetBreadth "anthineas" "123.4" ]
                                    |> .slices
                                    |> Dict.get "anthineas"
                                    |> Maybe.map (.breadth >> .value)
                                )
                    , test "SetBreadth is properly sent to JS" <|
                        \_ ->
                            let
                                msg =
                                    SetBreadth "anthineas" "123.4"
                            in
                                Expect.equal
                                    (toJS [ ToJs msg ] msg (Json.Decode.map Just HullSlices.decoder))
                                <|
                                    Just
                                        { tag = "load-hull"
                                        , data = setModel [ ToJs msg ] |> .slices |> Dict.get "anthineas"
                                        }
                    , test "Can press down arrow key to decrement breadth" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "breadth" ]
                                |> Query.first
                                |> Event.simulate ("22" |> press |> downArrow)
                                |> Event.expect (ToJs <| SetBreadth "anthineas" "5.8935699462890625")
                    , test "Can press up arrow key to increment breadth" <|
                        \_ ->
                            modellerView
                                |> Query.fromHtml
                                |> Query.findAll [ Selector.id "breadth" ]
                                |> Query.first
                                |> Event.simulate ("22" |> press |> upArrow)
                                |> Event.expect (ToJs <| SetBreadth "anthineas" "7.8935699462890625")
                    ]
            ]
        , describe "Parse JSON slices"
            [ test "Can parse 'length'" <|
                testHullSliceDecoding (.length >> .value) 22.84600067138672
            , test "Can parse 'breadth'" <|
                testHullSliceDecoding (.breadth >> .value) 6.8935699462890625
            , test "Can parse 'mouldedDepth'" <|
                testHullSliceDecoding (.mouldedDepth >> .value) 6.83698582649231
            , test "Can parse 'xmin'" <|
                testHullSliceDecoding .xmin -1
            , test "Can parse 'ymin'" <|
                testHullSliceDecoding .ymin -3.4467999935150146
            , test "Can parse 'zmin'" <|
                testHullSliceDecoding .zmin -6.146999835968018
            , test "Can parse 'slices/x'" <|
                testHullSliceDecoding (.slices >> List.map .x) [ 0.00437713372412022, 0.1111111111111111 ]
            , test "Can parse 'slices/zmin'" <|
                testHullSliceDecoding (.slices >> List.map .zmin) [ 0.31587930659489755, 0.07246874145311905 ]
            , test "Can parse 'slices/zmax'" <|
                testHullSliceDecoding (.slices >> List.map .zmax) [ 0.5298349579969897, 0.9851376673994297 ]
            , test "Can parse 'slices/y'" <|
                testHullSliceDecoding (.slices >> List.map .y >> List.head)
                    (Just
                        [ 0.964899527258786
                        , 0.9648943694688346
                        , 0.9629765202249831
                        , 0.9592250480632435
                        , 0.955473575901504
                        , 0.9502377948034448
                        , 0.9394176761317832
                        , 0.9282437133662546
                        , 0.9102579602794127
                        , 0.742320749879794
                        ]
                    )
            ]
        , describe "Encode JSON slices"
            [ test "Can encode 'length'" <|
                testHullSliceEncoding (.length >> .value) 22.84600067138672
            , test "Can encode 'breadth'" <|
                testHullSliceEncoding (.breadth >> .value) 6.8935699462890625
            , test "Can encode 'mouldedDepth'" <|
                testHullSliceEncoding (.mouldedDepth >> .value) 6.83698582649231
            , test "Can encode 'xmin'" <|
                testHullSliceEncoding .xmin -1
            , test "Can encode 'ymin'" <|
                testHullSliceEncoding .ymin -3.4467999935150146
            , test "Can encode 'zmin'" <|
                testHullSliceEncoding .zmin -6.146999835968018
            , test "Can encode 'slices/x'" <|
                testHullSliceEncoding (.slices >> List.map .x) [ 0.00437713372412022, 0.1111111111111111 ]
            , test "Can encode 'slices/zmin'" <|
                testHullSliceEncoding (.slices >> List.map .zmin) [ 0.31587930659489755, 0.07246874145311905 ]
            , test "Can encode 'slices/zmax'" <|
                testHullSliceEncoding (.slices >> List.map .zmax) [ 0.5298349579969897, 0.9851376673994297 ]
            , test "Can encode 'slices/y'" <|
                testHullSliceEncoding (.slices >> List.map .y >> List.head)
                    (Just
                        [ 0.964899527258786
                        , 0.9648943694688346
                        , 0.9629765202249831
                        , 0.9592250480632435
                        , 0.955473575901504
                        , 0.9502377948034448
                        , 0.9394176761317832
                        , 0.9282437133662546
                        , 0.9102579602794127
                        , 0.742320749879794
                        ]
                    )
            ]
        ]


testHullSliceEncoding : (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceEncoding =
    let
        json : String
        json =
            case Result.map (encode 0 << HullSlices.encoder) (decodeString HullSlices.decoder TestData.hullSliceJson) of
                Err e ->
                    e

                Ok s ->
                    s
    in
        testField HullSlices.decoder json


testHullSliceDecoding : (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceDecoding =
    testField HullSlices.decoder TestData.hullSliceJson


testField : Json.Decode.Decoder a -> String -> (a -> b) -> b -> (() -> Expect.Expectation)
testField decoder json extractor expectedValue =
    \() ->
        Expect.equal (Ok expectedValue) <| Result.map extractor <| (decodeString decoder json)
