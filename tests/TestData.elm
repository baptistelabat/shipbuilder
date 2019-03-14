module TestData exposing
    ( anthineas
    , blockA
    , blockB
    , blockC
    , cube
    , flags
    , hullSliceJson
    , initialModel
    , initialView
    , mpov
    , toblerone
    , valueToIndentedString
    , viewport
    , viewportJsonString
    , viewports
    , viewportsJsonString
    )

import Color
import Dict
import Html exposing (Html)
import HullSliceModifiers exposing (empty)
import HullSlices exposing (HullSlices)
import Json.Encode as Encode
import Main exposing (..)
import Math.Vector3 exposing (..)
import StringValueInput
import Viewports exposing (..)


anthineas : HullSlices
anthineas =
    initialModel
        |> .slices
        |> Dict.get "anthineas"
        |> Maybe.withDefault empty
        |> HullSliceModifiers.fillHullSliceMetrics


mpov : Float -> HullSlices
mpov draught =
    initialModel
        |> .slices
        |> Dict.get "mpov"
        |> Maybe.withDefault empty
        |> HullSliceModifiers.setDraught (String.fromFloat draught)


cube : HullSlices.HullSlices
cube =
    { empty
        | length = StringValueInput.floatInput 1 200
        , breadth = StringValueInput.floatInput 1 20
        , depth = StringValueInput.floatInput 1 10
        , xmin = -1
        , ymin = -10
        , zmin = 3
        , slices =
            [ { x = 0
              , zmin = 0
              , zmax = 1
              , y = [ 1, 1, 1, 1 ]
              }
            , { x = 0.5
              , zmin = 0
              , zmax = 1
              , y = [ 1, 1, 1, 1 ]
              }
            , { x = 1
              , zmin = 0
              , zmax = 1
              , y = [ 1, 1, 1, 1 ]
              }
            ]
        , draught = StringValueInput.floatInput 1 2
    }
        |> HullSliceModifiers.fillHullSliceMetrics


toblerone : Float -> Float -> HullSlices.HullSlices
toblerone breadth depth =
    { empty
        | length = StringValueInput.floatInput 1 200
        , breadth = StringValueInput.floatInput 1 breadth
        , depth = StringValueInput.floatInput 1 depth
        , xmin = -1
        , ymin = -breadth / 2
        , zmin = 3
        , slices =
            [ { x = 0
              , zmin = 0
              , zmax = 1
              , y = [ 1, 0.75, 0.5 ]
              }
            , { x = 0.5
              , zmin = 0
              , zmax = 1
              , y = [ 1, 0.75, 0.5 ]
              }
            , { x = 1
              , zmin = 0
              , zmax = 1
              , y = [ 1, 0.75, 0.5 ]
              }
            ]
        , draught = StringValueInput.floatInput 1 2
    }
        |> HullSliceModifiers.fillHullSliceMetrics


valueToIndentedString : Encode.Value -> String
valueToIndentedString json =
    Encode.encode 4 json


blockA : Block
blockA =
    initBlock
        "abcd"
        "Helicopter"
        Color.blue
        { x = StringValueInput.fromNumber "m" "x" 1 0
        , y = StringValueInput.fromNumber "m" "y" 1 0
        , z = StringValueInput.fromNumber "m" "z" 1 0
        }
        { length = StringValueInput.fromNumber "m" "" 1 10
        , width = StringValueInput.fromNumber "m" "" 1 10
        , height = StringValueInput.fromNumber "m" "" 1 10
        }


blockB : Block
blockB =
    initBlock
        "efgh"
        "Tank"
        Color.red
        { x = StringValueInput.fromNumber "m" "x" 1 0
        , y = StringValueInput.fromNumber "m" "y" 1 0
        , z = StringValueInput.fromNumber "m" "z" 1 0
        }
        { length = StringValueInput.fromNumber "m" "" 1 10
        , width = StringValueInput.fromNumber "m" "" 1 10
        , height = StringValueInput.fromNumber "m" "" 1 10
        }


blockC : Block
blockC =
    initBlock
        "ijkl"
        "Hangar"
        Color.green
        { x = StringValueInput.fromNumber "m" "x" 1 0
        , y = StringValueInput.fromNumber "m" "y" 1 0
        , z = StringValueInput.fromNumber "m" "z" 1 0
        }
        { length = StringValueInput.fromNumber "m" "" 1 10
        , width = StringValueInput.fromNumber "m" "" 1 10
        , height = StringValueInput.fromNumber "m" "" 1 10
        }


flags : { buildSHA : String, hullsJSON : String }
flags =
    { buildSHA = "1.0.0"
    , hullsJSON = """

{"anthineas":
  {"depth": 6.83698582649231, "slices": [{"zmin": 0.31587930659489755, "zmax": 0.5298349579969897, "y": [0.964899527258786, 0.9648943694688346, 0.9629765202249831, 0.9592250480632435, 0.955473575901504, 0.9502377948034448, 0.9394176761317832, 0.9282437133662546, 0.9102579602794127, 0.742320749879794], "x": 0.00437713372412022}, {"zmin": 0.07246874145311905, "zmax": 0.9851376673994297, "y": [0.9569840388381782, 0.9718894073773259, 0.976951106789423, 0.9765144025278825, 0.9593856710989374, 0.9151973999533979, 0.5041787633977366, 0.5034056128817148, 0.5027638369183798, 0.5008173052731562], "x": 0.1111111111111111}, {"zmin": 0.06518909610576247, "zmax": 0.9687640187154614, "y": [0.9180784712017998, 0.9815140591271704, 0.9885727457906006, 0.987368096009622, 0.977133767798804, 0.961139177440988, 0.9244071293698659, 0.5618313234484332, 0.541234217075008, 0.5207414942279469], "x": 0.2222222222222222}, {"zmin": 0.05787283527982956, "zmax": 0.9512312765442604, "y": [0.80332841659206, 0.9885592985666122, 0.9973321536530968, 0.9967259897562543, 0.9880216143527039, 0.9748813194208584, 0.9609650589635744, 0.9155940224405047, 0.5535210302870565, 0.5221087930805247], "x": 0.3333333333333333}, {"zmin": 0.05052686360842328, "zmax": 0.9338286457325863, "y": [0.7468292532633111, 0.9921633326908178, 0.9995041455114982, 0.9985497082146457, 0.9912029133817248, 0.978694444026474, 0.9662278478322455, 0.9366261287044062, 0.7213102910561715, 0.5117492827654173], "x": 0.4444444444444444}, {"zmin": 0.043235082845309976, "zmax": 0.8810163930287338, "y": [0.7131752334768763, 0.9887153982780554, 0.9929032802097376, 0.9865428081052688, 0.9779290000236092, 0.9655521163360473, 0.9527975164600915, 0.9384461968456247, 0.8720674792056557, 0.5731136363690701], "x": 0.5555555555555556}, {"zmin": 0.03593862924969265, "zmax": 0.8788826390916544, "y": [0.7055824913206741, 0.97550237120075, 0.9687994466349749, 0.949189619430608, 0.9297821732897, 0.9115759239908359, 0.8922558182679378, 0.8498419105219513, 0.774582990591277, 0.5657526542595518], "x": 0.6666666666666666}, {"zmin": 0.028620624829541818, "zmax": 0.8674958573073179, "y": [0.7222617693915551, 0.9439727425821186, 0.905777602557716, 0.8658205606152226, 0.8306209165661216, 0.7978867250016706, 0.7613684275612851, 0.7129708318399232, 0.6539177490557526, 0.5378339336267516], "x": 0.7777777777777778}, {"zmin": 0.02127932599063957, "zmax": 0.8494963832973857, "y": [0.753880001198394, 0.8309318250259391, 0.7650976233305499, 0.7057897184476372, 0.653840240418334, 0.6111647813850369, 0.5759989618207131, 0.6136210480498743, 0.5957031522814901, 0.5155260966635151], "x": 0.8888888888888888}, {"zmin": 0.02685806030653009, "zmax": 0.03982563081408036, "y": [0.5822166322935474, 0.5806428792985013, 0.5790691263034543, 0.5757437160135193, 0.5702570951239538, 0.5647704742343878, 0.5592838533448221, 0.5537972324552517, 0.5483106115656857, 0.54282399067612], "x": 0.9956228662758797}], "xmin": -1.0, "length": 22.84600067138672, "ymin": -3.4467999935150146, "zmin": -6.146999835968018, "breadth": 6.8935699462890625}

  , "opv": {"depth": 9.519988477230072, "slices": [{"zmin": 0.30417064409714856, "zmax": 0.34108237269823977, "y": [0.9376584750708888, 0.937350966503599, 0.9370434579363086, 0.9367359493690184, 0.9364284408017283, 0.9361209322344379, 0.9358134236671479, 0.9355059150998577, 0.9351984065325675, 0.9348908979652774], "x": 0.0012500000447034864}, {"zmin": 0.014574565416342698, "zmax": 0.8143551950140805, "y": [0.9987545562274935, 0.9881787257913335, 0.9777311851248616, 0.9689028121342305, 0.9616729399889613, 0.9500778107484545, 0.9042799456782511, 0.8280216569971091, 0.73338055247976, 0.6089829904205818], "x": 0.1111111111111111}, {"zmin": 0.014446340142969765, "zmax": 0.8837282391051735, "y": [0.9987761551491535, 0.9872737206535052, 0.9760561510172803, 0.9669378092876292, 0.9592123517400654, 0.9352434357291156, 0.8869679051962753, 0.8242399326492003, 0.7242521723831088, 0.6070280112274545], "x": 0.2222222222222222}, {"zmin": 0.014574565416342698, "zmax": 0.8846305712480382, "y": [0.998754523088005, 0.9872481913733249, 0.9760233155145477, 0.9669068747008167, 0.9591745439143403, 0.9350146882765648, 0.8866271850776827, 0.8236644741169257, 0.7238521448742864, 0.6069552968366467], "x": 0.3333333333333333}, {"zmin": 0.014496327964386244, "zmax": 0.8846305712480382, "y": [0.9987721469610188, 0.9872564382408408, 0.9760299171799464, 0.9669110468817677, 0.9591780186018379, 0.9350289259918181, 0.8866409749031305, 0.8236810621151849, 0.7238616568526769, 0.6069552683861731], "x": 0.4444444444444444}, {"zmin": 0.014496327964386244, "zmax": 0.8846305712480382, "y": [0.9987721408913015, 0.9872564382408406, 0.9760299171799467, 0.9669110309360024, 0.9591779746186722, 0.9350288820086359, 0.8866409309199486, 0.8236810462020334, 0.7238616174589276, 0.6069552399035799], "x": 0.5555555555555556}, {"zmin": 0.011140933017803122, "zmax": 0.8846305712480382, "y": [0.9991583438431498, 0.9876117879319736, 0.9763152701339065, 0.967089886687835, 0.9593270278188955, 0.9356398200208086, 0.8872323076163949, 0.8243928436246409, 0.7242703224274998, 0.6069552141927455], "x": 0.6666666666666666}, {"zmin": 0.010685833473324031, "zmax": 0.8846305712480382, "y": [0.9988502950914712, 0.9800234872259223, 0.9650135035308731, 0.9483406904724563, 0.9309832250866781, 0.8981877664189903, 0.8430729478030745, 0.7775360488349993, 0.6902662567819101, 0.5961718050764353], "x": 0.7777777777777778}, {"zmin": 0.014574565416342698, "zmax": 0.8846305587260389, "y": [0.8649526835728044, 0.8465622588666941, 0.8276427533300855, 0.8037473537788499, 0.7765403485631015, 0.7395212763981152, 0.687801941635616, 0.6334405469069144, 0.5840926429874984, 0.5376225124064066], "x": 0.8888888888888888}, {"zmin": 0.005757154492853022, "zmax": 0.014586686711716233, "y": [0.5023088552852771, 0.5036616389276776, 0.5050144225700781, 0.5063672062124785, 0.5077199898548772, 0.509072773497278, 0.5104255571396784, 0.5117783407820786, 0.5131452418900423, 0.514514813187791], "x": 0.9987499999552966}], "xmin": -2.322018623352051, "length": 79.99999713897705, "ymin": -6.817100524902344, "zmin": -8.56149959564209, "breadth": 13.634204864501953}

  , "dtmb": {"depth": 18.1350736618042, "slices": [{"zmin": 0.2522203325272929, "zmax": 0.26209332213504594, "y": [0.5883903357959285, 0.5852811763179698, 0.5821720168400117, 0.5790628573620533, 0.5759536978840952, 0.5724528995461206, 0.5681588002698321, 0.5638647009935432, 0.5595706017172546, 0.555276502440966], "x": 0.0006896549201040937}, {"zmin": 0.2249766998879838, "zmax": 0.6653432848112193, "y": [0.5761304939227626, 0.8900714934621535, 0.9143653224671279, 0.9030074923371243, 0.8914139048570856, 0.8762474972071647, 0.8480042757798263, 0.7855480092137883, 0.6654079131810424, 0.521919339082764], "x": 0.1111111111111111}, {"zmin": 0.19793563347670903, "zmax": 0.8236552775115255, "y": [0.5482746559948175, 0.8687254110416911, 0.9635554593433808, 0.9500755505682245, 0.9341081184817738, 0.9061999663550471, 0.8527043985953607, 0.7643694375678706, 0.6393789939269411, 0.5163711567470828], "x": 0.2222222222222222}, {"zmin": 0.17095015182738452, "zmax": 0.8257630408714176, "y": [0.5407925066678004, 0.8403974717740713, 0.9875128485918051, 0.9748098440616986, 0.962914383656884, 0.9492724981471156, 0.9249691677090562, 0.8832190384016718, 0.8178185172029654, 0.541097314537619], "x": 0.3333333333333333}, {"zmin": 0.14380885404782487, "zmax": 0.8278712056202084, "y": [0.5392528295477811, 0.8402360820892881, 0.9956545038839657, 0.9846658372171947, 0.9735631020302675, 0.9625368960610232, 0.9457761159080484, 0.9156285053116957, 0.8482906965935895, 0.5862832683257847], "x": 0.4444444444444444}, {"zmin": 0.11554597461937714, "zmax": 0.8299808896485765, "y": [0.5376154566409219, 0.8655203115026288, 0.9906950086035989, 0.9806013698497075, 0.9694345068837525, 0.955035710095417, 0.9326163495001735, 0.8898187078233891, 0.8242915818748906, 0.5558587094045748], "x": 0.5555555555555556}, {"zmin": 0.08810519224255485, "zmax": 0.8320889143015491, "y": [0.544923883150738, 0.906673968079108, 0.9635580359677396, 0.9487326544968758, 0.9310518072821261, 0.9048347939420724, 0.8640166595918449, 0.7967276317743355, 0.7038391856258491, 0.5156340889662003], "x": 0.6666666666666666}, {"zmin": 0.060420141919413854, "zmax": 0.8341790765322765, "y": [0.5682209276007332, 0.9156909694691283, 0.8850348301853734, 0.8532784114518654, 0.8202222698755841, 0.7846880375937832, 0.7388586258773603, 0.6796614251433521, 0.6093610183736956, 0.5097631999575285], "x": 0.7777777777777778}, {"zmin": 0.03295327624843137, "zmax": 0.9740678627364541, "y": [0.6691031611286246, 0.7585133102334671, 0.6961325818214734, 0.6374513286990522, 0.5933538948282303, 0.5637759787217166, 0.5428965182410199, 0.5370435132874409, 0.6134814973995449, 0.5602619897839073], "x": 0.8888888888888888}], "xmin": -1.2905651330947876, "length": 145.00005304813385, "ymin": -9.71803092956543, "zmin": -15.023879051208496, "breadth": 19.4343900680542}

, "kcs": {"depth": 23.50483534997329, "slices": [{"zmin": 0.00425444375640415, "zmax": 0.5153864706752955, "y": [0.9994162598096142, 0.9993791266498008, 0.9993564425158817, 0.9993564299805832, 0.9993564174452846, 0.9991133970073949, 0.9890653963600771, 0.9569257177164656, 0.8783662983212709, 0.5776805291583831], "x": 0.00041009798711197343}, {"zmin": 0.00425444375640415, "zmax": 0.9955399206332423, "y": [0.999437506884743, 0.9994374915121891, 0.9993071073870581, 0.9991428406708361, 0.9993936567509889, 0.9553405877363357, 0.6637743130857897, 0.5866902260847663, 0.5811722465264457, 0.5257184970892952], "x": 0.1111111111111111}, {"zmin": 0.00425444375640415, "zmax": 0.995539131446964, "y": [0.999437506884743, 0.9994374900496431, 0.9994374706740284, 0.9993530823029619, 0.9995728522206672, 0.9992764181904665, 0.979262833983992, 0.8743909983919437, 0.7672014286368819, 0.6219875776380086], "x": 0.2222222222222222}, {"zmin": 0.00425444375640415, "zmax": 0.9955399347834684, "y": [0.999437506884743, 0.9994374885870658, 0.9994374692114358, 0.9994194627778805, 0.9993953054862804, 0.9993711481946803, 0.999430605288701, 0.994070773059944, 0.9513210386026334, 0.7957599455537159], "x": 0.3333333333333333}, {"zmin": 0.00425444375640415, "zmax": 0.9955399633594549, "y": [0.9994375065001344, 0.9994234435158634, 0.9994369521771488, 0.9994291765099956, 0.9993790650461409, 0.999319626360362, 0.9993091485780514, 0.9994135857490931, 0.9960768783847922, 0.912333673278407], "x": 0.4444444444444444}, {"zmin": 0.00425444375640415, "zmax": 0.9955398979612009, "y": [0.9993869249979842, 0.9994374908653431, 0.999409779478913, 0.9993441405472241, 0.9994126767513505, 0.9994378716933014, 0.9993351114049936, 0.9987976604591653, 0.9816167976747896, 0.8665704393959844], "x": 0.5555555555555556}, {"zmin": 0.00425444375640415, "zmax": 0.9955399486597285, "y": [0.9993083743307829, 0.9994374983688499, 0.999437477517643, 0.9994374566664361, 0.9992377082552739, 0.9926035398449935, 0.9752830401603015, 0.943033150120877, 0.8850594203443386, 0.7233893843840599], "x": 0.6666666666666666}, {"zmin": 0.00425444375640415, "zmax": 0.9955399194441346, "y": [0.9992298236635818, 0.9965964966957372, 0.9868081651867582, 0.960339930125645, 0.919676572806242, 0.8742668133827667, 0.8283778655560111, 0.782789766825749, 0.7267027802912843, 0.5735839821985942], "x": 0.7777777777777778}, {"zmin": 0.00425444375640415, "zmax": 0.9955399212316898, "y": [0.9033266462274293, 0.858894596636521, 0.8145186471598445, 0.7413855619218009, 0.6643969702999787, 0.6168252011215634, 0.6032838513582934, 0.6017532163222489, 0.57517607212058, 0.5123752243055354], "x": 0.8888888888888888}, {"zmin": 0.0026325896307756343, "zmax": 0.004254524903478971, "y": [0.5036758725892362, 0.5038869571882205, 0.5040980417872022, 0.5043091263861864, 0.5045202109851707, 0.504731295584155, 0.5054079911998732, 0.5068069667802417, 0.5076484290723653, 0.5084363784219913], "x": 0.999589902012888}], "xmin": -6.0, "length": 243.8441619873047, "ymin": -16.12238121032715, "zmin": -23.500001907348633, "breadth": 32.24052047729492}

, "mpov":{"depth":7.56,"slices":[{"zmin":0.01,"zmax":0.66,"y":[0.953,0.944,0.934,0.925,0.916,0.906,0.897,0.888,0.878,0.5],"x":0},{"zmin":0,"zmax":0.74,"y":[0.987,0.976,0.965,0.954,0.943,0.932,0.922,0.911,0.878,0.5],"x":0.1},{"zmin":0.01,"zmax":0.82,"y":[1,0.988,0.976,0.963,0.951,0.939,0.927,0.915,0.846,0.5],"x":0.2},{"zmin":0.01,"zmax":0.9,"y":[0.992,0.979,0.966,0.953,0.939,0.926,0.913,0.899,0.798,0.5],"x":0.3},{"zmin":0.01,"zmax":0.94,"y":[0.964,0.95,0.936,0.922,0.908,0.894,0.879,0.818,0.737,0.5],"x":0.4},{"zmin":0.01,"zmax":0.98,"y":[0.915,0.9,0.886,0.871,0.856,0.842,0.802,0.735,0.676,0.5],"x":0.5},{"zmin":0.01,"zmax":1,"y":[0.845,0.83,0.816,0.801,0.786,0.771,0.704,0.66,0.595,0.5],"x":0.6},{"zmin":0.01,"zmax":0.98,"y":[0.755,0.74,0.726,0.711,0.687,0.651,0.621,0.597,0.535,0.5],"x":0.7},{"zmin":0.01,"zmax":0.92,"y":[0.6,0.59,0.58,0.57,0.56,0.55,0.54,0.53,0.515,0.5],"x":0.92},{"zmin":0.01,"zmax":0.1,"y":[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],"x":1}],"xmin":0,"length":87,"ymin":-6.5,"zmin":-6.1,"breadth":13}
}
"""
    }


initialModel : Model
initialModel =
    initModel
        flags


initialView : Html Msg
initialView =
    view initialModel


viewport : Viewport
viewport =
    Viewport "Test 1"
        0
        0
        1
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
        Orthographic


viewportJsonString : String
viewportJsonString =
    """{
    "label": "Test 1",
    "left": 0,
    "top": 0,
    "width": 1,
    "height": 1,
    "background": {
        "red": 255,
        "green": 255,
        "blue": 255,
        "alpha": 1
    },
    "eye": {
        "x": 0,
        "y": 1000,
        "z": 0
    },
    "canControl": {
        "x": true,
        "y": true,
        "z": false
    },
    "cameraType": "Orthographic"
}"""


viewports : Viewports
viewports =
    [ Viewport "First"
        0
        0
        0.5
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
        Orthographic
    , Viewport "Second"
        0.5
        0
        0.5
        1
        Color.white
        (vec3 0 1000 0)
        { x = True, y = True, z = False }
        Orthographic
    ]


viewportsJsonString : String
viewportsJsonString =
    """[
    {
        "label": "First",
        "left": 0,
        "top": 0,
        "width": 0.5,
        "height": 1,
        "background": {
            "red": 255,
            "green": 255,
            "blue": 255,
            "alpha": 1
        },
        "eye": {
            "x": 0,
            "y": 1000,
            "z": 0
        },
        "canControl": {
            "x": true,
            "y": true,
            "z": false
        },
        "cameraType": "Orthographic"
    },
    {
        "label": "Second",
        "left": 0.5,
        "top": 0,
        "width": 0.5,
        "height": 1,
        "background": {
            "red": 255,
            "green": 255,
            "blue": 255,
            "alpha": 1
        },
        "eye": {
            "x": 0,
            "y": 1000,
            "z": 0
        },
        "canControl": {
            "x": true,
            "y": true,
            "z": false
        },
        "cameraType": "Orthographic"
    }
]"""


hullSliceJson : String
hullSliceJson =
    """
    {
    "length": 22.84600067138672,
    "breadth": 6.8935699462890625,
    "depth": 6.83698582649231,
    "slices": [
        {
            "x": 0.00437713372412022,
            "y": [
                0.964899527258786,
                0.9648943694688346,
                0.9629765202249831,
                0.9592250480632435,
                0.955473575901504,
                0.9502377948034448,
                0.9394176761317832,
                0.9282437133662546,
                0.9102579602794127,
                0.742320749879794
            ],
            "zmin": 0.31587930659489755,
            "zmax": 0.5298349579969897
        },
        {
            "x": 0.1111111111111111,
            "y": [
                0.9569840388381782,
                0.9718894073773259,
                0.976951106789423,
                0.9765144025278825,
                0.9593856710989374,
                0.9151973999533979,
                0.5041787633977366,
                0.5034056128817148,
                0.5027638369183798,
                0.5008173052731562
            ],
            "zmin": 0.07246874145311905,
            "zmax": 0.9851376673994297
        }
        ],
    "xmin": -1.0,
    "ymin": -3.4467999935150146,
    "zmin": -6.146999835968018
    }
    """
