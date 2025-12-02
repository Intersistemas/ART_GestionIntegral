/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar source maps completos en desarrollo para ahorrar memoria
  productionBrowserSourceMaps: false,
  
  // Configuración de transpilación para asegurar compatibilidad
  transpilePackages: [],
  
  // Usar webpack en lugar de Turbopack temporalmente para compatibilidad con SWR
  // TODO: Migrar a Turbopack cuando se separe la lógica de hooks de SWR
  webpack: (config, { dev }) => {
    if (dev) {
      // Reducir el uso de memoria en desarrollo
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };
    }
    return config;
  },
  
}

module.exports = nextConfig
