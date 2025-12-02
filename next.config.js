/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para reducir el uso de memoria
  webpack: (config, { dev }) => {
    if (dev) {
      // Reducir el uso de memoria en desarrollo
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };
      
      // Limitar el caché de webpack para reducir memoria
      if (config.cache && typeof config.cache === 'object') {
        config.cache.maxMemoryGenerations = 1;
      }
    }
    
    // Asegurar que SWR se resuelva correctamente
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
      },
    };
    
    return config;
  },
  
  // Deshabilitar source maps completos en desarrollo para ahorrar memoria
  productionBrowserSourceMaps: false,
  
  // Optimizar la compilación
  swcMinify: true,
  
  // Configuración de transpilación para asegurar compatibilidad
  transpilePackages: [],
}

module.exports = nextConfig
