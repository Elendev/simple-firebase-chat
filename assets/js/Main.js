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

var app = new Vue({
    el: '#app'
});



/*import Person from './namespace/Person';

class Main {

    test() {
        var person = new Person('toto');
        console.log('Test method executed');
        console.log(person.getName());
    }

}


var main = new Main();

main.test();

alert('tata');*/