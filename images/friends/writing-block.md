# Projet Friends 3D – Création de figurines personnalisées avec l'IA locale

## 1. Présentation du projet

L'objectif de ce projet est de créer une collection de **6 figurines personnalisées inspirées de l'univers Friends**, représentant un groupe d'amis dans un style Funko Pop.

Le projet consiste à utiliser l'intelligence artificielle pour transformer des photographies de personnes en personnages stylisés en 3D, puis à fabriquer physiquement ces personnages grâce à une imprimante 3D.

Le résultat final sera une scène composée de :
- 6 figurines personnalisées, toutes debout.
- Un canapé orange emblématique de Friends.
- Une table basse.
- Un socle commun pour présenter les personnages.

Le style recherché est volontairement simplifié, avec un maximum de 5 couleurs principales afin de faciliter l'impression multicolore et la peinture.

## 2. Matériel et technologies utilisés

### Bambu Lab P2S

Imprimante 3D principale utilisée pour fabriquer les figurines, les accessoires et le décor.

Caractéristiques :
- Impression 3D FDM.
- Utilisation de l'AMS pour l'impression multicolore.
- Compatibilité avec différents matériaux comme le PLA et le PETG.
- Bonne précision pour la fabrication de figurines.
- Préparation des impressions avec Bambu Studio.

### NVIDIA RTX 4070 Ti Super

Carte graphique utilisée pour exécuter localement les modèles d'intelligence artificielle.

Elle permet notamment :
- La génération d'images par IA.
- L'exécution de modèles de génération 3D.
- Le traitement des workflows ComfyUI.
- L'utilisation de modèles sans dépendre systématiquement de services cloud payants.

### ComfyUI

Interface de création et d'orchestration de workflows d'intelligence artificielle basée sur un système de nœuds.

Elle permet de construire des chaînes de traitement personnalisées pour :
- Générer des images de personnages.
- Styliser des photographies.
- Préparer des images de référence pour la génération 3D.
- Intégrer différents modèles d'intelligence artificielle.
- Automatiser certaines étapes de création.

### Bambu Studio

Logiciel de préparation des impressions 3D.

Fonctionnalités utilisées :
- Importation et préparation des fichiers STL.
- Gestion des dimensions en millimètres.
- Orientation des figurines.
- Génération des supports.
- Réglage de la hauteur des couches.
- Gestion des couleurs avec l'AMS.
- Optimisation de la qualité des surfaces et des détails.

## 3. Intelligence artificielle et génération 3D

Le cœur du projet repose sur l'utilisation de l'intelligence artificielle pour automatiser une partie de la création des personnages.

L'objectif est de disposer d'un workflow permettant de passer d'une photographie à un modèle 3D imprimable.

### Workflow de génération

1. Importer une photographie de chaque personne.
2. Utiliser une IA pour transformer la photographie en personnage stylisé façon Funko Pop.
3. Générer un modèle 3D à partir de l'image.
4. Corriger les défauts géométriques du modèle.
5. Vérifier la structure et la qualité du maillage.
6. Exporter le modèle au format STL.
7. Préparer le modèle pour l'impression 3D.

### Outils IA étudiés

| Outil | Utilisation |
|---|---|
| ComfyUI | Orchestration des workflows IA locaux |
| Hunyuan3D | Génération de modèles 3D à partir d'images |
| Tripo AI | Alternative de génération 3D |
| Meshy | Autre solution de création de modèles 3D |

L'objectif est de privilégier les solutions locales et gratuites lorsque leur qualité est suffisante.

Les services cloud restent des alternatives possibles lorsque les résultats locaux ne sont pas satisfaisants.

## 4. Direction artistique

Le projet adopte une direction artistique inspirée des figurines Funko Pop.

### Caractéristiques des personnages

- Six personnages personnalisés.
- Têtes volontairement surdimensionnées.
- Corps simplifiés.
- Expressions reconnaissables.
- Vêtements et accessoires personnalisés.
- Position debout pour faciliter l'impression et la peinture.

### Décor

La scène finale comprendra :
- Un canapé orange inspiré de Friends.
- Une table basse.
- Un socle commun.
- Les six personnages disposés devant ou autour du décor.

### Palette de couleurs

Le projet privilégie une palette réduite à cinq couleurs principales maximum.

Ce choix permet :
- De réduire les changements de filament.
- De simplifier la gestion de l'AMS.
- De limiter les coûts d'impression.
- De faciliter les retouches et la peinture.
- De conserver un style visuel cohérent.

## 5. Fabrication et impression 3D

La fabrication sera réalisée avec la Bambu Lab P2S et son système AMS.

### Préparation des fichiers

1. Importation des fichiers STL dans Bambu Studio.
2. Vérification des dimensions et des proportions.
3. Orientation optimale des figurines.
4. Analyse des zones nécessitant des supports.
5. Réglage de la qualité d'impression.
6. Attribution des couleurs et des filaments.
7. Génération du G-code.

### Impression

Les figurines seront imprimées individuellement afin de faciliter :
- La gestion des impressions.
- La réduction des risques d'échec.
- Le remplacement éventuel d'une pièce.
- Le post-traitement.

Une attention particulière sera portée aux détails du visage, aux cheveux, aux lunettes et aux surfaces supérieures.

### Finition

Après impression :
- Retrait des supports.
- Nettoyage des pièces.
- Ponçage des zones présentant des imperfections.
- Application éventuelle d'un apprêt.
- Peinture acrylique.
- Assemblage des personnages et du décor.

L'impression en PLA blanc ou dans des couleurs de base permettra également de réaliser une partie des finitions manuellement.

## 6. Architecture globale du projet

Le workflow complet est organisé en plusieurs étapes :

```text
        PHOTOGRAPHIES
        des 6 personnes
               |
               v
       COMFYUI + IA LOCALE
       Stylisation des images
               |
               v
       GÉNÉRATION 3D
       Hunyuan3D / alternatives
               |
               v
       MODÈLES 3D
       Correction des maillages
               |
               v
       EXPORT STL
               |
               v
       BAMBU STUDIO
       Préparation et tranchage
               |
               v
       BAMBU LAB P2S + AMS
       Impression multicolore
               |
               v
       POST-TRAITEMENT
       Nettoyage et peinture
               |
               v
       ASSEMBLAGE FINAL
       6 figurines + décor Friends
```

## 7. Objectifs techniques et compétences développées

Ce projet permet de combiner plusieurs domaines techniques.

### Intelligence artificielle
- Utilisation de modèles génératifs.
- Création de workflows ComfyUI.
- Génération d'images.
- Génération de modèles 3D.

### Intelligence artificielle locale
- Exploitation de la puissance GPU.
- Installation et configuration de modèles.
- Réduction de la dépendance aux services cloud.
- Maîtrise des ressources matérielles.

### Modélisation 3D
- Conversion d'images en modèles 3D.
- Manipulation des fichiers STL.
- Correction des maillages.
- Optimisation des géométries pour l'impression.

### Impression 3D
- Gestion des matériaux.
- Impression multicolore avec AMS.
- Optimisation des supports.
- Réglage de la qualité d'impression.
- Prévention des échecs d'impression.

### Design et fabrication
- Création de personnages personnalisés.
- Travail sur les proportions et les couleurs.
- Peinture et post-traitement.
- Assemblage d'un décor miniature.

## 8. État d'avancement du projet

| Étape | État |
|---|---|
| Définition du concept | Terminé |
| Direction artistique | Définie |
| Acquisition de la Bambu Lab P2S | Terminé |
| Choix du style Funko Pop | Terminé |
| Recherche des outils IA | Réalisée |
| Mise en place du workflow IA local | À finaliser |
| Génération des six personnages | À réaliser |
| Correction et préparation des STL | À réaliser |
| Impression des figurines | À réaliser |
| Peinture et assemblage | À réaliser |

## 9. Évolutions possibles

Une fois le workflow maîtrisé, il pourra être réutilisé pour d'autres projets :

- Création de figurines personnalisées à partir de photographies.
- Création de personnages de jeux vidéo.
- Fabrication de cadeaux personnalisés.
- Création de collections de figurines.
- Conception de décors miniatures.
- Automatisation de la génération de modèles 3D.

L'ambition à plus long terme est de disposer d'une chaîne de production personnelle permettant de passer d'une simple photographie à une figurine physique personnalisée.

## 10. Conclusion

Le projet Friends 3D est une expérience de création combinant intelligence artificielle locale, modélisation 3D et fabrication additive.

L'objectif est de maîtriser toute la chaîne de production, depuis la photographie initiale jusqu'à la fabrication et la finition des figurines.

Il permet également d'explorer les possibilités offertes par les modèles d'intelligence artificielle exécutés localement, tout en exploitant les capacités d'une imprimante 3D multicolore.

**Résultat attendu : une collection de six figurines uniques, personnalisées et imprimées à domicile, accompagnées d'un décor inspiré de l'univers Friends.**