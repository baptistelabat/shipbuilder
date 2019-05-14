module HullReferences exposing
    ( HullReference
    , HullReferences
    , HullReferencesMsgs
    , viewHullStudioPanel
    )

import Html exposing (Html, div, h2, input, label, li, p, text, ul)
import Html.Attributes exposing (accept, attribute, class, disabled, download, for, hidden, href, id, name, placeholder, src, style, title, type_, value)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode


type alias HullReferences =
    List HullReference


type alias HullReference =
    { label : String
    , path : String
    }


type alias HullReferencesMsgs msg =
    { selectHullMsg : String -> msg
    , unselectHullMsg : msg
    , openLibraryMsg : msg
    }


viewHullStudioPanel : List String -> List String -> Maybe String -> HullReferencesMsgs msg -> Html msg
viewHullStudioPanel hullRefs hullHashs selectedHullReferencePath hullReferencesMsgs =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [ class "hull-panel-title" ]
            [ text "Hull Studio"
            , div [ class "hull-actions" ]
                [ importHullSlices hullReferencesMsgs.openLibraryMsg ]
            ]
        , viewHullReferences hullRefs hullHashs selectedHullReferencePath hullReferencesMsgs
        ]


importHullSlices : msg -> Html msg
importHullSlices openLibraryMsg =
    div
        [ class "import-item"
        , title "Import hull library from file"
        ]
        [ label
            [ for "import-hull-library" ]
            [ text "Import" ]
        , input
            [ type_ "file"
            , accept "application/json, .json"
            , id "import-hull-library"
            , name "import-hull-library"
            , class "hidden-input"
            , on "change" <| Decode.succeed <| openLibraryMsg
            ]
            []
        ]


viewHullReferences : List String -> List String -> Maybe String -> HullReferencesMsgs msg -> Html msg
viewHullReferences hullRefs hullHashs selectedHullReferencePath hullReferencesMsgs =
    let
        isAHullSelected : Bool
        isAHullSelected =
            selectedHullReferencePath /= Nothing
    in
    ul [ class "hull-references" ] <|
        viewUnselectHullReference isAHullSelected hullReferencesMsgs.unselectHullMsg
            :: List.map2 (viewHullReference hullReferencesMsgs.selectHullMsg selectedHullReferencePath) hullRefs hullHashs


viewHullReference : (String -> msg) -> Maybe String -> String -> String -> Html msg
viewHullReference selectHullMsg selectedHullReference ref hash =
    li
        (if selectedHullReference == Just ref then
            [ class "hull-reference hull-reference__selected" ]

         else
            [ class "hull-reference"
            , onClick <| selectHullMsg ref
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
viewUnselectHullReference isAHullSelected unselectHullMsg =
    li
        (if isAHullSelected then
            [ class "hull-reference"
            , onClick <| unselectHullMsg
            ]

         else
            [ class "hull-reference hull-reference-none hull-reference__selected" ]
        )
        [ div [ class "hull-info-wrapper" ]
            [ p [ class "hull-label" ] [ text "None" ]
            , p [ class "hull-path" ] [ text "No hull is displayed or used in computations" ]
            ]
        ]
