<template>
    <div class="chatroom-list">
        <h2>Chatroom List</h2>
        <ul>
            <li v-for="chatroom in chatrooms" @click="selectChatroom(chatroom)">{{ chatroom.id }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['user'],
        data: function() {
            return {
                chatrooms: [],
            }
        },
        created: function() {
            this.loadChatroomList();
        },
        watch: {
            user: function(value) {
                this.loadChatroomList();
            }
        },
        methods: {
            loadChatroomList: function() {
                var me = this;
                firebase.database().ref('/chatroom-list/' + this.user.uid).on('value', function(snapshot) {
                    me.chatrooms = [];

                    snapshot.forEach(function(childSnapshot) {
                        var chatroomId = childSnapshot.key;
                        var chatroom = childSnapshot.val();

                        me.chatrooms.push({
                            'owner': chatroom.owner,
                            'id': chatroomId
                        });
                    });
                });
            },
            selectChatroom: function(chatroom) {
                this.$emit('select', chatroom.id);
            }
        }
    }
</script>