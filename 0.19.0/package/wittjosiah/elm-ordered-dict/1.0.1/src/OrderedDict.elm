module OrderedDict exposing
    ( OrderedDict
    , empty, singleton, insert, insertAt, update, remove
    , orderedValues
    )

{-| A dictionary mapping unique keys to values preserving insert order.


# Dictionaries

@docs OrderedDict


# Build

@docs empty, singleton, insert, insertAt, update, remove


# Lists

@docs orderedValues

-}

import Dict exposing (Dict)


{-| A dictionary of keys and values with order.
-}
type alias OrderedDict k v =
    { order : List k
    , dict : Dict k v
    }


{-| Create an empty ordered dictionary.
-}
empty : OrderedDict k v
empty =
    { order = []
    , dict = Dict.empty
    }


{-| Create an ordered dictionary with one key-value pair.
-}
singleton : comparable -> v -> OrderedDict comparable v
singleton key value =
    { order = [ key ]
    , dict = Dict.singleton key value
    }


{-| Insert a key-value pair into an ordered dictionary. Replaces value when there is a collision.
-}
insert : comparable -> v -> OrderedDict comparable v -> OrderedDict comparable v
insert key value orderedDict =
    let
        newOrder =
            if Dict.member key orderedDict.dict then
                orderedDict.order

            else
                List.append orderedDict.order [ key ]
    in
    { order = newOrder
    , dict = Dict.insert key value orderedDict.dict
    }


{-| Insert a key-value pair into a specific location in the order of an ordered dictionary. Replaces value when there is a collision.
-}
insertAt : Int -> comparable -> v -> OrderedDict comparable v -> OrderedDict comparable v
insertAt index key value orderedDict =
    let
        start =
            List.take index orderedDict.order

        end =
            List.drop index orderedDict.order

        newOrder =
            List.concat [ start, [ key ], end ]
    in
    { order = newOrder
    , dict = Dict.insert key value orderedDict.dict
    }


{-| Update the value of an ordered dictionary for a specific key with a given function.
-}
update : comparable -> (Maybe v -> Maybe v) -> OrderedDict comparable v -> OrderedDict comparable v
update key alter orderedDict =
    if Dict.member key orderedDict.dict then
        { order = orderedDict.order
        , dict = Dict.update key alter orderedDict.dict
        }

    else
        orderedDict


{-| Remove a key-value pair from an ordered dictionary. If the key is not found, no changes are made.
-}
remove : comparable -> OrderedDict comparable v -> OrderedDict comparable v
remove key orderedDict =
    { order = List.filter (\k -> k /= key) orderedDict.order
    , dict = Dict.remove key orderedDict.dict
    }


{-| Return a list of items based on their order

    empty
        |> insert 33 "Hello"
        |> insert 45 "World"
        |> insertAt 1 39 "Elm"
        |> toList
        == [ "Hello", "Elm", "World" ]

-}
orderedValues : OrderedDict comparable v -> List v
orderedValues orderedDict =
    List.filterMap (\k -> Dict.get k orderedDict.dict) orderedDict.order
