// lib/constants/fourLaws.ts

export const FOUR_LAWS = {
    makeItObvious: {
        title: 'Make it Obvious',
        number: 1,
        description: 'Rendre le signal évident',
        questions: [
            'Quel est le signal déclencheur ?',
            'Où et quand va se passer l\'habitude ?',
            'Quelle habitude existante peut servir d\'ancrage ?',
        ],
        tips: [
            'Utilisez l\'intention d\'implémentation',
            'Pratiquez le habit stacking',
            'Rendez les signaux visuels',
        ],
    },
    makeItAttractive: {
        title: 'Make it Attractive',
        number: 2,
        description: 'Rendre l\'habitude attirante',
        questions: [
            'Que pouvez-vous associer de plaisant à cette habitude ?',
            'Pourquoi cette habitude vous attire émotionnellement ?',
            'Quelle récompense anticipez-vous ?',
        ],
        tips: [
            'Utilisez le temptation bundling',
            'Rejoignez une culture où l\'habitude est la norme',
            'Créez un rituel de motivation',
        ],
    },
    makeItEasy: {
        title: 'Make it Easy',
        number: 3,
        description: 'Rendre l\'habitude facile',
        questions: [
            'Quelle est la version 2 minutes de cette habitude ?',
            'Comment réduire la friction ?',
            'Comment préparer l\'environnement ?',
        ],
        tips: [
            'Commencez par la version 2 minutes',
            'Réduisez les étapes',
            'Optimisez l\'environnement',
        ],
    },
    makeItSatisfying: {
        title: 'Make it Satisfying',
        number: 4,
        description: 'Rendre l\'habitude satisfaisante',
        questions: [
            'Quelle récompense immédiate pouvez-vous vous donner ?',
            'Comment suivre visuellement votre progrès ?',
            'Qui peut vous tenir responsable ?',
        ],
        tips: [
            'Ne brisez jamais la chaîne',
            'Utilisez un tracker visuel',
            'Trouvez un accountability partner',
        ],
    },
};

export const INVERSION_LAWS = {
    makeItInvisible: {
        title: 'Make it Invisible',
        description: 'Rendre le signal invisible',
        tip: 'Supprimez les déclencheurs de mauvaises habitudes',
    },
    makeItUnattractive: {
        title: 'Make it Unattractive',
        description: 'Rendre l\'habitude peu attirante',
        tip: 'Associez la mauvaise habitude à quelque chose de désagréable',
    },
    makeItDifficult: {
        title: 'Make it Difficult',
        description: 'Augmenter la friction',
        tip: 'Ajoutez des obstacles entre vous et la mauvaise habitude',
    },
    makeItUnsatisfying: {
        title: 'Make it Unsatisfying',
        description: 'Rendre l\'habitude insatisfaisante',
        tip: 'Créez un contrat d\'habitude avec des conséquences',
    },
};

export const FREQUENCY_OPTIONS = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'custom', label: 'Personnalisé' },
];

export const ROUTINE_OPTIONS = [
    { value: 'morning', label: '🌅 Routine du matin' },
    { value: 'evening', label: '🌙 Routine du soir' },
    { value: 'anytime', label: '⏰ À tout moment' },
];

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Dim', fullLabel: 'Dimanche' },
    { value: 1, label: 'Lun', fullLabel: 'Lundi' },
    { value: 2, label: 'Mar', fullLabel: 'Mardi' },
    { value: 3, label: 'Mer', fullLabel: 'Mercredi' },
    { value: 4, label: 'Jeu', fullLabel: 'Jeudi' },
    { value: 5, label: 'Ven', fullLabel: 'Vendredi' },
    { value: 6, label: 'Sam', fullLabel: 'Samedi' },
];

export const SCORECARD_RATINGS = [
    { value: 'positive', label: 'Positive (+)', symbol: '+', color: '#10B981' },
    { value: 'negative', label: 'Négative (−)', symbol: '−', color: '#EF4444' },
    { value: 'neutral', label: 'Neutre (=)', symbol: '=', color: '#6B7280' },
];