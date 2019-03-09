const Parser = require('rss-parser');
const prompts = require('prompts');

const TREND_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR';

async function start() {
  const content = {};

  async function getGoogleTrends() {
    const parser = new Parser();
    const trends = await parser.parseURL(TREND_URL);
    return trends.items.map(({ title }) => title);
  }

  async function askAndReturnTrend() {
    const trendsFormated = [];
    process.stdout.write('Please wait...\n');
    const trends = await getGoogleTrends();
    trends.map(trend => trendsFormated.push({ title: trend, value: trend }));

    const choice = await prompts({
      type: 'select',
      name: 'term',
      message: 'Choose your trend: ',
      choices: trendsFormated,
    });
    return choice.term;
  }

  async function askAndReturnSearchTerm() {
    const response = await prompts({
      type: 'text',
      name: 'searchTerm',
      message: 'Type a wikipedia search term of G to fetch google trends: ',
    });
    return (response.searchTerm.toUpperCase() === 'G') ? askAndReturnTrend() : response.searchTerm;
  }

  async function askAndReturnPrefix() {
    const question = await prompts({
      type: 'select',
      name: 'prefix',
      message: 'Choose one option: ',
      choices: [
        { title: 'Who is', value: 'Who is' },
        { title: 'What is', value: 'What is' },
        { title: 'The history of', value: 'The history of' },
      ],
    });
    return question.prefix;
  }

  content.searchTerm = await askAndReturnSearchTerm();
  content.prefix = await askAndReturnPrefix();

  console.log(content);
}

start();
