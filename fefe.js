const syllables = require('nlp-syllables/src/syllables');
const Tag = require('en-pos').Tag;
const Lexer = require('pos').Lexer;
const lexer = new Lexer();

function fefe(input) {
  const words = lexer.lex(input);
  const tags = new Tag(words)
    .initial() // initial dictionary and pattern based tagging
    .smooth() // further context based smoothing
    .tags.map((tag, i) => [words[i], tag]);

  let output = '';
  for (let i = 0; i < tags.length; i++) {
    const [word, tag] = tags[i];
    const isLastNounOfSentence =
      ['NN', 'NNS', 'NNP', 'NNPS'].includes(tag) &&
      (tags
        .slice(i + 1)
        .find(([, tag]) => ['NN', 'NNS', 'NNP', 'NNPS', '.'].includes(tag)) || [
        ,
        '.'
      ])[1] === '.';

    if (i !== 0 && !['.', ',', ':', '"'].includes(tag)) output += ' ';

    const wordSyllables = isLastNounOfSentence && word === 'cover'
      ? ['cov', 'er']
      : syllables(word);

    if (isLastNounOfSentence && wordSyllables.length > 1) {
      output += wordSyllables.slice(0, -1).concat('fefe').join('');
      const nextFinalSentencePunctuationIndex = tags.findIndex(
        ([, tag], j) => j > i && tag === '.'
      );
      if (nextFinalSentencePunctuationIndex !== -1) {
        i = nextFinalSentencePunctuationIndex - 1;
      }
    } else {
      output += word;
    }
  }
  return output;
}

module.exports = fefe;
