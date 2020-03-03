const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const defaultColors = {
  'accent': 'ff2658',
  'background': '2f3333',
  'foreground': 'fff'
}

const loveInHanoi = fs.readFileSync(path.join(__dirname+'/badges/loveinhanoi.svg'), 'utf8');

app.use("/assets", express.static("assets"));
app.engine('html', require('ejs').renderFile);

app.get("/lovein/hanoi/:foreground?/:background?/:accent?/", (req, res) => {
  if(typeof req.params.foreground === 'undefined')
    req.params.foreground = defaultColors.foreground;
  if(typeof req.params.background === 'undefined')
    req.params.background = defaultColors.background;
  if(typeof req.params.accent === 'undefined')
    req.params.accent = defaultColors.accent;

  let returnSvg = loveInHanoi;

  returnSvg = returnSvg.replace(/\{\{ background \}\}/, req.params.background)
    .replace(/\{\{ foreground \}\}/g, req.params.foreground)
    .replace(/\{\{ accent \}\}/g, req.params.accent);

  res.set({
    'Content-Type': 'image/svg+xml',
    'ETag': req.params.foreground + req.params.background + req.params.accent+Date.now()
  })

  res.send(returnSvg);
})

// Validate colors
app.param(['bgcolor', 'heartbg', 'textcolor', 'heartColor'], function (req, res, next, value) {
  if(/(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(value)) {
    next();
  } else {
    res.render('notvalid.html');
  }
});

// Handle 404 - Keep this as a last route
app.get('*', function(_, res) {
  res.status(400);
  res.render('notfound.html');
});

app.listen(8080);
