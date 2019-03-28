module HullSlices exposing
    ( CustomHullProperties
    , HullSlice
    , HullSlices
    , emptyHullSlices
    )

import Array
import StringValueInput


type alias HullSlices =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    , originalSlicePositions : List Float
    , draught : StringValueInput.FloatInput
    , customHullProperties : CustomHullProperties
    }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


type alias CustomHullProperties =
    { customLength : StringValueInput.FloatInput
    , customBreadth : StringValueInput.FloatInput
    , customDepth : StringValueInput.FloatInput
    , customDraught : StringValueInput.FloatInput
    }


emptyHullSlices : HullSlices
emptyHullSlices =
    { length = StringValueInput.emptyFloat 1
    , breadth = StringValueInput.emptyFloat 1
    , depth = StringValueInput.emptyFloat 1
    , xmin = 0
    , ymin = 0
    , zmin = 0
    , slices = []
    , originalSlicePositions = []
    , draught = StringValueInput.emptyFloat 1
    , customHullProperties =
        { customLength = StringValueInput.emptyFloat 1
        , customBreadth = StringValueInput.emptyFloat 1
        , customDepth = StringValueInput.emptyFloat 1
        , customDraught = StringValueInput.emptyFloat 1
        }
    }
