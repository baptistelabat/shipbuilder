module Message exposing (Msg(..))

import Model exposing (Panel)


type Msg
    = NoOp
    | SelectPanel Panel
