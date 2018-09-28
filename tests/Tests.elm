module Tests exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import Main exposing (encodeViewport, encodeViewports, Viewport, Viewports)
import Color
import Math.Vector3 exposing (vec3)
import Json.Encode as Encode


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
        ]
