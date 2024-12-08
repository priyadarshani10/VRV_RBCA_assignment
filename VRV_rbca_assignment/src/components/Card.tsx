import { ReactNode, MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '',
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };
export type { CardProps, CardContentProps };