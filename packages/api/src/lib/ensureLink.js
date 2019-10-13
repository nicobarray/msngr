import moment from 'moment'

import timeout from './timeout'

module.exports = (id, res) => {
  if (!links.hasOwnProperty(id)) {
    res.send(
      JSON.stringify({ error: "link expired", errno: enums.error.LINK_EXPIRED })
    );
    return false;
  }

  if (moment().isAfter(timeout(id))) {
    res.send(
      JSON.stringify({
        error: "link expired",
        timeout: timeout(id),
        errno: enums.error.LINK_EXPIRED
      })
    );
    return false;
  }

  return true;
};
