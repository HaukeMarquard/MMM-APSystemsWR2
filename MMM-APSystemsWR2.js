Module.register("MMM-APSystemsWR2", {
  defaults: {
    updateInterval: 60 * 1000 * 3, // every 5 minutes
    text: "APSystems WR",
  },
  start: function () {
    Log.info("Starting Module: " + this.name);
    Log.info("Starting dingens durch hier");
    this.weather = {
      data: {
        p1: 0,
        p2: 0,
        e1: 0,
        e2: 0,
        te1: 0,
        te2: 0,
      },
    };
    this.date = "15.12.2023";
    this.daily_value = 0.537;
    this.sheduleUpdate();
  },
  getStyles: function () {
    return ["MMM-APSystemsWR2.css"];
  },
  getWeather: function () {
    this.sendSocketNotification("GET_DATA", {
      lat: this.config.lat,
      lon: this.config.lon,
      api_key: this.config.api_key,
    });
    this.updateDom();
  },
  processWeather: function (data) {
    this.weather = data;
    this.daily_value = this.weather.data.e1 + this.weather.data.e2;
    const d = new Date();
    this.date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    this.updateDom();
  },
  processOffline: function (data) {
    this.weather.data.p1 = 0;
    this.weather.data.p2 = 0;
    this.updateDom();
  },
  getDom: function () {
    if (this.weather == null) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = "Loading...";
      return wrapper;
    } else {
      var container = document.createElement("div");
      var img = document.createElement("img");
      img.src = "/MMM-APSystemsWR2/solaranlage.png";
      img.classList.add("solaranlage");
      const value_one_container = document.createElement("div");
      value_one_container.classList.add("value_one_container");
      value_one_container.classList.add("value_container");
      const value_one = document.createElement("p");
      value_one.innerText = `${this.weather.data.p2}`;
      value_one_container.appendChild(value_one);

      const value_two_container = document.createElement("div");
      value_two_container.classList.add("value_two_container");
      value_two_container.classList.add("value_container");
      const value_two = document.createElement("p");
      value_two.innerText = `${this.weather.data.p1}`;
      value_two_container.appendChild(value_two);

      const output_value = this.weather.data.p1 + this.weather.data.p2;

      const wr_container = document.createElement("div");
      wr_container.classList.add("wr_container");
      wr_container.classList.add("value_container");
      const wr = document.createElement("p");
      wr.innerText = output_value;
      wr_container.appendChild(wr);

      const output_container = document.createElement("div");
      output_container.classList.add("output_container");
      output_container.classList.add("value_container");
      const output = document.createElement("p");
      output.innerText = `${output_value > 600 ? 600 : output_value}`;
      output_container.appendChild(output);

      const daily_value = document.createElement("p");
      daily_value.innerText = `${this.date}: ${this.daily_value.toFixed(
        2
      )} kW / Gesamterzeugung: ${(
        this.weather.data.te1 + this.weather.data.te2
      ).toFixed(2)} kW`;

      container.appendChild(img);
      container.appendChild(value_one_container);
      container.appendChild(value_two_container);
      container.appendChild(wr_container);
      container.appendChild(output_container);
      container.appendChild(daily_value);
      return container;
    }
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification === "WR_RESULT") {
      Log.log("Data kommt an");
      this.processWeather(payload);
      this.updateDom();
    } else if (notification === "WR_OFFLINE") {
      Log.log("WR ist offline");
      this.processOffline(payload);
      this.updateDom();
    }
  },
  sheduleUpdate: function () {
    var self = this;
    setInterval(function () {
      self.getWeather();
    }, this.config.updateInterval);
    self.getWeather();
  },
});

/*
  for(let i = 0; i < 4; i++) {
                  const time = new Date(this.weather.timelines.hourly[3*i].time).toLocaleTimeString()
                  Log.info(time)
                  wrapper.appendChild(document.createElement("p").innerText = time)
                  wrapper.appendChild(document.createElement("p").innerText = `Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperature)}`)
                  wrapper.appendChild(document.createElement("p").innerText = `Gefühlte Temp: ${Math.round(this.weather.timelines.hourly[3*i].temperatureApparent)}`)
                  wrapper.appendChild(document.createElement("p").innerText = `UV-Index: ${Math.round(this.weather.timelines.hourly[3*i].uvIndex)}`)
                  wrapper.appendChild(document.createElement("p").innerText = `Regenmenge(mm): ${this.weather.timelines.hourly[3*i].rainIntensity}`)
                  
              }
  */
