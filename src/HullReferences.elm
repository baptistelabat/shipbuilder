module HullReferences exposing (HullReferences, HullReference, viewHullStudioPanel, viewHullStudioPanelWithSelection)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type alias HullReferences =
    List HullReference


type alias HullReference =
    { label : String
    , path : String
    }


viewHullStudioPanelWithSelection : HullReferences -> (HullReference -> msg) -> String -> Html msg
viewHullStudioPanelWithSelection hullRefs referenceSelectionMsg selectedHullReferencePath =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferencesWithSelection hullRefs referenceSelectionMsg selectedHullReferencePath
        ]


viewHullReferencesWithSelection : HullReferences -> (HullReference -> msg) -> String -> Html msg
viewHullReferencesWithSelection hullRefs referenceSelectionMsg selectedHullReferencePath =
    ul [ class "hull-references" ] <|
        List.map (viewHullReferenceWithSelection referenceSelectionMsg selectedHullReferencePath) hullRefs


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


viewHullStudioPanel : HullReferences -> (HullReference -> msg) -> Html msg
viewHullStudioPanel hullRefs referenceSelectionMsg =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferences hullRefs referenceSelectionMsg
        ]


viewHullReferences : HullReferences -> (HullReference -> msg) -> Html msg
viewHullReferences hullRefs referenceSelectionMsg =
    ul [ class "hull-references" ] <|
        List.map (viewHullReference referenceSelectionMsg) hullRefs


viewHullReference : (HullReference -> msg) -> HullReference -> Html msg
viewHullReference referenceSelectionMsg ref =
    li [ class "hull-reference", onClick <| referenceSelectionMsg ref ]
        [ div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text ref.label ]
            , p [ class "hull-path" ] [ text ref.path ]
            ]
        ]
