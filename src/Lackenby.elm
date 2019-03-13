module Lackenby exposing
    ( changeSliceAreaWhilePreservingSize
    , computePrismaticCoefficient
    , dB
    , getMasterCrossSection
    , initializePrismaticCoefficient
    , lackenby
    , modifiedBreadth
    , modifyHullSlicesToMatchTargetPrismaticCoefficient
    , setPrismaticCoefficientAndClamp
    , setSliceArea
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

import HullSlices exposing (HullSlice, HullSliceCentroidAndArea, HullSlices)
import List.Extra
import StringValueInput


bisectArea : { c | zmin : Float, zmax : Float, y : List Float } -> Float -> Float -> Float -> Int -> Int -> Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float }
bisectArea slice targetArea alphaLow alphaHigh niterMax niter tol draught =
    let
        lowArea =
            HullSlices.area (slice.zmax - draught) slice.zmax lowAreaSlice

        highArea =
            HullSlices.area (slice.zmax - draught) slice.zmax <| changeSliceAreaWhilePreservingSize alphaHigh slice

        alphaMid =
            (alphaLow + alphaHigh) / 2

        lowAreaSlice =
            changeSliceAreaWhilePreservingSize alphaLow slice

        highAreaSlice =
            changeSliceAreaWhilePreservingSize alphaHigh slice

        midAreaSlice =
            changeSliceAreaWhilePreservingSize alphaMid slice

        midArea =
            HullSlices.area (slice.zmax - draught) slice.zmax midAreaSlice

        reachedTolerance a =
            if targetArea == 0 then
                abs (a - targetArea) < tol

            else
                abs (a - targetArea) / targetArea < tol
    in
    if reachedTolerance lowArea then
        lowAreaSlice

    else if reachedTolerance highArea then
        highAreaSlice

    else if (niter > niterMax) || reachedTolerance midArea then
        midAreaSlice

    else if midArea > targetArea then
        bisectArea slice targetArea alphaLow alphaMid niterMax (niter + 1) tol draught

    else
        bisectArea slice targetArea alphaMid alphaHigh niterMax (niter + 1) tol draught


computePrismaticCoefficient : HullSlices.HullSlicesWithDisplacement -> Maybe Float
computePrismaticCoefficient hs =
    case hs of
        HullSlices.HullSlicesWithDisplacement hullSlices ->
            let
                displacement : Float
                displacement =
                    hullSlices.displacement

                lengthAtWaterline : Float
                lengthAtWaterline =
                    hullSlices.hullSlicesBeneathFreeSurface.xmax - hullSlices.hullSlicesBeneathFreeSurface.xmin

                masterCrossSectionArea2PrismaticCoefficient : HullSliceCentroidAndArea -> Maybe Float
                masterCrossSectionArea2PrismaticCoefficient masterCrossSection =
                    if lengthAtWaterline * masterCrossSection.area == 0 then
                        Nothing

                    else
                        Just <| displacement / (lengthAtWaterline * masterCrossSection.area)
            in
            getMasterCrossSection hs
                |> Maybe.andThen masterCrossSectionArea2PrismaticCoefficient



-- |> masterCrossSectionArea2PrismaticCoefficient


getMasterCrossSection : HullSlices.HullSlicesWithDisplacement -> Maybe HullSliceCentroidAndArea
getMasterCrossSection hullSlices =
    case hullSlices of
        HullSlices.HullSlicesWithDisplacement hs ->
            List.Extra.maximumBy .area hs.centroidAreaForEachImmersedSlice


setSliceArea : Float -> Float -> { c | zmin : Float, zmax : Float, y : List Float } -> Result String { c | zmin : Float, zmax : Float, y : List Float }
setSliceArea targetArea draught slice =
    let
        minArea =
            case slice.y of
                [] ->
                    0

                [ _ ] ->
                    0

                a :: _ ->
                    (slice.zmax - slice.zmin) * a / (toFloat (List.length slice.y) - 1)

        ( alphaMin, alphaMax ) =
            if targetArea < HullSlices.area (slice.zmax - draught) slice.zmax slice then
                ( -100, 0 )

            else
                ( 0, 100 )
    in
    if targetArea < minArea then
        Err "Can't set slice area to such a low value given the discretization: try to increase the area."

    else
        Ok <| bisectArea slice targetArea alphaMin alphaMax 20 0 1.0e-5 draught


{-| Dilates a slice while keeping its breadth & depth.
-}
changeSliceAreaWhilePreservingSize : Float -> { c | zmin : Float, zmax : Float, y : List Float } -> { c | zmin : Float, zmax : Float, y : List Float }
changeSliceAreaWhilePreservingSize alpha slice =
    case List.maximum slice.y of
        Nothing ->
            slice

        Just maxSliceBreadth ->
            { slice | y = List.map (modifiedBreadth maxSliceBreadth alpha) slice.y }


dB : Float -> Float -> Float -> Float
dB maxSliceBreadth alpha currentBreadth =
    let
        z =
            ((maxSliceBreadth - currentBreadth) / maxSliceBreadth) * currentBreadth / maxSliceBreadth
    in
    if z == 0 then
        0

    else
        z ^ (1 / alpha)


modifiedBreadth : Float -> Float -> Float -> Float
modifiedBreadth maxSliceBreadth alpha currentBreadth =
    let
        d =
            dB maxSliceBreadth (abs alpha) currentBreadth
    in
    if alpha < 0 then
        (1 - d) * currentBreadth

    else
        (1 - d) * currentBreadth + d * maxSliceBreadth


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
            curve |> HullSlices.integrate |> (*) (1 / (lengthAtWaterline * masterCrossSectionArea))
    in
    ( getPrismaticCoeff <| shiftAreaCurve -1 areaCurve, getPrismaticCoeff <| shiftAreaCurve 1 areaCurve )


clampPrismaticCoefficient : Float -> Float -> Float -> List ( Float, Float ) -> Float
clampPrismaticCoefficient prismaticCoeff lengthAtWaterline masterCrossSectionArea areaCurve =
    let
        ( minCoeff, maxCoeff ) =
            getPrismaticCoefficientBounds lengthAtWaterline masterCrossSectionArea areaCurve
    in
    StringValueInput.round_n 2 <| clamp minCoeff maxCoeff prismaticCoeff


setPrismaticCoefficientAndClamp : Float -> HullSlices -> HullSlices
setPrismaticCoefficientAndClamp prismaticCoefficient hullSlices_ =
    let
        hullSlices : HullSlices.HullSlicesWithDisplacement
        hullSlices =
            HullSlices.addAreaAndDisplacement hullSlices_

        hs : HullSlices
        hs =
            case hullSlices of
                HullSlices.HullSlicesWithDisplacement h ->
                    h

        clampedPrismaticCoefficient : Float
        clampedPrismaticCoefficient =
            case getMasterCrossSection hullSlices of
                Nothing ->
                    prismaticCoefficient

                Just masterCrossSectionArea ->
                    let
                        lengthAtWaterline : Float
                        lengthAtWaterline =
                            hs.hullSlicesBeneathFreeSurface.xmax - hs.hullSlicesBeneathFreeSurface.xmin

                        areaCurve : List ( Float, Float )
                        areaCurve =
                            hs.centroidAreaForEachImmersedSlice
                                |> List.map (\c -> ( c.x, c.area ))
                    in
                    clampPrismaticCoefficient prismaticCoefficient lengthAtWaterline masterCrossSectionArea.area areaCurve
    in
    { hs | prismaticCoefficient = clampedPrismaticCoefficient |> StringValueInput.asFloatIn hs.prismaticCoefficient }


lackenbyHS : Float -> HullSlices.HullSlicesWithDisplacement -> Result String (List ( Float, Float ))
lackenbyHS targetPrismaticCoefficient hullSlices =
    case getMasterCrossSection hullSlices of
        Nothing ->
            Err "Unable to compute master cross section"

        Just masterCrossSectionArea ->
            let
                hullSlices_ : HullSlices
                hullSlices_ =
                    case hullSlices of
                        HullSlices.HullSlicesWithDisplacement hs ->
                            hs

                lengthAtWaterline : Float
                lengthAtWaterline =
                    hullSlices_.hullSlicesBeneathFreeSurface.xmax - hullSlices_.hullSlicesBeneathFreeSurface.xmin

                areaCurve : List ( Float, Float )
                areaCurve =
                    hullSlices_.centroidAreaForEachImmersedSlice
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
                    curve |> HullSlices.integrate |> (*) (1 / (lengthAtWaterline * masterCrossSectionArea))

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
    lackenby_ 1.0e-2 8 0 -1 1


modifyLongitudinalPositionOfEachSlice : HullSlices -> List Float -> HullSlices
modifyLongitudinalPositionOfEachSlice hullSlices newXPositions =
    let
        normalize : Float -> Float
        normalize x =
            (x - hullSlices.xmin) / hullSlices.length.value

        xminOfAreaCurve : Float
        xminOfAreaCurve =
            hullSlices.centroidAreaForEachImmersedSlice
                |> List.map (.x >> normalize)
                |> List.minimum
                |> Maybe.withDefault hullSlices.xmin

        xmaxOfAreaCurve : Float
        xmaxOfAreaCurve =
            hullSlices.centroidAreaForEachImmersedSlice
                |> List.map (.x >> normalize)
                |> List.maximum
                |> Maybe.withDefault (hullSlices.xmin + hullSlices.length.value)

        slicesBeforeXminOfAreaCurve : List HullSlice
        slicesBeforeXminOfAreaCurve =
            List.filter (\slice -> slice.x < xminOfAreaCurve) hullSlices.slices

        slicesAfterXmaxOfAreaCurve : List HullSlice
        slicesAfterXmaxOfAreaCurve =
            List.filter (\slice -> slice.x > xmaxOfAreaCurve) hullSlices.slices

        slicesToShift : List HullSlice
        slicesToShift =
            List.filter (\slice -> (slice.x >= xminOfAreaCurve) && (slice.x <= xmaxOfAreaCurve)) hullSlices.slices

        shiftSliceLongitudinalPosition : HullSlice -> Float -> HullSlice
        shiftSliceLongitudinalPosition slice x =
            { slice | x = normalize x }

        modifiedSlices : List HullSlice
        modifiedSlices =
            List.map2 shiftSliceLongitudinalPosition slicesToShift newXPositions
    in
    { hullSlices | slices = modifiedSlices }


initializePrismaticCoefficient : HullSlices -> HullSlices
initializePrismaticCoefficient hullSlices =
    let
        p : StringValueInput.FloatInput
        p =
            { value = 0
            , string = ""
            , unit = "-"
            , description = "Prismatic coefficient"
            , nbOfDigits = 2
            }

        maybePrismatic : Maybe Float
        maybePrismatic =
            hullSlices
                |> HullSlices.addAreaAndDisplacement
                |> computePrismaticCoefficient
    in
    case maybePrismatic of
        Nothing ->
            { hullSlices | prismaticCoefficient = p }

        Just coeff ->
            { hullSlices | prismaticCoefficient = coeff |> StringValueInput.round_n 2 |> StringValueInput.asFloatIn p }


resetOriginalSlicesLongitudinalPositions : HullSlices -> HullSlices
resetOriginalSlicesLongitudinalPositions hullSlices =
    let
        setX : HullSlice -> Float -> HullSlice
        setX hullSlice x =
            { hullSlice | x = x }
    in
    { hullSlices | slices = List.map2 setX hullSlices.slices hullSlices.originalSlicePositions }


modifyHullSlicesToMatchTargetPrismaticCoefficient : HullSlices -> HullSlices
modifyHullSlicesToMatchTargetPrismaticCoefficient hullSlices =
    let
        originalHullSlices : HullSlices.HullSlicesWithDisplacement
        originalHullSlices =
            hullSlices
                |> resetOriginalSlicesLongitudinalPositions
                |> HullSlices.addAreaAndDisplacement

        maybeNewXPositions : HullSlices -> Maybe (List Float)
        maybeNewXPositions hs =
            lackenbyHS hs.prismaticCoefficient.value originalHullSlices
                |> Result.toMaybe
                |> Maybe.map (List.map Tuple.first)
    in
    case originalHullSlices of
        HullSlices.HullSlicesWithDisplacement hs ->
            maybeNewXPositions hs
                |> Maybe.map (modifyLongitudinalPositionOfEachSlice hs)
                |> Maybe.withDefault (initializePrismaticCoefficient hullSlices)
