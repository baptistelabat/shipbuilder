module HullSlicesMetrics exposing
    ( HullSlicesMetrics
    , addExtremePoints
    , computePrismaticCoefficient
    , emptyHullSlicesMetrics
    , extractHorizontalSliceAtZ
    , fillHullSliceMetrics
    , getBlockCoefficient
    , getBreadth
    , getCenterOfBuoyancy
    , getCentroidAreaForEachImmersedSlice
    , getDepth
    , getDisplacement
    , getDraught
    , getHullSlicesBeneathFreeSurface
    , getLength
    , getMasterCrossSection
    , getMetacentre
    , getPrismaticCoefficient
    , getSlices
    , getXmin
    , getZmin
    , initializePrismaticCoefficient
    , intersectBelow
    )

import Array
import HullSlices
    exposing
        ( HullSlice
        , HullSliceAsAreaXYList
        , HullSliceAsZYList
        , HullSliceCentroidAndArea
        , HullSlices
        , area
        , areaTrapezoid
        , blockVolume
        , calculateCentroid
        , calculateSliceArea
        , centroidAbscissa
        , clip
        , denormalizeHullSlice
        , denormalizeHullSlices
        , extractY
        , getInertialMoment
        , integrate
        , setLongitudinalPositionOfEachSlice
        , trapezoidCentroid
        , volume
        , zGTrapezoid
        , zTrapezoid
        , zminForEachTrapezoid
        )
import List.Extra
import StringValueInput


type alias HullSlicesMetrics_ =
    { length : StringValueInput.FloatInput
    , breadth : StringValueInput.FloatInput
    , depth : StringValueInput.FloatInput
    , prismaticCoefficient : StringValueInput.FloatInput
    , xmin : Float
    , zmin : Float
    , slices : List HullSlice
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


type HullSlicesMetrics
    = HullSlicesMetrics HullSlicesMetrics_


emptyHullSlicesMetrics : HullSlicesMetrics
emptyHullSlicesMetrics =
    HullSlicesMetrics
        { length = StringValueInput.emptyFloat 1
        , breadth = StringValueInput.emptyFloat 1
        , depth = StringValueInput.emptyFloat 1
        , prismaticCoefficient = StringValueInput.emptyFloat 1
        , xmin = 0
        , zmin = 0
        , slices = []
        , draught = StringValueInput.emptyFloat 1
        , denormalizedSlices = []
        , blockCoefficient = 0
        , centreOfBuoyancy = 0
        , displacement = 0
        , metacentre = 0
        , hullSlicesBeneathFreeSurface = { xmin = 0, xmax = 0, hullSlices = [] }
        , centroidAreaForEachImmersedSlice = []
        }



-- GETTERS


getBlockCoefficient : HullSlicesMetrics -> Float
getBlockCoefficient hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.blockCoefficient


getDisplacement : HullSlicesMetrics -> Float
getDisplacement hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.displacement


getPrismaticCoefficient : HullSlicesMetrics -> StringValueInput.FloatInput
getPrismaticCoefficient hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.prismaticCoefficient


getCenterOfBuoyancy : HullSlicesMetrics -> Float
getCenterOfBuoyancy hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.centreOfBuoyancy


getMetacentre : HullSlicesMetrics -> Float
getMetacentre hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.metacentre


getXmin : HullSlicesMetrics -> Float
getXmin hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.xmin


getZmin : HullSlicesMetrics -> Float
getZmin hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.zmin


getLength : HullSlicesMetrics -> StringValueInput.FloatInput
getLength hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.length


getBreadth : HullSlicesMetrics -> StringValueInput.FloatInput
getBreadth hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.breadth


getDepth : HullSlicesMetrics -> StringValueInput.FloatInput
getDepth hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.depth


getDraught : HullSlicesMetrics -> StringValueInput.FloatInput
getDraught hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.draught


getSlices : HullSlicesMetrics -> List HullSlice
getSlices hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.slices


getDenormalizedSlices : HullSlicesMetrics -> List HullSlice
getDenormalizedSlices hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.denormalizedSlices


getCentroidAreaForEachImmersedSlice : HullSlicesMetrics -> List HullSliceCentroidAndArea
getCentroidAreaForEachImmersedSlice hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.centroidAreaForEachImmersedSlice


getHullSlicesBeneathFreeSurface : HullSlicesMetrics -> { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList }
getHullSlicesBeneathFreeSurface hullSlicesMetrics =
    let
        hs : HullSlicesMetrics_
        hs =
            case hullSlicesMetrics of
                HullSlicesMetrics hs_ ->
                    hs_
    in
    hs.hullSlicesBeneathFreeSurface



-- FILLING METRICS


fillHullSliceMetrics : HullSlices -> HullSlicesMetrics
fillHullSliceMetrics hullSlices =
    hullSlices
        |> toHullSlicesMetrics
        |> addAreaAndDisplacement
        |> addCentreOfBuoyancy
        |> addBlockCoefficient
        |> addMetacentre
        |> initializePrismaticCoefficient
        |> HullSlicesMetrics


toHullSlicesMetrics : HullSlices -> HullSlicesMetrics_
toHullSlicesMetrics hullSlices =
    { length = HullSlices.getLength hullSlices
    , breadth = HullSlices.getBreadth hullSlices
    , depth = HullSlices.getDepth hullSlices
    , prismaticCoefficient = StringValueInput.emptyFloat 1
    , xmin = hullSlices.xmin
    , zmin = hullSlices.zmin
    , slices = setLongitudinalPositionOfEachSlice hullSlices
    , draught = HullSlices.getDraught hullSlices
    , denormalizedSlices = []
    , blockCoefficient = 0
    , centreOfBuoyancy = 0
    , displacement = 0
    , metacentre = 0
    , hullSlicesBeneathFreeSurface = { xmin = 0, xmax = 0, hullSlices = [] }
    , centroidAreaForEachImmersedSlice = []
    }


addAreaAndDisplacement : HullSlicesMetrics_ -> HullSlicesMetrics_
addAreaAndDisplacement hullSlicesMetrics =
    hullSlicesMetrics
        |> addDenormalizedSlices
        |> addHullSlicesBeneathFreeSurface
        |> addCentroidAreaForEachImmersedSlice
        |> addExtremePoints
        |> addDisplacement


addDenormalizedSlices : HullSlicesMetrics_ -> HullSlicesMetrics_
addDenormalizedSlices hullSlicesMetrics =
    let
        denormalizedSlices : List HullSlice
        denormalizedSlices =
            denormalizeHullSlices
                { length = hullSlicesMetrics.length.value, breadth = hullSlicesMetrics.breadth.value, depth = hullSlicesMetrics.depth.value, xmin = hullSlicesMetrics.xmin, zmin = hullSlicesMetrics.zmin }
                hullSlicesMetrics.slices
    in
    { hullSlicesMetrics | denormalizedSlices = denormalizedSlices }


addHullSlicesBeneathFreeSurface : HullSlicesMetrics_ -> HullSlicesMetrics_
addHullSlicesBeneathFreeSurface hullSlicesMetrics =
    let
        zAtDraught : Float
        zAtDraught =
            hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value - hullSlicesMetrics.draught.value

        hullSlicesBeneathFreeSurface : { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList }
        hullSlicesBeneathFreeSurface =
            intersectBelow zAtDraught <| HullSlicesMetrics hullSlicesMetrics
    in
    { hullSlicesMetrics | hullSlicesBeneathFreeSurface = hullSlicesBeneathFreeSurface }


addCentroidAreaForEachImmersedSlice : HullSlicesMetrics_ -> HullSlicesMetrics_
addCentroidAreaForEachImmersedSlice hullSlicesMetrics =
    let
        integrateTrapezoidMetricOnSlices : (( Float, Float ) -> ( Float, Float ) -> Float) -> List ( Float, Float ) -> Float
        integrateTrapezoidMetricOnSlices trapezoidMetric denormalizedSlices =
            case denormalizedSlices of
                ( z1, y1 ) :: ( z2, y2 ) :: rest ->
                    trapezoidMetric ( z1, y1 ) ( z2, y2 ) + integrateTrapezoidMetricOnSlices trapezoidMetric (( z2, y2 ) :: rest)

                _ ->
                    0

        calculateCentroidArea : HullSliceAsZYList -> HullSliceCentroidAndArea
        calculateCentroidArea hullSliceAsZYList =
            let
                area_ =
                    2 * integrateTrapezoidMetricOnSlices areaTrapezoid hullSliceAsZYList.zylist

                centroid_ =
                    if area_ == 0.0 then
                        0

                    else
                        integrateTrapezoidMetricOnSlices zTrapezoid hullSliceAsZYList.zylist / area_
            in
            { x = hullSliceAsZYList.x, centroid = centroid_, area = area_ }
    in
    { hullSlicesMetrics | centroidAreaForEachImmersedSlice = List.map calculateCentroidArea hullSlicesMetrics.hullSlicesBeneathFreeSurface.hullSlices }


addExtremePoints : HullSlicesMetrics_ -> HullSlicesMetrics_
addExtremePoints hullSlicesMetrics =
    let
        xmin =
            hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmin

        xmax =
            hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmax

        xminAreaCurve =
            hullSlicesMetrics.centroidAreaForEachImmersedSlice
                |> List.map .x
                |> List.minimum
                |> Maybe.withDefault xmin

        xmaxAreaCurve =
            hullSlicesMetrics.centroidAreaForEachImmersedSlice
                |> List.map .x
                |> List.maximum
                |> Maybe.withDefault xmax

        centroidAndAreaWithEndpointsAtZero =
            case ( xminAreaCurve == xmin, xmaxAreaCurve == xmax ) of
                ( False, False ) ->
                    List.concat [ [ { x = xmin, area = 0.0, centroid = 0 } ], hullSlicesMetrics.centroidAreaForEachImmersedSlice, [ { x = xmax, area = 0.0, centroid = 0 } ] ]

                ( False, True ) ->
                    List.concat [ [ { x = xmin, area = 0.0, centroid = 0 } ], hullSlicesMetrics.centroidAreaForEachImmersedSlice ]

                ( True, False ) ->
                    List.concat [ hullSlicesMetrics.centroidAreaForEachImmersedSlice, [ { x = xmax, area = 0.0, centroid = 0 } ] ]

                ( True, True ) ->
                    hullSlicesMetrics.centroidAreaForEachImmersedSlice
    in
    { hullSlicesMetrics | centroidAreaForEachImmersedSlice = centroidAndAreaWithEndpointsAtZero }


addDisplacement : HullSlicesMetrics_ -> HullSlicesMetrics_
addDisplacement hullSlicesMetrics =
    { hullSlicesMetrics | displacement = volume hullSlicesMetrics.centroidAreaForEachImmersedSlice }


addCentreOfBuoyancy : HullSlicesMetrics_ -> HullSlicesMetrics_
addCentreOfBuoyancy hullSlicesMetrics =
    let
        hullCentroid : Float
        hullCentroid =
            calculateCentroid hullSlicesMetrics.centroidAreaForEachImmersedSlice

        centreOfBuoyancy : Float
        centreOfBuoyancy =
            if hullSlicesMetrics.displacement == 0.0 then
                0.0

            else
                hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value - (hullCentroid / (hullSlicesMetrics.displacement / 2))
    in
    { hullSlicesMetrics | centreOfBuoyancy = centreOfBuoyancy }


addBlockCoefficient : HullSlicesMetrics_ -> HullSlicesMetrics_
addBlockCoefficient hullSlicesMetrics =
    let
        blockVolume_ : Float
        blockVolume_ =
            blockVolume hullSlicesMetrics.hullSlicesBeneathFreeSurface

        -- Block Coefficient = Volume of displacement ÷ blockVolume
        blockCoefficient : Float
        blockCoefficient =
            if blockVolume_ == 0.0 then
                0.0

            else
                (hullSlicesMetrics.displacement / 2) / blockVolume_
    in
    { hullSlicesMetrics | blockCoefficient = blockCoefficient }


addMetacentre : HullSlicesMetrics_ -> HullSlicesMetrics_
addMetacentre hullSlicesMetrics =
    let
        zAtDraught : Float
        zAtDraught =
            hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value - hullSlicesMetrics.draught.value

        horizontalHullSliceAtDraught : HullSliceAsAreaXYList
        horizontalHullSliceAtDraught =
            extractHorizontalSliceAtZ zAtDraught <| HullSlicesMetrics hullSlicesMetrics

        inertialMoment_ : Float
        inertialMoment_ =
            getInertialMoment horizontalHullSliceAtDraught

        bM : Float
        bM =
            if hullSlicesMetrics.displacement == 0.0 then
                0.0

            else
                inertialMoment_ / hullSlicesMetrics.displacement

        metacentre : Float
        metacentre =
            hullSlicesMetrics.centreOfBuoyancy + bM
    in
    { hullSlicesMetrics | metacentre = metacentre }


initializePrismaticCoefficient : HullSlicesMetrics_ -> HullSlicesMetrics_
initializePrismaticCoefficient hullSlicesMetrics =
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
            hullSlicesMetrics
                |> computePrismaticCoefficient
    in
    case maybePrismatic of
        Nothing ->
            { hullSlicesMetrics | prismaticCoefficient = p }

        Just coeff ->
            { hullSlicesMetrics | prismaticCoefficient = coeff |> StringValueInput.round_n 2 |> StringValueInput.asFloatIn p }


computePrismaticCoefficient : HullSlicesMetrics_ -> Maybe Float
computePrismaticCoefficient hullSlicesMetrics =
    let
        displacement : Float
        displacement =
            hullSlicesMetrics.displacement

        lengthAtWaterline : Float
        lengthAtWaterline =
            hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmax - hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmin

        masterCrossSectionArea2PrismaticCoefficient : HullSliceCentroidAndArea -> Maybe Float
        masterCrossSectionArea2PrismaticCoefficient masterCrossSection =
            if lengthAtWaterline * masterCrossSection.area == 0 then
                Nothing

            else
                Just <| displacement / (lengthAtWaterline * masterCrossSection.area)
    in
    (getMasterCrossSection <| HullSlicesMetrics hullSlicesMetrics)
        |> Maybe.andThen masterCrossSectionArea2PrismaticCoefficient


getMasterCrossSection : HullSlicesMetrics -> Maybe HullSliceCentroidAndArea
getMasterCrossSection hullSlicesMetrics =
    List.Extra.maximumBy .area <| getCentroidAreaForEachImmersedSlice hullSlicesMetrics


extractHorizontalSliceAtZ : Float -> HullSlicesMetrics -> HullSliceAsAreaXYList
extractHorizontalSliceAtZ z0 hullSlices =
    let
        hullSlicesBelowZ0 =
            intersectBelow z0 hullSlices

        extractFirstXY : HullSliceAsZYList -> ( Float, Float )
        extractFirstXY hullSliceAsZYList =
            ( hullSliceAsZYList.x, Maybe.withDefault 0 <| List.head <| extractY hullSliceAsZYList )

        xy_ =
            List.map extractFirstXY hullSlicesBelowZ0.hullSlices

        area_ =
            integrate xy_
    in
    { z = z0, xy = xy_, area = area_ }


intersectBelow : Float -> HullSlicesMetrics -> { xmin : Float, xmax : Float, hullSlices : List HullSliceAsZYList }
intersectBelow z0 hullSlices =
    -- CN List HullSlice supposed denormalized !!!
    let
        -- filter HullSlice with zmax <= z0
        filterHS =
            List.filter (\u -> u.zmax > z0 && not (List.isEmpty u.y)) <| getDenormalizedSlices hullSlices

        toXY_ : HullSlice -> HullSliceAsZYList
        toXY_ hs =
            let
                zmax =
                    hs.zmax

                zmin =
                    hs.zmin

                y =
                    hs.y

                dz : Float
                dz =
                    (zmax - zmin) / (toFloat <| max 1 <| List.length y - 1)

                acc : ( Int, Float ) -> ( Float, Float )
                acc ( idx, y_ ) =
                    ( zmin + toFloat idx * dz, y_ )

                lst =
                    y
                        |> Array.fromList
                        |> Array.toIndexedList
                        |> List.map acc
            in
            { x = hs.x, zylist = lst }

        lhsXY =
            List.map HullSlices.toHullSliceAsZYList filterHS

        getInterpolateValuesAndSubList : List ( Float, Float ) -> List ( Float, Float )
        getInterpolateValuesAndSubList list =
            -- find z(i), z(i+1) / z0 >= z(i) && z0 < z(i+1)
            -- k = (z0-z(i)) / (z(i+1) - z(i))
            -- y0 = k*y(i) + (1-k)*y(i+1)
            -- subList = (z0,y0)::(z(i+1),y(i+1))::rest
            let
                filterL : Float -> List ( Float, Float ) -> List ( Float, Float )
                filterL z lst =
                    case lst of
                        ( z1, y1 ) :: ( z2, y2 ) :: rest ->
                            if z < z2 && z >= z1 then
                                let
                                    k =
                                        (z - z1) / (z2 - z1)

                                    y =
                                        (1 - k) * y1 + k * y2
                                in
                                ( z, y ) :: ( z2, y2 ) :: rest

                            else
                                filterL z (( z2, y2 ) :: rest)

                        _ ->
                            []

                subList =
                    filterL z0 list
            in
            subList

        extractZYAtZ_ : List ( Float, Float ) -> List ( Float, Float )
        extractZYAtZ_ list =
            -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
            -- list order with z up
            let
                maybeZmin =
                    List.minimum (List.map Tuple.first list)

                maybeZmax =
                    List.maximum (List.map Tuple.first list)
            in
            case maybeZmax of
                Nothing ->
                    []

                Just zmax ->
                    if z0 > zmax then
                        []

                    else
                        case maybeZmin of
                            Nothing ->
                                []

                            Just zmin ->
                                if z0 < zmin then
                                    list

                                else
                                    getInterpolateValuesAndSubList list

        extractZYAtZ : HullSliceAsZYList -> HullSliceAsZYList
        extractZYAtZ hsXY =
            { x = hsXY.x, zylist = extractZYAtZ_ hsXY.zylist }

        --
        -- extract subSlice at z0
        -- return sublist with z > z0 concatenate with (z0, y(z0) interpolation)
        -- lhsXY_AtZ : List HullSliceAsZYList (dz is not constant)
        lhsXY_AtZ =
            List.map extractZYAtZ lhsXY

        xMinAtZ : Float -> List HullSlice -> Float
        xMinAtZ xmin_ listHS_ =
            case listHS_ of
                hs :: xs ->
                    if hs.zmax <= z0 then
                        xMinAtZ hs.x xs

                    else
                        xmin_

                _ ->
                    xmin_

        xmin =
            (xMinAtZ <| getXmin hullSlices) <| getDenormalizedSlices hullSlices

        xMaxAtZ : Float -> List HullSlice -> Float
        xMaxAtZ xmax_ listHS_ =
            case listHS_ of
                hs :: xs ->
                    if hs.zmax <= z0 then
                        xMaxAtZ hs.x xs

                    else
                        xmax_

                _ ->
                    xmax_

        xmax =
            xMaxAtZ (getXmin hullSlices + (getLength hullSlices |> .value)) (List.reverse <| getDenormalizedSlices hullSlices)
    in
    { xmin = xmin, xmax = xmax, hullSlices = lhsXY_AtZ }
