// components/Header.tsx
import React from 'react';
import { Card } from './ui/card'; // Using ShadCN Card for the header styling

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md">
      <Card className="flex items-center justify-center p-6">
        <h1 className="text-4xl font-bold">
          <span className="text-primary">Lay</span>
          <span className="font-thin text-primary">.out</span>
        </h1>
      </Card>
    </header>
  );
};

export default Header;