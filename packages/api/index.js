const express = require("express");
const { v4 } = require("uuid");
const moment = require("moment");

const server = express();

const constants = {
  LINK_DURATION: 1,
  LINK_DURATION_UNIT: "h",
  MSNGR_API_ENDPOINT: "http://localhost:3001"
};

let links = {};

server.get("/create", function(req, res) {
  const id = v4();
  console.log(`Create link ${id}`);

  links[id] = {
    ts: moment(),
    duration: constants.LINK_DURATION,
    unit: constants.LINK_DURATION_UNIT,
    url: `${constants.MSNGR_API_ENDPOINT}/chat/?id=${id}`
  };

  res.send(links[id].url);
});

server.get("/join", function(req, res) {
  res.send("Join!");
});

server.get("/chat/:id", (req, res) => {
  console.log("chat");

  if (!req.query.id) {
    return res.sendStatus(400);
  }

  const { id } = req.query;

  if (!links.hasOwnProperty(id)) {
    return res.send(JSON.stringify({ error: "link expired " }));
  }

  links[id].ts = moment();

  res.send(JSON.stringify({ ts: links[id].ts.toISOString() }));
});

server.listen(3001);

setInterval(() => {
  links = Object.keys(links)
    .filter(key => {
      const link = links[key];

      return link.ts.isAfter(moment().subtract(link.duration, link.unit));
    })
    .reduce((acc, key) => Object.assign(acc, { [key]: links[key] }), {});

  console.log("Housekeeping", Object.keys(links).length);
}, 1000);
