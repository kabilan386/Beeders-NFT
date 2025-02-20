import React, { useState, useEffect } from 'react';

const ConnectButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');

  // Add helper function to format the address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log("window",window.ethereum);
        // Always trigger the Metamask modal, even if already connected
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        alert('Please install Metamask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Handle user rejection or other errors
      if (error.code === 4001) {
        alert('Please connect your wallet to continue');
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear the account and connection state
      setAccount('');
      setIsConnected(false);
      
      // Note: There's no direct way to disconnect via Web3 API
      // The best practice is to just clear the local state
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount('');
          setIsConnected(false);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="wallet-connection">
      <button 
        onClick={isConnected ? disconnectWallet : connectWallet}
        className="connect-button"
      >
        {isConnected ? 'Disconnect Wallet' : "Let's start"}
      </button>
      {isConnected && (
        <div className="wallet-address">
          Connected: {formatAddress(account)}
        </div>
      )}
    </div>
  );
};

export default ConnectButton; 