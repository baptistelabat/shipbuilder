module HullSlices exposing
    ( HullSlice
    , HullSlices
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
    }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }
