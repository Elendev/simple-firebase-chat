
export default class UserInfosService {
    constructor() {
        this.users = {};
    }

    getUser(userId) {
        return new Promise((resolve, reject) => {

            if (userId in this.users) {
                resolve(this.users[userId]);
            } else {
                firebase.database().ref('/users/' + userId).once('value', snapshot => {
                    this.users[userId] = snapshot.val();
                    resolve(snapshot.val());
                }).then(success => {}, reject );
            }

        });
    }
}