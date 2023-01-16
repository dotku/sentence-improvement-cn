import { useEffect, useState } from "react";

export default function TypeEffect({ content }: { content: string[] }) {
  const [context, setContext] = useState("");
  console.log("content", content);
  useEffect(() => {
    let currentPosition = 0;
    const interval = setInterval(() => {
      if (currentPosition < content.length - 1) {
        setContext((prev) => `${prev}${content[currentPosition]}`);
        currentPosition++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return <p>{context}</p>;
}
