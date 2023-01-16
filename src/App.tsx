import { FormEvent, useMemo, useRef, useState } from "react";
import axios from "axios";
import DiffContent from "./components/DiffContent";
import Placeholder from "./components/Placeholder";
import Helmet from "react-helmet";
import Footer from "./components/Footer";

const GPT_API_URL = "https://api.openai.com/v1/completions";

async function paragraphPrase(paragraph: string, callback: Function) {
  let content = "";
  let isError,
    isLoading = false;
  let error;
  try {
    const response = await axios
      .post(
        GPT_API_URL,
        {
          model: "text-davinci-003",
          prompt: `改善文字: ${paragraph}`,
          temperature: 0,
          max_tokens: 2048,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      )
      .finally(() => {
        isLoading = false;
      });
    console.log(response?.data.choices[0].text);
    content = response?.data.choices[0].text;
    isError = false;
    callback();
  } catch (e) {
    console.error("paragraphPrase", e);
    error = e;
    isError = true;
    isLoading = false;
    return { isError, error, isLoading, content };
  }
  return { content, isError, error, isLoading };
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseContent, setResponseContent] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setResponseContent([]);
    setIsLoading(true);
    const inputText = `${inputRef.current?.value}`;
    for (let paragraph of (inputText || "")
      ?.replace(/ +/g, " ")
      .replace("\n\n", "\n")
      .split("\n")) {
      if (paragraph.trim() === "") continue;
      try {
        const { content, isError } = await paragraphPrase(paragraph, () => {
          setResponseContent((prev) => [...prev, content]);
          setIsLoading(false);
        });
        console.log("try", isError);
        if (isError) {
          setIsError(isError);
          break;
        } else {
          setIsError(isError);
        }
      } catch (e) {
        console.error("handleSubmit", e);
        setIsError(true);
        setIsLoading(false);
        return;
      }
    }
  };

  const handleInputChange = () => {
    const inputText = inputRef.current?.value || "";
    setResponseContent([]);
    console.log(inputText.length);
  };

  const outputText = useMemo(() => responseContent.join(), [responseContent]);

  return (
    <>
      <Helmet>
        <title>{process.env.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <div className="container">
        <h1 className="my-3">润文</h1>
        <div className="mb-2">润文通过 AI 算法来重写或改善句子。</div>
        <div className="row">
          <div className="col-sm-6 col-12">
            <form onSubmit={handleSubmit}>
              <textarea
                onChange={handleInputChange}
                defaultValue={`                以前，有一本有魔法的书，可以帮助盲人，因为它可以自己读出书中的内容，还可以和别人聊天，玩游戏。

                可是，有一天，这本书落入了坏人的手中，坏人想把这个强大的力量占为己有，因为有了这股力量，就可以干很多的坏事。
                
                可是，这本书不想干坏事，所以在一天夜里逃走了!
                
                它跑啊跑啊，跑到了一个陌生人家里，变成了普通的书，放在了书架上。
                
                它发现了这个人是个盲人。
                
                于是想：我应不应该帮助他呢？
                
                书决定帮助他，用很温顺的语气说：我是一本有魔法的书，在书架的第二层第四本，就是我。
                
                盲人把这本书拿了出来，问:你难道可以帮助我读书？
                
                书回答：是的。
                
                于是,盲人和这一本有魔法的书一起生活。`}
                ref={inputRef}
                rows={20}
                className="form-control mb-2"
                placeholder="Place any content you wish to refine here."
                autoFocus
              ></textarea>
              <div className="text-center">
                <button
                  className="btn btn-outline-dark mb-2"
                  type="submit"
                  disabled={isLoading}
                >
                  提交
                </button>
              </div>
            </form>
          </div>
          <div className="col-sm-6 col-12">
            {isLoading ? (
              <div>处理中。。。</div>
            ) : isError ? (
              <div className="alert alert-warning">
                程序出错，请联系{" "}
                <a
                  href="mailto:weijngjaylin@gmail.com"
                  className="text-decoration-none"
                >
                  weijngjaylin@gmail.com
                </a>
              </div>
            ) : (
              <>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">输出</h5>
                    <div className="card-text">
                      {responseContent.length ? (
                        responseContent.map((pText, idx) => (
                          <p key={idx}>{pText.trim().split("")}</p>
                        ))
                      ) : (
                        <Placeholder>输出的内容将在这里显示</Placeholder>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">差异报告</h5>
                    <div className="card-text">
                      <DiffContent
                        text1={inputRef.current?.value || ""}
                        text2={outputText}
                        placeholder="差异报告将在这里显示"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
