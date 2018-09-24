module Model
    exposing
        ( init
        , Model
        , Panel
        )


type alias Model =
    { title : String
    , build : String
    }


init : Model
init =
    { title = "Projet 1"
    , build = "0.0.1"
    }


type Panel
    = ElementsPanel
    | ImagesPanel
    | GridPanel
