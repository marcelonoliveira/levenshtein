import 'https://code.jquery.com/jquery-3.7.0.min.js';

import { LevenshteinDistance } from './src/levenshtein.js';

$(function() {
    $('.paramaterField').on('input', parameterChange);
    $('.paramaterField[type=range]').on('input', updateValue);
    $('#resetButton').on('click', reset);
    $('#asideToggler').on('click', toggleAside);
    reset();
});

function parameterChange(event) {
    const source = $('#sourceField').val();
    const treshold = parseFloat($('#tresholdField').val());
    const substitutionCost = parseFloat($('#substitutionCostField').val());
    const deletionCost = parseFloat($('#deletionCostField').val());
    const insertionCost = parseFloat($('#insertionCostField').val());
    const caseSensitive = $('#caseToggler').prop('checked');
    const ignoreAccents = $('#accentsToggler').prop('checked');
    const matches = $('#targetField')
        .val()
        .split('\n')
        .map(target => new LevenshteinDistance(
                source,
                target,
                treshold,
                substitutionCost,
                deletionCost,
                insertionCost,
                caseSensitive,
                ignoreAccents))
        .filter(distance => distance.matches.count)
        .map(distance => distance.matches);
    $('#resultsField')
        .empty()
        .append(matches.length > 0 ? formatMatches(matches) : noMatchText(source));
}

function updateValue() {
    $(this).siblings('span').text($(this).val());
}

function formatMatches(matches) {
    return matches.map(match => {
        const formattedSequences = match.sequences.map(sequence => {
            return $('<span>')
                .text(sequence.text)
                .toggleClass('match-sequence', sequence.match);
        });
        return $('<div>').append(formattedSequences);
    });
}

function noMatchText(source) {
    return $('<span>').text(source ? `No matches found for the input '${source}'` : 'Please, type some source string.');
}

function reset() {
    let targetDefaults = [
        'Aidan Bowen',
        'Dorothea Schöttmer',
        'Luke Jäger',
        'Valquíria da Silva',
        'Álvaro Mcgrath',
        'Amâncio Sheppard',
        'Freyja Gordon',
        'Dionísio Sonnen',
        'Mehmet Matthews',
        'Larry Barrett'
    ].join('\n');
    $('#sourceField').val('');
    $('#tresholdField').val(3);
    $('#substitutionCostField').val(1);
    $('#deletionCostField').val(1);
    $('#insertionCostField').val(1);
    $('#targetField').val(targetDefaults);
    $('#resultsField').append(noMatchText(''));
    $('#accentsToggler').prop('checked', true);
    $('#caseToggler').prop('checked', false);
    $('.paramaterField[type=range]').trigger('input');
}

function toggleAside() {
    $('#asideToggler').children('span').text($('aside').toggleClass('show').hasClass('show') ? 'close' : 'menu');
}