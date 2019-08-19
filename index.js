'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const request = require('request');
const fs = require('fs');

const config = {
  apiKey: fs.readFileSync(`${__dirname}/config/api_key.txt`, 'utf8').trim(),
  channelAccessToken: fs.readFileSync(`${__dirname}/config/channel_access_token.txt`, 'utf8').trim(),
  channelSecret: fs.readFileSync(`${__dirname}/config/channel_secret.txt`, 'utf8').trim(),
  botName: fs.readFileSync(`${__dirname}/config/bot_name.txt`, 'utf8').trim(),
  country: fs.readFileSync(`${__dirname}/config/country.txt`, 'utf8').trim(),
  atextBadProbMax: fs.readFileSync(`${__dirname}/config/atext_bad_prob_max.txt`, 'utf8').trim(),
  atextBadProbMin: fs.readFileSync(`${__dirname}/config/atext_bad_prob_min.txt`, 'utf8').trim(),
  atextLengthMax: fs.readFileSync(`${__dirname}/config/atext_length_max.txt`, 'utf8').trim(),
  atextLengthMin: fs.readFileSync(`${__dirname}/config/atext_length_min.txt`, 'utf8').trim(),
  registDateMax: fs.readFileSync(`${__dirname}/config/regist_date_max.txt`, 'utf8').trim(),
  registDateMin: fs.readFileSync(`${__dirname}/config/regist_date_min.txt`, 'utf8').trim(),
};

const lineConfig = {
  channelAccessToken: config.channelAccessToken,
  channelSecret: config.channelSecret,
};
const client = new line.Client(lineConfig);

const app = express();

app.post('/callback', line.middleware(lineConfig), (req, res) => {
  if (req.body.destination) {
    console.log(`Destination User ID: ${req.body.destination}`);
  }

  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log(`Test hook received: ${JSON.stringify(event.message)}`);
  }

  if (event.type === 'message') {
    const message = event.message;

    if (message.type === 'text') {
      return handleText(message, event.replyToken);
    } else {
      console.log(`Unsupported type: ${JSON.stringify(message.type)}`);
      return Promise.resolve(null);
    }
  } else {
    console.log(`Unsupported type: ${JSON.stringify(event.type)}`);
    return Promise.resolve(null);
  }
}

function handleText(message, replyToken) {
  const options = {
    method: 'POST',
    url: 'https://wsapi.simsimi.com/190410/talk/',
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: buildBody(message.text),
    json: true
  };

  request(options, (err, res, body) => {
    if (err) {
      return replyText(replyToken, '문제가 발생했습니다. 다시 시도해주세요.');
    } else {
      return replyText(replyToken, body.atext);
    }
  })
}

function buildBody(utext) {
  const body = {
    utext: utext,
    lang: 'ko',
  };

  if (config.botName) body['bot_name'] = config.botName.split(',').map(s => s.trim()).filter((item, pos, self) => self.indexOf(item) === pos);
  if (config.country) body['country'] = config.country.split(',').map(s => s.trim());
  if (config.atextBadProbMax) body['atext_bad_prob_max'] = Number(config.atextBadProbMax);
  if (config.atextBadProbMin) body['atext_bad_prob_min'] = Number(config.atextBadProbMin);
  if (config.atextLengthMax) body['atext_length_max'] = Number(config.atextLengthMax);
  if (config.atextLengthMin) body['atext_length_min'] = Number(config.atextLengthMin);
  if (config.registDateMax) body['regist_date_max'] = Number(config.registDateMax);
  if (config.registDateMin) body['regist_date_min'] = Number(config.registDateMin);

  return body;
}

function replyText(token, text) {
  return client.replyMessage(token, {type: 'text', text: text});
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});