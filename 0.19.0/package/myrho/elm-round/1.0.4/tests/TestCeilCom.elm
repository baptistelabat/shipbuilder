module TestCeilCom exposing (ceilComTest)

import Test exposing (..)
import TestFunction exposing (..)
import Round


data =
    [ TestRow 0 "0" "0" "0" "0.0" "0.00"
    , TestRow 0 "0" "0" "0" "0.0" "0.00"
    , TestRow 0 "0" "0" "0" "0.0" "0.00"
    , TestRow 0 "0" "0" "0" "0.0" "0.00"
    , TestRow 0 "0" "0" "0" "0.0" "0.00"
    , TestRow 99 "100" "100" "99" "99.0" "99.00"
    , TestRow 9.9 "100" "10" "10" "9.9" "9.90"
    , TestRow 0.99 "100" "10" "1" "1.0" "0.99"
    , TestRow 0.099 "100" "10" "1" "0.1" "0.10"
    , TestRow 0.0099 "100" "10" "1" "0.1" "0.01"
    , TestRow -99 "-100" "-100" "-99" "-99.0" "-99.00"
    , TestRow -9.9 "-100" "-10" "-10" "-9.9" "-9.90"
    , TestRow -0.99 "-100" "-10" "-1" "-1.0" "-0.99"
    , TestRow -0.099 "-100" "-10" "-1" "-0.1" "-0.10"
    , TestRow -0.0099 "-100" "-10" "-1" "-0.1" "-0.01"
    , TestRow 1 "100" "10" "1" "1.0" "1.00"
    , TestRow 1.1 "100" "10" "2" "1.1" "1.10"
    , TestRow 1.01 "100" "10" "2" "1.1" "1.01"
    , TestRow 1.001 "100" "10" "2" "1.1" "1.01"
    , TestRow -1 "-100" "-10" "-1" "-1.0" "-1.00"
    , TestRow -1.1 "-100" "-10" "-2" "-1.1" "-1.10"
    , TestRow -1.01 "-100" "-10" "-2" "-1.1" "-1.01"
    , TestRow -1.001 "-100" "-10" "-2" "-1.1" "-1.01"
    , TestRow 213 "300" "220" "213" "213.0" "213.00"
    , TestRow 213.1 "300" "220" "214" "213.1" "213.10"
    , TestRow 213.01 "300" "220" "214" "213.1" "213.01"
    , TestRow 213.001 "300" "220" "214" "213.1" "213.01"
    , TestRow -213 "-300" "-220" "-213" "-213.0" "-213.00"
    , TestRow -213.1 "-300" "-220" "-214" "-213.1" "-213.10"
    , TestRow -213.01 "-300" "-220" "-214" "-213.1" "-213.01"
    , TestRow -213.001 "-300" "-220" "-214" "-213.1" "-213.01"
    , TestRow 5.5 "100" "10" "6" "5.5" "5.50"
    , TestRow 5.55 "100" "10" "6" "5.6" "5.55"
    , TestRow 5.555 "100" "10" "6" "5.6" "5.56"
    , TestRow 5.5555 "100" "10" "6" "5.6" "5.56"
    , TestRow -5.5 "-100" "-10" "-6" "-5.5" "-5.50"
    , TestRow -5.55 "-100" "-10" "-6" "-5.6" "-5.55"
    , TestRow -5.555 "-100" "-10" "-6" "-5.6" "-5.56"
    , TestRow -5.5555 "-100" "-10" "-6" "-5.6" "-5.56"
    , TestRow 5.5 "100" "10" "6" "5.5" "5.50"
    , TestRow 5.51 "100" "10" "6" "5.6" "5.51"
    , TestRow 5.501 "100" "10" "6" "5.6" "5.51"
    , TestRow 5.5001 "100" "10" "6" "5.6" "5.51"
    , TestRow -5.5 "-100" "-10" "-6" "-5.5" "-5.50"
    , TestRow -5.51 "-100" "-10" "-6" "-5.6" "-5.51"
    , TestRow -5.501 "-100" "-10" "-6" "-5.6" "-5.51"
    , TestRow -5.5001 "-100" "-10" "-6" "-5.6" "-5.51"
    , TestRow 4.9 "100" "10" "5" "4.9" "4.90"
    , TestRow 4.99 "100" "10" "5" "5.0" "4.99"
    , TestRow 4.999 "100" "10" "5" "5.0" "5.00"
    , TestRow 4.9999 "100" "10" "5" "5.0" "5.00"
    , TestRow -4.9 "-100" "-10" "-5" "-4.9" "-4.90"
    , TestRow -4.99 "-100" "-10" "-5" "-5.0" "-4.99"
    , TestRow -4.999 "-100" "-10" "-5" "-5.0" "-5.00"
    , TestRow -4.9999 "-100" "-10" "-5" "-5.0" "-5.00"
    , TestRow 1.234e22 "12340000000000000000000" "12340000000000000000000" "12340000000000000000000" "12340000000000000000000.0" "12340000000000000000000.00"
    , TestRow -1.234e22 "-12340000000000000000000" "-12340000000000000000000" "-12340000000000000000000" "-12340000000000000000000.0" "-12340000000000000000000.00"
    , TestRow 1.234e-22 "100" "10" "1" "0.1" "0.01"
    , TestRow -1.234e-22 "-100" "-10" "-1" "-0.1" "-0.01"
    ]


ceilComTest : Test
ceilComTest =
    testFunction "ceilingCom" Round.ceilingCom data
