import FormulariosRGRL from './FormulariosRGRL';

export default function Page({
  searchParams,
}: {
  searchParams?: { cuit?: string };
}) {
  const initialCuit =
    (searchParams?.cuit && !Number.isNaN(Number(searchParams.cuit)))
      ? Number(searchParams.cuit)
      : 0;

  return <FormulariosRGRL cuit={initialCuit} />;
}
