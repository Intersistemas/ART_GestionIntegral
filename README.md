This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## INTERSISTEMAS:

**Styles: aplicamos module.css para cada directorio, el cual debe estar basado en las variables creadas en el root de styles/globals.css
    **Banco de Iconos: https://react-icons.github.io/react-icons/
    **Todo el material grafico (imagenes, iconos, logos, etc) debe estar en la carpeta "public"

**Fetching:
    _Para Acceder a los datos del USUARIO logeado usamos AuthContext.
        import { useAuth } from '@/data/AuthContext';
        const { user } = useAuth();  

    _Para nuevos fetching de datos, agregamos una NUEVA CLASE en la carpeta DATA, declarando los nuevos endpoints que usaremos (los types que declaramos deben ser lo mas parecido a los campos en swagger/backend) mediante SWR de nextsj y AXIOS

**Entorno UI: 
    _Usaremos los componentes de UTILS/UI que tiene Botones, Forms, DataGrid y Modals que implementan MATERIAL UI y @tanstack/react-table

**Otros:     
    _Dayjs: la usamos para datos de Fechas y horas. DateTable, etc... https://www.npmjs.com/package/dayjs
https://github.com/iamkun/dayjs/blob/HEAD/docs/es-es/README-es-es.md
    _PDF: para la generacion de PDFs usaremos import jsPDF from "jspdf" y import html2canvas from "html2canvas"
    _EXCEL:

**Estados Globales: si no tenemos lo necesario en useSession, utilizamos Zustand.