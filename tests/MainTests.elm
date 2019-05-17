module MainTests exposing (ParsedJSData, alt, ctrl, discardCmd, downArrow, keyDown, modellerView, press, setModel, setView, shift, suite, testField, testHullSliceDecoding, testHullSliceEncoding, toJS, upArrow, updateModel)

import Color
import Dict
import DictList exposing (DictList)
import EncodersDecoders exposing (getHashImageForSlices)
import Expect exposing (Expectation)
import ExtraEvents exposing (KeyEvent)
import Fuzz
import Html exposing (Html)
import Html.Attributes as Attributes
import HullReferences
import HullSliceModifiers
import HullSlices
import HullSlicesMetrics exposing (fillHullSliceMetrics, getBlockCoefficient, getCenterOfBuoyancy, getDisplacement, getMetacentre)
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
        , testUpdateCenterOfGravity
        , testHullSlicesHash
        , testImportHullSlicesLibrary
        , testRenameHullInLibrary
        , testSaveAsNewHullInLibrary
        , testReadFromClipboard
        , testPasteFromClipboard
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
                            |> updateNoJs NoOp
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

            updateCenterOfGravity : Float -> Float -> Float -> Block -> Block
            updateCenterOfGravity x y z block =
                { block
                    | centerOfGravity =
                        { x = StringValueInput.fromNumber "m" "x" 1 x
                        , y = StringValueInput.fromNumber "m" "y" 1 y
                        , z = StringValueInput.fromNumber "m" "z" 1 z
                        }
                }

            updateCenterOfGravityFixed : Bool -> Block -> Block
            updateCenterOfGravityFixed boolean block =
                { block | centerOfGravityFixed = boolean }

            updateLengthInAFromElm : Model
            updateLengthInAFromElm =
                updateModel [ ToJs <| UpdateDimension Length blockA "20" ] modelWithTwoBlocks

            updateLengthInAFromJs : Model
            updateLengthInAFromJs =
                updateModel [ FromJs <| SynchronizeSize blockA.uuid (.size <| updateLength blockA) ] modelWithTwoBlocks

            updateMultipleDimensionFromElm : Model
            updateMultipleDimensionFromElm =
                updateModel
                    [ ToJs <| UpdateDimension Length blockB "20"
                    , ToJs <| UpdateDimension Width blockB "1"
                    , ToJs <| UpdateDimension Height blockB "150.8"
                    ]
                    modelWithTwoBlocks

            updateMultipleDimensionFromJs : Model
            updateMultipleDimensionFromJs =
                updateModel [ FromJs <| SynchronizeSize blockB.uuid (.size <| updateLength <| updateWidth <| updateHeight blockB) ] modelWithTwoBlocks

            updateCogThenLengthInAFromElm : Model
            updateCogThenLengthInAFromElm =
                updateModel
                    [ NoJs <| UpdateCenterOfGravity X blockA "7"
                    , ToJs <| UpdateDimension Length blockA "20"
                    ]
                    modelWithTwoBlocks

            updateCogThenLengthInAFromJs : Model
            updateCogThenLengthInAFromJs =
                updateModel
                    [ NoJs <| UpdateCenterOfGravity X blockA "7"
                    , FromJs <| SynchronizeSize blockA.uuid (.size <| updateLength blockA)
                    ]
                    modelWithTwoBlocks
        in
        [ test "Update length from Elm" <|
            \_ ->
                updateLengthInAFromElm
                    |> .blocks
                    |> toList
                    |> Expect.equal [ updateCenterOfGravity 10 5 5 <| updateLength blockA, blockB ]
        , test "Update length from Js" <|
            \_ ->
                updateLengthInAFromJs
                    |> .blocks
                    |> toList
                    |> Expect.equal [ updateCenterOfGravity 10 5 5 <| updateLength blockA, blockB ]
        , test "Update length from Elm with fixed Cog" <|
            \_ ->
                updateCogThenLengthInAFromElm
                    |> .blocks
                    |> toList
                    |> Expect.equal [ updateCenterOfGravity 7 5 5 <| updateCenterOfGravityFixed True <| updateLength blockA, blockB ]
        , test "Update length from Js with fixed Cog" <|
            \_ ->
                updateCogThenLengthInAFromJs
                    |> .blocks
                    |> toList
                    |> Expect.equal [ updateCenterOfGravity 7 5 5 <| updateCenterOfGravityFixed True <| updateLength blockA, blockB ]
        , test "Update length from Elm == Update length from Js" <|
            \_ ->
                Expect.equal updateLengthInAFromElm updateLengthInAFromJs
        , test "Update the size on multiple dimensions from Elm" <|
            \_ ->
                updateMultipleDimensionFromElm
                    |> .blocks
                    |> toList
                    |> Expect.equal [ blockA, updateCenterOfGravity 10 0.5 75.4 <| updateLength <| updateWidth <| updateHeight blockB ]
        , test "Update the size on multiple dimensions from Js" <|
            \_ ->
                updateMultipleDimensionFromJs
                    |> .blocks
                    |> toList
                    |> Expect.equal [ blockA, updateCenterOfGravity 10 0.5 75.4 <| updateLength <| updateWidth <| updateHeight blockB ]
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
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.15)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 0.63)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 1.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 3.92)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "1.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 303.52)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.18)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 1.39)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 2.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 7.19)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "2.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 797.16)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.28)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 2.09)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 3.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 7.6)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "3.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 1425.02)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.36)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 2.71)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 4.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.7)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "4.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 2099.53)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.41)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 3.29)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 5.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.38)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "5.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify displacement" <|
            \_ ->
                Expect.equal (Just 2813.7)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getDisplacement >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify block coefficient" <|
            \_ ->
                Expect.equal (Just 0.44)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getBlockCoefficient >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify KB" <|
            \_ ->
                Expect.equal (Just 3.85)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getCenterOfBuoyancy >> StringValueInput.round_n 2)
                    )
        , test "select mpov. set draught to 6.0 and verify KM" <|
            \_ ->
                Expect.equal (Just 6.48)
                    (setModel [ ToJs <| ModifySlice HullSliceModifiers.setDraught "mpov" "6.0" ]
                        |> .slices
                        |> Dict.get "mpov"
                        |> Maybe.map fillHullSliceMetrics
                        |> Maybe.map (getMetacentre >> StringValueInput.round_n 2)
                    )
        ]


parseJSONSlices =
    describe "Parse JSON slices"
        [ test "Can parse 'length'" <|
            testHullSliceDecoding TestData.hullSliceJson (.length >> .value) 22.8
        , test "Can parse 'breadth'" <|
            testHullSliceDecoding TestData.hullSliceJson (.breadth >> .value) 6.9
        , test "Can parse 'depth'" <|
            testHullSliceDecoding TestData.hullSliceJson (.depth >> .value) 6.8
        , test "Can parse 'xmin'" <|
            testHullSliceDecoding TestData.hullSliceJson .xmin -1
        , test "Can parse 'zmin'" <|
            testHullSliceDecoding TestData.hullSliceJson .zmin -6.146999835968018
        , test "Can parse 'slices/x'" <|
            testHullSliceDecoding TestData.hullSliceJson (.slices >> List.map .x) [ 0, 1 ]
        , test "Can parse 'slices/zmin'" <|
            testHullSliceDecoding TestData.hullSliceJson (.slices >> List.map .zmin) [ 0.31587930659489755, 0.07246874145311905 ]
        , test "Can parse 'slices/zmax'" <|
            testHullSliceDecoding TestData.hullSliceJson (.slices >> List.map .zmax) [ 0.5298349579969897, 0.9851376673994297 ]
        , test "Can parse 'slices/y'" <|
            testHullSliceDecoding TestData.hullSliceJson
                (.slices >> List.map .y >> List.head)
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
        , test "Can parse 'custom length'" <|
            testHullSliceDecoding TestData.hullSliceJsonCustomized (.custom >> .length >> Maybe.map .value) <|
                Just 20
        , test "Can parse 'custom breadth'" <|
            testHullSliceDecoding TestData.hullSliceJsonCustomized (.custom >> .breadth >> Maybe.map .value) <|
                Just 5
        , test "Can parse 'custom depth'" <|
            testHullSliceDecoding TestData.hullSliceJsonCustomized (.custom >> .depth >> Maybe.map .value) <|
                Just 12
        , test "Can parse 'custom draught'" <|
            testHullSliceDecoding TestData.hullSliceJsonCustomized (.custom >> .draught >> Maybe.map .value) <|
                Just 3
        , test "Can parse 'custom hullslicesPositions'" <|
            testHullSliceDecoding TestData.hullSliceJsonCustomized (.custom >> .hullslicesPositions) <|
                Just
                    [ 0.00437713372412022
                    , 0.05
                    , 0.1
                    , 0.25
                    , 0.37
                    , 0.5555555555555556
                    , 0.73
                    , 0.8
                    , 0.95
                    , 0.9956228662758797
                    ]
        ]


encodeJSONTests =
    describe "Encode JSON slices"
        [ test "Can encode 'length'" <|
            testHullSliceEncoding TestData.hullSliceJson (.length >> .value) 22.8
        , test "Can encode 'breadth'" <|
            testHullSliceEncoding TestData.hullSliceJson (.breadth >> .value) 6.9
        , test "Can encode 'depth'" <|
            testHullSliceEncoding TestData.hullSliceJson (.depth >> .value) 6.8
        , test "Can encode 'xmin'" <|
            testHullSliceEncoding TestData.hullSliceJson .xmin -1
        , test "Can encode 'zmin'" <|
            testHullSliceEncoding TestData.hullSliceJson .zmin -6.146999835968018
        , test "Can encode 'slices/x'" <|
            testHullSliceEncoding TestData.hullSliceJson (.slices >> List.map .x) [ 0, 1 ]
        , test "Can encode 'slices/zmin'" <|
            testHullSliceEncoding TestData.hullSliceJson (.slices >> List.map .zmin) [ 0.31587930659489755, 0.07246874145311905 ]
        , test "Can encode 'slices/zmax'" <|
            testHullSliceEncoding TestData.hullSliceJson (.slices >> List.map .zmax) [ 0.5298349579969897, 0.9851376673994297 ]
        , test "Can encode 'slices/y'" <|
            testHullSliceEncoding TestData.hullSliceJson
                (.slices >> List.map .y >> List.head)
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
        , test "Can encode 'custom length'" <|
            testHullSliceEncoding TestData.hullSliceJsonCustomized (.custom >> .length >> Maybe.map .value) <|
                Just 20
        , test "Can encode 'custom breadth'" <|
            testHullSliceEncoding TestData.hullSliceJsonCustomized (.custom >> .breadth >> Maybe.map .value) <|
                Just 5
        , test "Can encode 'custom depth'" <|
            testHullSliceEncoding TestData.hullSliceJsonCustomized (.custom >> .depth >> Maybe.map .value) <|
                Just 12
        , test "Can encode 'custom draught'" <|
            testHullSliceEncoding TestData.hullSliceJsonCustomized (.custom >> .draught >> Maybe.map .value) <|
                Just 3
        , test "Can encode 'custom hullslicesPositions'" <|
            testHullSliceEncoding TestData.hullSliceJsonCustomized (.custom >> .hullslicesPositions) <|
                Just
                    [ 0.00437713372412022
                    , 0.05
                    , 0.1
                    , 0.25
                    , 0.37
                    , 0.5555555555555556
                    , 0.73
                    , 0.8
                    , 0.95
                    , 0.9956228662758797
                    ]
        , test "Encoding unchanged hullslices store no custom properties" <|
            \_ ->
                let
                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (TestData.anthineas |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.equal
                    { length = Nothing
                    , breadth = Nothing
                    , depth = Nothing
                    , draught = Nothing
                    , hullslicesPositions = Nothing
                    }
                    hullSlicesEncodedThenDecoded.custom
        , test "Encoding hullslices with custom length store custom length property" <|
            \_ ->
                let
                    customizedHullSlices : HullSlices.HullSlices
                    customizedHullSlices =
                        TestData.anthineas
                            |> HullSliceModifiers.setLengthOverAll "20"

                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (customizedHullSlices |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.notEqual Nothing hullSlicesEncodedThenDecoded.custom.length
        , test "Encoding hullslices with custom breadth store custom breadth property" <|
            \_ ->
                let
                    customizedHullSlices : HullSlices.HullSlices
                    customizedHullSlices =
                        TestData.anthineas
                            |> HullSliceModifiers.setBreadth "8"

                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (customizedHullSlices |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.notEqual Nothing hullSlicesEncodedThenDecoded.custom.breadth
        , test "Encoding hullslices with custom depth store custom depth property" <|
            \_ ->
                let
                    customizedHullSlices : HullSlices.HullSlices
                    customizedHullSlices =
                        TestData.anthineas
                            |> HullSliceModifiers.setDepth "5"

                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (customizedHullSlices |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.notEqual Nothing hullSlicesEncodedThenDecoded.custom.depth
        , test "Encoding hullslices with custom draught store custom draught property" <|
            \_ ->
                let
                    customizedHullSlices : HullSlices.HullSlices
                    customizedHullSlices =
                        TestData.anthineas
                            |> HullSliceModifiers.setDraught "3"

                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (customizedHullSlices |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.notEqual Nothing hullSlicesEncodedThenDecoded.custom.draught
        , test "Encoding hullslices with custom hullslices position store custom hullslices position property" <|
            \_ ->
                let
                    customizedHullSlices : HullSlices.HullSlices
                    customizedHullSlices =
                        TestData.anthineas
                            |> HullSliceModifiers.setPrismaticCoefficient "0.5"

                    hullSlicesEncodedThenDecoded : HullSlices.HullSlices
                    hullSlicesEncodedThenDecoded =
                        case Decode.decodeString EncodersDecoders.decoder (customizedHullSlices |> (encode 0 << EncodersDecoders.encoder)) of
                            Ok c ->
                                c

                            Err _ ->
                                HullSlices.emptyHullSlices
                in
                Expect.notEqual Nothing hullSlicesEncodedThenDecoded.custom.hullslicesPositions
        ]


testHullSliceEncoding : String -> (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceEncoding slicesToTest =
    let
        json : String
        json =
            case Result.map (encode 0 << EncodersDecoders.encoder) (decodeString EncodersDecoders.decoder slicesToTest) of
                Err e ->
                    Decode.errorToString e

                Ok s ->
                    s
    in
    testField EncodersDecoders.decoder json


testHullSliceDecoding : String -> (HullSlices.HullSlices -> b) -> b -> (() -> Expect.Expectation)
testHullSliceDecoding slicesToTest =
    testField EncodersDecoders.decoder slicesToTest


testUpdateCenterOfGravity =
    describe "Update the global center of gravity" <|
        let
            modelWithTwoBlocks : Model
            modelWithTwoBlocks =
                setModel
                    [ FromJs <| NewBlock blockA
                    , FromJs <| NewBlock blockB
                    ]
        in
        [ test "Global center of gravity when no block has a mass" <|
            \_ ->
                modelWithTwoBlocks
                    |> .globalCenterOfGravity
                    |> Expect.equal { x = 0, y = 0, z = 0 }
        , test "Global center of gravity when only one block has a mass" <|
            \_ ->
                updateModel [ NoJs <| UpdateMass blockA "1" ] modelWithTwoBlocks
                    |> .globalCenterOfGravity
                    |> Expect.equal { x = 5, y = 5, z = -5 }
        , test "Global center of gravity when two blocks have a mass" <|
            \_ ->
                updateModel
                    [ NoJs <| UpdateMass blockA "1"
                    , NoJs <| UpdateMass blockB "1"
                    , ToJs <| UpdatePosition X blockB "10"
                    ]
                    modelWithTwoBlocks
                    |> .globalCenterOfGravity
                    |> Expect.equal { x = 10, y = 5, z = -5 }
        ]


testHullSlicesHash =
    describe "Hash HullSlices with SHA1" <|
        [ test "Can hash a hullSlices" <|
            \_ ->
                Expect.equal "e77c706831037c5fe8f7a49de13c28a48fd2713c"
                    (getHashImageForSlices TestData.anthineas)
        , test "Hash image doesn't change when hull changes" <|
            \_ ->
                Expect.equal "e77c706831037c5fe8f7a49de13c28a48fd2713c"
                    (getHashImageForSlices <|
                        HullSliceModifiers.setLengthOverAll "10" TestData.anthineas
                    )
        ]


testImportHullSlicesLibrary =
    describe "Import hulls library from save file" <|
        let
            emptySaveFile : SaveFile
            emptySaveFile =
                { selectedHullReference = Nothing
                , hulls = Dict.empty
                , blocks = []
                , coordinatesTransform = []
                , partitions = initPartitions
                , tags = []
                , customProperties = []
                }

            createSaveFileWithHull : String -> HullSlices.HullSlices -> SaveFile
            createSaveFileWithHull hullName hull =
                { emptySaveFile | hulls = Dict.insert hullName hull Dict.empty }

            changeHullLength : HullSlices.HullSlices -> HullSlices.HullSlices
            changeHullLength hull =
                { hull | length = StringValueInput.floatInput 1 10 }

            modelWithOnlyAnthineas : Model
            modelWithOnlyAnthineas =
                { initialModel | slices = Dict.insert "anthineas" TestData.anthineas Dict.empty }

            modelWithCopy : Model
            modelWithCopy =
                { initialModel
                    | slices =
                        Dict.insert "anthineas" TestData.anthineas <|
                            Dict.insert "anthineas - bis" TestData.anthineas <|
                                Dict.insert "anthineas - bis - bis" TestData.anthineas Dict.empty
                }
        in
        [ test "Can import new hull" <|
            \_ ->
                Expect.equal [ "anthineas", "mpov" ]
                    (updateModel
                        [ FromJs <|
                            ImportHullsLibrary <|
                                createSaveFileWithHull
                                    "mpov"
                                    (TestData.mpov 1)
                        ]
                        modelWithOnlyAnthineas
                        |> .slices
                        |> Dict.keys
                    )
        , test "Can import new hull with existing name" <|
            \_ ->
                Expect.equal [ "anthineas", "anthineas - bis" ]
                    (updateModel
                        [ FromJs <|
                            ImportHullsLibrary <|
                                createSaveFileWithHull
                                    "anthineas"
                                    (changeHullLength TestData.anthineas)
                        ]
                        modelWithOnlyAnthineas
                        |> .slices
                        |> Dict.keys
                    )
        , test "Cannot import existing hull" <|
            \_ ->
                Expect.equal [ "anthineas" ]
                    (updateModel
                        [ FromJs <|
                            ImportHullsLibrary <|
                                createSaveFileWithHull
                                    "anthineas"
                                    TestData.anthineas
                        ]
                        modelWithOnlyAnthineas
                        |> .slices
                        |> Dict.keys
                    )
        , test "Cannot import existing hull with custom properties" <|
            \_ ->
                Expect.equal [ "anthineas" ]
                    (updateModel
                        [ FromJs <|
                            ImportHullsLibrary <|
                                createSaveFileWithHull
                                    "anthineas"
                                    (HullSliceModifiers.setLengthOverAll "10" TestData.anthineas)
                        ]
                        modelWithOnlyAnthineas
                        |> .slices
                        |> Dict.keys
                    )
        , test "Cannot import existing hull with different name" <|
            \_ ->
                Expect.equal [ "anthineas" ]
                    (updateModel
                        [ FromJs <|
                            ImportHullsLibrary <|
                                createSaveFileWithHull
                                    "anthineas2"
                                    TestData.anthineas
                        ]
                        modelWithOnlyAnthineas
                        |> .slices
                        |> Dict.keys
                    )
        , test "Can rename hull correctly when copy already exist" <|
            \_ ->
                updateModel
                    [ createSaveFileWithHull "anthineas" (changeHullLength TestData.anthineas)
                        |> ImportHullsLibrary
                        |> FromJs
                    ]
                    modelWithCopy
                    |> .slices
                    |> Dict.keys
                    |> List.member "anthineas - bis - bis - bis"
                    |> Expect.true "Expected renamed hull to be in hull library"
        ]


testRenameHullInLibrary =
    describe "Rename hull in library" <|
        [ test "Can rename a hull" <|
            \_ ->
                updateModel [ NoJs <| RenameHull "anthineas" "anthineas2" ] initialModel
                    |> .slices
                    |> Dict.keys
                    |> List.member "anthineas2"
                    |> Expect.true "Expected renamed hull to be in hull library"
        , test "Renaming a hull selects it" <|
            \_ ->
                Expect.equal (Just "anthineas2")
                    (updateModel [ NoJs <| RenameHull "anthineas" "anthineas2" ] initialModel
                        |> .selectedHullReference
                    )
        , test "Cannot rename a hull with an existing name" <|
            \_ ->
                updateModel [ NoJs <| RenameHull "anthineas" "mpov" ] initialModel
                    |> .slices
                    |> Dict.keys
                    |> List.member "anthineas"
                    |> Expect.true "Expected renamed hull to be in hull library"
        ]


testDeleteHullInLibrary =
    describe "Remove hull in library" <|
        [ test "Can remove a hull" <|
            \_ ->
                updateModel [ ToJs <| RemoveHull "anthineas" ] initialModel
                    |> .slices
                    |> Dict.keys
                    |> List.member "anthineas"
                    |> Expect.false "Expected removed hull to not be in hull library"
        , test "No hull selected after a delete" <|
            \_ ->
                Expect.equal Nothing
                    (updateModel [ ToJs <| RemoveHull "anthineas" ] initialModel
                        |> .selectedHullReference
                    )
        ]


testSaveAsNewHullInLibrary =
    describe "Save a customized hull as a new hull in library" <|
        let
            modelWithCustomAnthineas : Model
            modelWithCustomAnthineas =
                updateModel [ ToJs <| ModifySlice HullSliceModifiers.setLengthOverAll "anthineas" "10" ] initialModel
        in
        [ test "Can add as new hull" <|
            \_ ->
                Expect.equal True
                    (updateModel [ NoJs <| SaveAsNewHull "anthineas" ] modelWithCustomAnthineas
                        |> .slices
                        |> Dict.keys
                        |> List.member "anthineas - bis"
                    )
        , test "the new hull is the same as the customized hull" <|
            \_ ->
                Expect.equal
                    (Just <|
                        HullSlices.applyCustomPropertiesToHullSlices <|
                            HullSliceModifiers.setLengthOverAll "10" TestData.anthineas
                    )
                    (updateModel [ NoJs <| SaveAsNewHull "anthineas" ] modelWithCustomAnthineas
                        |> .slices
                        |> Dict.get "anthineas - bis"
                    )
        , test "the new hull as no custom properties" <|
            \_ ->
                Expect.equal (Just False)
                    (updateModel [ NoJs <| SaveAsNewHull "anthineas" ] modelWithCustomAnthineas
                        |> .slices
                        |> Dict.get "anthineas - bis"
                        |> Maybe.map HullSlices.isHullCustomized
                    )
        , test "Cannot add as new hull to identical hull" <|
            \_ ->
                Expect.equal False
                    (updateModel [ NoJs <| SaveAsNewHull "anthineas" ] modelWithCustomAnthineas
                        |> updateModel [ NoJs <| SaveAsNewHull "anthineas" ]
                        |> .slices
                        |> Dict.keys
                        |> List.member "anthineas - bis - bis"
                    )
        ]


testSlicesDetails =
    describe "Test functions on slices details" <|
        [ test "Can toggle open slices details" <|
            \_ ->
                Expect.equal
                    (Just True)
                    (updateModel [ ToJs <| ToggleSlicesDetails True "anthineas" ] initialModel
                        |> .uiState
                        |> .accordions
                        |> Dict.get "hull-slices-details"
                    )
        , test "Can toggle close slices details" <|
            \_ ->
                Expect.equal
                    (Just True)
                    (updateModel [ ToJs <| ToggleSlicesDetails False "anthineas" ] initialModel
                        |> .uiState
                        |> .accordions
                        |> Dict.get "hull-slices-details"
                    )
        , test "Can select a slice" <|
            \_ ->
                Expect.equal 5
                    (updateModel [ ToJs <| SelectSlice "anthineas" 10 "5" ] initialModel
                        |> .uiState
                        |> .selectedSlice
                        |> .value
                    )
        , test "Cannot select a slice greater than slices length" <|
            \_ ->
                Expect.equal 5
                    (updateModel [ ToJs <| SelectSlice "anthineas" 10 "11" ] initialModel
                        |> .uiState
                        |> .selectedSlice
                        |> .value
                    )
        ]


testReadFromClipboard =
    describe "Test updating of model when reading clipboard" <|
        [ test "Clicking 'slice import' button update UI State" <|
            \_ ->
                Expect.equal True
                    (updateModel [ ToJs <| ReadClipboard ] initialModel
                        |> .uiState
                        |> .waitToPasteClipBoard
                    )
        , test "Clicking 'close slice import' button update UI State" <|
            \_ ->
                Expect.equal False
                    (updateModel [ NoJs <| CancelReadClipboard ] initialModel
                        |> .uiState
                        |> .waitToPasteClipBoard
                    )
        ]


testPasteFromClipboard =
    describe "Test recovery of data in the clipboard" <|
        [ describe "Section import" <|
            let
                coordinates =
                    [ { x = 0, y = 0, z = 0 }
                    , { x = 0, y = 0, z = 0 }
                    , { x = 0, y = 0, z = 0 }
                    , { x = 10, y = 8, z = 0 }
                    , { x = 10, y = 5, z = 0 }
                    , { x = 10, y = 0, z = 5 }
                    , { x = 20, y = 10, z = 0 }
                    , { x = 20, y = 5, z = 0 }
                    , { x = 20, y = 0, z = 10 }
                    , { x = 30, y = 8, z = 0 }
                    , { x = 30, y = 5, z = 0 }
                    , { x = 30, y = 0, z = 5 }
                    , { x = 40, y = 0, z = 0 }
                    , { x = 40, y = 0, z = 0 }
                    , { x = 40, y = 0, z = 0 }
                    ]

                modelWithSelectedhull =
                    setModel [ ToJs <| SelectHullReference "anthineas" ]
            in
            [ test "Can format coordinates when pasting" <|
                \_ ->
                    Expect.equal (formatClipboardData "1\t2\t3\n4\t5\t6\n7\t8\t9\n") <|
                        Just [ { x = 1, y = 2, z = 3 }, { x = 4, y = 5, z = 6 }, { x = 7, y = 8, z = 9 } ]
            , test "Importing coordinates update dimension parameters of selected hull" <|
                \_ ->
                    { length = 40, breadth = 20, depth = 10, xmin = 0, zmin = 0 }
                        |> Just
                        |> Expect.equal
                            (updateModel [ FromJs <| PasteClipBoard coordinates ] modelWithSelectedhull
                                |> .slices
                                |> Dict.get "anthineas"
                                |> Maybe.map
                                    (\s ->
                                        { length = s.length.value
                                        , breadth = s.breadth.value
                                        , depth = s.depth.value
                                        , xmin = s.xmin
                                        , zmin = s.zmin
                                        }
                                    )
                            )
            , test "Importing coordinates update slices of selected hull" <|
                \_ ->
                    [ { x = 0, y = [ 0.5, 0.5, 0.5 ], zmax = 0, zmin = 0 }
                    , { x = 0.25, y = [ 0.9, 0.75, 0.5 ], zmax = 0.5, zmin = 0 }
                    , { x = 0.5, y = [ 1, 0.75, 0.5 ], zmax = 1, zmin = 0 }
                    , { x = 0.75, y = [ 0.9, 0.75, 0.5 ], zmax = 0.5, zmin = 0 }
                    , { x = 1, y = [ 0.5, 0.5, 0.5 ], zmax = 0, zmin = 0 }
                    ]
                        |> Just
                        |> Expect.equal
                            (updateModel [ FromJs <| PasteClipBoard coordinates ] modelWithSelectedhull
                                |> .slices
                                |> Dict.get "anthineas"
                                |> Maybe.map .slices
                            )
            , test "Importing coordinates reset custom values of selected hull" <|
                \_ ->
                    { length = Nothing
                    , breadth = Nothing
                    , depth = Nothing
                    , draught = Nothing
                    , hullslicesPositions = Nothing
                    }
                        |> Just
                        |> Expect.equal
                            (updateModel [ FromJs <| PasteClipBoard coordinates ] modelWithSelectedhull
                                |> .slices
                                |> Dict.get "mpov"
                                |> Maybe.map .custom
                            )
            ]
        ]


testField : Decode.Decoder a -> String -> (a -> b) -> b -> (() -> Expect.Expectation)
testField decoder json extractor expectedValue =
    \() ->
        Expect.equal (Ok expectedValue) <| Result.map extractor <| decodeString decoder json
