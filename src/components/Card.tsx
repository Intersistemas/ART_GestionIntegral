import Link from 'next/link';
import { IconType } from 'react-icons';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  icon: IconType;
  link: string;
  borderColorClass: string; // Nueva prop para el color del borde
}

const Card: React.FC<CardProps> = ({ title, icon: Icon, link, borderColorClass }) => {
  return (
    // Agrega la clase del borde aquí, junto con la clase principal de la tarjeta
    <div className={`${styles.card} ${styles[borderColorClass]}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} />
      </div>
      <Link href={link} className={styles.link}>
        Acceder →
      </Link>
    </div>
  );
};

export default Card;