module Viewports exposing
    ( CameraType(..)
    , Viewport
    , Viewports
    , encodeViewport
    , encodeViewports
    , init
    )

import Color exposing (Color, hsl)
import Json.Encode as Encode
import Math.Vector3 exposing (Vec3, toRecord, vec3)


type alias Viewports =
    List Viewport


type CameraType
    = Orthographic
    | Perspective


cameraTypeToString : CameraType -> String
cameraTypeToString cameraType =
    case cameraType of
        Orthographic ->
            "Orthographic"

        Perspective ->
            "Perspective"


type alias Viewport =
    { label : String
    , left :
        -- between 0 and 1, left margin of the viewport within the canvas
        Float
    , top :
        -- between 0 and 1, top margin of the viewport within the canvas
        Float
    , width :
        -- between 0 and 1, ratio of the width between the viewport and the canvas
        Float
    , height :
        -- between 0 and 1, ratio of the height between the viewport and the canvas
        Float
    , background : Color
    , eye : Vec3
    , canControl :
        { x : Bool
        , y : Bool
        , z : Bool
        }
    , cameraType : CameraType
    }


init : Viewports
init =
    [ topLeftCornerViewport (hsl (degrees 222) 0.7 0.98) viewportSide
    , topRightCornerViewport (hsl (degrees 222) 0.53 0.95) viewportFront
    , bottomLeftCornerViewport (hsl (degrees 222) 0.53 0.95) viewportTop
    , bottomRightCornerViewport (hsl (degrees 222) 0.7 0.98) viewportPerspective
    ]


encodeViewports : Viewports -> Encode.Value
encodeViewports viewports =
    Encode.list encodeViewport viewports


encodeViewport : Viewport -> Encode.Value
encodeViewport viewport =
    Encode.object
        [ ( "label", Encode.string viewport.label )
        , ( "left", Encode.float viewport.left )
        , ( "top", Encode.float viewport.top )
        , ( "width", Encode.float viewport.width )
        , ( "height", Encode.float viewport.height )
        , ( "background", encodeColor viewport.background )
        , ( "eye", encodeVector3 viewport.eye )
        , ( "canControl", encodeCanControl viewport.canControl )
        , ( "cameraType", Encode.string <| cameraTypeToString viewport.cameraType )
        ]


encodeVector3 : Vec3 -> Encode.Value
encodeVector3 vector =
    let
        record =
            toRecord vector
    in
    Encode.object
        [ ( "x", Encode.float record.x )
        , ( "y", Encode.float record.y )
        , ( "z", Encode.float record.z )
        ]


encodeCanControl : { x : Bool, y : Bool, z : Bool } -> Encode.Value
encodeCanControl canControl =
    Encode.object
        [ ( "x", Encode.bool canControl.x )
        , ( "y", Encode.bool canControl.y )
        , ( "z", Encode.bool canControl.z )
        ]


viewportSide : Float -> Float -> Float -> Float -> Color -> Viewport
viewportSide left top width height background =
    { label = "Side"
    , left = left
    , top = top
    , width = width
    , height = height
    , background = background
    , eye = vec3 0 1000 0
    , canControl = { x = True, y = False, z = True }
    , cameraType = Orthographic
    }


viewportTop : Float -> Float -> Float -> Float -> Color -> Viewport
viewportTop left top width height background =
    { label = "Top"
    , left = left
    , top = top
    , width = width
    , height = height
    , background = background
    , eye = vec3 0 0 -1000
    , canControl = { x = True, y = True, z = False }
    , cameraType = Orthographic
    }


viewportFront : Float -> Float -> Float -> Float -> Color -> Viewport
viewportFront left top width height background =
    { label = "Front"
    , left = left
    , top = top
    , width = width
    , height = height
    , background = background
    , eye = vec3 1000 0 0
    , canControl = { x = False, y = True, z = True }
    , cameraType = Orthographic
    }


viewportPerspective : Float -> Float -> Float -> Float -> Color -> Viewport
viewportPerspective left top width height background =
    { label = "Perspective"
    , left = left
    , top = top
    , width = width
    , height = height
    , background = background
    , eye = vec3 1000 1000 -1000
    , canControl = { x = False, y = False, z = False }
    , cameraType = Perspective
    }


topLeftCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
topLeftCornerViewport background viewport =
    viewport 0 0 0.5 0.5 background


topRightCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
topRightCornerViewport background viewport =
    viewport 0.5 0 0.5 0.5 background


bottomLeftCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
bottomLeftCornerViewport background viewport =
    viewport 0 0.5 0.5 0.5 background


bottomRightCornerViewport : Color -> (Float -> Float -> Float -> Float -> Color -> Viewport) -> Viewport
bottomRightCornerViewport background viewport =
    viewport 0.5 0.5 0.5 0.5 background


encodeColor : Color -> Encode.Value
encodeColor color =
    let
        rgb : { red : Float, green : Float, blue : Float, alpha : Float }
        rgb =
            Color.toRgba color
    in
    Encode.object
        [ ( "red", Encode.int <| floor <| 0.5 + 255 * rgb.red )
        , ( "green", Encode.int <| floor <| 0.5 + 255 * rgb.green )
        , ( "blue", Encode.int <| floor <| 0.5 + 255 * rgb.blue )
        , ( "alpha", Encode.float rgb.alpha )
        ]
