/**
 * App Scope Demo
 * @author csc309ta@teach.cs.toronto.edu (CSC 309 TAs)
 *
 * This app code helps you understand JS scopes better.
 */

// Namespace
CSC309ScopeApp = {};

// Constants
CSC309ScopeApp.INSTAGRAM_USERNAME = 'uoft'; // public username


/**
 * This function runs JSONP calls.
 * TODO: what is JSONP, how is different than XHR?
 *
 * @param {string} url
 * @param {function} callback
 */
CSC309ScopeApp.JSONP = function (url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function (data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };
  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
};


/**
 * Construct API url.
 * The API used here was written over the weekend, you can find more details
 * here: https: //github.com/whizzzkid/instagram-reverse-proxy
 *
 * @param {integer} postCount
 * @return {string} url
 */
CSC309ScopeApp.constructAPIUrl = function (postCount) {
  return 'https://instareproxy.herokuapp.com/' +
    this.INSTAGRAM_USERNAME + '/media/?count=' + postCount.toString();
};


/**
 * This method actually adds the image to the DOM.
 *
 * @param {string} imageUrl
 */
CSC309ScopeApp.renderImage = function (imageUrl) {
  var imageTemplate = document.getElementById('instagram-photo');
  var template = imageTemplate.content.cloneNode(true);
  template.getElementById('image').src = imageUrl;
  imageTemplate.parentNode.appendChild(template);
};


/**
 * This method generates a callback function which will render the images.
 */
CSC309ScopeApp.constructInstagramAPICallbackHandler = function () {
  return function (response) {
    var images = response.items;
    for (var i in images) {
      this.renderImage(images[i].images.standard_resolution.url);
    }
  };
};


/**
 * This method fetches images and renders on the page.
 *
 * @param {integer} count
 */
CSC309ScopeApp.fetchImagesAndRender = function (count) {
  var instagramImageFetchUrl = this.constructAPIUrl(count);
  this.JSONP(instagramImageFetchUrl, this.constructInstagramAPICallbackHandler().bind(this));
}


/**
 * Init method.
 */
CSC309ScopeApp.init = function () {
  this.fetchImagesAndRender(6);
};

// Init
CSC309ScopeApp.init();