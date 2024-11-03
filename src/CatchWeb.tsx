import  { useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./App.css";

export const CatchWeb = () => {
  useEffect(() => {
    axios
      .get("https://example.com")
      .then((response) => {
        const $ = cheerio.load(response.data);
        // 使用 $ 来选择和操作 HTML 元素
        const content = $("#some-id").text();
        console.log(content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return null;
};

export default CatchWeb;
