module CoordinatesTransform exposing
    ( CoordinatesTransform
    , default
    , encode
    , fromList
    , fromVectors
    , toList
    )

import Json.Encode as Encode
import Math.Vector3 exposing (Vec3, getX, getY, getZ, vec3)


fromList : List Float -> Maybe CoordinatesTransform
fromList listOfTransforms =
    case listOfTransforms of
        [ xx, yx, zx, xy, yy, zy, xz, yz, zz ] ->
            Just <| fromVectors (vec3 xx xy xz) (vec3 yx yy yz) (vec3 zx zy zz)

        _ ->
            Nothing


type alias CoordinatesTransform =
    { x : Vec3
    , y : Vec3
    , z : Vec3
    }


encode : CoordinatesTransform -> Encode.Value
encode coordinatesTransform =
    Encode.list Encode.float (toList coordinatesTransform)


fromVectors : Vec3 -> Vec3 -> Vec3 -> CoordinatesTransform
fromVectors x y z =
    { x = x
    , y = y
    , z = z
    }


toList : CoordinatesTransform -> List Float
toList coordinatesTransform =
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


default : CoordinatesTransform
default =
    -- Ship to ThreeJs
    fromVectors (vec3 1 0 0) (vec3 0 0 -1) (vec3 0 1 0)
