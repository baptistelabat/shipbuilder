module TestData exposing (..)

import Main exposing (..)
import Viewports exposing (..)
import Math.Vector3 exposing (..)
import Html exposing (Html)
import Color
import Json.Encode as Encode


valueToIndentedString : Encode.Value -> String
valueToIndentedString json =
    Encode.encode 4 json


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


initialView : Html Msg
initialView =
    view initialModel


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
        Orthographic


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
    },
    "cameraType": "Orthographic"
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
        Orthographic
    , Viewport "Second"
        0.5
        0
        0.5
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
        Orthographic
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
        },
        "cameraType": "Orthographic"
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
        },
        "cameraType": "Orthographic"
    }
]"""


hullSliceJson : String
hullSliceJson =
    """
    {
    "length": 22.84600067138672,
    "breadth": 6.8935699462890625,
    "mouldedDepth": 6.83698582649231,
    "slices": [
        {
            "x": 0.00437713372412022,
            "y": [
                0.964899527258786,
                0.9648943694688346,
                0.9629765202249831,
                0.9592250480632435,
                0.955473575901504,
                0.9502377948034448,
                0.9394176761317832,
                0.9282437133662546,
                0.9102579602794127,
                0.742320749879794
            ],
            "zmin": 0.31587930659489755,
            "zmax": 0.5298349579969897
        },
        {
            "x": 0.1111111111111111,
            "y": [
                0.9569840388381782,
                0.9718894073773259,
                0.976951106789423,
                0.9765144025278825,
                0.9593856710989374,
                0.9151973999533979,
                0.5041787633977366,
                0.5034056128817148,
                0.5027638369183798,
                0.5008173052731562
            ],
            "zmin": 0.07246874145311905,
            "zmax": 0.9851376673994297
        }
        ],
    "xmin": -1.0,
    "ymin": -3.4467999935150146,
    "zmin": -6.146999835968018
    }
    """
