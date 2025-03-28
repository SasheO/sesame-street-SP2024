/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const firebase = require("firebase-admin");
const functions = require("firebase-functions");
// const algoliasearch = require("algoliasearch");
const express = require("express");
const app = express();
const firebase = require("firebase-admin");

firebase.initializeApp(functions.config().firebase);
const db = firebase.firestore();
const cors = require("cors"); // -angelica
app.use(express.json()); // Middleware to parse JSON body
app.use(cors({origin: true})); // Enable CORS for frontend access

// // for full text search of forums
// const APP_ID = functions.config().algolia.app;
// const ADMIN_KEY = functions.config().algolia.key;
// const client = algoliasearch(APP_ID, ADMIN_KEY);
// const index = client.initIndex("carelink_forums");

app.get("/embedded_google_search", (req, res) => {
  try {
    res.status(200).json({message: "Google Search API Endpoint"});
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
  }
  const API_KEY = "AIzaSyC6KoJ7n8zPos4Md5EJoddoKRGDaUsvSMk";
  const CX = "e2d3ac9f4a49e4eba";

  async function searchGoogle(query) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      displayResults(data.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  function displayResults(results) {
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";

    if (!results) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    results.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.snippet}</p>
            `;
      resultsDiv.appendChild(resultItem);
    });
  }

  document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (query) {
      searchGoogle(query);
    }
  });
});

app.get("/embedded_google_maps", (req, res) => { // each endpoint of app should be expressed here as well as in ..\firebase.json hosting
  try {
    res.status(200).json({message: "Google Maps API Endpoint"});
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
  }
  src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAWwwRByaGji1A_HnKGHRBabtcFyDP0Xus&callback=initMap";
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
    });
    const input = document.getElementById("searchInput");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    const infowindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35),
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ""),
          (place.address_components[1] && place.address_components[1].short_name || ""),
          (place.address_components[2] && place.address_components[2].short_name || ""),
        ].join(" ");
      }

      infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + address);
      infowindow.open(map, marker);

      // Location details
      for (let i = 0; i < place.address_components.length; i++) {
        if (place.address_components[i].types[0] == "postal_code") {
          document.getElementById("postal_code").innerHTML = place.address_components[i].long_name;
        }
        if (place.address_components[i].types[0] == "country") {
          document.getElementById("country").innerHTML = place.address_components[i].long_name;
        }
      }
      document.getElementById("location").innerHTML = place.formatted_address;
      document.getElementById("phone_number").innerHTML = place.formatted_phone_number;
      document.getElementById("website").innerHTML = place.website;
      document.getElementById("business_hours").innerHTML = place.opening_hours.weekday_text;
      document.getElementById("currently_open").innerHTML = place.opening_hours.open_now;
      document.getElementById("lat").innerHTML = place.geometry.location.lat();
      document.getElementById("lon").innerHTML = place.geometry.location.lng();
      showCallPrompt(place.formatted_phone_number);
    });
  }

  function showCallPrompt(phoneNumber) {
    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (!isIOS) {
      alert("This feature is only available on iOS devices.");
      return;
    }

    const confirmation = confirm(`Would you like to call ${phoneNumber}?`);

    if (confirmation) {
      window.location.href = `tel:${phoneNumber}`;
    }
  }
});

// Start server only if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


app.post("/sign_up", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const _firstName = req.body.first_name;
  const _surname = req.body.surname;
  // const _gender = req.body.gender;

  console.log("Received request:", req.body);

  // check that values are not empty and return accurate error message
  if (email === "" || !email) {
    // strValue was empty string
    return res.status(400).json({message:
      "email or password inaccurately entered"});
  }
  if (password === "" || !password) {
    // strValue was empty string
    return res.status(400).json({message:
      "email or password inaccurately entered"});
  }
  if (_firstName === "" || !_firstName) {
    // strValue was empty string
    return res.status(422).json({message: "no first  name entered"});
  }
  if (_surname === "" || !_surname) {
    // strValue was empty string
    return res.status(422).json({message: "no surname  name entered"});
  }


  // // ORIGINAL SIGN_UP: (COMMENTED OUT)
  // const _userType = req.body.user_type;
  // if (!(_userType==="practitioner" || _userType==="patient")) {
  //   return res.status(422).json({message: "invalid user type"});
  // }


  // firebase.auth().createUser({
  //   email: email,
  //   emailVerified: false,
  //   password: password,
  //   displayName: _firstName+" "+_surname,
  // })
  //     .then((userCred) => {
  //       let userData = {};
  //       // const user = userCred.user;
  //       const _uid = userCred.uid;

  //       if (_userType=="patient") {
  //         if (!("dob" in req.body)) {
  //           return res.status(422).json({message: "no dob entered"});
  //         }
  //         const dateSt = req.body.dob;
  //         const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
  //         const _dob = new Date(dateSt.replace(pattern, "$3-$2-$1"));
  //         if (_dob === "Invalid Date" || isNaN(_dob)) {
  //           return res.status(422).json({message: "invalid dob format"});
  //         }
  //         userData = {
  //           // all these are required fields for patients
  //           uid: _uid,
  //           dob: _dob,
  //           userType: _userType,
  //           gender: _gender,
  //           first_name: _firstName,
  //           surname: _surname,
  //         };

  //         // optional fields below
  //         if ("preferred_lang" in req.body) {
  //           userData["preferred_lang"] = req.body.preferred_lang;
  //         } else {
  //           userData["preferred_lang"] = null;
  //         }
  //         if ("gender" in req.body && !(req.body.gender==="")) {
  //           userData["gender"] = req.body.gender;
  //         } else {
  //           userData["gender"] = null;
  //         }
  //       } else if (_userType=="practitioner") { // userType = practitioner
  //         userData = {
  //           // all these are required fields for healthcare practictioners
  //           uid: _uid,
  //           userType: _userType,
  //           first_name: _firstName,
  //           surname: _surname,

  //         };

  //         if ("specialty" in req.body) {
  //           if (req.body.specialty==="") {
  //             return res.status(422).json({message:
  //                   "no specialty entered"});
  //           }
  //           userData["specialty"] = req.body.specialty;
  //         } else {
  //           return res.status(422).json({message: "no specialty entered"});
  //         }

  //         if ("certification" in req.body) {
  //           if (req.body.certification==="") {
  //             return res.status(422).json({message:
  //                   "no certification provided"});
  //           }

  //           userData["certification"] = req.body.certification;
  //         } else {
  //           return res.status(422).json({message:
  //             "no certification entered"});
  //         }


  //         // optional fields below
  //         if ("hospital_id" in req.body) {
  //           userData["hospital_id"] = req.body.hospital_id;
  //         } else {
  //           userData["hospital_id"] = null;
  //         }
  //         if ("gender" in req.body && !(req.body.gender==="")) {
  //           userData["gender"] = req.body.gender;
  //         } else {
  //           userData["gender"] = null;
  //         }
  //       }

  //       // ensure empty values are converted to null
  //       for (const [key, value] of Object.entries(userData)) {
  //         if (value=="") {
  //           userData[key]=null;
  //         }
  //       }

  //       // upload user record to user collections in firestore
  //       const userRef = db.collection("user");
  //       userRef.doc().set(userData).then(() =>{
  //         // TODO: set up all other user info being saved, log it to the
  //         console.log("Successfully created new user:"+userCred.uid);
  //         res.status(200).json({message: "Successfully created new user:"});
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("Error: "+error.code+" "+error.message);
  //       res.status(500).json({error: "Some error has occured..."});
  //     // res.send("Error: "+error.code);
  //     });
  // // END OF ORIGINAL SIGN_UP: (COMMENTED OUT)

  // // FULLSTACK SIGN_UP
  // Automatically assign "patient" or another default
  const _userType = "patient";

  try {
    console.log("🛠 Creating user...");
    const userRecord = await firebase.auth().createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: _firstName+" "+_surname,
    });
    const _uid = userRecord.uid;
    console.log("✅ User Created:", _uid);
    const userData = {
      uid: _uid,
      first_name: _firstName,
      surname: _surname,
      email,
      user_type: _userType,
    };

    await db.collection("users").doc(_uid).set(userData);
    console.log("✅ User Data Saved to Firestore:", _uid);
    res.status(200).json({message: "User created successfully", uid: _uid});
  } catch (error) {
    console.error("Firebase Sign-Up Error:", error);
    res.status(500).json({error: error.message});
  }
// // END OF FULLSTACK SIGN_UP
});

app.post("/edit_profile", (req, res) => {
  // TODO: do stuff in sign_up like if no gender given, set user gender to none
  const idToken = req.body.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;
        console.log(uid);
        const userRef = db.collection("user");
        await userRef.where("uid", "==", uid).get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0];
                const userType = user.data()["user_type"];
                if (userType === "patient") {
                  // update patient values from request:
                  // first_name, surname, dob, preferred_lang, gender
                  if ("first_name" in req.body) {
                    if (req.body.first_name==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      // TODO: User must have first name
                    } else {
                      user.ref.update({first_name: req.body.first_name});
                    }
                  }
                  if ("surname" in req.body) {
                    if (req.body.surname==="") {
                      // return res.status(422)
                      //       .json({message: "no first_name entered"});
                      console.log("no surname entered");
                      // TODO: User must have surname
                    } else {
                      user.ref.update({surname: req.body.surname});
                    }
                  }
                  if ("preferred_lang" in req.body) {
                    if (req.body.preferred_lang==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no preferred_lang entered");
                      user.ref.update({preferred_lang: null});
                    } else {
                      user.ref
                          .update({preferred_lang: req.body.preferred_lang});
                    }
                  }

                  if ("gender" in req.body) {
                    if (req.body.gender==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no gender entered");
                      user.ref.update({gender: null});
                    } else {
                      user.ref.update({gender: req.body.gender});
                    }
                  }
                  if ("dob" in req.body) {
                    if (req.body.dob==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no dob entered");
                      // TODO: user must have dob
                    } else {
                      const dateSt = req.body.dob;
                      const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
                      const _dob = new Date(dateSt
                          .replace(pattern, "$3-$2-$1"));
                      if (_dob === "Invalid Date" || isNaN(_dob)) {
                        // return res.status(422)
                        //    .json({message: "invalid dob format"});
                        console.log("invalid dob format");
                      } else {
                        user.ref.update({dob: _dob});
                      }
                    }
                  }
                  return res.status(200).json({message: "Edited user profile"});
                } else if (userType=="practitioner") {
                  // update practitioner values from request:
                  // first_name, surname, specialty, certification

                  if ("first_name" in req.body) {
                    if (req.body.first_name==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                    } else {
                      user.ref.update({first_name: req.body.first_name});
                    }
                  }
                  if ("surname" in req.body) {
                    if (req.body.surname==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no surname entered");
                    } else {
                      user.ref.update({surname: req.body.surname});
                    }
                  }
                  if ("certification" in req.body) {
                    if (req.body.certification==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no certification entered");
                      // TODO: user must have certification.
                      // also should be system to verify certification
                    } else {
                      user.ref.update({certification: req.body.certification});
                    }
                  }
                  if ("specialty" in req.body) {
                    if (req.body.specialty==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no specialty entered");
                      // TODO: user must have specialty
                    } else {
                      user.ref.update({specialty: req.body.specialty});
                    }
                  }
                  if ("gender" in req.body) {
                    if (req.body.gender==="") {
                      // return res.status(422)
                      //      .json({message: "no first_name entered"});
                      console.log("no gender entered");
                      user.ref.update({gender: null});
                    } else {
                      user.ref.update({gender: req.body.gender});
                    }
                  }
                  return res.status(200).json({message: "Edited user profile"});
                }
              } else {
                return res.status(401).json({message:
                  "Invalid user credentials"});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(401).json({message: "Invalid user credentials"});
      });
});

app.post("/user_profile", (req, res) => {
  const idToken = req.body.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;
        console.log("uid: "+uid);

        const userRef = db.collection("user");

        await userRef.where("uid", "==", uid).get().then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // return user data to client without revealing UID info
            const user = querySnapshot.docs[0];
            const userData = user.data();
            if ("dob" in userData) {
              // convert dob to right format from timestamp
              userData["dob"] = new Date(1000*userData["dob"]["_seconds"]);
            }
            delete userData["uid"];
            return res.status(200).json({user_info: userData});
          } else {
            return res.status(401).json({message: "Invalid user credentials"});
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(401).json({message: "Invalid user credentials"});
      });
});

app.get("/forums", async (req, res) => {
  // this only returns a forum with a given id and its replies
  const forumId = req.query.forum_id;
  const forumRef = db.collection("forum");
  const userRef = db.collection("user");
  if (!(!forumId)||forumId!=="") {
    // if user is searching for particular forum post.
    // for example, user clicks on a forum from search results.
    // this will give the expanded info on the forum
    // this should also give first level replies of that forum post

    // TODO: get forumRef by id and its replies
    forumRef.doc(forumId).get()
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const forumPost = querySnapshot.data();
            const createdBy = forumPost["created_by"];
            console.log(createdBy);
            await userRef.where("uid", "==", createdBy)
                .get().then(async (_querySnapshot) => {
                  if (!_querySnapshot.empty) {
                    // return user data to client without revealing UID info
                    const user = _querySnapshot.docs[0];
                    const userData = user.data();
                    forumPost["created_by"]=userData["first_name"]+
                    " "+userData["surname"];
                    await forumRef
                        .doc(forumId).collection("replies").get()
                        .then((repliesSnapshot) => {
                          if (!repliesSnapshot.empty) {
                            const replies = [];
                            for (const item of repliesSnapshot.docs) {
                              replies.push(item.id);
                            }
                            return res.status(200)
                                .json(
                                    {forum_post: forumPost, replies: replies});
                          } else {
                            return res.status(200)
                                .json({forum_post: forumPost, replies: null});
                          }
                        });
                  } else {
                    // if user is deleted, indicate so
                    forumPost["created_by"]="this user has been deleted";
                    await forumRef
                        .doc(forumId).collection("replies").get()
                        .then((repliesSnapshot) => {
                          if (!repliesSnapshot.empty) {
                            const replies = [];
                            for (const item of repliesSnapshot.docs) {
                              replies.push(item.id);
                            }
                            return res.status(200)
                                .json(
                                    {forum_post: forumPost, replies: replies});
                          } else {
                            return res.status(200)
                                .json({forum_post: forumPost, replies: null});
                          }
                        });
                  }
                });
          }
        });
  } else {
    return res.status(422).json({message: "no forum id entered"});
  }
});

app.get("/myforums", async (req, res) => {
  // get and verify user token
  // return all original posts by given user
  const idToken = req.query.idToken; // verify that user is logged in
  const forumRef = db.collection("forum");
  if (idToken==null) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        console.log("decodedToken.uid "+decodedToken.uid);
        await forumRef.where("created_by", "==", decodedToken.uid).get()
            .then(async (querySnapshot) => {
              if (!querySnapshot.empty) {
                const myForumPosts = [];
                for (const item of querySnapshot.docs) {
                  myForumPosts.push(item);
                }
                return res.status(200).json({forum_posts: myForumPosts});
              } else {
                return res.status(200).json({forum_posts: []});
              }
            });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({error: "Some error has occured..."});
      });
});

app.post("/post_forum", (req, res) => {
  const idToken = req.body.idToken; // verify that user is logged in
  if (idToken==null) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const _createdBy = decodedToken.uid;
        console.log("created by uid: "+_createdBy);
        const createdAtDateSt = req.body.created_at;
        const _tags = req.body.tags;
        const _title = req.body.title;
        const _postDescription = req.body.post_description; // post's content
        const _repliedToId = req.body.replied_to_id;
        const _rootForumId = req.body.root_forum_id;

        // ensure the format is good format
        if (createdAtDateSt===""|| !createdAtDateSt) {
          return res.status(422).json({message: "no created_at entered"});
        }
        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        const _createdAt = new Date(createdAtDateSt
            .replace(pattern, "$3-$2-$1"));
        if (_createdAt === "Invalid Date" || isNaN(_createdAt)) {
          return res.status(422).json({message:
            "invalid created_at format: should be mm-dd-yyyy"});
        }

        if (_postDescription===""|| !_postDescription) {
          return res.status(422).json({message: "no post_description entered"});
        }
        const forumData = {
          // all these are required fields.
          // except post description which is empty
          created_by: _createdBy,
          created_at: _createdAt,
          post_description: _postDescription,
        };

        const forumRef = db.collection("forum");
        if (_repliedToId===""|| !_repliedToId) {
          // this is an original post
          if (_title===""|| !_title) {
            return res.status(422).json({message: "no title entered"});
          }
          forumData["title"] = _title;


          if (!_tags||_tags==="") {
            forumData["tags"] = null;
          } else {
            forumData["tags"] = _tags;
          }

          const newForumPost = forumRef.doc();
          forumData["root_forum_id"] = newForumPost.id;
          forumData["replied_to_id"] = null;
          newForumPost.set(forumData).then(() =>{
            // TODO: set up all other user info being saved, log it to the
            console.log("Successfully created forum post: "+ newForumPost.id);
            return res.status(200).json({message:
                  "Successfully created forum post"});
          });
        } else {
          // this is a reply post
          if (_rootForumId===""|| !_rootForumId) {
            // a reply must have the root parent
            // post id which should be the same as the reply id
            console.log("Error: This reply post does not have a root forum id");
            return res.status(422).json({message:
                  "Reply post format inaccurately formatted"});
          } else {
            // search and retrieve the root forum by its id.
            // if it doesn;t exist, return error message.
            // if it exists, check for the replied to id.
            // if replied to id does not exist in forums,
            // return error message.
            // if replied to id exists in root forum replies,
            // then create the forum wiht the appropriate fields
            // as a child of root forum id in firestore:
            // root forum id and replied to id
            const repliedToPost = await forumRef.doc(_repliedToId).get();
            const repliedPostData = repliedToPost.data();
            if (repliedPostData==null) {
              return res.status(422).json({message:
                  "The post you are replying to does not exist"});
            }
            if (repliedPostData["root_forum_id"]!==_rootForumId) {
              console.log("Root forum id not equal");
              return res.status(422)
                  .json({message: "Badly formatted forum reply"});
            }
            if (_postDescription===""|| !_postDescription) {
              console.log("Error: no body text/post description");
              return res.status(422).json({message:
                  "Incorrect format: no body text/post description"});
            }


            forumData["replied_to_id"]= _repliedToId;
            forumData["root_forum_id"] = repliedPostData["root_forum_id"];

            const repliesRef = await forumRef.doc(_repliedToId)
                .collection("replies");
            repliesRef.doc().set(forumData).then(() =>{
              return res.status(200).json({message: "Reply created"});
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({error: "Some error has occured..."});
      });
});

app.post("/send_doctor_connection_request", (req, res) => {
  // user should be logged in patient
  // they should send the doctor they want to connect with
  // info:
  // a. Doctor id
  // b. patient id
  // c. user alert level (1 mild, 2 moderate, 3 severe)
  // d. general background of user (i.e. user name, gender, age)
  // e. Symptoms
  // f. Doctor notes (initialized to null, updated when doctor  gives one)
  // g. contact information of patient (phone number)
  // h. Status of accepted or rejected or pending
  // i. Doctor message to patient (initialized as null, will be populated when the doctor accepts or deletes)
  // j. Timestamp received (created on backend)
  // Patient not allowed to send a new request to same practitioner if existing on less than two weeks old
  const idToken = req.body.idToken;

  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  const _practitionerUID = req.body.practitioner_id;
  if (_practitionerUID==null||_practitionerUID==="") {
    console.log("_practitionerUID==null||_practitionerUID===''");
    return res.status(422).json({message: "No practitioner_id given"});
  }

  const _requestAlertLevel = req.body.alert_level;
  if (!([1,2,3].includes(_requestAlertLevel))) {
    console.log("Invalid value for _requestAlertLevel");
    return res.status(422).json({message: "Invalid value for alert_level"});
  }

  const _symptoms = req.body.symptoms;
  if (_symptoms === undefined || _symptoms.length == 0) {
    console.log("_symptoms === undefined || _symptoms.length == 0");
    return res.status(422).json({message: "No symptoms given"});
  }

  const _patientPhoneNumber = req.body.phone_number;
  // TODO: check if phone number is in phone number format
  // this currently just checks if the phone number is givens
  if (_patientPhoneNumber==null||_patientPhoneNumber==="") {
    console.log("_patientPhoneNumber==null||_patientPhoneNumber===''");
    return res.status(422).json({message: "No phone_number given"});
  }

  const _doctorNotes = null;
  const _practictionerMessageToPatient = null;

  const _status = "pending";

  firebase.auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        const _patientUID = decodedToken.uid;
        console.log("patientUID: "+_patientUID);
        
        // check if uid is patient
        const userRef = db.collection("user");
        await userRef.where("uid", "==", _patientUID).get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            // return user data to client without revealing UID info
            console.log("user is logged in but not in user collection");
            return res.status(500).json({message: "Some error has occurred..."});
          }
          else{
            const user = querySnapshot.docs[0];
            // TODO: change logging in to "user_type" in firestore for uniform camel case there.
            // TODO: then change to user.data()["user_type"]
            const userType = user.data()["userType"];
            if (userType!=="patient"){
              return res.status(401).json({message: "Wrong user type for this request"});
            }
          }
        });

        // confirm _practitionerUID belongs to an actual doctor
        await userRef.where("uid", "==", _practitionerUID).get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            // return user data to client without revealing UID info
            return res.status(422).json({message: "Doctor does not exist"});
          }
          else{
            const user = querySnapshot.docs[0];
            // TODO: change logging in to "user_type" in firestore for uniform camel case there.
            // TODO: then change to user.data()["user_type"]
            const userType = user.data()["userType"];
            if (userType!="practitioner"){
              return res.status(422).json({message: "Doctor does not exist"});
            }
          }
        })

        // TODO here: check if user already has rejected request with doctor less than 2 weeks old

        doctorPatientConnectionRequest = {
          // all these are required fields for patients
          patientUID: _patientUID,
          practitionerUID: _practitionerUID,
          request_alert_level: _requestAlertLevel,
          symptoms: _symptoms,
          doctor_notes: _doctorNotes,
          practictioner_message_to_patient: _practictionerMessageToPatient,
          patient_phone_number: _patientPhoneNumber,
          status: _status,
          created_at: Date.now(), // timestamp created in milliseconds
        };

        console.log(doctorPatientConnectionRequest);

        const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
        doctorPatientConnectionRef.doc().set(doctorPatientConnectionRequest).then((request) =>{
          // TODO: set up all other user info being saved, log it to the
          console.log("Successfully sent request");
          return res.status(200).json({message: "Successfully sent request"});
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({message: "Some error has occurred..."});
        });

      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({message: "Some error has occurred..."});
      });
  
});

app.get("/my_doctor_requests", (req, res) => {
  // user should be logged in patient
  // show them requests sent
  // divide results into pending vs accepted vs rejected
  // return all requests as well as pending, accepted, rejected as separate lists
  const idToken = req.query.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is patient
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      await doctorPatientConnectionRef.where("patientUID", "==", decodedToken.uid).get()
          .then(async (querySnapshot) => {
            if (!querySnapshot.empty) {
              const myDoctorRequests = [];
              for (const item of querySnapshot.docs) {
                myDoctorRequests.push(item);
              }
              return res.status(200).json({doctor_requests: myDoctorRequests});
            } else {
              return res.status(200).json({doctor_requests: []});
            }
          });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({message: "Some error has occurred..."});
  });
});

app.post("/delete_doctor_requests", (req, res) => {
  // user should be logged in patient
  // should provide id of doctor request
  // delete it
  const idToken = req.body.idToken;
  const _requestID = req.body.request_id;

  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  if (_requestID==null||_requestID==="") {
    console.log("_requestID==null||_requestID===''");
    return res.status(422).json({message: "No request_id given"});
  }

  firebase.auth()
  .verifyIdToken(idToken)
  .then(async (decodedToken) => {
    const currentUserUID = decodedToken.uid;
    console.log("_currentUserUID: "+currentUserUID);
    // check if logged in user is the one on the request.
    // delete if so
    // else give this request does not exist error
    const doctorPatientConnectionRef = db.collection("doctor_patient_connection");

    doctorPatientConnectionRef.doc(_requestID).get()
    .then(async (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doctorPatientConnectionRequest = querySnapshot.data();
        if (doctorPatientConnectionRequest==undefined){
          return res.status(500).json({message: "Some error has occurred..."});
        }
        if (doctorPatientConnectionRequest.patientUID===currentUserUID){
          querySnapshot.ref.delete();
          return res.status(200).json({message: "Request deleted successfully"});
        }
        else{
          return res.status(204).json({message: "Your request with this request_id was not found"});
        }
      }
      else{
        return res.status(204).json({message: "Your request with this request_id was not found"});
      }
    });

  })
  .catch((error) => {
    console.log(error);
    return res.status(500).json({message: "Some error has occurred..."});
  });
});

app.get("/my_patient_requests", (req, res) => {
  // user should be logged in practitioner
  // return all requests by still existing users
  const idToken = req.query.idToken;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is practitioner
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      await doctorPatientConnectionRef.where("practitionerUID", "==", decodedToken.uid).get()
          .then(async (querySnapshot) => {
            if (!querySnapshot.empty) {
              // TODO: divide results into pending vs accepted vs rejected
              // return all requests as well as pending, accepted, rejected as separate lists
              const myPatientRequests = [];
              for (const item of querySnapshot.docs) {
                myPatientRequests.push(item);
              }
              return res.status(200).json({patient_requests: myPatientRequests});
            } else {
              return res.status(200).json({patient_requests: []});
            }
          });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({message: "Some error has occurred..."});
  });
});

app.post("/edit_patient_requests", (req, res) => {
  // user should be logged in practitioner
  // if pending status:
  // accept or reject based
  // display message
  // if rejectd status:
  // can change to accepted
  // if accepted status: 
  // edit fields
  // OR move patient into previous patients by changing status to previous
  const idToken = req.body.idToken;
  const _requestID = req.body.request_id;
  const _status = req.body.status;
  const _doctorNotes = req.body.doctor_notes;
  if (idToken==null ) {
    console.log("idToken==null");
    return res.status(401).json({message: "User is not logged in"});
  }

  // TODO here: check if the user type is practitioner
  // if not, return an error of invalid user type (mayber code 422?)

  const doctorPatientConnectionRef = db.collection("doctor_patient_connection");
  firebase.auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const currentUserUID = decodedToken.uid;
      // TODO retrieve connection request with given ID
      // check if it is for the current doctor
      doctorPatientConnectionRef.doc(_requestID).get()
      .then(async (docSnapshot) => {
        // TODO: is this right?
        // https://firebase.google.com/docs/firestore/manage-data/add-data#web_3
        if (docSnapshot.exists) {
          const doctorPatientConnectionRequest = docSnapshot;
          if (doctorPatientConnectionRequest.data().practitionerUID===currentUserUID){
            if (['accepted', 'previous', 'rejected'].includes(_status)){
              doctorPatientConnectionRef.doc(_requestID).update({
                status: _status,
            })
            .then(() => {
              console.log("Patient request successfully edited!")
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                return res.status(501).json({message: "Error updating document..."});
            });
            return res.status(200).json({message: "Patient request successfully edited!"});

            }
            if (!(!_doctorNotes)&&_doctorNotes!==""){
              doctorPatientConnectionRef.doc(_requestID).update({
                doctor_notes: _doctorNotes
            })
            .then(() => {
              console.log("Patient request successfully edited!")
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                return res.status(501).json({message: "Error updating document..."});
            });
            return res.status(200).json({message: "Patient request successfully edited!"});
            }
            return res.status(422).json({message: "Request not fulfilled"});
          }
          else{
            return res.status(403).json({message: "Your request with this request_id was not found"});
          }
        }
        else{
          return res.status(403).json({message: "Your request with this request_id was not found"});
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({message: "Some error has occurred..."});
  });
});

// TODO: don't think i can sign in or out with

exports.app = onRequest(app); // exports.'app' is the app in firebase.json
// Export for testing
// module.exports = app;
// exports.api = functions.https.onRequest
