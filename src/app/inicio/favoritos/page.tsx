import styles from './favoritos.module.css';

function FavoritosPage() {
  return (
    <div className={styles.inicioContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Estos son tus Favoritos</h1>
      </div>
    </div>
  )
}

export default FavoritosPage