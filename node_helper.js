const NodeHelper = require("node_helper");
var axios = require("axios");
const Log = require("logger");

module.exports = NodeHelper.create({
  start: function () {},
  getWeather: function (payload) {
    var that = this;
    this.url = `http://192.168.178.61:8050/getOutputData`;
    Log.info(this.url);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // Festlegen eines Zeitlimits in Millisekunden
    const timeout = 5000; // z.B. 5000 Millisekunden = 5 Sekunden

    // Starten des Timers, um den Request nach dem Zeitlimit abzubrechen
    const timeoutId = setTimeout(() => {
      source.cancel("Request wurde wegen Zeitüberschreitung abgebrochen");
    }, timeout);
    axios
      .get(this.url, {
        cancelToken: source.token,
      })
      .then((response) => {
        // Stellen Sie sicher, dass der Timeout abgebrochen wird, wenn der Request erfolgreich war
        clearTimeout(timeoutId);
        that.sendSocketNotification("WR_RESULT", response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          Log.info("offline 1");
          that.sendSocketNotification("WR_OFFLINE", { error: "OFFLINE" });
        } else {
          Log.info("offline 2");
          that.sendSocketNotification("WR_OFFLINE", { error: "OFFLINE" });
        }
      });
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification == "GET_DATA") {
      this.getWeather(payload);
    }
  },
});
