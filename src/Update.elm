module Update exposing (update)

import Message exposing (Msg(..))
import Model exposing (Model)


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        SelectPanel panel ->
            { model | panel = panel }
