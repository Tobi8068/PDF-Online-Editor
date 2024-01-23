import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {GlobalWorkerOptions } from "pdfjs-dist";
import '../styles/custom-responsive-styles.css';
import '../styles/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  return <Component {...pageProps} />
}
