module Lackenby exposing
    ( clampPrismaticCoefficient
    , getPrismaticCoefficientBounds
    , lackenby
    , modifyHullSlicesToMatchTargetPrismaticCoefficient
    , setPrismaticCoefficientAndClamp
    )

{-| What we wish to do is modify the hull slice so it has a given area while maintaining its breadth and depth.
To do this, we use the fact that the function $`f_{\alpha}:x\mapsto (x\cdot(1-x))^{\alpha}`$ is always between $`\left[0,1\right]`$ for $`x\in\left[0,1\right]`$ and $`\forall\alpha\geq 0`$ and that we always have $`\forall\alpha>0,f_{\alpha}(0)=f_{\alpha}(1)=0`$.

If we denote $`T`$ the depth of the slice and $`B:z\mapsto B(z)`$ the breadth function, giving the half-breadth of the hull at a given immersion $`z`$ (with axis $`z`$ pointing downwards), we define:

```math
\delta B_{\alpha}(z) \underset{def}{=} \left(\frac{B(T)-B(z)}{B(T)}\cdot\frac{B(z)}{B(T)}\right)^{\frac{1}{\alpha}}
```

we get the following properties:

```math
\forall \alpha<0, \forall z\in\left[0,1\right], \delta B_{\alpha}(z) > 1
```

```math
\forall z\in\left[0,1\right], \delta B_{\alpha}(z)\underset{\alpha 0}{\longrightarrow} 0
```

```math
\forall \alpha\geq 0, \forall z\in\left[0,1\right], \delta B_{\alpha}(z) \geq 1
```

```math
\forall \alpha\neq 0, \delta B_{\alpha}(0) = 0
```

```math
\forall \alpha\neq 0, \delta B_{\alpha}(T) = 0
```

```math
\delta B_{\alpha}(z)\underset{\alpha\rightarrow +\infty}{\longrightarrow}  1
```

```math
\delta B_{\alpha}(z)\underset{\alpha\rightarrow -\infty}{\longrightarrow}  1
```

Using these properties, we define a "modified breadth function":

```math
B_{\alpha}(z) \underset{def}{=} (1-\delta B_{\alpha})\cdot B(z) + \delta B_{\alpha}(z)\cdot B(T), \alpha>0
```

```math
B_{\alpha}(z) \underset{def}{=} (1-\delta B_{\alpha})\cdot B(z), \alpha<=0
```

  - For $`\alpha \ll 0`$, the area converges to 0.
  - For $`\alpha=0`$, we get the original curve.
  - For $`\alpha \gg 0`$, the area converges to that of a rectangular block.

-}

import HullSlices exposing (HullSlice, HullSliceCentroidAndArea, HullSlices, integrate)
import HullSlicesMetrics
    exposing
        ( HullSlicesMetrics
        , getCentroidAreaForEachImmersedSlice
        , getHullSlicesBeneathFreeSurface
        , getLength
        , getMasterCrossSection
        , getPrismaticCoefficient
        , getSlices
        , getXmin
        )
import List.Extra
import StringValueInput


shiftAreaCurve : Float -> List ( Float, Float ) -> List ( Float, Float )
shiftAreaCurve c areaCurve =
    let
        maybePositionMaxArea : Maybe Float
        maybePositionMaxArea =
            areaCurve
                |> List.Extra.maximumBy Tuple.second
                |> Maybe.map Tuple.first

        maybeMinMax : Maybe ( Float, Float )
        maybeMinMax =
            let
                xs =
                    List.map Tuple.first areaCurve
            in
            case ( List.minimum xs, List.maximum xs ) of
                ( Just mi, Just ma ) ->
                    Just ( mi, ma )

                ( _, _ ) ->
                    Nothing

        dx : Float -> Float
        dx x =
            c * x * (1 - x)

        shift : Float -> Float -> Float -> ( Float, Float ) -> ( Float, Float )
        shift xmin xmax x0 ( x, a ) =
            if x < x0 then
                let
                    x_ =
                        (x - xmin) / (x0 - xmin)
                in
                ( (x_ - dx x_) * (x0 - xmin) + xmin, a )

            else
                let
                    x_ =
                        (x - x0) / (xmax - x0)
                in
                ( (x_ + dx x_) * (xmax - x0) + x0, a )
    in
    case ( maybePositionMaxArea, maybeMinMax ) of
        ( Just x0, Just ( xmin, xmax ) ) ->
            List.map (shift xmin xmax x0) areaCurve

        ( _, _ ) ->
            areaCurve


getPrismaticCoefficientBounds : Float -> Float -> List ( Float, Float ) -> ( Float, Float )
getPrismaticCoefficientBounds lengthAtWaterline masterCrossSectionArea areaCurve =
    let
        getPrismaticCoeff : List ( Float, Float ) -> Float
        getPrismaticCoeff curve =
            curve |> integrate |> (*) (1 / (lengthAtWaterline * masterCrossSectionArea))
    in
    ( getPrismaticCoeff <| shiftAreaCurve -1 areaCurve, getPrismaticCoeff <| shiftAreaCurve 1 areaCurve )


clampPrismaticCoefficient : Float -> Float -> Float -> List ( Float, Float ) -> Float
clampPrismaticCoefficient prismaticCoeff lengthAtWaterline masterCrossSectionArea areaCurve =
    let
        ( minCoeff, maxCoeff ) =
            getPrismaticCoefficientBounds lengthAtWaterline masterCrossSectionArea areaCurve
    in
    StringValueInput.round_n 2 <| clamp minCoeff maxCoeff prismaticCoeff


setPrismaticCoefficientAndClamp : Float -> HullSlicesMetrics -> Float
setPrismaticCoefficientAndClamp prismaticCoefficient hullSlicesMetrics =
    case getMasterCrossSection hullSlicesMetrics of
        Nothing ->
            prismaticCoefficient

        Just masterCrossSectionArea ->
            let
                lengthAtWaterline : Float
                lengthAtWaterline =
                    (getHullSlicesBeneathFreeSurface hullSlicesMetrics |> .xmax) - (getHullSlicesBeneathFreeSurface hullSlicesMetrics |> .xmin)

                areaCurve : List ( Float, Float )
                areaCurve =
                    getCentroidAreaForEachImmersedSlice hullSlicesMetrics
                        |> List.map (\c -> ( c.x, c.area ))
            in
            clampPrismaticCoefficient prismaticCoefficient lengthAtWaterline masterCrossSectionArea.area areaCurve


lackenbyHS : Float -> HullSlicesMetrics -> Result String (List ( Float, Float ))
lackenbyHS targetPrismaticCoefficient hullSlicesMetrics =
    case getMasterCrossSection hullSlicesMetrics of
        Nothing ->
            Err "Unable to compute master cross section"

        Just masterCrossSectionArea ->
            let
                lengthAtWaterline : Float
                lengthAtWaterline =
                    (getHullSlicesBeneathFreeSurface hullSlicesMetrics |> .xmax) - (getHullSlicesBeneathFreeSurface hullSlicesMetrics |> .xmin)

                areaCurve : List ( Float, Float )
                areaCurve =
                    getCentroidAreaForEachImmersedSlice hullSlicesMetrics
                        |> List.map (\c -> ( c.x, c.area ))
            in
            lackenby targetPrismaticCoefficient lengthAtWaterline masterCrossSectionArea.area areaCurve


{-| Modify the abscicae of an area curve to reach a given prismatic coefficient
-}
lackenby : Float -> Float -> Float -> List ( Float, Float ) -> Result String (List ( Float, Float ))
lackenby targetPrismaticCoefficient lengthAtWaterline masterCrossSectionArea areaCurve =
    let
        lackenby_ : Float -> Int -> Int -> Float -> Float -> Result String (List ( Float, Float ))
        lackenby_ tolerance niterMax niter cLow cHigh =
            let
                getPrismaticCoeff : List ( Float, Float ) -> Float
                getPrismaticCoeff curve =
                    curve |> integrate |> (*) (1 / (lengthAtWaterline * masterCrossSectionArea))

                lowAreaCurve =
                    shiftAreaCurve cLow areaCurve

                highAreaCurve =
                    shiftAreaCurve cHigh areaCurve

                lowPrismaticCoeff =
                    getPrismaticCoeff lowAreaCurve

                highPrismaticCoeff =
                    getPrismaticCoeff highAreaCurve

                cMid =
                    (cLow + cHigh) / 2

                midAreaCurve =
                    shiftAreaCurve cMid areaCurve

                midPrismaticCoeff =
                    getPrismaticCoeff midAreaCurve

                reachedTolerance c =
                    if targetPrismaticCoefficient == 0 then
                        abs (c - targetPrismaticCoefficient) < tolerance

                    else
                        abs (c - targetPrismaticCoefficient) / targetPrismaticCoefficient < tolerance
            in
            if lowPrismaticCoeff > targetPrismaticCoefficient then
                Err "target prismatic coefficient is lower than the lowest bound"

            else if highPrismaticCoeff < targetPrismaticCoefficient then
                Err "target prismatic coefficient is higher than the lowest bound"

            else if reachedTolerance lowPrismaticCoeff then
                Ok lowAreaCurve

            else if reachedTolerance highPrismaticCoeff then
                Ok highAreaCurve

            else if reachedTolerance midPrismaticCoeff then
                Ok midAreaCurve

            else if niter > niterMax then
                Err "Unable to reach tolerance."

            else if midPrismaticCoeff > targetPrismaticCoefficient then
                lackenby_ tolerance niterMax (niter + 1) cLow cMid

            else
                lackenby_ tolerance niterMax (niter + 1) cMid cHigh
    in
    lackenby_ 1.0e-3 10 0 -1 1


getLongitudinalPositionOfEachSlice : HullSlices -> HullSlicesMetrics -> List Float -> List Float
getLongitudinalPositionOfEachSlice hullSlices hullSlicesMetrics newXPositions =
    let
        normalize : Float -> Float
        normalize x =
            (x - getXmin hullSlicesMetrics) / (getLength hullSlicesMetrics |> .value)

        xminOfAreaCurve : Float
        xminOfAreaCurve =
            getCentroidAreaForEachImmersedSlice hullSlicesMetrics
                |> List.map (.x >> normalize)
                |> List.minimum
                |> (Maybe.withDefault <| getXmin hullSlicesMetrics)
                |> StringValueInput.round_n 4

        xmaxOfAreaCurve : Float
        xmaxOfAreaCurve =
            getCentroidAreaForEachImmersedSlice hullSlicesMetrics
                |> List.map (.x >> normalize)
                |> List.maximum
                |> Maybe.withDefault (getXmin hullSlicesMetrics + (getLength hullSlicesMetrics |> .value))
                |> StringValueInput.round_n 4

        positionsBeforeXminOfAreaCurve : List Float
        positionsBeforeXminOfAreaCurve =
            List.map .x (List.filter (\slice -> StringValueInput.round_n 4 slice.x < xminOfAreaCurve) <| getSlices hullSlicesMetrics)

        positionsAfterXmaxOfAreaCurve : List Float
        positionsAfterXmaxOfAreaCurve =
            List.map .x (List.filter (\slice -> StringValueInput.round_n 4 slice.x > xmaxOfAreaCurve) <| getSlices hullSlicesMetrics)
    in
    positionsBeforeXminOfAreaCurve ++ List.map normalize newXPositions ++ positionsAfterXmaxOfAreaCurve


resetOriginalSlicesLongitudinalPositions : HullSlices -> HullSlices
resetOriginalSlicesLongitudinalPositions hullSlices =
    let
        oldCustomHullProperties =
            hullSlices.customHullProperties

        newCustomHullProperties =
            { oldCustomHullProperties | customHullslicesPosition = hullSlices.originalSlicePositions }
    in
    { hullSlices | customHullProperties = newCustomHullProperties }


modifyHullSlicesToMatchTargetPrismaticCoefficient : String -> HullSlices -> List Float
modifyHullSlicesToMatchTargetPrismaticCoefficient prismaticCoefficient hullSlices =
    let
        hullSlicesMetrics : HullSlicesMetrics
        hullSlicesMetrics =
            HullSlicesMetrics.fillHullSliceMetrics hullSlices

        originalHullSlices : HullSlicesMetrics
        originalHullSlices =
            hullSlices
                |> resetOriginalSlicesLongitudinalPositions
                |> HullSlicesMetrics.fillHullSliceMetrics

        clampedPrismaticCoefficient : Float
        clampedPrismaticCoefficient =
            case String.toFloat prismaticCoefficient of
                Nothing ->
                    getPrismaticCoefficient hullSlicesMetrics |> .value

                Just pc ->
                    setPrismaticCoefficientAndClamp pc originalHullSlices

        maybeNewXPositions : HullSlicesMetrics -> Maybe (List Float)
        maybeNewXPositions hs =
            lackenbyHS clampedPrismaticCoefficient originalHullSlices
                |> Result.toMaybe
                |> Maybe.map (List.map Tuple.first)
    in
    maybeNewXPositions originalHullSlices
        |> Maybe.map (getLongitudinalPositionOfEachSlice hullSlices originalHullSlices)
        |> Maybe.withDefault hullSlices.customHullProperties.customHullslicesPosition
