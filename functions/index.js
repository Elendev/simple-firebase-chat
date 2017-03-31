const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })

exports.addCreatedChatroomToOwner = functions.database.ref('/chatrooms/$chatroom_id')
    .onWrite(
        event => {
            const userId = event.data.val().owner;
            return admin.database().ref('/chatroom-list/' + userId + '/' + event.params.chatroom_id).set(true);
        }
    );