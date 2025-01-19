import { Form, message, Spin } from "antd";
import MonsterInput from "../../shared/elements/MonsterInput/MonsterInput";
import MonsterButton from "../../shared/elements/MonsterButton/MonsterButton";
import { createAuthProvider } from "../../middlewares/authProvider";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/apis/authApi";
import { useState } from "react";
import { LoginBody } from "../../models/user";

const LoginPage = () => {
  const [form] = Form.useForm<LoginBody>();
  const [submitCredentials] = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { login } = createAuthProvider();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const loginResponce = await submitCredentials(
        form.getFieldsValue()
      ).unwrap();
      login(loginResponce.access_token);
      navigate("/");
    } catch (e) {
      messageApi.open({
        content:
          "Неверное имя пользователя или пароль. Пожалуйста, попробуйте снова.",
        type: "error",
      });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="flex-1 h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom, #000000, #1a1951, #3a3a87, #5252b2, #6a6ac9)",
        }}
      >
        {!loading ? (
          <div className="lg:w-[460px] w-[300px]">
            <div className="flex justify-center font-normal font-reemkufi text-[22px] text-white leading-[56px] mb-[25px]">
              MONSTER PWA
            </div>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item name="email" className="mb-[25px]">
                <MonsterInput placeholder="Email" className="!bg-[#161724]" />
              </Form.Item>
              <Form.Item name="password" className="mb-[25px]">
                <MonsterInput
                  placeholder="Пароль"
                  type="password"
                  className="!bg-[#161724]"
                />
              </Form.Item>
              <div className="flex justify-center">
                <MonsterButton
                  type="primary"
                  className="w-2/3 h-10"
                  htmlType="submit"
                >
                  Войти
                </MonsterButton>
              </div>
            </Form>
          </div>
        ) : (
          <Spin />
        )}
      </div>
    </>
  );
};

export default LoginPage;
