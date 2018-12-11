module Spline
    exposing
        ( make
        , Spline
        , evaluate
        )


type Spline
    = Spline Spline_


type alias Spline_ =
    { xmin : Float
    , xmax : Float
    , ys : List Float
    }


type alias CubicCoefficients =
    { a : Float
    , b : Float
    , c : Float
    , d : Float
    }


make : Float -> Float -> List Float -> Spline
make xmin xmax ys =
    Spline { xmin = xmin, xmax = xmax, ys = ys }


evaluate : Spline -> Float -> Float
evaluate spline x =
    12
