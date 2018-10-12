module CoordinatesTransform
    exposing
        ( CoordinatesTransform
        , encodeCoordinatesTransform
        , defaultCoordinatesTransform
        , coordinatesTransformFromList
        , coordinatesTransformToList
        )

import Json.Encode as Encode
import Math.Vector3 exposing (Vec3, vec3, getX, getY, getZ)


coordinatesTransformFromList : List Float -> Maybe CoordinatesTransform
coordinatesTransformFromList listOfTransforms =
    case listOfTransforms of
        [ xx, yx, zx, xy, yy, zy, xz, yz, zz ] ->
            Just <| makeCoordinatesTransform (vec3 xx xy xz) (vec3 yx yy yz) (vec3 zx zy zz)

        _ ->
            Nothing


type alias CoordinatesTransform =
    { x : Vec3
    , y : Vec3
    , z : Vec3
    }


encodeCoordinatesTransform : CoordinatesTransform -> Encode.Value
encodeCoordinatesTransform coordinatesTransform =
    Encode.list <| List.map Encode.float (coordinatesTransformToList coordinatesTransform)


makeCoordinatesTransform : Vec3 -> Vec3 -> Vec3 -> CoordinatesTransform
makeCoordinatesTransform x y z =
    { x = x
    , y = y
    , z = z
    }


coordinatesTransformToList : CoordinatesTransform -> List Float
coordinatesTransformToList coordinatesTransform =
    [ getX coordinatesTransform.x
    , getX coordinatesTransform.y
    , getX coordinatesTransform.z
    , getY coordinatesTransform.x
    , getY coordinatesTransform.y
    , getY coordinatesTransform.z
    , getZ coordinatesTransform.x
    , getZ coordinatesTransform.y
    , getZ coordinatesTransform.z
    ]


defaultCoordinatesTransform : CoordinatesTransform
defaultCoordinatesTransform =
    -- Ship to ThreeJs
    makeCoordinatesTransform (vec3 1 0 0) (vec3 0 0 -1) (vec3 0 1 0)
