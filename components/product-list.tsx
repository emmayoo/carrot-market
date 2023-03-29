import useSWR from "swr";

import Item from "@components/item";

import type { Product, Record, Kind } from "@prisma/client";

interface ProductListProps {
  kind: Kind;
}

interface ProductWithCount extends Product {
  _count: {
    records: number;
  };
}

interface RecordWithProduct extends Record {
  product: ProductWithCount;
}

interface RecordResponse {
  ok: boolean;
  records: RecordWithProduct[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<RecordResponse>(`/api/users/me/records?kind=${kind}`);
  return data ? (
    <>
      {data?.records?.map((record) => (
        <Item
          id={record.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          hearts={record.product._count.records}
        />
      ))}
    </>
  ) : null;
}
