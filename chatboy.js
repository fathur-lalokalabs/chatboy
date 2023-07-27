"use strict";

(function (window) {
  // You can enable the strict mode commenting the following line
  // 'use strict';

  // This function will contain all our code
  function chatboy() {
    // initial object

    var settings = {
      ui_mode: "embed", // embed / sticky
      url_storage_key: "chatboy_form_url",
      dev_mode: false,
    };

    var _chatboy = {
      settings: settings,
      iframe_settings: {
        iframe_container_id: "chatboy_iframe_parent",
        iframe_container_class: "",
        iframe_id: "chatboy_iframe",
        iframe_class: "",
      },
      trusted_origins: ["https://fathur-lalokalabs.github.io/chatboy"],
      is_loading_script: false,
      is_script_loaded: false,
      embed_height: null,
      spinner_id: "chatboy_spinner",
      script_origin: document.currentScript && document.currentScript.src,
    };

    // end initial object

    // use init to custom config

    _chatboy.init = function (options) {
      for (var key in options) {
        if (this.settings.hasOwnProperty(key)) {
          if (isValidOption(key, options)) {
            this.settings[key] = options[key];
          }
        }
      }

      // 1. create empty div to embed iframe

      const emptyDiv = document.createElement("div");
      emptyDiv.id = "chatboy_embed_div";

      var dom_element = document.body.appendChild(emptyDiv);

      // 2. embed iframe

      var chatboy_src = this.trusted_origins[0] + "/index.html";

      if (this.settings.dev_mode) {
        chatboy_src = getBaseUrl() + "/index.html";
      }

      // console.log("var base_url = getBaseUrl();", getBaseUrl());

      // var chat_url = "http://127.0.0.1:5500/index.html";

      _chatboy.showEmbed(chatboy_src, dom_element);
    };

    // end use init to custom config

    // business logic

    function isValidOption(key, options) {
      var value = options[key];

      if (typeof value == "string") {
        value = value.trim();
      }

      if (key === "ui_mode") {
        var valid_ui_modes = ["sticky", "embed"];

        if (!valid_ui_modes.includes(value)) {
          return false;
        }
      }

      if (key === "dev_mode") {
        if (typeof value != "boolean") {
          return false;
        }
      }

      return true;
    }

    function embedChatbox(chatbox_url, embed_container) {
      fireEvent("onOtpBeforeLoad", {});

      var iframe_container = document.createElement("div");

      iframe_container.setAttribute(
        "id",
        _chatboy.iframe_settings.iframe_container_id
      );
      iframe_container.setAttribute(
        "class",
        _chatboy.iframe_settings.iframe_container_class
      );

      iframe_container.style["max-width"] = "340px";
      iframe_container.style["max-height"] = "385px";

      var iframe = document.createElement("iframe");

      iframe.setAttribute("id", _chatboy.iframe_settings.iframe_id);
      iframe.setAttribute("class", _chatboy.iframe_settings.iframe_class);

      iframe_container.appendChild(iframe);

      // TODO: show loading before fetch the url

      iframe.src = chatbox_url;
      iframe.width = "100%";
      iframe.style.border = "none";
      iframe.style.height = "517px";

      // remove modal spinner before append chatboy iframe

      var spinner = document.getElementById(_chatboy.spinner_id);

      if (spinner) {
        spinner.parentNode.removeChild(spinner);
      }

      // append chatboy iframe

      embed_container.appendChild(iframe_container);

      iframe.addEventListener("load", function () {
        // do something
      });
    }

    // end business logic

    // helper

    function setDefaultStyle() {
      // create inline style for iframe position

      var style_element = document.createElement("style");

      var css_rules = getStyle();

      if (css_rules) {
        style_element.appendChild(document.createTextNode(css_rules));

        /* attach to the document head */

        document.getElementsByTagName("head")[0].appendChild(style_element);
      }
    }

    function getStyle() {
      if (_chatboy.settings.ui_mode === "embed") {
        return (
          "div#" +
          _chatboy.iframe_settings.iframe_container_id +
          " { position: fixed; bottom: 0; right:0; width: 100%; background-color: transparent; }"
        );
      }

      return null;
    }

    function prepareEmbedUrl(url) {
      return url;
    }

    function fireEvent(event_name, payload) {
      var custom_event = new CustomEvent(event_name, { detail: payload });

      window.dispatchEvent(custom_event);
    }

    function getBaseUrl() {
      var parse_origin = new URL(_chatboy.script_origin);

      var base_url = parse_origin.origin;

      return base_url;
    }

    function getAssetPath(filename) {
      var version =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : "v1";

      var file_extension = filename.split(".").pop();

      var path = "/sdk/" + version + "/";

      if (file_extension === "css") {
        path = "/sdk/" + version + "/";
      }

      if (_chatboy.settings.dev_mode) {
        path = "/dist/";
      }

      return path;
    }

    function getAssetUrl(filename) {
      var base_url = getBaseUrl();

      var path = getAssetPath(filename);

      var asset_url = base_url + path + filename;

      return asset_url;
    }

    // end helper

    /* event listener */

    _chatboy.chatboyServerMessage = function (event) {
      // Check sender origin to be trusted

      var client_origin = window.location.origin;

      if (event.origin != client_origin) {
        if (!_chatboy["trusted_origins"].includes(event.origin)) {
          console.error(
            "Server callback failed because event origin " +
              event.origin +
              " is not define inside trusted_origins"
          );
          return;
        }
      }

      var data = event.data;

      if (typeof _chatboy[data.func] == "function") {
        _chatboy[data.func].call(null, data.message);
      }
    };

    /* end event listener */

    // manual position form

    function initEmbed(embed_url, embed_container) {
      _chatboy.settings.ui_mode = "embed";

      embedChatbox(embed_url, embed_container);

      setDefaultStyle();
    }

    _chatboy.showEmbed = function (chatbox_url, embed_container) {
      var embed_url = prepareEmbedUrl(chatbox_url);

      // save otp url for reload purpose
      sessionStorage.setItem(this.settings.url_storage_key, embed_url);

      initEmbed(embed_url, embed_container);

      return true;
    };

    _chatboy.reloadEmbed = function (embed_container) {
      var embed_url = sessionStorage.getItem(this.settings.url_storage_key);

      if (!embed_url) {
        console.error(
          "No previous otp form url define in session storage with key " +
            this.settings.url_storage_key
        );
        return;
      }

      initEmbed(embed_url, embed_container);
    };

    // end manual position form

    _chatboy.getEmbedHeight = function () {
      return this.embed_height;
    };

    // for development purpose

    _chatboy.addOrigin = function (origin) {
      origin = origin.replace(/\/$/, "");
      this.trusted_origins.push(origin);
      return this.trusted_origins;
    };

    _chatboy.clearSession = function () {
      sessionStorage.removeItem(this.settings.url_storage_key);
    };

    return _chatboy;
  }

  // We need that our library is globally accesible, then we save in the window
  if (typeof window.chatboy === "undefined") {
    window.chatboy = chatboy();
  }

  if (window.addEventListener) {
    window.addEventListener(
      "message",
      window.chatboy.chatboyServerMessage,
      false
    );
  } else if (window.attachEvent) {
    window.attachEvent("onmessage", window.chatboy.chatboyServerMessage, false);
  }
})(window);
