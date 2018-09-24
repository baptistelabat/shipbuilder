module Main exposing (..)

import Html exposing (beginnerProgram)
import Message exposing (Msg)
import Model exposing (init, Model)
import View exposing (view)
import Update exposing (update)


main : Program Never Model Msg
main =
    Html.beginnerProgram
        { model = init
        , view = view
        , update = update
        }
