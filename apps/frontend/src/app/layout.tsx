import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import AuthProvider from '../components/AuthProvider';
import ThemeWrapper from '../components/ThemeWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Avonet Expense Tracker',
  description: 'Personal expense tracking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
