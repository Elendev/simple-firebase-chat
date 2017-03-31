<template>
    <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header" v-mdl>
        <header class="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
            <div class="mdl-layout__header-row">
                <span class="mdl-layout-title">{{currentChatroom}}</span>
                <!--<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                    <label class="mdl-button mdl-js-button mdl-button--icon" for="search">
                        <i class="material-icons">search</i>
                    </label>
                    <div class="mdl-textfield__expandable-holder">
                        <input class="mdl-textfield__input" type="text" id="search">
                        <label class="mdl-textfield__label" for="search">Enter your query...</label>
                    </div>
                </div>-->
                <template v-if="logued">
                    <div class="mdl-layout-spacer"></div>
                    <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn" v-mdl>
                        <i class="material-icons">more_vert</i>
                    </button>
                    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="hdrbtn" v-mdl>
                        <li class="mdl-menu__item" v-on:click="createChatroom">Create new chatroom</li>
                        <li class="mdl-menu__item" v-on:click="joinChatroom">Join chatroom</li>
                    </ul>
                </template>
            </div>
        </header>

        <chatroom-list v-bind:user="user" v-on:select="selectChatroom" v-on:logout="logout"></chatroom-list>
        <chatroom v-bind:chatroom="currentChatroom" v-bind:user="user"></chatroom>

        <dialog class="mdl-dialog" id="init-dialog">
            <div class="mdl-dialog__content">
                <div class="loading" v-if="logued === null">Loading...</div>
                <div class="login" v-else-if="!logued">
                    <h3>Please connect to the chat</h3>
                </div>
            </div>
            <div v-if="logued === false" class="mdl-dialog__actions mdl-dialog__actions--full-width">
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" v-on:click="login" v-mdl>Login</button>
            </div>
        </dialog>


    </div>


</template>

<script>
    import dialogPolyfill from 'dialog-polyfill';

    export default {
        data: function() {
            return {
                logued: null,
                user: null,
                currentChatroom: null
            }
        },

        mounted: function() {

            var initDialog = this.$el.querySelector('#init-dialog');

            if (! initDialog.showModal) {
                dialogPolyfill.registerDialog(initDialog);
            }

            initDialog.showModal();


            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                    this.logued = true;

                    initDialog.close();

                    firebase.database().ref('/users/' + user.uid).set({
                        'displayName': user.displayName,
                        'photoURL': user.photoURL,
                    });

                } else {
                    this.user = null;
                    this.logued = false;
                    initDialog.showModal();
                }
            });
        },

        methods: {
            login: function(event) {
                var provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function(result) {
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error);

                    alert ('An error occured while login : ' + errorCode + ' - ' + errorMessage);
                });
            },
            logout: function() {
                firebase.auth().signOut();
                this.user = null;
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