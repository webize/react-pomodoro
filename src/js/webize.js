var webize = {}

webize.save = function() {
  if (!webize.storage) return;

  var origin = location.origin.replace(/.*?:\/\//g, "");

  var uri = webize.storage + webize.containerName + origin;

  var state = JSON.parse(localStorage.getItem('state'))
  var turtle = '';
  turtle += '<'+origin+'> <urn:localStorage:time> "'+ state.time +'" .'
  console.log(turtle)

  solid.web.put(uri, turtle).then(
    function(solidResponse) {
      console.log(solidResponse)
      notie.alert(1, 'localStorage saved!');
      // The resulting object has several useful properties.
      // See lib/solid-response.js for details
      // solidResponse.url - value of the Location header
      // solidResponse.acl - url of acl resource
      // solidResponse.meta - url of meta resource
    }
  ).catch(function(err){
    notie.alert(1, err);
    console.log(err) // error object
    console.log(err.status) // contains the error status
    console.log(err.xhr) // contains the xhr object
  })

}

webize.load = function() {
  if (!webize.storage) return;

  var origin = location.origin.replace(/.*?:\/\//g, "");

  var uri = webize.storage + webize.containerName + origin;


  solid.web.get(uri)
    .then(function(response) {
      if (response.isContainer()) {
        // This is an instance of SolidContainer, see Listing Containers below
        for (resourceUrl in response.resources) {
          // iterate over resources
        }
        for (subcontainerUrl in response.containers) {
          // iterate over sub-containers
        }
      } else {
        // Regular resource
        console.log('Raw resource: %s', response.raw())
        notie.alert(1, 'localStorage loaded!');

        var graph = response.parsedGraph()
        // Print all statements matching resources of type foaf:Post
        var st = graph.statements[0].object.value;
        console.log(st)
        localStorage.setItem('state', JSON.stringify({"time" : st }))

      }
    })
    .catch(function(err) {
        notie.alert(1, err);
        console.log(err) // error object
      // ...
     })
}


webize.createContainer = function() {
  var parentDir = 'https://example.org/'
  var slug = 'localStorage'
  var data = '<#this> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/sioc/ns#Space> .'
  var isContainer = true

  solid.web.post(webize.storage, data, slug, true).then(
    function(solidResponse) {
      console.log(solidResponse)
      // The resulting object has several useful properties.
      // See lib/solid-response.js for details
      // solidResponse.url - value of the Location header
      // solidResponse.acl - url of acl resource
      // solidResponse.meta - url of meta resource
      notie.alert(1, 'localStorage container set up : ' + url);

    }
  ).catch(function(err){
    notie.alert(1, err);
    console.log(err) // error object
    console.log(err.status) // contains the error status
    console.log(err.xhr) // contains the xhr object
  })

}

webize.login = function() {
  // Get the current user
  solid.auth.login().then(function(webid){
    // authentication succeeded; do something with the WebID string
    notie.alert(1, 'Success!  You are logged in as : ' + webid);

    solid.identity.getProfile(webid).then(function (parsedProfile) {
      console.log('getProfile result: %o', parsedProfile)
      console.log('Account storage root: %s', parsedProfile.storage) // array of URIs })
      webize.storage = parsedProfile.storage[0];
      console.log(webize.storage);
      notie.alert(1, 'storage found at : ' + webize.storage);

      var url = webize.storage + webize.containerName;
      solid.web.get(url).then(
        function(response) {
          console.log('Raw resource: %s', response.raw())
        }
      ).catch(
        function(err) {
          console.log(err) // error object
          this.createContainer()
        }
      )
    });

    webize.user = webid;
    window.user = webid;
  }).catch(function(err) {
    // authentication failed; display some error message
    alert(err);
  });
};

webize.bindKeys = function() {
  document.addEventListener('keydown', function(e){
    if(e.keyCode == 76 && (e.ctrlKey || e.metaKey)){
      e.preventDefault()
      webize.login();
      return false;
    }

    if(e.keyCode == 83 && (e.ctrlKey || e.metaKey)){
      e.preventDefault()
      webize.save()
      return false
    };


    if(e.keyCode == 79 && (e.ctrlKey || e.metaKey)){
      e.preventDefault()
      webize.load()
      return false;
    };


  });

}
