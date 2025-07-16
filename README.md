# ICP Chat Application

This project is a chat application built using the Internet Computer Protocol (ICP) with a React frontend and a Motoko backend. 

## Project Structure

```
icp-chat-app
├── src
│   ├── backend
│   │   ├── main.mo        # Main logic for the backend
│   │   └── types.mo       # Data types for messages and users
│   ├── frontend
│   │   ├── src
│   │   │   ├── App.jsx     # Main React component
│   │   │   ├── components
│   │   │   │   ├── Chat.jsx        # Chat interface component
│   │   │   │   └── MessageList.jsx  # Component to display messages
│   │   │   └── index.js    # Entry point for the React app
│   │   ├── public
│   │   │   └── index.html   # HTML template for the React app
│   │   └── package.json      # NPM configuration for the frontend
├── dfx.json                  # DFINITY SDK configuration
├── canister_ids.json         # Deployed canister IDs
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Install DFX**: Ensure you have DFX installed on your machine. Follow the [DFINITY installation guide](https://sdk.dfinity.org/docs/quickstart/installation.html) if you haven't done so.

2. **Clone the Repository**: Clone this repository to your local machine.

   ```
   git clone <repository-url>
   cd icp-chat-app
   ```

3. **Install Frontend Dependencies**: Navigate to the frontend directory and install the necessary dependencies.

   ```
   cd src/frontend
   npm install
   ```

4. **Start the Backend**: In the root directory of the project, start the DFX local environment.

   ```
   dfx start
   ```

5. **Deploy the Canisters**: Deploy the backend canisters.

   ```
   dfx deploy
   ```

6. **Run the Frontend**: In a new terminal, navigate to the frontend directory and start the React application.

   ```
   cd src/frontend
   npm start
   ```

7. **Access the Application**: Open your browser and go to `http://localhost:3000` to access the chat application.

## Usage Guidelines

- Users can send and receive messages in real-time.
- The chat interface allows for easy interaction and message management.
- Ensure that the backend is running to handle incoming messages and user interactions.

## Contributing

Feel free to submit issues or pull requests if you would like to contribute to the project. 

## License

This project is licensed under the MIT License.