module MainTests exposing (..)

import Array
import Color
import DictList
import Expect exposing (Expectation)
import Fuzz
import Json.Encode as Encode
import Main
    exposing
        ( encodeInitThreeCommand
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
import Math.Vector3 exposing (vec3)
import Test exposing (..)


blockA : Block
blockA =
    { uuid = "abcd"
    , label = "Helicopter"
    , color = Color.blue
    , position =
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
    , size =
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }
    }


blockAYellow : Block
blockAYellow =
    { uuid = "abcd"
    , label = "Helicopter"
    , color = Color.yellow
    , position =
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
    , size =
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }
    }


blockB : Block
blockB =
    { uuid = "efgh"
    , label = "Tank"
    , color = Color.red
    , position =
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
    , size =
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }
    }


blockC : Block
blockC =
    { uuid = "ijkl"
    , label = "Hangar"
    , color = Color.green
    , position =
        { x = { value = 0, string = "0" }
        , y = { value = 0, string = "0" }
        , z = { value = 0, string = "0" }
        }
    , size =
        { length = { value = 10, string = "10" }
        , width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        }
    }


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
                    init
                        |> Tuple.first
                        |> Expect.equal initModel
            , test "init has initCmd as side effect" <|
                \_ ->
                    let
                        ( model, cmd ) =
                            init
                    in
                        Expect.equal cmd (toJs <| initCmd model)
            , test "initCmd is init-three" <|
                \_ ->
                    Expect.equal
                        (initCmd initModel)
                        { tag = "init-three"
                        , data = (encodeInitThreeCommand initModel)
                        }
            ]
        , describe "update"
            [ describe "NoJs"
                [ describe "NoOp"
                    [ test "leaves model untouched" <|
                        \_ ->
                            initModel
                                |> update (NoJs NoOp)
                                |> Tuple.first
                                |> Expect.equal initModel
                    , test
                        "has no side effect"
                      <|
                        \_ ->
                            initModel
                                |> update (NoJs NoOp)
                                |> Tuple.second
                                |> Expect.equal Cmd.none
                    ]
                , describe "ToJs"
                    [ describe "ChangeBlockColor"
                        [ test "updates only the color of the given block" <|
                            \_ ->
                                { initModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockA Color.yellow)
                                    |> Tuple.first
                                    |> Expect.equal { initModel | blocks = DictList.fromList [ ( blockA.uuid, { blockA | color = Color.yellow } ) ] }
                        , test "leaves model untouched if the block doesn't exist" <|
                            \_ ->
                                { initModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockB Color.yellow)
                                    |> Tuple.first
                                    |> Expect.equal { initModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                        , test "has a side effect" <|
                            \_ ->
                                { initModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockA Color.yellow)
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        , test "has no side effect if the block doesn't exist" <|
                            \_ ->
                                { initModel | blocks = DictList.fromList [ ( blockA.uuid, blockA ) ] }
                                    |> update (ToJs <| ChangeBlockColor blockB Color.yellow)
                                    |> Tuple.second
                                    |> Expect.equal Cmd.none
                        ]
                    , describe "AddBlock"
                        [ test "leaves the model untouched" <|
                            \_ ->
                                initModel
                                    |> update (ToJs <| AddBlock "aLabel")
                                    |> Tuple.first
                                    |> Expect.equal initModel
                        , test "has a side effect" <|
                            \_ ->
                                initModel
                                    |> update (ToJs <| AddBlock "aLabel")
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        , fuzz Fuzz.string "leaves the model untouched no matter the label" <|
                            \label ->
                                initModel
                                    |> update (ToJs <| AddBlock label)
                                    |> Tuple.first
                                    |> Expect.equal initModel
                        , fuzz Fuzz.string "has a side effect no matter the label" <|
                            \label ->
                                initModel
                                    |> update (ToJs <| AddBlock label)
                                    |> Tuple.second
                                    |> Expect.notEqual Cmd.none
                        ]
                    ]
                ]
            ]
        ]
