module Tests exposing (all)

import Dict
import Expect
import OrderedDict as OrdDict
import Test exposing (..)


all : Test
all =
    describe "Ordered Dictionary"
        [ test "empty should create an empty OrderedDict " <|
            \() ->
                Expect.equal OrdDict.empty { order = [], dict = Dict.empty }
        , test "singleton should create a singleton OrderedDict" <|
            \() ->
                Expect.equal
                    (OrdDict.singleton 1 "one")
                    { order = [ 1 ], dict = Dict.singleton 1 "one" }
        , test "insert into OrderedDict" <|
            \() ->
                OrdDict.empty
                    |> OrdDict.insert 1 "one"
                    |> Expect.equal
                        { order = [ 1 ], dict = Dict.singleton 1 "one" }
        , test "insertAt into OrderedDict" <|
            \() ->
                OrdDict.empty
                    |> OrdDict.insert 1 "one"
                    |> OrdDict.insert 3 "three"
                    |> OrdDict.insert 4 "four"
                    |> OrdDict.insertAt 1 2 "two"
                    |> Expect.equal
                        { order = [ 1, 2, 3, 4 ]
                        , dict =
                            Dict.fromList
                                [ ( 1, "one" )
                                , ( 2, "two" )
                                , ( 3, "three" )
                                , ( 4, "four" )
                                ]
                        }
        , test "insertAt location greater than order inserts at end of order" <|
            \() ->
                OrdDict.empty
                    |> OrdDict.insert 1 "one"
                    |> OrdDict.insertAt 5 2 "two"
                    |> Expect.equal
                        { order = [ 1, 2 ]
                        , dict = Dict.fromList [ ( 1, "one" ), ( 2, "two" ) ]
                        }
        , test "insertAt location less than zero inserts at start of order" <|
            \() ->
                OrdDict.singleton 1 "one"
                    |> OrdDict.insertAt -1 0 "zero"
                    |> Expect.equal
                        { order = [ 0, 1 ]
                        , dict = Dict.fromList [ ( 0, "zero" ), ( 1, "one" ) ]
                        }
        , test "update into OrderedDict" <|
            \() ->
                OrdDict.singleton 1 "one"
                    |> OrdDict.update
                        1
                        (\key -> Maybe.map (\k -> k ++ " hundred") key)
                    |> Expect.equal
                        { order = [ 1 ], dict = Dict.singleton 1 "one hundred" }
        , test "remove from OrderedDict" <|
            \() ->
                OrdDict.singleton 1 "one"
                    |> OrdDict.remove 1
                    |> Expect.equal OrdDict.empty
        , test "Getting orderedValues should work" <|
            \() ->
                OrdDict.empty
                    |> OrdDict.insert 5 "five"
                    |> OrdDict.insert 2 "two"
                    |> OrdDict.insert 8 "eight"
                    |> OrdDict.orderedValues
                    |> Expect.equal [ "five", "two", "eight" ]
        , test "insert should not add duplicate items" <|
            \() ->
                OrdDict.empty
                    |> OrdDict.insert 5 "five"
                    |> OrdDict.insert 5 "two"
                    |> OrdDict.insert 5 "eight"
                    |> OrdDict.orderedValues
                    |> Expect.equal [ "eight" ]
        ]
