module CustomFuzzers exposing
    ( epsAbsolute
    , epsRelative
    , negativeFloat
    , nonZero
    , positiveFloat
    )

import Expect exposing (FloatingPointTolerance(..))
import Fuzz


epsAbsolute : FloatingPointTolerance
epsAbsolute =
    Absolute 1.0e-5


epsRelative : FloatingPointTolerance
epsRelative =
    Relative 1.0e-5


positiveFloat : Fuzz.Fuzzer Float
positiveFloat =
    Fuzz.floatRange 1.0e-6 1.0e8


negativeFloat : Fuzz.Fuzzer Float
negativeFloat =
    Fuzz.map (\x -> -x) positiveFloat


nonZero : Fuzz.Fuzzer Float
nonZero =
    let
        chooseFuzzer : Bool -> Float -> Float -> Float
        chooseFuzzer choosePositive positive negative =
            if choosePositive then
                positive

            else
                negative
    in
    Fuzz.map3 chooseFuzzer Fuzz.bool positiveFloat negativeFloat
