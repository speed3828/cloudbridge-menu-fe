import React from 'react';
import { Header } from '../components/Header.jsx';
import '../styles/globals.css';

/**
 * Custom App component for Pages Router
 * @param {object} props
 * @param {React.ComponentType} props.Component - Page component
 * @param {object} props.pageProps - Page props
 */
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 