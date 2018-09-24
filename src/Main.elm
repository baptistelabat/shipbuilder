module Main exposing (..)

import Html exposing (..)


type Msg
    = NoOp


main : Program Never Model Msg
main =
    Html.beginnerProgram
        { model = init
        , view = view
        , update = update
        }


type alias Model =
    { title : String
    }


init : Model
init =
    { title = "Projet 1"
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        _ ->
            model


view : Model -> Html msg
view model =
    h1 [] [ text model.title ]
