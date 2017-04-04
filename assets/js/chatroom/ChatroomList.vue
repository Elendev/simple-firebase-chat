<template>
    <!--<div class="chatroom-list">
        <h2>Chatroom List</h2>
        <ul>
            <li v-for="chatroom in chatrooms" @click="selectChatroom(chatroom)">{{ chatroom.id }}</li>
        </ul>
    </div>-->


    <div class="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50" v-mdl>
        <template v-if="user">
            <header class="demo-drawer-header">
                <img :src="user.photoURL" class="demo-avatar">
                <div class="demo-avatar-dropdown">
                    <span>{{ user.displayName }}</span>
                    <div class="mdl-layout-spacer"></div>
                    <button id="accbtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" v-mdl>
                        <i class="material-icons" role="presentation">arrow_drop_down</i>
                        <span class="visuallyhidden">Accounts</span>
                    </button>
                    <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="accbtn" v-mdl>
                        <!--<li class="mdl-menu__item">hello@example.com</li>
                        <li class="mdl-menu__item">info@example.com</li>
                        <li class="mdl-menu__item"><i class="material-icons">add</i>Add another account...</li>-->
                        <li class="mdl-menu__item" @click="logout">Logout</li>
                    </ul>
                </div>
            </header>
            <nav class="demo-navigation mdl-navigation mdl-color--blue-grey-800">
                <!--<a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Home</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">inbox</i>Inbox</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">delete</i>Trash</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">report</i>Spam</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">forum</i>Forums</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">flag</i>Updates</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">local_offer</i>Promos</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">shopping_cart</i>Purchases</a>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Social</a>-->
                <a class="mdl-navigation__link" v-for="chatroom in chatrooms" @click="selectChatroom(chatroom)">{{ chatroom.id }}</a>
                <div class="mdl-layout-spacer"></div>
                <a class="mdl-navigation__link" href=""><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">help_outline</i><span class="visuallyhidden">Help</span></a>
            </nav>
        </template>
    </div>

</template>

<script>
    export default {
        props: ['user'],
        data: function() {
            return {
                chatrooms: [],
                chatroomListRef: null,
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
                if (!this.user) {
                    if (this.chatroomListRef) {
                        this.chatroomListRef.off('value', this.onValueChange);
                        this.chatroomListRef = null;
                    }
                } else {
                    this.chatroomListRef = firebase.database().ref('/chatroom-list/' + this.user.uid);
                    this.chatroomListRef.on('value', this.onValueChange);
                }
            },

            onValueChange: function(snapshot) {
                this.chatrooms = [];

                snapshot.forEach(childSnapshot => {
                    this.chatrooms.push({
                        'owner': childSnapshot.val().owner,
                        'id': childSnapshot.key
                    });
                });
            },
            selectChatroom: function(chatroom) {
                this.$emit('select', chatroom.id);
            },
            logout: function() {
                this.$emit('logout');
            },
        }
    }
</script>