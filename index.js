const readline = require('readline-sync');

function start() {
  const content = {};
  function askAndReturnSearchTerm() {
    return readline.question('Type a wikipedia search term: ');
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The History of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ');
    const selectedPrefixTest = prefixes[selectedPrefixIndex];
    return selectedPrefixTest;
  }

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  console.log(content);
}

start();
