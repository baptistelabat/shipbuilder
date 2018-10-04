module Tests exposing (..)

import Color
import DictList
import Expect exposing (Expectation)
import Json.Encode as Encode
import Main
    exposing
        ( Block
        , Blocks
        , addBlockTo
        , removeBlockFrom
        , encodeViewport
        , encodeViewports
        , Viewport
        , Viewports
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
        { width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        , depth = { value = 10, string = "10" }
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
        { width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        , depth = { value = 10, string = "10" }
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
        { width = { value = 10, string = "10" }
        , height = { value = 10, string = "10" }
        , depth = { value = 10, string = "10" }
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
            [ test "Init with one block" <|
                \_ ->
                    Expect.equal (DictList.fromList [ ( blockA.uuid, blockA ) ]) (addBlockTo DictList.empty blockA)
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
            ]
        ]
