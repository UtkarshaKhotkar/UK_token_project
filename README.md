# UTK Token - Internet Computer Token Application

A modern, decentralized token application built on the Internet Computer (ICP) blockchain. This project demonstrates a complete token system with mining, sending, and selling capabilities.

## Features

### 🔐 Authentication
- Internet Computer wallet integration
- Secure principal-based authentication
- Automatic session management

### 💰 Token Management
- **Mine Tokens**: Create new UTK tokens
- **Send Tokens**: Transfer tokens to other users
- **Sell Tokens**: Burn tokens from your balance
- **Balance Tracking**: Real-time balance updates
- **Transaction History**: Complete transaction log

### 📊 Dashboard
- Real-time balance display
- Total supply tracking
- Principal information
- Transaction history with timestamps

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Glassmorphism design elements
- Intuitive navigation

## Technology Stack

### Backend (Rust)
- **Internet Computer Canister**: Smart contract logic
- **Candid**: Interface definition language
- **ic-cdk**: Internet Computer development kit

### Frontend (React)
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Internet Computer Agent**: Blockchain interaction
- **Auth Client**: Wallet authentication

## Project Structure

```
UTK_Token/
├── src/
│   ├── UTK_Token_backend/          # Rust canister
│   │   ├── src/lib.rs              # Backend logic
│   │   └── UTK_Token_backend.did   # Candid interface
│   └── UTK_Token_frontend/         # React frontend
│       ├── src/
│       │   ├── App.jsx             # Main application
│       │   ├── App.css             # Styling
│       │   └── main.jsx            # Entry point
│       └── package.json            # Frontend dependencies
├── dfx.json                        # DFX configuration
└── Cargo.toml                      # Rust dependencies
```

## Getting Started

### Prerequisites

1. **Install DFX**: The Internet Computer SDK
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Install Node.js**: Version 16 or higher
   ```bash
   # Using nvm (recommended)
   nvm install 16
   nvm use 16
   ```

3. **Install Rust**: For backend development
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UTK_Token
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd src/UTK_Token_frontend
   npm install
   cd ../..
   ```

3. **Start local Internet Computer**
   ```bash
   dfx start --background
   ```

4. **Deploy the canister**
   ```bash
   dfx deploy
   ```

5. **Start the frontend**
   ```bash
   cd src/UTK_Token_frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

### Connecting Your Wallet

1. Click "Connect Wallet" on the welcome screen
2. Choose your Internet Computer wallet (e.g., Plug, Stoic, or Internet Identity)
3. Authorize the connection

### Mining Tokens

1. Navigate to the "Mine Tokens" tab
2. Enter the amount of tokens you want to mine
3. Click "Mine Tokens"
4. Confirm the transaction in your wallet

### Sending Tokens

1. Navigate to the "Send Tokens" tab
2. Enter the recipient's principal ID
3. Enter the amount to send
4. Click "Send Tokens"
5. Confirm the transaction in your wallet

### Selling Tokens

1. Navigate to the "Sell Tokens" tab
2. Enter the amount of tokens to sell (burn)
3. Click "Sell Tokens"
4. Confirm the transaction in your wallet

### Viewing Transactions

1. Navigate to the "Transactions" tab
2. View your complete transaction history
3. Each transaction shows:
   - Transaction type (Mine/Send/Sell)
   - Amount
   - Sender/Recipient principals
   - Timestamp

## Backend Functions

The Rust canister provides the following functions:

### Queries (Read-only)
- `whoami()` - Get caller's principal
- `get_my_balance()` - Get caller's token balance
- `get_balance_of(principal)` - Get any user's balance
- `get_total_supply()` - Get total token supply
- `get_my_transactions()` - Get caller's transaction history
- `get_all_transactions()` - Get all transactions (admin)

### Updates (State-changing)
- `mine_tokens(amount)` - Create new tokens
- `send_tokens(receiver, amount)` - Transfer tokens
- `sell_tokens(amount)` - Burn tokens

## Development

### Adding New Features

1. **Backend Changes**:
   - Modify `src/UTK_Token_backend/src/lib.rs`
   - Update `src/UTK_Token_backend/UTK_Token_backend.did` if needed
   - Redeploy with `dfx deploy`

2. **Frontend Changes**:
   - Modify `src/UTK_Token_frontend/src/App.jsx`
   - Update styles in `src/UTK_Token_frontend/src/App.css`
   - The dev server will auto-reload

### Testing

```bash
# Test the backend
dfx canister call UTK_Token_backend whoami

# Test the frontend
cd src/UTK_Token_frontend
npm test
```

## Deployment

### Local Development
```bash
dfx start --background
dfx deploy
```

### Mainnet Deployment
```bash
dfx deploy --network ic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the Internet Computer documentation
- Join the ICP community forums

## Acknowledgments

- Internet Computer Foundation for the blockchain infrastructure
- DFX team for the development tools
- React team for the frontend framework
