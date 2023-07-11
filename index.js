import { LevenshteinDistance } from './src/levenshtein.js';

$(function() {
    reset();
    $('.paramaterField')
        .on('keyup', parameterChange)
        .on('change', parameterChange);
});

function formatMatches(matches) {
    return matches.map(match => $('<span>').text(match.target));
}

function noMatchText(source) {
    return $('<span>').text(source ? `No matches found for the input '${source}'` : 'Please, type some source string.');
}

function parameterChange(event) {
    const source = $('#sourceField').val();
    const treshold = parseFloat($('#tresholdField').val());
    const substitutionCost = parseFloat($('#substitutionCostField').val());
    const deletionCost = parseFloat($('#deletionCostField').val());
    const insertionCost = parseFloat($('#insertionCostField').val());
    let matches = [];

    $('#targetField')
        .val()
        .split('\n')
        .forEach(target => {
            const distance = new LevenshteinDistance(source, target, treshold, substitutionCost, deletionCost, insertionCost);

            if (distance.matches.count)
                matches.push(distance.matches);
        });

    $('#resultsField').empty().append(matches.length > 0 ? formatMatches(matches) : noMatchText(source));
}

function reset() {
    let targetDefaults = [
        'Aidan Bowen',
        'Beth England',
        'Luke Durham',
        'Anish Shields',
        'Brittney Mcgrath',
        'Md Sheppard',
        'Freyja Gordon',
        'Oskar Nicholson',
        'Mehmet Matthews',
        'Larry Barrett'
    ].join('\n');
    $('#targetField').val(targetDefaults);
    $('#resultsField').append(noMatchText(''));
}