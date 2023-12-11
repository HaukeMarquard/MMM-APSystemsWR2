Module.register("MMM-APSystemsWR2", {
  defaults: {
    updateInterval: 60 * 1000, // every 10 minutes
    text: "APSystems WR",
    lat: "",
    lon: "",
    api_key: "",
  },
  start: function () {
    Log.info("Starting Module: " + this.name);
    Log.info("Starting dingens durch hier");
    this.weather = null;
    this.status = "ONLINE";
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
    this.status = "ONLINE";
    this.daily_value = this.weather.data.e1 + this.weather.data.e2;
    //Datenverarbeitung
    this.updateDom();
  },
  processOffline: function (data) {
    this.status = "OFFLINE";
    const date = new Date();
    const hour = date.getHours();
    if (hour == 0) {
      this.daily_value = 0;
    }
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
      value_one.innerText = `${this.weather.data.p1}`;
      value_one_container.appendChild(value_one);

      const value_two_container = document.createElement("div");
      value_two_container.classList.add("value_two_container");
      value_two_container.classList.add("value_container");
      const value_two = document.createElement("p");
      value_two.innerText = `${this.weather.data.p2}`;
      value_two_container.appendChild(value_two);

      const wr_container = document.createElement("div");
      wr_container.classList.add("wr_container");
      wr_container.classList.add("value_container");
      const wr = document.createElement("p");
      wr.innerText = `400`;
      wr_container.appendChild(wr);

      const output_container = document.createElement("div");
      output_container.classList.add("output_container");
      output_container.classList.add("value_container");
      const output = document.createElement("p");
      output.innerText = `400`;
      output_container.appendChild(output);

      //   const rain_container = document.createElement("div");
      //   rain_container.style.display = "flex";
      //   rain_container.style.align_items = "center";
      //   rain_container.style.justifyContent = "center";
      //   const rain = document.createElement("p");
      //   rain.innerText = `20%`;
      //   const r_img = document.createElement("img");
      //   r_img.classList.add("small");
      //   r_img.src = "/MMM-APSystemsWR2/solaranlage.png";
      //   rain_container.appendChild(r_img);
      //   rain_container.appendChild(rain);
      //   container.appendChild(rain_container);

      container.appendChild(img);
      container.appendChild(value_one_container);
      container.appendChild(value_two_container);
      container.appendChild(wr_container);
      container.appendChild(output_container);
      //   container.classList.add("container");
      //   var output = document.createElement("div");
      //   output.classList.add("output");
      //   const output_value = this.weather.data.p1 + this.weather.data.p2;
      //   output.innerText = `${output_value > 600 ? 600 : output_value} W`;
      //   const wr = document.createElement("div");
      //   wr.classList.add("wr");
      //   const wr_value = document.createElement("p");
      //   wr_value.innerText = `${output_value} W`;
      //   wr.appendChild(wr_value);
      //   const strang_one = document.createElement("div");
      //   strang_one.classList.add("strang_one_line");
      //   const strang_one_line = document.createElement("p");
      //   strang_one_line.innerText = `---------`;
      //   strang_one.appendChild(strang_one_line);
      //   const strang_one_value = document.createElement("p");
      //   strang_one_value.innerText = `${this.weather.data.p1} W`;
      //   strang_one.appendChild(strang_one_value);
      //   const strang_two = document.createElement("div");
      //   strang_two.classList.add("strang_two_line");
      //   const strang_two_line = document.createElement("p");
      //   strang_two_line.innerText = `---------`;
      //   strang_two.appendChild(strang_two_line);
      //   const strang_two_value = document.createElement("p");
      //   strang_two_value.innerText = `${this.weather.data.p2} W`;
      //   strang_two.appendChild(strang_two_value);

      //   const test_p = document.createElement("p");
      //   test_p.innerText = `123`;
      //   test_p.classList.add("test_p");
      //   container.appendChild(output);
      //   container.appendChild(wr);
      //   container.appendChild(strang_one);
      //   container.appendChild(strang_two);
      //   container.appendChild(test_p);
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
