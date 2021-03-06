module Internal.Interpolation exposing (Config(..), toCommands)

{-| -}

import Internal.Path as Path exposing (..)
import Internal.Data as Data exposing (..)



{-| -}
type Config
  = Linear
  | Monotone
  | Stepped


{-| -}
toCommands : Config -> List (List (Data.Data data), Maybe (Data.Data data)) -> List (List Command)
toCommands interpolation data =
  let
    points =
      List.map (Tuple.first >> List.map .point)

    pointsSections =
      List.map (Tuple.mapFirst (List.map .point) >> Tuple.mapSecond (Maybe.map .point))
  in
  case interpolation of
    Linear   -> linear (points data)
    Monotone -> monotone (points data)
    Stepped  -> stepped (pointsSections data)



-- INTERNAL / LINEAR


linear : List (List Point) -> List (List Command)
linear =
  List.map (List.map Line)



-- INTERNAL / MONOTONE


monotone : List (List Point) -> List (List Command)
monotone sections =
  List.foldr monotoneSection ( First, [] ) sections
    |> Tuple.second


monotoneSection : List Point -> ( Tangent, List (List Command) ) -> ( Tangent, List (List Command) )
monotoneSection points ( tangent, acc ) =
  let
    ( t0, commands ) =
      case points of
        p0 :: rest ->
          monotonePart (p0 :: rest) ( tangent, [ Line p0 ] )

        [] ->
          ( tangent, [] )
  in
  ( t0, commands :: acc )


type Tangent
  = First
  | Previous Float


monotonePart : List Point -> ( Tangent, List Command ) -> ( Tangent, List Command )
monotonePart points ( tangent, commands ) =
  case ( tangent, points ) of
    ( First, p0 :: p1 :: p2 :: rest ) ->
      let t1 = slope3 p0 p1 p2
          t0 = slope2 p0 p1 t1
      in
      ( Previous t1
      , commands ++ [ monotoneCurve p0 p1 t0 t1 ]
      )
      |> monotonePart (p1 :: p2 :: rest)

    ( Previous t0, p0 :: p1 :: p2 :: rest ) ->
      let t1 = slope3 p0 p1 p2 in
      ( Previous t1
      , commands ++ [ monotoneCurve p0 p1 t0 t1 ]
      )
      |> monotonePart (p1 :: p2 :: rest)

    ( First, [ p0, p1 ] ) ->
      let t1 = slope3 p0 p1 p1 in
      ( Previous t1
      , commands ++ [ monotoneCurve p0 p1 t1 t1, Line p1 ]
      )

    ( Previous t0, [ p0, p1 ] ) ->
      let t1 = slope3 p0 p1 p1 in
      ( Previous t1
      , commands ++ [ monotoneCurve p0 p1 t0 t1, Line p1 ]
      )

    ( _, _ ) ->
      ( tangent
      , commands
      )


monotoneCurve : Point -> Point -> Float -> Float -> Command
monotoneCurve point0 point1 tangent0 tangent1 =
  let
    dx =
      (point1.x - point0.x) / 3
  in
  CubicBeziers
      { x = point0.x + dx, y = point0.y + dx * tangent0 }
      { x = point1.x - dx, y = point1.y - dx * tangent1 }
      point1


{-| Calculate the slopes of the tangents (Hermite-type interpolation) based on
 the following paper: Steffen, M. 1990. A Simple Method for Monotonic
 Interpolation in One Dimension
-}
slope3 : Point -> Point -> Point -> Float
slope3 point0 point1 point2 =
  let
    h0 = point1.x - point0.x
    h1 = point2.x - point1.x
    s0h = toH h0 h1
    s1h = toH h1 h0
    s0 = (point1.y - point0.y) / s0h
    s1 = (point2.y - point1.y) / s1h
    p = (s0 * h1 + s1 * h0) / (h0 + h1)
    slope = (sign s0 + sign s1) * (min (min (abs s0) (abs s1)) (0.5 * abs p))
  in
    if isNaN slope then 0 else slope


toH : Float -> Float -> Float
toH h0 h1 =
  if h0 == 0
    then if h1 < 0 then 0 * -1 else h1
    else h0


{-| Calculate a one-sided slope.
-}
slope2 : Point -> Point -> Float -> Float
slope2 point0 point1 t =
  let h = point1.x - point0.x in
    if h /= 0
      then (3 * (point1.y - point0.y) / h - t) / 2
      else t


sign : Float -> Float
sign x =
  if x < 0
    then -1
    else 1



-- INTERNAL / STEPPED


stepped : List (List Point, Maybe Point) -> List (List Command)
stepped sections =
  let
    expand result section =
      case section of
        (a :: b :: rest, broken)  -> expand (result ++ after a b) (b :: rest, broken)
        (last :: [], Just broken) -> result ++ [ Point broken.x last.y ]
        (last :: [], Nothing)     -> result
        ([], _)                   -> result
  in
  List.map (expand [] >> List.map Line) sections


fakeLast : Point -> Point -> Point
fakeLast last0 last1 =
  Point (last1.x + last1.x - last0.x) last1.y


after : Point -> Point -> List Point
after a b =
  [ a, Point b.x a.y, b ]
