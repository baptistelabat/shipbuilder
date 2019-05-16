module HullReferences exposing
    ( HullReferencesMsgs
    , viewHullStudioPanel
    )

import FontAwesome.Solid as FASolid
import Html exposing (Html, div, h2, input, label, li, p, text, ul)
import Html.Attributes exposing (accept, attribute, class, disabled, download, for, hidden, href, id, name, placeholder, src, style, title, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode


type alias HullReferencesMsgs msg =
    { selectHullMsg : String -> msg
    , unselectHullMsg : msg
    , openLibraryMsg : msg
    , renameHullMsg : String -> String -> msg
    , removeHullMsg : String -> msg
    , saveAsNewMsg : String -> msg
    }


viewHullStudioPanel : List String -> List String -> List Bool -> Maybe String -> HullReferencesMsgs msg -> Html msg
viewHullStudioPanel hullRefs hullHashs isHullsCustomized selectedHull hullReferencesMsgs =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [ class "hull-panel-title" ]
            [ text "Hull Studio"
            , div [ class "hull-studio-actions" ]
                [ viewImportHullSlices hullReferencesMsgs.openLibraryMsg ]
            ]
        , viewHullReferences hullRefs hullHashs isHullsCustomized selectedHull hullReferencesMsgs
        ]


viewImportHullSlices : msg -> Html msg
viewImportHullSlices openLibraryMsg =
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


viewHullReferences : List String -> List String -> List Bool -> Maybe String -> HullReferencesMsgs msg -> Html msg
viewHullReferences hullRefs hullHashs isHullsCustomized selectedHull hullReferencesMsgs =
    let
        isAHullSelected : Bool
        isAHullSelected =
            selectedHull /= Nothing
    in
    ul [ class "hull-references" ] <|
        viewUnselectHullReference isAHullSelected hullReferencesMsgs.unselectHullMsg
            :: List.map3 (viewHullReference selectedHull hullReferencesMsgs) hullRefs hullHashs isHullsCustomized


viewHullReference : Maybe String -> HullReferencesMsgs msg -> String -> String -> Bool -> Html msg
viewHullReference selectedHull hullReferencesMsgs ref hash isHullCustomized =
    let
        hullWrapperClass : String
        hullWrapperClass =
            if isHullCustomized then
                "hull-info-wrapper hull-info-wrapper__simple"

            else
                "hull-info-wrapper hull-info-wrapper__double"
    in
    li
        (if selectedHull == Just ref then
            [ class "hull-reference hull-reference__selected" ]

         else
            [ class "hull-reference"
            , onClick <| hullReferencesMsgs.selectHullMsg ref
            ]
        )
        [ div [ class hullWrapperClass ]
            [ input
                [ class "hull-label"
                , id ref
                , value ref
                , onInput <| hullReferencesMsgs.renameHullMsg ref
                ]
                []
            , p [ class "hull-hash" ] [ text hash ]
            ]
        , if isHullCustomized then
            div [ class "hull-actions hull-actions__simple" ]
                [ viewSaveAsNewHullAction ref hullReferencesMsgs.saveAsNewMsg
                , viewRemoveHullAction ref hullReferencesMsgs.removeHullMsg
                ]

          else
            div [ class "hull-actions hull-actions__double" ]
                [ viewRemoveHullAction ref hullReferencesMsgs.removeHullMsg ]
        ]


viewRemoveHullAction : String -> (String -> msg) -> Html msg
viewRemoveHullAction hullReference removeHullMsg =
    div
        [ class "hull-action delete-hull"
        , onClick <| removeHullMsg hullReference
        , title "Delete hull from library"
        ]
        [ FASolid.trash [] ]


viewSaveAsNewHullAction : String -> (String -> msg) -> Html msg
viewSaveAsNewHullAction hullReference saveAsNewMsg =
    div
        [ class "hull-action save-hull"
        , onClick <| saveAsNewMsg hullReference
        , title "Save as a new"
        ]
        [ FASolid.save [] ]


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
