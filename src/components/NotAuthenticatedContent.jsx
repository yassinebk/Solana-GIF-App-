const NotAuthenticatedContent = ({ connectWallet }) => {

  return (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );
};

export default NotAuthenticatedContent;
