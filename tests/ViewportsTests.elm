module ViewportsTests exposing (suite)

import Expect exposing (..)
import Test exposing (..)
import TestData exposing (..)
import Viewports
    exposing
        ( CameraType(..)
        , Viewport
        , Viewports
        , encodeViewport
        , encodeViewports
        )


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
