import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-aea2b.firebaseio.com'
});

export default instance;