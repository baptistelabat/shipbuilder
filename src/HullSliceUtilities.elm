module HullSliceUtilities exposing
    ( hullVolume
    , integrateTrapezoidMetricOnSlices
    )

import Array


integrateTrapezoidMetricOnSlices : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
integrateTrapezoidMetricOnSlices trapezoidMetric denormalizedSlices =
    case denormalizedSlices of
        ( z1, y1 ) :: ( z2, y2 ) :: rest ->
            trapezoidMetric ( z1, y1 ) ( z2, y2 ) + integrateTrapezoidMetricOnSlices trapezoidMetric (( z2, y2 ) :: rest)

        _ ->
            0


hullVolume : { xmin : Float, xmax : Float } -> List { a | x : Float, area : Float } -> Float
hullVolume config list =
    let
        xmin =
            config.xmin

        xmax =
            config.xmax

        toXA : List { a | x : Float, area : Float } -> List { x : Float, area : Float }
        toXA =
            List.map (\u -> { x = u.x, area = u.area })

        newList =
            List.concat [ [ { x = xmin, area = 0.0 } ], toXA list, [ { x = xmax, area = 0.0 } ] ]
    in
    volume newList


volume : List { a | x : Float, area : Float } -> Float
volume lo =
    case lo of
        o1 :: o2 :: rest ->
            let
                x1 =
                    o1.x

                a1 =
                    o1.area

                x2 =
                    o2.x

                a2 =
                    o2.area

                value =
                    abs (((a1 + a2) / 2.0) * (x2 - x1))
            in
            value + volume (o2 :: rest)

        _ ->
            0
