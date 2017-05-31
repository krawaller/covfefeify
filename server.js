const express = require('express');
const fefe = require('./fefe');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const URL = require('url').URL;

const app = express();
app.get('/', function(req, res) {
  res.send(
    'Go to https://covfefeify.now.sh/&lt;your-url-here&gt; to get a vastly enhanced experifefe'
  );
});

app.get('*', function(req, res) {
  const url = req.url.slice(1).replace(/^https?:\/\/|/, 'https://');
  fetch(url, {
    headers: Object.assign({}, req.headers, { host: new URL(url).host })
  })
    .then(response => response.text())
    .then(text => {
      const $ = cheerio.load(text);
      $('*')
        .contents()
        .filter(
          (i, el) => el.type === 'text' && !$(el).parent('script, style').length
        )
        .each((i, elem) => {
          if (!/^\s+$/.test(elem.data)) elem.data = fefe(elem.data);
        });
      $('head').prepend(`<base href="${url}">`);
      res.send($.html());
    })
    .catch(error => res.status(500).send(error));
});

app.listen(3000);
