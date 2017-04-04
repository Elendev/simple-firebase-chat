const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.addCreatedChatroomToOwner = functions.database.ref('/chatrooms/{chatroom_id}')
    .onWrite(
        event => {
            const userId = event.data.val().owner;
            return admin.database().ref('/chatroom-list/' + userId + '/' + event.params.chatroom_id).set(true);
        }
    );





