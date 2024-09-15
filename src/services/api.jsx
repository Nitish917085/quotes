import axios from "axios";

let token = "";

const handleLogin = async (username, otp) => {
  try {
    const authFrom = { username, otp };
    const header = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      "https://assignment.stage.crafto.app/login",
      authFrom,
      header
    );
    localStorage.setItem("token", response.data.token); // Save token in local storage
    token = response.data.token;
    return true;
  } catch (error) {
    if (error.status === 401) {
      alert("enter valid credentials");
      return false;
    } else alert("something  went wrong");

    return false;
  }
};

const fetchQuotes = async (offset) => {
  try {

    token = localStorage.getItem('token')
    const response = await axios.get(
      `https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${offset}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    if (error.status === 401) alert("Enter valid token, re-login");
    else alert("something  went wrong");

    return false;
  }
};

const handleUpload = async (formData) => {

      token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "https://crafto.app/crafto/v1.0/media/assignment/upload",
      formData
    );
    return response.data[0].url;
  } catch (error) {
    alert("Unable to upload, try again");
    throw error;
  }
};

const handleCreateQuote = async (text, mediaUrl) => {
      token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "https://assignment.stage.crafto.app/postQuote",
      {
        text,
        mediaUrl,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Quote Successfully created");

    return true;
  } catch (error) {
    alert("Failed to create quote, re-login");
    return false;
  }
};

export { handleLogin, handleCreateQuote, handleUpload, fetchQuotes };
