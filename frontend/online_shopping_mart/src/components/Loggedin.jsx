import React from 'react';

const Loggedin = ({ user }) => {
  return (
    <div style={styles.container}>
      <h1>Welcome, {user.name}!</h1>
      {user.isSeller ? (
        <SellerDashboard />
      ) : (
        <EndUserDashboard />
      )}
    </div>
  );
};

const SellerDashboard = () => {
  return (
    <div style={styles.dashboard}>
      <h2>Seller Dashboard</h2>
      <ul style={styles.list}>
        <li><a href="/manage-products">Manage Products</a></li>
        <li><a href="/view-orders">View Orders</a></li>
        <li><a href="/account-settings">Account Settings</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </div>
  );
};

const EndUserDashboard = () => {
  return (
    <div style={styles.dashboard}>
      <h2>End User Dashboard</h2>
      <ul style={styles.list}>
        <li><a href="/my-cart">My Cart</a></li>
        <li><a href="/my-orders">My Orders</a></li>
        <li><a href="/wishlist">Wishlist</a></li>
        <li><a href="/account-settings">Account Settings</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  dashboard: {
    textAlign: 'left',
    marginTop: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
};

export default Loggedin;
