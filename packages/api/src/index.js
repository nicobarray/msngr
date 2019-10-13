const express = require("express");
const bodyParser = require("body-parser");
const { v4 } = require("uuid");
const moment = require("moment");

const server = express();

const constants = {
  LINK_DURATION: 1,
  LINK_DURATION_UNIT: "h",
  MSNGR_API_ENDPOINT: "http://localhost:3001"
};

const enums = {
  error: {
    LINK_EXPIRED: "E1",
    LINK_INVITE_PENDING: "E2"
  }
};

let links = {};

const timeout = id =>
  moment(links[id].ts).add(links[id].duration, links[id].unit);

const ensureObj = (obj, keys, res) => {
  if (!keys.every(key => obj.hasOwnProperty(key))) {
    res.sendStatus(400);
    return false;
  }

  return true;
};

const allowCors = (headers = []) => (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "content-type, authorization, content-length, x-requested-with, accept, origin"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Allow", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");

  for (let header of headers) {
    res.header(header[0], header[1]);
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
};

server.use(allowCors());
server.use(bodyParser.json());

server.post("/create", function(req, res) {
  if (!ensureObj(req.body, ["from"], res)) {
    return;
  }

  const { from } = req.body;
  const id = v4();
  console.log(`Create link ${id}`);

  links[id] = {
    ts: moment(),
    duration: constants.LINK_DURATION,
    unit: constants.LINK_DURATION_UNIT,
    url: `${constants.MSNGR_API_ENDPOINT}/chat/${id}`,
    from,
    to: null,
    buffers: {
      [from]: []
    }
  };

  res.send(id);
});

// Create other buffer.
server.post("/join", function(req, res) {
  res.send("Join!");

  if (!ensureObj(req.body, ["id", "from"], res)) {
    return;
  }

  const { id, from } = req.body;

  if (!ensureLinkAlive(id, res)) {
    return;
  }

  if (links[id].to) {
    // This invitation is alredy used.
    return res.sendStatus(303);
  }

  links[id].to = from;

  res.sendStatus(200);
});

server.get("/chat/:id", (req, res) => {
  console.log("chat", req.params);

  if (!ensureObj(req.params, ["id"], res)) {
    return;
  }

  const { id } = req.params;

  if (!ensureLinkAlive(id, res)) {
    return;
  }

  links[id].ts = moment();

  res.send(
    JSON.stringify({
      ts: links[id].ts.toISOString(),
      timeout: timeout(id),
      id,
      buffers: links[id].buffers
    })
  );
});

server.post("/send", (req, res) => {
  console.log("send", req.body);

  if (!ensureObj(req.body, ["id", "message", "from"], res)) {
    return;
  }

  const { id, message, from } = req.body;

  if (!ensureLinkAlive(id, res)) {
    return;
  }

  const to = links[id].from === from ? links[id].to : links[id].from;

  if (!to) {
    return res.send({
      error: "Wait for other user to accept chat",
      errno: enums.error.LINK_INVITE_PENDING
    });
  }

  const ts = moment();
  links[id].buffers[from].push({ message, ts, from });
  links[id].buffers[to].push({ message, ts, from });

  res.send(
    JSON.stringify({
      ts,
      id
    })
  );
});

server.listen(3001);

setInterval(() => {
  let length = Object.keys(links).length;
  links = Object.keys(links)
    .filter(key => {
      const link = links[key];

      return link.ts.isAfter(moment().subtract(link.duration, link.unit));
    })
    .reduce((acc, key) => Object.assign(acc, { [key]: links[key] }), {});

  if (length !== Object.keys(links).length) {
    console.log("Housekeeping", Object.keys(links).length);
  }
}, 1000);
