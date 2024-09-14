import axios from "axios"

let token =""

const handleLogin = async (username, otp) => {
    console.log("login")
    try {
        const authFrom = { username, otp }
        const header = { headers: { 'Content-Type': 'application/json' } }
        const response = await axios.post('https://assignment.stage.crafto.app/login', authFrom, header);

        localStorage.setItem('token', response.data.token); // Save token in local storage

        token=response.data.token

        console.log(response.data)
        return response

    } catch (error) {
        console.error('Login failed', error);
    }
};
const fetchQuotes = async (offset) => {
    try {
        const response = await axios.get(`https://assignment.stage.crafto.app/getQuotes?limit=80&offset=${offset}`, {
            headers: {
                'Authorization': token,
            },
        });

        console.log("data",response.data)
        return response.data.data
    } catch (error) {
        console.error('Failed to fetch quotes', error);
    }
};

const handleUpload = async (formData) => {
    try {
      
        const response = await axios.post('https://crafto.app/crafto/v1.0/media/assignment/upload', formData);
        console.log("h",response)
        return response.data[0].url;
    } catch (error) {
        console.error('File upload failed', error);
        throw error;
    }
};

const handleCreateQuote = async (text,mediaUrl) => {
    try {
        await axios.post('https://assignment.stage.crafto.app/postQuote', {
            text,
            mediaUrl,
        }, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to create quote', error);
        // Handle error
    }
};


export { handleLogin, handleCreateQuote, handleUpload, fetchQuotes }
