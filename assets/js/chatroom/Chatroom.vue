<template>
    <div v-if="chatroom" class="chatroom">
        <h2>{{chatroom}}</h2>
        <ul>
            <h2>Chatroom</h2>
            <li v-for="line in lines">{{line.user}} - {{line.message}}</li>
        </ul>
        <input type="text" v-model="message"> <button @click="sendMessage()">Submit</button>
    </div>
    <div v-else class="chatroom">
        <h2>No chatroom selected</h2>
    </div>
</template>

<script>
    export default {
        props: ['user', 'chatroom'],
        data() {
            return {
                lines: [],
                message: null,
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
                if (this.chatroom !== null) {
                    firebase.database().ref('/chatrooms-messages/' + this.chatroom).on('child_added', snapshot => {
                        this.lines.push({
                            'timestamp': snapshot.val().timestamp,
                            'author' : snapshot.val().user,
                            'message': snapshot.val().message,
                        });
                    });
                }
            },
            sendMessage: function() {
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