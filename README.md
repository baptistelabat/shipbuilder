# ShipBuilder

## Description

_ShipBuilder_ est un outil léger qui tourne exclusivement sur un navigateur web.

## Utilisation

La dernière version de la page est disponible ici : [https://projets.gitlab-pages.sirehna.com/ShipBuilder2](https://projets.gitlab-pages.sirehna.com/ShipBuilder2).
Pour une version offline, télécharger les artefacts ici : [https://gitlab.sirehna.com/projets/ShipBuilder2/-/jobs/artifacts/master/download?job=build](https://gitlab.sirehna.com/projets/ShipBuilder2/-/jobs/artifacts/master/download?job=build).
Ensuite, ouvrir le fichier `shipBuilder/index.html` dans le navigateur (double-cliquer dessus dans l'explorateur de fichier, par exemple).

## Note sur la librairie TransformControls.js

Les gizmos de manipulation dans les vues 3D sont gérés par la librairie TransformControls. Elle ne fait pas partie de Three.js mais de ses exemples. Il a fallu en modifier une partie (rechercher "view" dans le fichier) pour fonctionner avec les viewports multiples. Si les viewports devaient évoluer, il faudrait revoir les parties modifiées. La version "originale" est disponible à l'adresse suivante : [https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TransformControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TransformControls.js)

Elle permet de gérer une seule vue par canvas.

# Barre de titre

La barre de titre permet, via les actions à sa droite, d'ouvrir un fichier JSON précédemment sauvegardé dans l'application ou de sauver le projet courant au format JSON.

# Panneau latéral

L'application se décompose en deux parties principales : un panneau latéral à gauche qui présente différentes informations et actions réparties en 4 onglets : ___Hull___, ___Partitions___, ___Blocks___, ___KPIs___. L'autre partie de l'application est la grille de vues 3D qui occupe le reste de la largeur de l'écran.

## Onglets

### Hull

L'onglet permet de sélectionner un modèle 3D de référence à afficher dans les vues 3D. Ce modèle se veut comme une aide à la disposition des blocs.

Il est possible de retirer le modèle 3D de la vue 3D en sélectionnant l'option `None` à la tête de la liste.

### Partitions

L'onglet ___Partitions___ permet de définir les ponts et les cloisons du navire.

- Les champs _Number of decks_ et _Number of bulkheads_ permettent respectivement de spécifier le nombre de ponts et de cloisons. Ces champs acceptent des nombres entiers positifs.
- Les champs _Default spacing of decks_ et _Default spacing of bulkheads_ permettent de spécifier la distance en mètres entre un pont et le pont supérieur et entre une cloison et la cloison suivante. Les nombres décimaux positifs sont acceptés.
- Les boutons _Define deck n°0_ et _Define bulkhead n°0_ permettent de rentrer dans le mode de sélection du pont ou de la coison numérotée 0. Il est alors possible de cliquer sur une pont ou un cloison pour qu'il se colore en rouge et soit retenu comme pont (ou cloison le cas échéant) n°0.
- Les champs _Position of deck n°0_ et _Position of bulkhead n°0_ permettent d'indiquer en mètres où se situe le pont 0 sur l'axe Z et la cloison 0 sur l'axe X. Ils acceptent des nombres décimaux négatifs et positifs.
- Les labels _Spacing details_ permettent de déplier ou replier le détail des espacements des ponts et cloisons. Pour chaque pont et cloison, il est possible de définir un espacement particulier qui remplace l'espacement par défaut jusqu'au pont supérieur ou jusqu'à la prochaine cloison. 

Les trois premiers champs peuvent être édités à l'aide des touches fléchées du clavier comme décrit dans la partie __Fiche technique d'un bloc__ de ce document.


### Blocks

L'onglet permet de visualiser et d'éditer la liste des blocs qui composent le navire. Le nom des blocs figure dans la liste. Le nom d'un bloc est éditable depuis la liste. 

Les blocs peuvent être cachés (et affichés à nouveau), ou supprimés après avoir cliqué sur l'icône  `...` affichée au survol d'un bloc.

Il est possible de réordonner la liste des blocs. Au survol d'un bloc, des flèches apparaissent au dessus et en dessous de la ligne du bloc pour permettre de déplacer le bloc vers le haut ou le bas de la liste.

Il est possible de sélectionner un bloc en cliquant sur sa ligne. Sa couleur est alors affichée sur la bordure de gauche tant que le bloc reste sélectionné. Cette bordure s'affiche également au survol des blocs dans la liste.

Pour sélectionner plusieurs blocs, il faut maintenir la touche `<Ctrl>` enfoncée et cliquer sur chaque bloc à sélectionner.

En haut de la liste, il est possible de télécharger un CSV contenant les informations de tous les blocs et de cacher/afficher tous les blocs. Lorsque plusieurs blocs sont sélectionnés, ces opérations s'appliquent sur la sélection.

#### Fiche technique d'un bloc

En survolant un bloc, une flèche bleue apparait à droite de son nom. Cliquer sur cette flèche amène à la fiche technique d'un bloc.

Il est possible d'éditer son nom, sa couleur, sa position, ses dimensions, son centre de gravité, sa densité et sa masse. Il est également possible de rajouter des propriétés personnalisées qui seront exportées dans le CSV des blocs.

Plusieurs de ces champs peuvent être incrémentés (et décrémentés) à l'aide des flèches du clavier. Après avoir cliqué dans un de ces champs :
- la flèche du haut (↑) du clavier permet d'incrémenter la valeur de 1
- la flèche du bas (↓) permet de décrémenter la valeur de 1
- maintenir la touche `Maj` du clavier enfoncé pendant l'appui sur l'une des flèches incrémente/décrément de 10 au lieu de 1
- maintenir la touche `Alt` du clavier enfoncé pendant l'appui sur l'une des flèches incrémente/décrément de 0.1 au lieu de 1.

Le tableau suivant résume les entrées acceptées par chacun des champs et s'il est possible d'utiliser les flèches pour incrémenter et décrémenter.

| Champ                     | Type                   | Incrément avec les flèches |
|---------------------------|------------------------|----------------------------|
| X (position sur l'axe X)  | Nombre décimal         | Oui                        |
| Y (position sur l'axe Y)  | Nombre décimal         | Oui                        |
| Z (position sur l'axe Z)  | Nombre décimal         | Oui                        |
| Length (taille sur X)     | Nombre décimal __positif__ | Oui                    |
| Width (taille sur Y)      | Nombre décimal __positif__ | Oui                    |
| Height (taille sur Z)     | Nombre décimal __positif__ | Oui                    |
| Center of gravity (x, y et z) | Nombre décimal     | Non                        |
| Volume                | _Non éditable_         | _Non éditable_             |
| Density                  | Nombre décimal __positif__ | Non                    |
| Mass                    | Nombre décimal __positif__ | Non                    |

### KPIs 

L'onglet KPIs présente et permet de télécharger au format CSV certaines métriques à propos du projet courant.
- la longueur (axe X) totale occupée par les blocs
- la largeur (axe Y) totale occupée par les blocs
- la hauteur (axe Z) totale occupée par les blocs
- le centre de gravité de l'ensemble des blocs (sur les axes X, Y et Z)
- la somme des volumes des blocs
- la somme des masses des blocs.

Les deux dernières métriques peuvent être dépliées pour connaitre les sommes des blocs d'une couleur (un tag) donné. La couleur porte son nom par défaut, il est possible de l'éditer pour associer la couleur à une catégorie (par exemple, remplacer le label "Brown" pour la couleur marron par "Réservoirs").

# Vues 3D

L'application présenté 4 vues 3D : du côté du navire (Side), de face (Front), de dessus (Top) et une vue libre (Perspective). Les trois premières sont des vues __isométriques__ tandis que la dernière est une vue en __perspective__.

Les vues __isométriques__ présentent les axes suivants :

| Vue   | Axe Horizontal | Axe Vertical |
|-------|----------------|--------------|
| Side  | X              | Z            |
| Front | Y              | Y            |
| Top   | Y              | Z            |

## Contrôle

Les vues se contrôlent à l'aide de la souris.

### Contrôle des vues isométriques

Un clic droit maintenu (_drag_) sur l'une des vues isométriques permet de déplacer les caméras sur l'axe vertical et horizontal de la vue courante. Ainsi, un déplacement vertical sur la vue Side déplace les caméras de chacune des vues le long de l'axe Z.

La molette de la souris sert à zoomer. Le zoom est identique entre les trois vues isométriques.

### Contrôle de la vue perspective

Comme pour les vues isométriques, un clic droit maintenu contrôle la position de la caméra dans la vue et la molette contrôle le zoom.

En plus, le clic gauche contrôle la rotation de la caméra autour du centre de la vue.

## Manipulation des éléments dans les vues 3D

Dans toutes les vues 3D, les éléments opaques sont affichés d'une couleur plus claire lorsqu'ils se trouvent directement en dessous du curseur.

Cliquer sur un événement mis en évidence de cette façon peut avoir plusieurs effets :
- un bloc sera sélectionné : il présentera un outil de manipulation 3D qui permet de le déplacer ou de le redimensionner. Pour passer d'une opération à l'autre sur ce bloc, il faut double cliquer dessus.
    - Note 1 : Plusieurs blocs peuvent être sélectionnés à condition de maintenir la touche `<Ctrl>` enfoncée. 
    - Note 2 : Il est possible de désélectionner le(s) bloc(s) sélectionné(s) en cliquant sur la molette de la souris.
- une partition (pont ou cloison) sera sélectionnée comme portant le numéro 0 (pont 0/cloison  0) lorsque cette opération est activée dans l'onglet ___Partitions___.



