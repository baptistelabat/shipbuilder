module ViewportsTests exposing (suite)

import Viewports
    exposing
        ( Viewport
        , Viewports
        , encodeViewport
        , encodeViewports
        , CameraType(..)
        )
import Expect exposing (..)
import Json.Encode as Encode
import Test exposing (..)
import TestData exposing (..)


stringifyViewport : Viewport -> String
stringifyViewport =
    valueToIndentedString << encodeViewport


stringifyViewports : Viewports -> String
stringifyViewports =
    valueToIndentedString << encodeViewports


suite : Test
suite =
    describe "Viewports"
        [ test "Encode 1 Viewport" <|
            \_ ->
                Expect.equal viewportJsonString <| stringifyViewport viewport
        , test "Encode Viewports" <|
            \_ ->
                Expect.equal viewportsJsonString <| stringifyViewports viewports
        ]
