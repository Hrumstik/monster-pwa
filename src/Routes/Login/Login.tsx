import { Form } from "antd";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput";
import MonsterButton from "../../shared/elements/MonsterButton/MonsterButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../../shared/hooks/useAuth";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = () => {
    const values = form.getFieldsValue();
    if (values.login === "admin" && values.password === "admin") {
      login();
      navigate("/");
    }
  };

  return (
    <div
      className="flex-1 h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom, #000000, #1a1951, #3a3a87, #5252b2, #6a6ac9)",
      }}
    >
      <div className="w-[460px]">
        <div className="flex justify-center font-normal font-reemkufi text-[22px] text-white leading-[56px] mb-[25px]">
          MONSTER PWA
        </div>
        <Form form={form}>
          <Form.Item name="login" className="mb-[25px]">
            <MonsterInput
              placeholder="Логин"
              autoComplete="off"
              className="!bg-[#161724]"
            />
          </Form.Item>
          <Form.Item name="password" className="mb-[25px]">
            <MonsterInput
              placeholder="Пароль"
              autoComplete="off"
              type="password"
              className="!bg-[#161724]"
            />
          </Form.Item>
        </Form>
        <div className="flex justify-center">
          <MonsterButton
            type="primary"
            className="w-2/3 h-10"
            onClick={handleLogin}
          >
            Войти
          </MonsterButton>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
