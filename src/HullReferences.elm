module HullReferences
    exposing
        ( HullReferences
        , HullReference
        , viewHullStudioPanel
        , viewHullStudioPanelWithSelection
        )

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type alias HullReferences =
    List HullReference


type alias HullReference =
    { label : String
    , path : String
    }


viewHullStudioPanelWithSelection : List String -> (String -> msg) -> msg -> String -> Html msg
viewHullStudioPanelWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferencesWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath
        ]


viewHullReferencesWithSelection : List String -> (String -> msg) -> msg -> String -> Html msg
viewHullReferencesWithSelection hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath =
    ul [ class "hull-references" ] <|
        (viewUnselectHullReference True unselectMsg)
            :: List.map (viewHullReferenceWithSelection referenceSelectionMsg selectedHullReferencePath) hullRefs


viewHullReferenceWithSelection : (String -> msg) -> String -> String -> Html msg
viewHullReferenceWithSelection referenceSelectionMsg selectedHullReference ref =
    li
        (if ref == selectedHullReference then
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
            [ p [ class "hull-label" ] [ text ref ]
            ]
        ]


viewHullStudioPanel : List String -> (String -> msg) -> msg -> Html msg
viewHullStudioPanel hullRefs referenceSelectionMsg unselectMsg =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [] [ text "Hull Studio" ]
        , viewHullReferences hullRefs referenceSelectionMsg unselectMsg
        ]


viewHullReferences : List String -> (String -> msg) -> msg -> Html msg
viewHullReferences hullRefs referenceSelectionMsg unselectMsg =
    ul [ class "hull-references" ] <|
        (viewUnselectHullReference False unselectMsg)
            :: List.map (viewHullReference referenceSelectionMsg) hullRefs


viewHullReference : (String -> msg) -> String -> Html msg
viewHullReference referenceSelectionMsg ref =
    li [ class "hull-reference", onClick <| referenceSelectionMsg ref ]
        [ div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text ref ]
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
