module Model
    exposing
        ( init
        , Model
        , Panel(..)
        )


type alias Model =
    { title : String
    , build : String
    , panel : Panel
    }


init : Model
init =
    { title = "Projet 1"
    , build = "0.0.1"
    , panel = ElementsPanel
    }


type Panel
    = ElementsPanel
    | ImagesPanel
    | GridPanel
