import Image from "next/image";

export default function StoreCard({
  store,
  onSelect,
}: {
  store: { id: number; name: string; logoUrl?: string | null };
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="rounded-2xl shadow-md p-8 bg-white hover:shadow-lg transition-shadow transition-transform duration-100 active:scale-95 flex items-center justify-between cursor-pointer"
    >
      {store.logoUrl ? (
        <Image
          src={store.logoUrl}
          alt={`${store.name} logo`}
          width={90}
          height={30}
          className="object-contain rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
          No Logo
        </div>
      )}
      <h3 className="text-xl font-brand font-bold px-5 text-brand">
        {store.name}
      </h3>
    </div>
  );
}
