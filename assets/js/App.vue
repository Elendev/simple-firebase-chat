<template>
    <div class="loading" v-if="logued === null">Loading...</div>
    <div class="login" v-else-if="!logued"><button v-on:click="login">Login</button></div>
    <div class="app-panel" v-else="">
        <button v-on:click="createChatroom">Create new chatroom</button>
        <button v-on:click="joinChatroom">Join chatroom</button>
        <div class="chatroom-list-container">
            <chatroom-list v-bind:user="user" v-on:select="selectChatroom"></chatroom-list>
        </div>
        <div class="chatroom-container">
            <chatroom v-bind:chatroom="currentChatroom" v-bind:user="user"></chatroom>
        </div>

    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                logued: null,
                user: null,
                currentChatroom: null
            }
        },

        created: function() {
            var vm = this;
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    vm.$data.user = user;
                    vm.$data.logued = true;
                } else {
                    vm.$data.user = null;
                    vm.$data.logued = false;
                }
            });
        },

        methods: {
            login: function(event) {
                var provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function(result) {
                    var token = result.credential.accessToken;
                    var user = result.user;
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;

                    alert ('An error occured while login : ' + errorCode + ' - ' + errorMessage);
                });
            },
            createChatroom: function(event) {
                var chatroomName = prompt('Create new chatroom, please enter the name (format : [a-zA-Z0-9-_]+, min lenght: 2)');

                if (!chatroomName.match(/^[a-zA-Z0-9_-]+$/) || chatroomName.length < 2) {
                    alert('Please enter a name corresponding to [a-zA-Z0-9_-]+ pattern');
                    return;
                }

                firebase.database().ref('/chatrooms/' + chatroomName).set({
                    'owner': this.user.uid
                }).then(result => {
                    alert('Congratulation, Chatroom ' + chatroomName + ' created !');
                }, error => {
                    alert('An error occured, please try again');
                    console.log(error);
                });
            },
            joinChatroom: function(event) {
                var chatroomName = prompt('Chatroom Name');

                firebase.database().ref('/chatroom-list/' + this.user.uid + '/' + chatroomName).set(true)
                    .then(result => {
                        alert('Chatroom correctly added !');
                    }, error => {
                        alert('Impossible to add chatroom "' + chatroomName + '", please try with an other name');
                    })
            },
            selectChatroom: function(chatroomId) {
                this.currentChatroom = chatroomId;
            }
        }
    }

</script>