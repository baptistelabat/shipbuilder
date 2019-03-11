module HullSliceUtilities exposing (integrateTrapezoidMetricOnSlices)

import Array


integrateTrapezoidMetricOnSlices : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
integrateTrapezoidMetricOnSlices trapezoidMetric denormalizedSlices =
    case denormalizedSlices of
        ( z1, y1 ) :: ( z2, y2 ) :: rest ->
            trapezoidMetric ( z1, y1 ) ( z2, y2 ) + integrateTrapezoidMetricOnSlices trapezoidMetric (( z2, y2 ) :: rest)

        _ ->
            0
