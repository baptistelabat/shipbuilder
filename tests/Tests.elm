module Tests exposing (..)

import Array
import Color
import DictList
import Expect exposing (Expectation)
import Json.Encode as Encode
import Main
    exposing
        ( encodeInitThreeCommand
        , init
        , initCmd
        , initModel
        , sendToJs
          --Blocks
        , Block
        , Blocks
        , addBlockTo
        , removeBlockFrom
          -- CoordinatesTransform
        , CoordinatesTransform
        , arrayToCoordinatesTransform
        , coordinatesTransformToList
        , defaultCoordinatesTransform
        , encodeCoordinatesTransform
        , makeCoordinatesTransform
          -- Viewports
        , Viewport
        , Viewports
        , encodeViewport
        , encodeViewports
        )
import Math.Vector3 exposing (vec3)
import Test exposing (..)


viewport : Viewport
viewport =
    Viewport "Test 1"
        0
        0
        1
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }


viewportJsonString : String
viewportJsonString =
    """{
    "label": "Test 1",
    "left": 0,
    "top": 0,
    "width": 1,
    "height": 1,
    "background": {
        "red": 255,
        "green": 255,
        "blue": 255,
        "alpha": 1
    },
    "eye": {
        "x": 0,
        "y": 1000,
        "z": 0
    },
    "canControl": {
        "x": true,
        "y": true,
        "z": false
    }
}"""


viewports : Viewports
viewports =
    [ Viewport "First"
        0
        0
        0.5
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
    , Viewport "Second"
        0.5
        0
        0.5
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
    ]


viewportsJsonString : String
viewportsJsonString =
    """[
    {
        "label": "First",
        "left": 0,
        "top": 0,
        "width": 0.5,
        "height": 1,
        "background": {
            "red": 255,
            "green": 255,
            "blue": 255,
            "alpha": 1
        },
        "eye": {
            "x": 0,
            "y": 1000,
            "z": 0
        },
        "canControl": {
            "x": true,
            "y": true,
            "z": false
        }
    },
    {
        "label": "Second",
        "left": 0.5,
        "top": 0,
        "width": 0.5,
        "height": 1,
        "background": {
            "red": 255,
            "green": 255,
            "blue": 255,
            "alpha": 1
        },
        "eye": {
            "x": 0,
            "y": 1000,
            "z": 0
        },
        "canControl": {
            "x": true,
            "y": true,
            "z": false
        }
    }
]"""


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


valueToIndentedString : Encode.Value -> String
valueToIndentedString json =
    Encode.encode 4 json


stringifyViewport : Viewport -> String
stringifyViewport =
    valueToIndentedString << encodeViewport


stringifyViewports : Viewports -> String
stringifyViewports =
    valueToIndentedString << encodeViewports


stringOfDefaultCoordinatesTransform : String
stringOfDefaultCoordinatesTransform =
    """[
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    -1,
    0
]"""


stringifyCoordinatesTransform : CoordinatesTransform -> String
stringifyCoordinatesTransform =
    valueToIndentedString << encodeCoordinatesTransform


suite : Test
suite =
    describe "Main"
        [ describe "Viewports"
            [ test "Encode 1 Viewport" <|
                \_ ->
                    Expect.equal viewportJsonString <| stringifyViewport viewport
            , test "Encode Viewports" <|
                \_ ->
                    Expect.equal viewportsJsonString <| stringifyViewports viewports
            ]
        , describe "Blocks"
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
        , describe "CoordinatesTransform"
            [ test "defaultCoordinatesTransform" <|
                \_ ->
                    Expect.equal defaultCoordinatesTransform { x = (vec3 1 0 0), y = (vec3 0 0 -1), z = (vec3 0 1 0) }
            , test "coordinatesTransformToList" <|
                \_ ->
                    Expect.equal
                        (coordinatesTransformToList defaultCoordinatesTransform)
                        [ 1, 0, 0, 0, 0, 1, 0, -1, 0 ]
            , test "arrayToCoordinatesTransform for defaultCoordinatesTransform" <|
                \_ ->
                    Expect.equal
                        (arrayToCoordinatesTransform <| Array.fromList [ 1, 0, 0, 0, 0, 1, 0, -1, 0 ])
                        (Just defaultCoordinatesTransform)
            , test "arrayToCoordinatesTransform with array too short" <|
                \_ ->
                    Expect.equal
                        (arrayToCoordinatesTransform <| Array.fromList [ 1, 0, 0, 0, 0, 1, 0 ])
                        (Nothing)
            , test "encodeCoordinatesTransform" <|
                \_ ->
                    Expect.equal
                        (stringifyCoordinatesTransform defaultCoordinatesTransform)
                        stringOfDefaultCoordinatesTransform
            ]
        , describe "Init"
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
                        Expect.equal cmd (initCmd model)
            , test "initCmd is init-three" <|
                \_ ->
                    Expect.equal
                        (initCmd initModel)
                        (sendToJs
                            "init-three"
                            (encodeInitThreeCommand initModel)
                        )
        ]
