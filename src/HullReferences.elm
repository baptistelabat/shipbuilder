module HullReferences exposing
    ( HullReference
    , HullReferences
    , viewHullStudioPanel
    )

import Html exposing (Html, div, h2, li, p, text, ul)
import Html.Attributes exposing (class, id)
import Html.Events exposing (onClick)


type alias HullReferences =
    List HullReference


type alias HullReference =
    { label : String
    , path : String
    }


viewHullStudioPanel : List String -> (String -> msg) -> msg -> Maybe String -> Html msg -> Html msg
viewHullStudioPanel hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath importHullSlices =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [ class "hull-panel-title" ]
            [ text "Hull Studio"
            , div [ class "hull-actions" ]
                [ importHullSlices ]
            ]
        , viewHullReferences hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath
        ]


viewHullReferences : List String -> (String -> msg) -> msg -> Maybe String -> Html msg
viewHullReferences hullRefs referenceSelectionMsg unselectMsg selectedHullReferencePath =
    let
        isAHullSelected : Bool
        isAHullSelected =
            case selectedHullReferencePath of
                Just hullname ->
                    True

                Nothing ->
                    False
    in
    ul [ class "hull-references" ] <|
        viewUnselectHullReference isAHullSelected unselectMsg
            :: List.map (viewHullReference referenceSelectionMsg selectedHullReferencePath) hullRefs


viewHullReference : (String -> msg) -> Maybe String -> String -> Html msg
viewHullReference referenceSelectionMsg selectedHullReference ref =
    li
        (if ref == Maybe.withDefault "" selectedHullReference then
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
