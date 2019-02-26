import axios from "axios";

export const sendPostRequest = (endpoint, data) => {
  return new Promise((res, rej) => {
    //Send HTTP Post request
    axios
      .post(
        "https://europe-west1-studienarbeit.cloudfunctions.net/" + endpoint,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        res(response);
      })
      .catch(error => {
        console.log(error)
        rej(null);
      });
  });
};
