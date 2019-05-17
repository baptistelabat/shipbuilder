module HullReferences exposing
    ( HullReferencesMsgs
    , viewHullLibraryPanel
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
    , changeViewMsg : msg
    }


viewHullLibraryPanel : List String -> List String -> List Bool -> Maybe String -> HullReferencesMsgs msg -> Html msg
viewHullLibraryPanel hullRefs hullHashs isHullsCustomized selectedHull hullReferencesMsgs =
    div
        [ class "panel hull-panel"
        ]
        [ h2 [ class "hull-panel-title" ]
            [ text "Hull Library"
            , div [ class "hull-library-actions" ]
                [ viewHullImporter hullReferencesMsgs.openLibraryMsg ]
            ]
        , viewHullReferences hullRefs hullHashs isHullsCustomized selectedHull hullReferencesMsgs
        ]


viewHullImporter : msg -> Html msg
viewHullImporter openLibraryMsg =
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
                "hull-info-wrapper hull-info-wrapper__custom"

            else
                "hull-info-wrapper hull-info-wrapper__uncustom"
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
            div [ class "hull-customized" ]
                [ div [ class "hull-actions hull-actions__custom" ]
                    [ viewSaveAsNewHullAction ref hullReferencesMsgs.saveAsNewMsg
                    , viewRemoveHullAction ref hullReferencesMsgs.removeHullMsg
                    , viewFocusHullAction ref hullReferencesMsgs.changeViewMsg
                    ]
                , div
                    [ class "hull-custom-icon" ]
                    [ text "unsaved"
                    , FASolid.asterisk []
                    , text "changes"
                    ]
                ]

          else
            div [ class "hull-actions hull-actions__uncustom" ]
                [ viewRemoveHullAction ref hullReferencesMsgs.removeHullMsg
                , viewFocusHullAction ref hullReferencesMsgs.changeViewMsg
                ]
        ]


viewFocusHullAction : String -> msg -> Html msg
viewFocusHullAction ref changeViewMsg =
    div
        [ class "hull-action focus-hull"
        , onClick <| changeViewMsg
        , title "Focus hull"
        ]
        [ FASolid.arrowRight []
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
