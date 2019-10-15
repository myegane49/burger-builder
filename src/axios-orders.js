import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-87d27.firebaseio.com/'
});

export default instance;