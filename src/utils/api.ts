import axios from 'axios';

 const  api=axios.create({
  baseURL:"https://8f40420d852c823273c059d9d491b230.serveo.net/api/",
    headers:{

        "Content-Type": "application/json",
    }
})

export  default  api ;
