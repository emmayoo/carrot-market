import Layout from "../../components/layout";
import Item from "../../components/item";

import type { NextPage } from "next";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        {[...Array(11)].map((_, i) => (
          <Item
            key={i}
            id={i}
            title="iPhone 14"
            price={1000 * i + 1000}
            comments={i * 2}
            hearts={i * 3}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Bought;
