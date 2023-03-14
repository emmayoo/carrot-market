import Layout from "@components/layout";
import TextArea from "@components/textarea";
import Button from "@components/button";

import type { NextPage } from "next";

const Write: NextPage = () => {
  return (
    <Layout canGoBack title="Write Post">
      <form className="px-4 py-10">
        <TextArea required placeholder="Ask a question!" />
        <Button text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
