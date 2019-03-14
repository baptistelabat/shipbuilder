module MainTests exposing (ParsedJSData, alt, ctrl, discardCmd, downArrow, keyDown, modellerView, press, setModel, setView, shift, suite, testField, testHullSliceDecoding, testHullSliceEncoding, toJS, upArrow, updateModel)

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
        , ToJs <| SwitchViewMode <| Modeller
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


suite : Test
suite =
    describe "Main"
        [ blockTests
        , initTests
        , updateTests
        , commonJSMessages
        , updateBlockPosition
        , updateBlockSize
        , integrationtestsOnMPOV
        , parseJSONSlices
        , encodeJSONTests
        ]


initTests =
    describe "init"
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
                    , data = encodeInitThreeCommand initialModel
                    }
        ]


blockTests =
    describe "Blocks"
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


updateTests =
    describe "update"
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


commonJSMessages =
    describe "Common messages From/ToJs"
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
        ]


updateBlockPosition =
    describe "Update the position of a block" <|
        let
            modelWithTwoBlocks : Model
            modelWithTwoBlocks =
                setModel
                    [ FromJs <| NewBlock blockA
                    , FromJs <| NewBlock blockB
                    ]

            updateX : Block -> Block
            updateX block =
                { block | position = StringValueInput.fromNumber "m" "x" 1 1.0 |> asXInPosition block.position }

            updateY : Block -> Block
            updateY block =
                { block | position = StringValueInput.fromNumber "m" "y" 1 2.0 |> asYInPosition block.position }

            updateZ : Block -> Block
            updateZ block =
                { block | position = StringValueInput.fromNumber "m" "z" 1 3.3 |> asZInPosition block.position }

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

        --
        -- , test "Update X from Elm == Update X from Js" <|
        --     -- CRASHES
        --     \_ ->
        --         Expect.equal updateXInAFromElm updateXInAFromJs
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

        -- , test "Update the position on multiple axis from Elm == from Js" <|
        --     \_ ->
        --         Expect.equal updateMultipleAxisFromElm updateMultipleAxisFromJs
        ]


updateBlockSize =
    describe "Update the size of a block" <|
        let
            modelWithTwoBlocks : Model
            modelWithTwoBlocks =
                setModel
                    [ FromJs <| NewBlock blockA
                    , FromJs <| NewBlock blockB
                    ]

            updateLength : Block -> Block
            updateLength block =
                { block | size = StringValueInput.fromNumber "m" "" 1 20 |> asLengthInSize block.size }

            updateWidth : Block -> Block
            updateWidth block =
                { block | size = StringValueInput.fromNumber "m" "" 1 1 |> asWidthInSize block.size }

            updateHeight : Block -> Block
            updateHeight block =
                { block | size = StringValueInput.fromNumber "m" "" 1 150.8 |> asHeightInSize block.size }

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


integrationtestsOnMPOV =
    describe "Integration tests on MPOV"
        [ test "select mpov. set draught to 1.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 48.96)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.15)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 0.63)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 3.92)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 303.52)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.18)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 1.39)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 7.19)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 797.16)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.28)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 2.09)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 7.6)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 1425.02)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.36)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 2.71)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.7)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 2099.53)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.41)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 3.29)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.38)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 2813.7)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.displacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.44)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.blockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 3.85)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.centreOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.48)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map (.metacentre >> StringValueInput.round_n 2)
                    )
        ]


parseJSONSlices =
    describe "Parse JSON slices"
        [ test "Can parse 'length'" <|
            testHullSliceDecoding (.length >> .value) 22.8
        , test "Can parse 'breadth'" <|
            testHullSliceDecoding (.breadth >> .value) 6.9
        , test "Can parse 'depth'" <|
            testHullSliceDecoding (.depth >> .value) 6.8
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


encodeJSONTests =
    describe "Encode JSON slices"
        [ test "Can encode 'length'" <|
            testHullSliceEncoding (.length >> .value) 22.8
        , test "Can encode 'breadth'" <|
            testHullSliceEncoding (.breadth >> .value) 6.9
        , test "Can encode 'depth'" <|
            testHullSliceEncoding (.depth >> .value) 6.8
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


testHullSliceEncoding : (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceEncoding =
    let
        json : String
        json =
            case Result.map (encode 0 << EncodersDecoders.encoder) (decodeString EncodersDecoders.decoder TestData.hullSliceJson) of
                Err e ->
                    Decode.errorToString e

                Ok s ->
                    s
    in
    testField EncodersDecoders.decoder json


testHullSliceDecoding : (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceDecoding =
    testField EncodersDecoders.decoder TestData.hullSliceJson


testField : Decode.Decoder a -> String -> (a -> b) -> b -> (() -> Expect.Expectation)
testField decoder json extractor expectedValue =
    \() ->
        Expect.equal (Ok expectedValue) <| Result.map extractor <| decodeString decoder json
