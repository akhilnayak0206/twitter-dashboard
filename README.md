# Twitter-Dashboard

This is a website for twitter users to login and see tweets and reply to a particular tweet.  
This is a **MERN** project.  
The Back End is made using **NodeJS & ExpressJS** using **socket.io** as realtime-database.  
The Front End is made using **ReactJS** for state management.

## Quick Start

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Make directory and add credential
mkdir config

# inside config make default.json file
# add your credential in this file
{
  "consumerKey": "your_key",
  "consumerSecret": "your_secret",
  "callbackURL": "your_url to get auth_data",
  "secretWord": "your_secret_word"
}

# Run both Backend & Frontend from root
npm run dev
```

## Code Explaination

### Backend APIs

- `/auth/twitter` is used for authentication.
- `/access-token` is used to get access token after accepting permission.
- `/fetch-conversation` is used to fetch information about the selected tweet.
- `/reply-tweet` is used to reply to the selected tweet
- `allTweets` is a socket.io api to get the initial tweets.
- `tweet` is realtime tweet api that is attached with allTweets but has to be listened separately to avoid too much population.

### Front-End Screens

- **Login Screen** consists of a card that asks for authentication.
- Once the authentication is done the same page listens to the changes and shows different card which asks for permission.
- If accepted the user gets redirected to **Dashboard**.
- **Dashboard Screen** consist of two views **AllTweets** and **Conversation**.
- **AllTweets** is on the left and **Conversation** is on the right.
- Once they enter the search query they get the data accordingly.
- **AllTweets** shows all the tweets and on selecting will show the detailed view on the right side.
- **Conversation** shows the detailed view of the tweet and also shows the replies of that tweet.
- If the user wants then they can reply to that tweet by typing in the bottom input box.

## Screen Shots

- Login Page
  ![Login Page](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.07.06_AM.jpg)

- Authentication Page
  ![Authentication Page](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.10.02_AM.jpg)

- Permission Page
  ![Permission Page](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.12.37_AM.jpg)

- Dashboard
  ![Dashboard](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.16.34_AM.jpg)

- Dashboard: reply input
  ![Dashboard: reply input](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.17.12_AM.jpg)

- Dashboard: replied
  ![Dashboard: replied](https://res.cloudinary.com/dx0wpoeyu/image/upload/v1588647597/twitter-dashboard/WhatsApp_Image_2020-05-05_at_8.17.33_AM.jpg)

## Project Info

### Author

> Akhil Nayak

### License

> This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

#### If you have any suggestion or doubt do let me know

#### ThankYou.Peace
