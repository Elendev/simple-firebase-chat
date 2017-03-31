/**
 * Created by jonas on 26.03.2017.
 */

import Vue from 'vue';
import App from './App.vue';

import Chatroom from './chatroom/Chatroom.vue';
import ChatroomList from './chatroom/ChatroomList.vue';

Vue.component('app', App);
Vue.component('chatroom', Chatroom);
Vue.component('chatroom-list', ChatroomList);


// Automatically bind MDL component
// Quick hack to handle MDL components requiring
// javascript to work
Vue.directive('mdl', {
    inserted: function(el) {
        componentHandler.upgradeElement(el);
    }
});


var app = new Vue({
    el: '#app'
});

