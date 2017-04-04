<template>

    <main class="message-list mdl-layout__content mdl-color--grey-100">
        <template v-if="user">
            <template v-if="chatroom">

                <div class="message-list__messages-container">
                    <div v-for="line in lines" v-bind:class="{'message-list__message': true, 'mdl-shadow--2dp': true, 'mdl-color-text--grey-600': true, 'mdl-color--blue-200': line.own, 'own': line.own}">

                            {{ line.message }}
                        <div class="author" v-if="line.author !== null">
                        <img :src="line.author.photoURL" class="author__image"> {{ line.author.displayName }}
                        </div>
                    </div>
                </div>

                <div class="message-list__input">

                    <div class="mdl-textfield mdl-js-textfield" v-mdl>
                        <input class="mdl-textfield__input" type="text" id="message" v-model="message" @keyup="sendMessage">
                        <label class="mdl-textfield__label" for="message">Type your message and send it using 'enter'...</label>
                    </div>

                    <!--<input type="text" v-model="message"> <button @click="sendMessage()">Submit</button>-->
                </div>

            </template>
            <div v-else class="chatroom">
                <h2>No chatroom selected</h2>
            </div>
        </template>
    </main>



</template>

<script>
    import UserInfoService from '../UserInfosService';

    var uis = new UserInfoService();

    export default {
        props: ['user', 'chatroom'],
        data() {
            return {
                lines: [],
                message: null,
                messagesRef: null,
            }
        },
        created: function() {
            this.displayChatroom();
        },
        watch: {
            chatroom: function() {
                this.displayChatroom();
            }
        },
        methods: {
            displayChatroom: function() {
                this.lines = [];

                if (this.messagesRef) {
                    this.messagesRef.off('child_added', this.addLine);
                    this.messagesRef = null;
                }

                if (this.chatroom) {
                    this.messagesRef = firebase.database().ref('/chatrooms-messages/' + this.chatroom);
                    this.messagesRef.on('child_added', this.addLine);
                }
            },
            addLine: function(snapshot) {
                const line = {
                    'timestamp': snapshot.val().timestamp,
                    'author' : null,
                    'message': snapshot.val().message,
                    'own': snapshot.val().user === this.user.uid,
                };

                uis.getUser(snapshot.val().user).then(value => {
                    line.author = value;
                });

                this.lines.push(line);
            },
            sendMessage: function(e) {
                if (e.keyCode !== 13) {
                    return;
                }

                var data = {
                    'timestamp': firebase.database.ServerValue.TIMESTAMP,
                    'user': this.user.uid,
                    'message': this.message,
                };

                firebase.database().ref('/chatrooms-messages/' + this.chatroom).push(data).then(success => {
                    console.log('Message sent !');
                    console.log(success);
                    this.message = null;
                }, error => {
                    console.log('An error occured');
                    console.log(error);
                    console.log(data);
                    alert('An error occured, please take a look at the console for detail');
                })
            }
        }
    }
</script>