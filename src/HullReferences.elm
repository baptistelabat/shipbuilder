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


viewHullStudioPanel : List String -> List String -> (String -> msg) -> msg -> Maybe String -> Html msg -> Html msg
viewHullStudioPanel hullRefs hullHashs referenceSelectionMsg unselectMsg selectedHullReferencePath importHullSlices =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [ class "hull-panel-title" ]
            [ text "Hull Studio"
            , div [ class "hull-actions" ]
                [ importHullSlices ]
            ]
        , viewHullReferences hullRefs hullHashs referenceSelectionMsg unselectMsg selectedHullReferencePath
        ]


viewHullReferences : List String -> List String -> (String -> msg) -> msg -> Maybe String -> Html msg
viewHullReferences hullRefs hullHashs referenceSelectionMsg unselectMsg selectedHullReferencePath =
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
            :: List.map2 (viewHullReference referenceSelectionMsg selectedHullReferencePath) hullRefs hullHashs


viewHullReference : (String -> msg) -> Maybe String -> String -> String -> Html msg
viewHullReference referenceSelectionMsg selectedHullReference ref hash =
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
            , p [ class "hull-hash" ] [ text hash ]
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
