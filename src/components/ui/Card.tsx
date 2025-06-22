import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}

const Card = ({
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  children,
}: CardProps) => {
  return (
    <div className={`cyber-card ${className}`}>
      {title && (
        <div className={`cyber-card-header ${headerClassName}`}>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className={`cyber-card-body ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;