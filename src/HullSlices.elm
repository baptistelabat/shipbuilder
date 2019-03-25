module HullSlices exposing
    ( HullSlice
    , HullSlices
    , scale
    )

import Array
import StringValueInput


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , prismaticCoefficient : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , originalSlicePositions : List Float
    , draught : StringValueInput.FloatInput
    , blockCoefficient : Float
    , displacement : Float
    , centreOfBuoyancy : Float
    , metacentre : Float
    , denormalizedSlices : List HullSlice
    , hullSlicesBeneathFreeSurface :
        { xmin : Float
        , xmax : Float
        , hullSlices : List HullSliceAsZYList
        }
    , centroidAreaForEachImmersedSlice : List HullSliceCentroidAndArea
    }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


type alias HullSliceAsZYList =
    { x : Float
    , zylist : List ( Float, Float )
    }


type alias HullSliceAsAreaXYList =
    { z : Float
    , xy : List ( Float, Float )
    , area : Float
    }


type alias HullSliceCentroidAndArea =
    { x : Float
    , centroid : Float
    , area : Float
    }


scale : HullSlices -> HullSlice -> HullSlice
scale json hullSlice =
    let
        scaleY : Float -> Float
        scaleY y =
            y * json.breadth.value + json.ymin

        scaleZ : Float -> Float
        scaleZ z =
            z * json.depth.value + json.zmin
    in
    { x = hullSlice.x
    , zmin = scaleZ hullSlice.zmin
    , zmax = scaleZ hullSlice.zmax
    , y = List.map scaleY hullSlice.y
    }
