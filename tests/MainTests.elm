module MainTests exposing (..)

import Array
import Color
import DictList
import Expect exposing (Expectation)
import Fuzz
import Json.Encode as Encode
import Main exposing (..)
import Math.Vector3 exposing (vec3)
import Test exposing (..)


discardCmd : ( Model, Cmd Msg ) -> Model
discardCmd ( model, _ ) =
    model


setModel : List Msg -> Model
setModel msgs =
    List.foldl (\msg model -> update msg model |> discardCmd) initialModel msgs


updateModel : List Msg -> Model -> Model
updateModel msgs modelToUpdate =
    List.foldl (\msg model -> update msg model |> discardCmd) modelToUpdate msgs


blockA : Block
blockA =
    initBlock
        "abcd"
        "Helicopter"
        Color.blue
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }


blockAYellow : Block
blockAYellow =
    initBlock
        "abcd"
        "Helicopter"
        Color.yellow
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }


blockB : Block
blockB =
    initBlock
        "efgh"
        "Tank"
        Color.red
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }


blockC : Block
blockC =
    initBlock
        "ijkl"
        "Hangar"
        Color.green
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }


initialModel : Model
initialModel =
    initModel "1.0.0"


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
                    Expect.equal (DictList.fromList [ ( blockAYellow.uuid, blockAYellow ) ]) (addBlockTo (DictList.fromList [ ( blockA.uuid, blockA ) ]) blockAYellow)
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
                            blockAYellow
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
                    init "1.0.0"
                        |> Tuple.first
                        |> Expect.equal initialModel
            , test "init has side effects" <|
                \_ ->
                    let
                        ( model, cmd ) =
                            init "1.0.0"
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
                        { block | position = numberToNumberInput 1.0 |> asXInPosition block.position }

                    updateY : Block -> Block
                    updateY block =
                        { block | position = numberToNumberInput 1.0 |> asYInPosition block.position }

                    updateZ : Block -> Block
                    updateZ block =
                        { block | position = numberToNumberInput 1.0 |> asZInPosition block.position }

                    updateXInAFromElm : Model
                    updateXInAFromElm =
                        updateModel [ ToJs <| UpdatePosition X blockA "1" ] modelWithTwoBlocks

                    updateXInAFromJs : Model
                    updateXInAFromJs =
                        updateModel [ FromJs <| SynchronizePosition blockA.uuid (.position <| updateX blockA) ] modelWithTwoBlocks
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
                    ]
            ]
        ]
