import { useState, useEffect } from 'react';
import { UTK_Token_backend } from 'declarations/UTK_Token_backend';
import "./App.css";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "declarations/UTK_Token_backend";
import { canisterId } from "declarations/UTK_Token_backend";

const identityProvider = "https://identity.ic0.app/#authorize";

function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [mineAmount, setMineAmount] = useState("");
  const [mineResult, setMineResult] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendPrincipal, setSendPrincipal] = useState("");
  const [sendResult, setSendResult] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellResult, setSellResult] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      const identity = client.getIdentity();
      const actorInstance = createActor(canisterId, {
        agentOptions: { identity },
      });

      const isAuth = await client.isAuthenticated();
      setAuthClient(client);
      setActor(actorInstance);
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const principal = identity.getPrincipal().toText();
        setPrincipal(principal);
        await fetchBalance(actorInstance);
        await fetchTotalSupply(actorInstance);
        await fetchTransactions(actorInstance);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  };

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider,
      onSuccess: initAuth,
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    initAuth();
  };

  const whoami = async () => {
    if (!actor) return;
    setPrincipal("Loading...");
    try {
      const result = await actor.whoami();
      setPrincipal(result.toString());
    } catch (error) {
      console.error("Whoami error:", error);
      setPrincipal("Error fetching principal");
    }
  };

  const handleResult = (res, setResult) => {
    if (typeof res === "string") return setResult(res);
    if (res?.Err) return setResult(`Error: ${res.Err}`);
    if (res?.Ok) return setResult(res.Ok);
    setResult("Unknown error.");
  };

  const fetchBalance = async (a = actor) => {
    if (!a) return;
    setLoading(true);
    try {
      const bal = await a.get_my_balance();
      setBalance(Number(bal));
    } catch (error) {
      console.error("Balance fetch error:", error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalSupply = async (a = actor) => {
    if (!a) return;
    try {
      const supply = await a.get_total_supply();
      setTotalSupply(Number(supply));
    } catch (error) {
      console.error("Total supply fetch error:", error);
      setTotalSupply(0);
    }
  };

  const fetchTransactions = async (a = actor) => {
    if (!a) return;
    try {
      const txs = await a.get_my_transactions();
      setTransactions(txs.reverse());
    } catch (error) {
      console.error("Transactions fetch error:", error);
      setTransactions([]);
    }
  };

  const handleMine = async (e) => {
    e.preventDefault();
    if (!actor) return;
    
    setMineResult("");
    const amt = Number(mineAmount);
    if (amt > 0) {
      setLoading(true);
      try {
        const res = await actor.mine_tokens(amt);
        handleResult(res, setMineResult);
        await fetchBalance();
        await fetchTotalSupply();
        await fetchTransactions();
        setMineAmount("");
      } catch (error) {
        console.error("Mine error:", error);
        setMineResult("Error mining tokens");
      } finally {
        setLoading(false);
      }
    } else {
      setMineResult("Enter a valid amount.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!actor) return;
    
    setSendResult("");
    const amt = Number(sendAmount);

    try {
      if (sendPrincipal && amt > 0) {
        setLoading(true);
        const recipientPrincipal = Principal.fromText(sendPrincipal.trim());
        const res = await actor.send_tokens(recipientPrincipal, amt);
        handleResult(res, setSendResult);
        await fetchBalance();
        await fetchTransactions();
        setSendAmount("");
        setSendPrincipal("");
      } else {
        setSendResult("Enter a valid principal and amount.");
      }
    } catch (err) {
      console.error("Send error:", err);
      setSendResult("Invalid principal format. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (!actor) return;
    
    setSellResult("");
    const amt = Number(sellAmount);
    if (amt > 0) {
      setLoading(true);
      try {
        const res = await actor.sell_tokens(amt);
        handleResult(res, setSellResult);
        await fetchBalance();
        await fetchTotalSupply();
        await fetchTransactions();
        setSellAmount("");
      } catch (error) {
        console.error("Sell error:", error);
        setSellResult("Error selling tokens");
      } finally {
        setLoading(false);
      }
    } else {
      setSellResult("Enter a valid amount.");
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const formatPrincipal = (principal) => {
    const text = principal.toText();
    return text.length > 20 ? `${text.substring(0, 10)}...${text.substring(text.length - 10)}` : text;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src="/logo2.svg" alt="UTK Token" />
            <h1>UTK Token</h1>
          </div>
          <div className="auth-section">
            {!isAuthenticated ? (
              <button className="btn btn-primary" onClick={login}>
                Connect Wallet
              </button>
            ) : (
              <div className="user-info">
                <span className="principal">{formatPrincipal(Principal.fromText(principal))}</span>
                <button className="btn btn-secondary" onClick={logout}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!isAuthenticated ? (
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome to UTK Token</h2>
            <p>Connect your Internet Computer wallet to start managing your UTK tokens.</p>
            <button className="btn btn-primary btn-large" onClick={login}>
              Connect Wallet
            </button>
          </div>
        </div>
      ) : (
        <main className="main-content">
          <div className="sidebar">
            <nav className="nav">
              <button 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-item ${activeTab === 'mine' ? 'active' : ''}`}
                onClick={() => setActiveTab('mine')}
              >
                Mine Tokens
              </button>
              <button 
                className={`nav-item ${activeTab === 'send' ? 'active' : ''}`}
                onClick={() => setActiveTab('send')}
              >
                Send Tokens
              </button>
              <button 
                className={`nav-item ${activeTab === 'sell' ? 'active' : ''}`}
                onClick={() => setActiveTab('sell')}
              >
                Sell Tokens
              </button>
              <button 
                className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
            </nav>
          </div>

          <div className="content">
            {activeTab === 'dashboard' && (
              <div className="dashboard">
                <h2>Dashboard</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>My Balance</h3>
                    <p className="stat-value">{balance.toLocaleString()} UTK</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Supply</h3>
                    <p className="stat-value">{totalSupply.toLocaleString()} UTK</p>
                  </div>
                  <div className="stat-card">
                    <h3>My Principal</h3>
                    <p className="stat-value principal-text">{principal}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mine' && (
              <div className="action-panel">
                <h2>Mine UTK Tokens</h2>
                <form onSubmit={handleMine} className="form">
                  <div className="form-group">
                    <label htmlFor="mineAmount">Amount to Mine:</label>
                    <input
                      id="mineAmount"
                      type="number"
                      value={mineAmount}
                      onChange={(e) => setMineAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Mine Tokens
                  </button>
                  {mineResult && (
                    <div className="result-message">
                      {mineResult}
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'send' && (
              <div className="action-panel">
                <h2>Send UTK Tokens</h2>
                <form onSubmit={handleSend} className="form">
                  <div className="form-group">
                    <label htmlFor="sendPrincipal">Recipient Principal:</label>
                    <input
                      id="sendPrincipal"
                      type="text"
                      value={sendPrincipal}
                      onChange={(e) => setSendPrincipal(e.target.value)}
                      placeholder="Enter recipient principal"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sendAmount">Amount:</label>
                    <input
                      id="sendAmount"
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Tokens
                  </button>
                  {sendResult && (
                    <div className="result-message">
                      {sendResult}
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'sell' && (
              <div className="action-panel">
                <h2>Sell UTK Tokens</h2>
                <form onSubmit={handleSell} className="form">
                  <div className="form-group">
                    <label htmlFor="sellAmount">Amount to Sell:</label>
                    <input
                      id="sellAmount"
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                      max={balance}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Sell Tokens
                  </button>
                  {sellResult && (
                    <div className="result-message">
                      {sellResult}
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="transactions-panel">
                <h2>Transaction History</h2>
                <div className="transactions-list">
                  {transactions.length === 0 ? (
                    <p className="no-transactions">No transactions found.</p>
                  ) : (
                    transactions.map((tx, index) => (
                      <div key={index} className="transaction-item">
                        <div className="transaction-header">
                          <span className={`transaction-type ${tx.tx_type}`}>
                            {tx.tx_type.toUpperCase()}
                          </span>
                          <span className="transaction-amount">
                            {tx.amount.toLocaleString()} UTK
                          </span>
                        </div>
                        <div className="transaction-details">
                          {tx.from && (
                            <span className="transaction-from">
                              From: {formatPrincipal(tx.from)}
                            </span>
                          )}
                          {tx.to && (
                            <span className="transaction-to">
                              To: {formatPrincipal(tx.to)}
                            </span>
                          )}
                          <span className="transaction-time">
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
