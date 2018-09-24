module Model exposing (init, Model)


type alias Model =
    { title : String
    }


init : Model
init =
    { title = "Projet 1" }
