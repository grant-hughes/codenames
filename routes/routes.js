const express = require('express');
const path = require('path');
const mustache = require('mustache');
const fs = require('fs');

const router = express();

const words = ['account', 'act', 'adjustment', 'advertisement', 'agreement', 'air', 'amount', 'amusement', 'animal', 'answer', 'apparatus',
'approval', 'argument', 'art', 'attack', 'attempt', 'attention', 'attraction', 'authority', 'back', 'balance', 'base', 'behavior', 'belief',
'birth', 'bit', 'bite', 'blood', 'blow', 'body', 'brass', 'bread', 'breath', 'brother', 'building', 'burn', 'burst', 'business', 'butter',
'canvas', 'care', 'cause', 'chalk', 'chance', 'change', 'cloth', 'coal', 'color', 'comfort', 'committee', 'company', 'comparison',
'competition', 'condition', 'connection', 'control', 'cook', 'copper', 'copy', 'cork', 'copy', 'cough', 'country', 'cover', 'crack',
'credit', 'crime', 'crush', 'cry', 'current', 'curve', 'damage', 'danger', 'daughter', 'day', 'death', 'debt', 'decision', 'degree',
'design', 'desire', 'destruction', 'detail', 'development', 'digestion', 'direction', 'discovery', 'discussion', 'disease', 'disgust',
'distance', 'distribution', 'division', 'doubt', 'drink', 'driving', 'dust', 'earth', 'edge', 'education', 'effect', 'end', 'error',
'event', 'example', 'exchange', 'existence', 'expansion', 'experience', 'expert', 'fact', 'fall', 'family', 'father', 'fear', 'feeling',
'fiction', 'field', 'fight', 'fire', 'flame', 'flight', 'flower', 'fold', 'food', 'force', 'form', 'friend', 'front', 'fruit', 'glass',
'gold', 'government', 'grain', 'grass', 'grip', 'group', 'growth', 'guide', 'harbor', 'harmony', 'hate', 'hearing', 'heat', 'help',
'history', 'hole', 'hope', 'hour', 'humor', 'ice', 'idea', 'impulse', 'increase', 'industry', 'ink', 'insect', 'instrument', 'insurance',
'interest', 'invention', 'iron', 'jelly', 'join', 'journey', 'judge', 'jump', 'kick', 'kiss', 'knowledge', 'land', 'language', 'laugh',
'low', 'lead', 'learning', 'leather', 'letter', 'level', 'lift', 'light', 'limit', 'linen', 'liquid', 'list', 'look', 'loss', 'love',
'machine', 'man', 'manager', 'mark', 'market', 'mass', 'meal', 'measure', 'meat', 'meeting', 'memory', 'metal', 'middle', 'milk', 'mind',
'mine', 'minute', 'mist', 'money', 'month', 'morning', 'mother', 'motion', 'mountain', 'move', 'music', 'name', 'nation', 'need', 'news',
'night', 'noise', 'note', 'number', 'observation', 'offer', 'oil', 'operation', 'opinion', 'order', 'organization', 'ornament', 'owner',
'page', 'pain', 'paint', 'paper', 'part', 'paste', 'payment', 'peace', 'person', 'place', 'plant', 'play', 'pleasure', 'point', 'poison',
'polish', 'porter', 'position', 'powder', 'power', 'price', 'print', 'process', 'produce', 'profit', 'property', 'prose', 'protest', 'pull',
'punishment', 'purpose', 'push', 'quality', 'question', 'rain', 'range', 'rate', 'ray', 'reaction', 'reading', 'reason', 'record', 'regret',
'relation', 'religion', 'representative', 'request', 'respect', 'rest', 'reward', 'rhythm', 'rice', 'river', 'road', 'roll', 'room', 'rub',
'rule', 'run', 'salt', 'sand', 'scale', 'science', 'sea', 'seat', 'secretary', 'selection', 'self', 'sense', 'servant', 'sex', 'shade',
'shake', 'shame', 'shock', 'side', 'sign', 'silk', 'silver', 'sister', 'size', 'sky', 'sleep', 'slip', 'slope', 'smash', 'smell', 'smile',
'smoke', 'sneeze', 'snow', 'soap', 'society', 'son', 'song', 'sort', 'sound', 'soup', 'space', 'stage', 'start', 'statement', 'steam',
'steel', 'step', 'stitch', 'stone', 'stop', 'story', 'stretch', 'structure', 'substance', 'sugar', 'suggestion', 'summer', 'support',
'surprise', 'swim', 'system', 'talk', 'taste', 'tax', 'teaching', 'tendency', 'test', 'theory', 'thing', 'thought', 'thunder', 'time',
'tin', 'top', 'touch', 'trade', 'transport', 'trick', 'trouble', 'turn', 'twist', 'unit', 'use', 'value', 'verse', 'vessel', 'view',
'voice', 'walk', 'war', 'wash', 'waste', 'water', 'wave', 'wax', 'way', 'weather', 'week', 'weight', 'wind', 'wine', 'winter', 'woman',
'wood', 'wool', 'word', 'work', 'wound', 'writing', 'year', 'angle', 'ant', 'apple', 'arch', 'arm', 'army', 'baby', 'bag', 'ball', 'band',
'basin', 'basket', 'bath', 'bed', 'bee', 'bell', 'berry', 'bird', 'blade', 'board', 'boat', 'bone', 'book', 'boot', 'bottle', 'box', 'boy',
'brain', 'brake', 'branch', 'brick', 'bridge', 'brush', 'bucket', 'bulb', 'button', 'cake', 'camera', 'card', 'carriage', 'cart', 'cat',
'chain', 'cheese', 'chess', 'chin', 'church', 'circle', 'clock', 'cloud', 'coat', 'collar', 'comb', 'cord', 'cow', 'cup', 'curtain',
'cushion', 'dog', 'door', 'drain', 'drawer', 'dress', 'drop', 'ear', 'egg', 'engine', 'eye', 'face', 'farm', 'feather', 'finger', 'fish',
'flag', 'floor', 'fly', 'foot', 'fork', 'fowl', 'frame', 'garden', 'girl', 'glove', 'goat', 'gun', 'hair', 'hammer', 'hand', 'hat', 'head',
'heart', 'hook', 'horn', 'horse', 'hospital', 'house', 'island', 'jewel', 'kettle', 'key', 'knee', 'knife', 'knot', 'leaf', 'leg',
'library', 'line', 'lip', 'lock', 'map', 'match', 'monkey', 'moon', 'mouth', 'muscle', 'nail', 'neck', 'needle', 'nerve', 'net', 'nose',
'nut', 'office', 'orange', 'oven', 'parcel', 'pen', 'pencil', 'picture', 'pig', 'pin', 'pipe', 'plane', 'plate', 'plough', 'pocket', 'pot',
'potato', 'prison', 'pump', 'rail', 'rat', 'receipt', 'ring', 'rod', 'roof', 'root', 'sail', 'school', 'scissors', 'screw', 'seed', 'sheep',
'shelf', 'ship', 'shirt', 'shoe', 'skin', 'skirt', 'snake', 'sock', 'spade', 'sponge', 'spoon', 'spring', 'square', 'stamp', 'star',
'station', 'stem', 'stick', 'stocking', 'stomach', 'store', 'street', 'sun', 'table', 'tail', 'thread', 'throat', 'thumb', 'ticket', 'toe',
'tongue', 'tooth', 'town', 'train', 'tray', 'tree', 'trousers', 'umbrella', 'wall', 'watch', 'wheel', 'whip', 'whistle', 'window', 'wing',
'wire', 'worm'
];

router.get('/', function(req, res) {

    const gameId = Math.random().toString(36).substr(2, 4).toUpperCase();

    var games =  new Map(JSON.parse(process.env.games));

    var gameWords = [];
    for(var gameWordsIndex = 0; gameWordsIndex < 25; gameWordsIndex++) {
        var wordsIndex = parseInt(Math.random() * words.length + 1);
        gameWords[gameWordsIndex] = words[wordsIndex];
        
    }
    const randomClasses = getRandomClasses();
    console.log(randomClasses);

    games.set(gameId, {redConnect: false, blueConnect: false, redReady: false, blueReady: false, gameStatus: 'home', gameWords: gameWords, randomClasses: randomClasses});
    process.env.games = JSON.stringify(Array.from(games.entries()));
    res.redirect('/' + gameId);
});

router.get('/:gameId', function(req, res) {

    const gameId = req.params.gameId;
    const games =  new Map(JSON.parse(process.env.games));
    if(!games.get(gameId)) {
        res.send("Not found!");
    }

    const game = games.get(gameId);

    const data = {
        gameId: gameId,
        redReady: game['redReady'],
        blueReady: game['blueReady'],
        gameStatus: game['gameStatus'],
        gameWords: game['gameWords'],
        randomClasses: game['randomClasses']
    }

    const template = fs.readFileSync(path.join(path.resolve(__dirname, '..') + '/public/html/game.html'), 'utf-8');
    const html = mustache.to_html(template, data);
    res.send(html);   
});

function getRandomClasses() {
    var randomClasses = [];
    randomClasses[0] = 'bomb';
    for(var i = 1; i < 10; i++) {
        randomClasses[i] = 'red';
    }
    for(var i = 10; i < 18; i++) {
        randomClasses[i] = 'blue';
    }
    for(var i = 18; i < 25; i++) {
        randomClasses[i] = 'blank';
    }
    for (let i = randomClasses.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomClasses[i], randomClasses[j]] = [randomClasses[j], randomClasses[i]];
    }

    return randomClasses;
}

module.exports = router;