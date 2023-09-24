      var container = document.querySelector("#unity-container");
      var canvas = document.querySelector("#unity-canvas");
      var loadingBar = document.querySelector("#unity-loading-bar");
      var progressBarFull = document.querySelector("#unity-progress-bar-full");
      var fullscreenButton = document.querySelector("#unity-fullscreen-button");
      var warningBanner = document.querySelector("#unity-warning");
      var warningBannerText = document.querySelector("#unity-warning p");
      var fullScreenBlock = document.querySelector("#unity-fullscreen-block");

      // Shows a temporary message banner/ribbon for a few seconds, or
      // a permanent error message on top of the canvas if type=='error'.
      // If type=='warning', a yellow highlight color is used.
      // Modify or remove this function to customize the visually presented
      // way that non-critical warnings and error messages are presented to the
      // user.
      function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
          warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
          if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
          setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
          }, 5000);
        }
        updateBannerVisibility();
      }

      var loaderUrl = "../build/Build/FreshBuild.loader.js";
      var config = {
        dataUrl: "../build/Build/FreshBuild.data.unityweb",
        frameworkUrl: "../build/Build/FreshBuild.framework.js.unityweb",
        codeUrl: "../build/Build/FreshBuild.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "AssetsDemoProject",
        productVersion: "1.0",
        showBanner: unityShowBanner,
      };

      // By default Unity keeps WebGL canvas render target size matched with
      // the DOM size of the canvas element (scaled by window.devicePixelRatio)
      // Set this to false if you want to decouple this synchronization from
      // happening inside the engine, and you would instead like to size up
      // the canvas DOM size and WebGL render target sizes yourself.
      // config.matchWebGLToCanvasSize = false;

      var width = "100%";
      var height = "100%";
      canvas.style.width = width;
      canvas.style.height = height;
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.screen.width <= 950) {
        container.className = "unity-mobile";
        // Avoid draining fillrate performance on mobile devices,
        // and default/override low DPI mode on mobile browsers.
        config.devicePixelRatio = 1;
        warningBanner.style = "display: block";
        container.style = "display: none";

        var bannerText = "";
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)){
          bannerText = "! Cannot load WebGL preview on Tablet or Phone, use laptop instead !";
        }
        else{
          bannerText = "! Cannot load WebGL Project preview as screen resolution is too small, required a wider one !";
        }
        warningBannerText.innerHTML = bannerText;

        document.querySelector('.content p').style.color = 'red';
      } else {
        warningBanner.style = "display: none";
      }
      loadingBar.style.display = "block";

      var script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => {
          loadingBar.style.display = "none";
          fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
          };
        }).catch((message) => {
          alert(message);
        });
      };
      document.body.appendChild(script);