import FormulariosRGRL from './FormulariosRGRL';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ cuit?: string }>;
}) {
  const params = await searchParams;
  const initialCuit =
    (params?.cuit && !Number.isNaN(Number(params.cuit)))
      ? Number(params.cuit)
      : 0;

  return <FormulariosRGRL cuit={initialCuit} />;
}
