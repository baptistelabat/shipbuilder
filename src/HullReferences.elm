module HullReferences
    exposing
        ( hullSlicesDecoder
        , HullReferences
        , HullReference
        , HullSlices
        , HullSlice
        , viewHullStudioPanel
        , viewHullStudioPanelWithSelection
        )

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Json.Decode.Pipeline as Pipeline


type alias HullReferences =
    List HullReference


type alias HullReference =
    { label : String
    , path : String
    }


type alias HullSlices =
    { length : Float
    , breadth : Float
    , mouldedDepth : Float
    , xmin : Float
    , ymin : Float
    , zmin : Float
    , slices : List HullSlice
    }


type alias HullSlice =
    { x : Float
    , zmin : Float
    , zmax : Float
    , y : List Float
    }


hullSliceDecoder : Decode.Decoder HullSlice
hullSliceDecoder =
    Pipeline.decode HullSlice
        |> Pipeline.required "x" Decode.float
        |> Pipeline.required "zmin" Decode.float
        |> Pipeline.required "zmax" Decode.float
        |> Pipeline.required "y" (Decode.list Decode.float)


hullSlicesDecoder : Decode.Decoder HullSlices
hullSlicesDecoder =
    Pipeline.decode HullSlices
        |> Pipeline.required "length" Decode.float
        |> Pipeline.required "breadth" Decode.float
        |> Pipeline.required "mouldedDepth" Decode.float
        |> Pipeline.required "xmin" Decode.float
        |> Pipeline.required "ymin" Decode.float
        |> Pipeline.required "zmin" Decode.float
        |> Pipeline.required "slices" (Decode.list hullSliceDecoder)


viewHullStudioPanelWithSelection : HullReferences -> (HullReference -> msg) -> msg -> String -> Html msg
viewHullStudioPanelWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferencesWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath
        ]


viewHullReferencesWithSelection : HullReferences -> (HullReference -> msg) -> msg -> String -> Html msg
viewHullReferencesWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath =
    ul [ class "hull-references" ] <|
        (viewUnselectHullReference True unselectMsg)
            :: List.map (viewHullReferenceWithSelection referenceSelectionMsg selectedHullReferencePath) hullRefs


viewHullReferenceWithSelection : (HullReference -> msg) -> String -> HullReference -> Html msg
viewHullReferenceWithSelection referenceSelectionMsg selectedHullReferencePath ref =
    li
        (if ref.path == selectedHullReferencePath then
            [ class "hull-reference hull-reference__selected" ]
         else
            [ class "hull-reference"
            , onClick <| referenceSelectionMsg ref
            ]
        )
        [ div
            []
            []
        , div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text ref.label ]
            , p [ class "hull-path" ] [ text ref.path ]
            ]
        ]


viewHullStudioPanel : HullReferences -> (HullReference -> msg) -> msg -> Html msg
viewHullStudioPanel hullRefs referenceSelectionMsg unselectMsg =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferences hullRefs referenceSelectionMsg unselectMsg
        ]


viewHullReferences : HullReferences -> (HullReference -> msg) -> msg -> Html msg
viewHullReferences hullRefs referenceSelectionMsg unselectMsg =
    ul [ class "hull-references" ] <|
        (viewUnselectHullReference False unselectMsg)
            :: List.map (viewHullReference referenceSelectionMsg) hullRefs


viewHullReference : (HullReference -> msg) -> HullReference -> Html msg
viewHullReference referenceSelectionMsg ref =
    li [ class "hull-reference", onClick <| referenceSelectionMsg ref ]
        [ div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text ref.label ]
            , p [ class "hull-path" ] [ text ref.path ]
            ]
        ]


viewUnselectHullReference : Bool -> msg -> Html msg
viewUnselectHullReference isAHullSelected unselectMsg =
    li
        (if isAHullSelected then
            [ class "hull-reference"
            , onClick <| unselectMsg
            ]
         else
            [ class "hull-reference hull-reference-none hull-reference__selected" ]
        )
        [ div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text "None" ]
            , p [ class "hull-path" ] [ text "No hull is displayed or used in computations" ]
            ]
        ]
