import axios from "axios";

export const getBookApi = (keyWord) => {
    return (
        axios.get(`https://www.googleapis.com/books/v1/volumes?country=US&projection=lite&printType=books&key=AIzaSyD6SlU9JUr7Z-3SOOy0TfZTJtqv_EEqfZY&q=intitle:${keyWord}&startIndex=0&maxResults=5`,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            )

    )
}