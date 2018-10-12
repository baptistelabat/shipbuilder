module CoordinatesTransformTests exposing (suite)

import CoordinatesTransform exposing (..)
import Json.Encode as Encode
import Test exposing (..)
import Expect
import Math.Vector3 exposing (vec3)


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
stringifyCoordinatesTransform coordinatesTransform =
    Encode.encode 4 <| encodeCoordinatesTransform coordinatesTransform


suite : Test
suite =
    describe "CoordinatesTransform"
        [ test "defaultCoordinatesTransform" <|
            \_ ->
                Expect.equal defaultCoordinatesTransform { x = (vec3 1 0 0), y = (vec3 0 0 -1), z = (vec3 0 1 0) }
        , test "coordinatesTransformToList" <|
            \_ ->
                Expect.equal
                    (coordinatesTransformToList defaultCoordinatesTransform)
                    [ 1, 0, 0, 0, 0, 1, 0, -1, 0 ]
        , test "coordinatesTransformFromList for defaultCoordinatesTransform" <|
            \_ ->
                Expect.equal
                    (coordinatesTransformFromList [ 1, 0, 0, 0, 0, 1, 0, -1, 0 ])
                    (Just defaultCoordinatesTransform)
        , test "coordinatesTransformFromList with array too short" <|
            \_ ->
                Expect.equal
                    (coordinatesTransformFromList [ 1, 0, 0, 0, 0, 1, 0 ])
                    (Nothing)
        , test "encodeCoordinatesTransform" <|
            \_ ->
                Expect.equal
                    (stringifyCoordinatesTransform defaultCoordinatesTransform)
                    stringOfDefaultCoordinatesTransform
        ]
